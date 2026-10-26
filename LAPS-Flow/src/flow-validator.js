'use strict';

const RETRY_SAFE_TYPES = new Set([
  'wait',
  'logic-condition',
  'set-variable',
  'copy-text',
  'wait-download-complete'
]);

function isRetrySafeStep(step, config = step?.config || {}) {
  if (!step || !RETRY_SAFE_TYPES.has(step.type)) return false;
  // A timestamp assignment changes on each attempt, so do not treat it as idempotent.
  if (step.type === 'set-variable' && config.valueType === 'timestamp') return false;
  return true;
}

function validateFlowStructure(workflow, label = workflow?.name || 'Flow') {
  const errors = [];
  const warnings = [];
  const steps = Array.isArray(workflow?.steps) ? workflow.steps : [];
  const prefix = (index) => `${label} · Step ${index + 1}: `;
  if (!steps.length) warnings.push(`${label}: this flow has no actions yet.`);

  const ids = new Set();
  const loopStack = [];
  const variablePattern = /\$\{[a-zA-Z0-9_.-]+\}/;
  const needsValue = (value) => !String(value ?? '').trim();
  const checkUrl = (url, at) => {
    const value = String(url || '').trim();
    if (needsValue(value)) { errors.push(`${at}URL is required.`); return; }
    if (variablePattern.test(value)) { warnings.push(`${at}URL contains a variable and will be checked at runtime.`); return; }
    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol)) errors.push(`${at}Only HTTP and HTTPS URLs are allowed.`);
    } catch { errors.push(`${at}Enter a valid full URL.`); }
  };

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i] || {};
    const config = step.config || {};
    const at = prefix(i);
    if (!step.id || ids.has(step.id)) errors.push(`${at}step ID is missing or duplicated.`);
    else ids.add(step.id);

    if (step.type === 'loop-start') loopStack.push(i);
    if (step.type === 'loop-end') {
      if (!loopStack.length) errors.push(`${at}“End loop” has no matching “Start loop”.`);
      else loopStack.pop();
    }

    if (step.type === 'open-url' || step.type === 'open-web-app') checkUrl(config.url, at);
    if (step.type === 'open-websites') {
      const urls = String(config.urls || '').split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
      if (!urls.length) errors.push(`${at}Add at least one URL.`);
      urls.forEach((url) => checkUrl(url, at));
    }
    if (step.type === 'open-mailbox' && config.provider === 'other') checkUrl(config.url, at);
    if (['open-path', 'open-folder', 'launch-app'].includes(step.type) && needsValue(config.path)) errors.push(`${at}A path or application must be selected.`);

    if (step.type === 'file-operation') {
      if (config.operation === 'create') {
        if (needsValue(config.sourcePath)) errors.push(`${at}Enter the full path for the new file.`);
      } else {
        if (needsValue(config.sourcePath)) errors.push(`${at}Source path is required.`);
        if (needsValue(config.destinationPath)) errors.push(`${at}Destination path is required.`);
      }
    }
    if (step.type === 'search-files-by-type') {
      if (needsValue(config.folderPath)) errors.push(`${at}Choose a folder to search.`);
      if (needsValue(config.extensions)) errors.push(`${at}Enter at least one file extension.`);
    }
    if (step.type === 'sort-files-by-type') {
      if (needsValue(config.sourcePath)) errors.push(`${at}Choose a source folder.`);
      if (needsValue(config.destinationPath)) errors.push(`${at}Choose a destination folder.`);
      if (needsValue(config.rules)) errors.push(`${at}Add at least one file-sorting rule.`);
    }
    if (step.type === 'logic-condition') {
      if (config.conditionSource === 'variable' && needsValue(config.variableName)) errors.push(`${at}A variable name is required for this condition.`);
      if (config.conditionSource === 'file-exists' && needsValue(config.path)) errors.push(`${at}A file path is required for this condition.`);
      if (config.conditionSource === 'process-running' && needsValue(config.processName)) errors.push(`${at}A process name is required for this condition.`);
      const skip = Math.max(0, Math.trunc(Number(config.skipSteps) || 0));
      if (skip > 0) {
        for (let j = i + 1; j <= Math.min(steps.length - 1, i + skip); j++) {
          if (steps[j]?.type === 'loop-start' || steps[j]?.type === 'loop-end') {
            errors.push(`${at}The false-branch skip crosses a loop marker at step ${j + 1}. Adjust the number of skipped steps.`);
          }
        }
      }
    }
    if (step.type === 'set-variable' && !/^[a-zA-Z_][a-zA-Z0-9_.-]{0,99}$/.test(String(config.name || ''))) {
      errors.push(`${at}Enter a valid variable name (letters, numbers, dots, underscores and hyphens; it cannot start with a number).`);
    }
    if (step.type === 'run-subflow' && needsValue(config.workflowId)) errors.push(`${at}Choose a saved subflow.`);
    if (Number(workflow?.retryCount) > 0 && !isRetrySafeStep(step, config)) {
      warnings.push(`${at}Automatic retries are disabled for this side-effecting action to help prevent duplicate actions.`);
    }
  }
  if (loopStack.length) {
    loopStack.forEach((index) => errors.push(`${prefix(index)}“Start loop” has no matching “End loop”.`));
  }
  const trigger = workflow?.trigger || { type: 'manual' };
  if (['file-created', 'download-complete'].includes(trigger.type) && trigger.folderPath && !variablePattern.test(trigger.folderPath)) {
    warnings.push(`${label}: make sure the watched folder exists and is accessible before enabling the file trigger.`);
  }
  if (trigger.type === 'process-start' && needsValue(trigger.processName)) errors.push(`${label}: process-start trigger needs a process name.`);
  return { errors, warnings };
}

function validateFlowCollection(root, allFlows = []) {
  const byId = new Map(allFlows.map((flow) => [flow.id, flow]));
  byId.set(root.id, root);
  const errors = [];
  const warnings = [];
  const localChecked = new Set();
  const visitedAtDepth = new Set();
  const active = new Set();
  const addUnique = (target, value) => { if (!target.includes(value)) target.push(value); };

  function walk(flow, depth, trail) {
    if (active.has(flow.id)) {
      addUnique(errors, `${flow.name}: circular subflow reference detected (“${flow.name}”).`);
      return;
    }
    if (depth > 5) {
      addUnique(errors, `${flow.name}: subflows exceed the maximum nesting depth of five.`);
      return;
    }
    const visitKey = `${flow.id}:${depth}`;
    if (visitedAtDepth.has(visitKey)) return;
    visitedAtDepth.add(visitKey);

    if (!localChecked.has(flow.id)) {
      const local = validateFlowStructure(flow, flow.id === root.id ? root.name : `Subflow “${flow.name}”`);
      local.errors.forEach((value) => addUnique(errors, value));
      local.warnings.forEach((value) => addUnique(warnings, value));
      localChecked.add(flow.id);
    }

    active.add(flow.id);
    for (const step of (flow.steps || []).filter((item) => item.type === 'run-subflow')) {
      const targetId = String(step.config?.workflowId || '');
      const target = byId.get(targetId);
      if (!target) { addUnique(errors, `${flow.name}: referenced subflow “${targetId || '(not selected)'}” was not found.`); continue; }
      if (active.has(targetId) || trail.includes(targetId)) {
        addUnique(errors, `${flow.name}: circular subflow reference detected (“${target.name}”).`);
        continue;
      }
      walk(target, depth + 1, [...trail, flow.id]);
    }
    active.delete(flow.id);
  }

  walk(root, 0, []);
  return { ok: errors.length === 0, errors, warnings };
}

module.exports = { isRetrySafeStep, validateFlowStructure, validateFlowCollection };
