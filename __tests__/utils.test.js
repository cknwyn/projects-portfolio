/**
 * ============================================================================
 * __tests__/utils.test.js — Jest Unit Tests for Werkstatt Portfolio
 *
 * Tests cover the critical pure-function utilities exported from utils.js.
 * These run on every push / PR via the GitHub Actions "test" job, and the
 * "deploy" job is blocked until ALL tests here pass.
 *
 * Run locally with:   npm test
 * ============================================================================
 */

'use strict';

const {
  escapeHtml,
  inferCategoryFromLanguage,
  filterRepos,
  countByCategory,
  buildCloneCommand,
} = require('../utils');

// ─────────────────────────────────────────────────────────────────────────────
// Shared fixture data used across multiple test suites
// ─────────────────────────────────────────────────────────────────────────────
const FIXTURE_REPOS = [
  {
    id: 'r1',
    name: 'bauhaus-css-system',
    category: 'web',
    description: 'A modular brutalist CSS framework.',
    tags: ['CSS', 'Grid', 'Typography'],
    primaryLang: 'CSS',
  },
  {
    id: 'r2',
    name: 'hypergrid-engine',
    category: 'creative',
    description: 'Hardware-accelerated WebGL rendering engine.',
    tags: ['TypeScript', 'WebGL', 'Math'],
    primaryLang: 'TypeScript',
  },
  {
    id: 'r3',
    name: 'docker-minimalist',
    category: 'tools',
    description: 'Micro-sized multi-stage Dockerfiles.',
    tags: ['Docker', 'DevOps', 'Alpine'],
    primaryLang: 'Shell',
  },
  {
    id: 'r4',
    name: 'rust-cli-toolkit',
    category: 'systems',
    description: 'Rust CLI utilities for system automation.',
    tags: ['Rust', 'CLI', 'Systems'],
    primaryLang: 'Rust',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. escapeHtml
// ─────────────────────────────────────────────────────────────────────────────
describe('escapeHtml()', () => {
  test('returns an empty string for null input', () => {
    expect(escapeHtml(null)).toBe('');
  });

  test('returns an empty string for undefined input', () => {
    expect(escapeHtml(undefined)).toBe('');
  });

  test('escapes ampersands', () => {
    expect(escapeHtml('AT&T')).toBe('AT&amp;T');
  });

  test('escapes less-than signs', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  test('escapes greater-than signs', () => {
    expect(escapeHtml('3 > 2')).toBe('3 &gt; 2');
  });

  test('escapes double-quotes', () => {
    expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
  });

  test('escapes single-quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#039;s');
  });

  test('escapes a combined XSS payload', () => {
    const input  = '<img src="x" onerror=\'alert(1)\'>';
    const output = escapeHtml(input);
    expect(output).toBe('&lt;img src=&quot;x&quot; onerror=&#039;alert(1)&#039;&gt;');
  });

  test('leaves safe plain text unchanged', () => {
    expect(escapeHtml('Hello, World!')).toBe('Hello, World!');
  });

  test('coerces numbers to string', () => {
    expect(escapeHtml(42)).toBe('42');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. inferCategoryFromLanguage
// ─────────────────────────────────────────────────────────────────────────────
describe('inferCategoryFromLanguage()', () => {
  test.each([
    ['HTML',       'web'],
    ['CSS',        'web'],
    ['JavaScript', 'web'],
    ['Vue',        'web'],
    ['React',      'web'],
  ])('maps %s → "web"', (lang, expected) => {
    expect(inferCategoryFromLanguage(lang)).toBe(expected);
  });

  test.each([
    ['Rust',  'systems'],
    ['Go',    'systems'],
    ['C',     'systems'],
    ['C++',   'systems'],
    ['Shell', 'systems'],
  ])('maps %s → "systems"', (lang, expected) => {
    expect(inferCategoryFromLanguage(lang)).toBe(expected);
  });

  test.each([
    ['GLSL',       'creative'],
    ['Processing', 'creative'],
    ['Python',     'creative'],
  ])('maps %s → "creative"', (lang, expected) => {
    expect(inferCategoryFromLanguage(lang)).toBe(expected);
  });

  test('defaults unknown languages to "tools"', () => {
    expect(inferCategoryFromLanguage('Haskell')).toBe('tools');
    expect(inferCategoryFromLanguage('Kotlin')).toBe('tools');
    expect(inferCategoryFromLanguage('')).toBe('tools');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. filterRepos
// ─────────────────────────────────────────────────────────────────────────────
describe('filterRepos()', () => {
  test('returns all repos when filter is "all" and query is empty', () => {
    const result = filterRepos(FIXTURE_REPOS, 'all', '');
    expect(result).toHaveLength(FIXTURE_REPOS.length);
  });

  test('filters by category correctly', () => {
    const result = filterRepos(FIXTURE_REPOS, 'web', '');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('r1');
  });

  test('returns empty array when no repos match a category', () => {
    const result = filterRepos(FIXTURE_REPOS, 'nonexistent', '');
    expect(result).toHaveLength(0);
  });

  test('searches by repo name (case-insensitive)', () => {
    const result = filterRepos(FIXTURE_REPOS, 'all', 'BAUHAUS');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('r1');
  });

  test('searches by description', () => {
    const result = filterRepos(FIXTURE_REPOS, 'all', 'webgl');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('r2');
  });

  test('searches by tag', () => {
    const result = filterRepos(FIXTURE_REPOS, 'all', 'docker');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('r3');
  });

  test('searches by primaryLang', () => {
    const result = filterRepos(FIXTURE_REPOS, 'all', 'rust');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('r4');
  });

  test('combines category and search query (AND logic)', () => {
    // There IS a "web" category repo named bauhaus-css-system — should match.
    const match = filterRepos(FIXTURE_REPOS, 'web', 'css');
    expect(match).toHaveLength(1);

    // There is NO "systems" category repo named bauhaus — should NOT match.
    const noMatch = filterRepos(FIXTURE_REPOS, 'systems', 'bauhaus');
    expect(noMatch).toHaveLength(0);
  });

  test('returns empty array for an empty repos list', () => {
    expect(filterRepos([], 'all', 'anything')).toHaveLength(0);
  });

  test('handles repos with missing optional fields gracefully', () => {
    const sparse = [{ id: 'x', name: 'minimal', category: 'tools' }];
    expect(() => filterRepos(sparse, 'all', 'minimal')).not.toThrow();
    expect(filterRepos(sparse, 'all', 'minimal')).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. countByCategory
// ─────────────────────────────────────────────────────────────────────────────
describe('countByCategory()', () => {
  test('returns correct totals for fixture repos', () => {
    const counts = countByCategory(FIXTURE_REPOS);
    expect(counts.total).toBe(4);
    expect(counts.web).toBe(1);
    expect(counts.creative).toBe(1);
    expect(counts.tools).toBe(1);
    expect(counts.systems).toBe(1);
  });

  test('all counts are zero for an empty array', () => {
    const counts = countByCategory([]);
    expect(counts.total).toBe(0);
    expect(counts.web).toBe(0);
    expect(counts.tools).toBe(0);
    expect(counts.systems).toBe(0);
    expect(counts.creative).toBe(0);
  });

  test('unknown categories do not inflate named buckets', () => {
    const counts = countByCategory([{ category: 'unknown' }]);
    expect(counts.total).toBe(1);
    expect(counts.web).toBe(0);
    expect(counts.tools).toBe(0);
    expect(counts.systems).toBe(0);
    expect(counts.creative).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. buildCloneCommand
// ─────────────────────────────────────────────────────────────────────────────
describe('buildCloneCommand()', () => {
  test('builds a correctly formatted git clone command', () => {
    const url = 'https://github.com/octocat/hypergrid-engine';
    expect(buildCloneCommand(url)).toBe(
      'git clone https://github.com/octocat/hypergrid-engine.git'
    );
  });

  test('appends .git to the URL', () => {
    const result = buildCloneCommand('https://github.com/user/repo');
    expect(result).toMatch(/\.git$/);
  });

  test('returns an empty string for a falsy input', () => {
    expect(buildCloneCommand('')).toBe('');
    expect(buildCloneCommand(null)).toBe('');
    expect(buildCloneCommand(undefined)).toBe('');
  });

  test('starts with "git clone "', () => {
    const result = buildCloneCommand('https://github.com/user/repo');
    expect(result.startsWith('git clone ')).toBe(true);
  });
});

