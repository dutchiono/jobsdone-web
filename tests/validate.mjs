import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const file = path => { assert.ok(existsSync(path), 'Missing ' + path); return readFileSync(path, 'utf8'); };
for (const path of ['dist/index.html','dist/studio/index.html','dist/templates/index.html','dist/automation/index.html','dist/shared.css']) file(path);
const projects = JSON.parse(file('dist/data/projects.json'));
const inventory = JSON.parse(file('dist/data/repositories.json'));
assert.ok(projects.projects.length >= 10, 'Curated portfolio too small');
assert.equal(inventory.entries.length, 114, 'Public repo inventory changed; refresh its grounded count');
assert.equal(new Set(inventory.entries.map(x => x.repo)).size, inventory.entries.length, 'Duplicate repo identities');
for (const project of projects.projects) {
  assert.ok(project.id && project.title && project.status && project.links?.[0]?.url, 'Invalid project entry');
}
for (const entry of inventory.entries) assert.ok(entry.url.startsWith('https://github.com/'), 'Invalid repo URL');
const template = file('dist/templates/index.html');
for (const id of ['industry','business','preview']) {
  assert.ok(template.includes('id="' + id + '"'), 'Missing template control ' + id);
}
const automation = file('dist/automation/index.html');
assert.ok(automation.includes('jobsdone.automation-brief.v1'), 'Missing Bot Foundry interchange format');
const studio = file('dist/studio/index.html');
assert.ok(studio.includes('/data/repositories.json'), 'Miono portfolio not connected to inventory');
const homepage = file('dist/index.html');
assert.ok(homepage.includes('/templates/'), 'Jobs Done does not link to industry templates');
assert.ok(homepage.includes('/automation/'), 'Jobs Done does not link to automation bridge');
console.log('Validated Jobs Done, Miono Studio, template migration, and all public repo records.');
