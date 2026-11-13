#!/usr/bin/env node
// Write the failed tests of mochawesome reports (JSON, or HTML from marge) as one JUnit XML on stdout.
// Prints nothing when nothing failed. Usage: node cypress/scripts/junit-failures.mjs <report.json|report.html>...
import { readFileSync } from 'fs';

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const codePoint = e => String.fromCodePoint(Number(/x/i.test(e[1]) ? `0x${e.slice(2)}` : e.slice(1)));
const unescapeHtml = s => s.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? codePoint(e) : (ENTITIES[e] ?? m)));

const load = path => {
  const text = readFileSync(path, 'utf8');
  if (!path.endsWith('.html')) return JSON.parse(text);
  // marge embeds the report JSON, HTML-escaped, in a data-raw attribute
  const raw = text.match(/data-raw="([^"]*)"/);
  if (!raw) throw new Error('no data-raw attribute');
  return JSON.parse(unescapeHtml(raw[1]));
};

const xmlChars = s => String(s ?? '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
const XML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\n': '&#10;' };
const attr = s => xmlChars(s).replace(/[&<>"\n]/g, c => XML_ESCAPES[c]);
const cdata = s => `<![CDATA[${xmlChars(s).replaceAll(']]>', ']]]]><![CDATA[>')}]]>`;
const seconds = ms => ((ms || 0) / 1000).toFixed(3);

const testcase = t => [`    <testcase name="${attr(t.fullTitle)}" classname="${attr(t.title)}" time="${seconds(t.duration)}">`, `      <failure message="${attr(t.err?.message)}">${cdata(t.err?.estack)}</failure>`, '    </testcase>'].join('\n');

const suites = [];
let total = 0;

for (const path of process.argv.slice(2)) {
  let report;
  try {
    report = load(path);
  } catch (e) {
    console.error(`${path} skipped: ${e.message}`);
    continue;
  }
  // Same layout as mocha-junit-reporter, which readers expect: the suite carrying `file` precedes the suites of that spec
  const timestamp = new Date(report.stats?.start ?? Date.now()).toISOString().slice(0, 19);
  for (const spec of report.results ?? []) {
    const failed = [];
    // Cypress leaves the hook lists empty and fails the test whose hook failed
    const walk = (suite, titles) => {
      const tests = (suite.tests ?? []).filter(t => t.fail);
      if (tests.length) failed.push({ name: titles.filter(Boolean).join(' ') || 'Root Suite', tests });
      for (const child of suite.suites ?? []) walk(child, [...titles, child.title]);
    };
    walk(spec, [spec.title]);
    if (!failed.length) continue;

    suites.push(`  <testsuite name="Root Suite" file="${attr(spec.file || spec.fullFile)}" timestamp="${timestamp}" tests="0" failures="0" time="0.000"></testsuite>`);
    for (const { name, tests } of failed) {
      total += tests.length;
      const time = seconds(tests.reduce((sum, t) => sum + (t.duration || 0), 0));
      suites.push(`  <testsuite name="${attr(name)}" timestamp="${timestamp}" tests="${tests.length}" failures="${tests.length}" time="${time}">`, ...tests.map(testcase), '  </testsuite>');
    }
  }
}

if (total) {
  process.stdout.write(`<?xml version="1.0" encoding="UTF-8"?>\n<testsuites name="Cypress failures" tests="${total}" failures="${total}">\n${suites.join('\n')}\n</testsuites>\n`);
}
