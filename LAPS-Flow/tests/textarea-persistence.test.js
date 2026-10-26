'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { hydrateConfigTextareas } = require('../src/field-state');

const project = path.join(__dirname, '..');
const renderer = fs.readFileSync(path.join(project, 'src', 'renderer.js'), 'utf8');
const html = fs.readFileSync(path.join(project, 'src', 'index.html'), 'utf8');

test('multiline config is restored from the model on every Properties render', () => {
  const urlText = 'https://example.com\nhttps://example.org/path?a=1&b=2\nhttps://example.net';
  const controls = [
    { dataset: { config: 'urls' }, value: '' },
    { dataset: { config: 'rules' }, value: 'stale value' },
    { dataset: { config: 'body' }, value: 'stale value' }
  ];
  const root = { querySelectorAll: (selector) => selector === 'textarea[data-config]' ? controls : [] };
  const count = hydrateConfigTextareas(root, { urls: urlText, rules: '.pdf=PDF\n.png=Images', body: null });
  assert.equal(count, 3);
  assert.equal(controls[0].value, urlText);
  assert.equal(controls[1].value, '.pdf=PDF\n.png=Images');
  assert.equal(controls[2].value, '');
});

test('renderer explicitly hydrates textarea values after rebuilding Properties', () => {
  assert.match(renderer, /window\.LAPSFlowFieldState\.hydrateConfigTextareas\(box, step\.config\)/);
  assert.match(renderer, /const valueAttr = isArea \? '' : `value=/);
  assert.match(renderer, /commitInspectorFields\(\);\s*selectedStepId = step\.id/);
});

test('textarea hydrator is loaded before the renderer', () => {
  assert.match(html, /<script src="field-state\.js"><\/script>\s*<script src="renderer\.js"><\/script>/);
});
