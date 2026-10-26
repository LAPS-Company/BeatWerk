'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.html'), 'utf8');
const renderer = fs.readFileSync(path.join(__dirname, '..', 'src', 'renderer.js'), 'utf8');

test('starts in English with English listed before German', () => {
  assert.match(html, /<html lang="en" data-theme="dark">/);
  assert.match(html, /<option value="en">English<\/option>\s*<option value="de">Deutsch<\/option>/);
  assert.match(renderer, /let saved = 'en';[\s\S]{0,100}localStorage\.getItem\('laps-flow-locale'\) \|\| 'en'/);
});

test('offers a persistent switch between dark and light themes', () => {
  assert.match(html, /id="theme-btn"/);
  assert.match(renderer, /localStorage\.setItem\('laps-flow-theme', currentTheme\)/);
  assert.match(renderer, /setTheme\(currentTheme === 'dark' \? 'light' : 'dark'\)/);
  assert.match(fs.readFileSync(path.join(__dirname, '..', 'src', 'styles.css'), 'utf8'), /html\[data-theme="light"\]/);
});


test('properties panel can be hidden and reopened', () => {
  assert.match(html, /id="properties-close-btn"/);
  assert.match(html, /id="properties-open-btn"/);
  assert.match(renderer, /\$\('#properties-close-btn'\)\.addEventListener\('click'/);
  assert.match(renderer, /\$\('#properties-open-btn'\)\.addEventListener\('click'/);
  const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'styles.css'), 'utf8');
  assert.match(css, /\.studio-grid\.inspector-hidden \.inspector-panel\{display:none\}/);
});

test('inspector commits existing field values before rebuilding and preserves textarea values', () => {
  assert.match(renderer, /function commitInspectorFields\(\)/);
  assert.match(renderer, /commitInspectorFields\(\);\s*inspectorRenderedStepId = selectedStepId/);
  assert.match(renderer, /closest\('textarea, \[contenteditable=\"true\"\]'\)/);
  assert.match(renderer, /element\.tagName === 'TEXTAREA'[\s\S]{0,160}addEventListener\('blur', \(\) => commitInspectorFields\(\)\)/);
  assert.match(renderer, /case 'open-websites':[\s\S]{0,180}inputField\('WEBADRESSEN \(EINE PRO ZEILE\)', 'urls'/);
});

test('release metadata is consistently 1.0.0', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  const buildBat = fs.readFileSync(path.join(__dirname, '..', 'build-windows.bat'), 'utf8');
  const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
  assert.equal(pkg.version, '1.0.0');
  assert.match(pkg.build.win.artifactName, /\$\{version\}/);
  assert.match(html, /id="version-label">v1\.0\.0<\/span>/);
  assert.match(buildBat, /LAPS-Flow-Setup-1\.0\.0\.exe/);
  assert.match(readme, /^# LAPS Flow v1\.0\.0/m);
  assert.doesNotMatch(`${html}\n${renderer}\n${buildBat}\n${readme}`, /0\.4\.4/);
});

test('About LAPS displays the official site link and can open it externally', () => {
  assert.match(html, /id="about-link"/);
  assert.match(html, /id="about-modal"[^>]*role="dialog"/);
  assert.match(html, /href="https:\/\/sites\.google\.com\/view\/laps-web\/home"/);
  assert.match(renderer, /const LAPS_WEBSITE_URL = 'https:\/\/sites\.google\.com\/view\/laps-web\/home'/);
  assert.match(renderer, /window\.lapsFlow\.openExternal\(LAPS_WEBSITE_URL\)/);
  assert.match(renderer, /\$\('#about-link'\)\.addEventListener\('click', \(\) => \{ \$\('#about-modal'\)\.classList\.remove\('hidden'\)/);
});

test('light theme explicitly fixes hard-coded dark surfaces and text', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'src', 'styles.css'), 'utf8');
  for (const selector of [
    'html[data-theme="light"] .brand-mark',
    'html[data-theme="light"] .flow-title-wrap input',
    'html[data-theme="light"] .action-search',
    'html[data-theme="light"] .count-badge',
    'html[data-theme="light"] .danger-button',
    'html[data-theme="light"] .toast',
    'html[data-theme="light"] .about-modal .about-url'
  ]) assert.ok(css.includes(selector), `Missing light-theme override: ${selector}`);
});
