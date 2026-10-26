'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { isRetrySafeStep, validateFlowStructure } = require('../src/flow-validator');

let stepSequence = 0;
function step(type, config = {}, id = `s${++stepSequence}`) {
  return { id, type, config };
}
function flow(steps, extra = {}) {
  return { id: 'test-flow', name: 'Test Flow', retryCount: 0, trigger: { type: 'manual' }, steps, ...extra };
}

test('empty flows produce a warning but are not structurally invalid', () => {
  const result = validateFlowStructure(flow([]));
  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some((warning) => warning.includes('no actions')));
});

test('rejects invalid URLs before running', () => {
  const result = validateFlowStructure(flow([step('open-url', { url: 'javascript:alert(1)' }, 'open1')]));
  assert.ok(result.errors.some((error) => error.includes('Only HTTP and HTTPS')));
});

test('rejects missing and unmatched loop markers', () => {
  const unmatchedEnd = validateFlowStructure(flow([step('loop-end', {}, 'end1')]));
  assert.ok(unmatchedEnd.errors.some((error) => error.includes('End loop')));
  const unmatchedStart = validateFlowStructure(flow([step('loop-start', { count: 2 }, 'start1')]));
  assert.ok(unmatchedStart.errors.some((error) => error.includes('Start loop')));
});

test('accepts a balanced loop', () => {
  const result = validateFlowStructure(flow([
    step('loop-start', { count: 2 }, 'start1'),
    step('set-variable', { name: 'iteration_count', value: '1', valueType: 'number' }, 'var1'),
    step('loop-end', {}, 'end1')
  ]));
  assert.deepEqual(result.errors, []);
});

test('rejects conditional jumps that cross loop boundaries', () => {
  const result = validateFlowStructure(flow([
    step('logic-condition', { conditionSource: 'variable', variableName: 'ready', operator: 'truthy', skipSteps: 1 }, 'if1'),
    step('loop-start', { count: 2 }, 'start1'),
    step('loop-end', {}, 'end1')
  ]));
  assert.ok(result.errors.some((error) => error.includes('false-branch skip crosses a loop marker')));
});

test('rejects invalid variable identifiers', () => {
  const result = validateFlowStructure(flow([step('set-variable', { name: '123bad', value: 'x' }, 'var1')]));
  assert.ok(result.errors.some((error) => error.includes('valid variable name')));
});

test('rejects a variable condition with no variable name', () => {
  const result = validateFlowStructure(flow([step('logic-condition', { conditionSource: 'variable', variableName: '', operator: 'equals', compareValue: 'x' }, 'if1')]));
  assert.ok(result.errors.some((error) => error.includes('variable name is required')));
});

test('warns when a local process trigger lacks its process name', () => {
  const result = validateFlowStructure(flow([], { trigger: { type: 'process-start', processName: '' } }));
  assert.ok(result.errors.some((error) => error.includes('process-start trigger needs a process name')));
});

test('automatic retries are limited to designated safe actions', () => {
  assert.equal(isRetrySafeStep({ type: 'wait' }), true);
  assert.equal(isRetrySafeStep({ type: 'set-variable' }, { valueType: 'text' }), true);
  assert.equal(isRetrySafeStep({ type: 'set-variable' }, { valueType: 'timestamp' }), false);
  assert.equal(isRetrySafeStep({ type: 'file-operation' }), false);
  assert.equal(isRetrySafeStep({ type: 'launch-app' }), false);
  const result = validateFlowStructure(flow([step('file-operation', { operation: 'copy', sourcePath: 'a', destinationPath: 'b' }, 'copy1')], { retryCount: 2 }));
  assert.ok(result.warnings.some((warning) => warning.includes('Automatic retries are disabled')));
});

test('detects missing subflows and circular references', () => {
  const { validateFlowCollection } = require('../src/flow-validator');
  const root = flow([step('run-subflow', { workflowId: 'missing-flow' }, 'sub1')]);
  const missing = validateFlowCollection(root, [root]);
  assert.ok(missing.errors.some((error) => error.includes('was not found')));

  const a = flow([step('run-subflow', { workflowId: 'flow-b' }, 'sub-a')], { id: 'flow-a', name: 'Flow A' });
  const b = flow([step('run-subflow', { workflowId: 'flow-a' }, 'sub-b')], { id: 'flow-b', name: 'Flow B' });
  const cycle = validateFlowCollection(a, [a, b]);
  assert.ok(cycle.errors.some((error) => error.includes('circular subflow reference')));
});

test('rejects subflow chains deeper than five levels', () => {
  const { validateFlowCollection } = require('../src/flow-validator');
  const flows = [];
  for (let i = 0; i <= 6; i++) {
    const id = i === 0 ? 'root-flow' : `flow-${i}`;
    const nextId = i === 0 ? 'flow-1' : `flow-${i + 1}`;
    const steps = i < 6 ? [step('run-subflow', { workflowId: nextId }, `sub-${i}`)] : [];
    flows.push(flow(steps, { id, name: `Flow ${i}` }));
  }
  const result = validateFlowCollection(flows[0], flows);
  assert.ok(result.errors.some((error) => error.includes('maximum nesting depth of five')));
});

test('rejects duplicate step IDs', () => {
  const result = validateFlowStructure(flow([
    step('wait', { ms: 100 }, 'duplicate'),
    step('notification', { title: 'Test', message: 'Test' }, 'duplicate')
  ]));
  assert.ok(result.errors.some((error) => error.includes('step ID is missing or duplicated')));
});

test('rejects missing required paths before execution', () => {
  const result = validateFlowStructure(flow([
    step('open-folder', { path: '' }, 'folder1'),
    step('file-operation', { operation: 'copy', sourcePath: 'C:/source.txt', destinationPath: '' }, 'copy1')
  ]));
  assert.ok(result.errors.some((error) => error.includes('A path or application must be selected')));
  assert.ok(result.errors.some((error) => error.includes('Destination path is required')));
});
