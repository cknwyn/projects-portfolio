/**
 * ============================================================================
 * utils.js — Exported Pure Utility Functions
 *
 * These functions are extracted and modularized so they can
 * be imported and tested independently with Jest (Node environment)
 * while also being safely loaded and executed in browser environments.
 * ============================================================================
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // CommonJS / Node environment (e.g. Jest)
    module.exports = factory();
  } else {
    // Browser environment
    root.PortfolioUtils = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  /**
   * Escapes HTML special characters to prevent XSS when inserting user-supplied
   * or API-sourced strings into innerHTML.
   *
   * @param {*} str - Value to escape (coerced to string if not already).
   * @returns {string} HTML-escaped string safe for use in innerHTML.
   */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Infers a project category string from a primary programming language.
   * Used when mapping raw GitHub API repo objects to portfolio entries.
   *
   * @param {string} lang - Primary programming language reported by GitHub.
   * @returns {'web'|'systems'|'creative'|'tools'} Category label.
   */
  function inferCategoryFromLanguage(lang) {
    if (['HTML', 'CSS', 'JavaScript', 'Vue', 'React'].includes(lang)) return 'web';
    if (['Rust', 'Go', 'C', 'C++', 'Shell'].includes(lang))           return 'systems';
    if (['GLSL', 'Processing', 'Python'].includes(lang))               return 'creative';
    return 'tools';
  }

  /**
   * Filters a list of repository objects against an active category filter and
   * a free-text search query.
   *
   * @param {Array<Object>} repos        - Full array of repo / project objects.
   * @param {string}        activeFilter - Category to match ('all' matches every entry).
   * @param {string}        searchQuery  - Free-text query (empty string matches all).
   * @returns {Array<Object>} Repos that satisfy both the category and text filters.
   */
  function filterRepos(repos, activeFilter, searchQuery) {
    return (repos || []).filter((repo) => {
      const matchCategory =
        activeFilter === 'all' || repo.category === activeFilter;

      const q = (searchQuery || '').toLowerCase().trim();
      const matchSearch =
        !q ||
        (repo.name        && repo.name.toLowerCase().includes(q))        ||
        (repo.description && repo.description.toLowerCase().includes(q)) ||
        (repo.tags        && repo.tags.some((t) => t.toLowerCase().includes(q))) ||
        (repo.primaryLang && repo.primaryLang.toLowerCase().includes(q));

      return matchCategory && matchSearch;
    });
  }

  /**
   * Counts how many repos belong to each known category.
   *
   * @param {Array<Object>} repos - Array of repo / project objects.
   * @returns {{ total: number, web: number, tools: number, systems: number, creative: number }}
   */
  function countByCategory(repos) {
    const list = repos || [];
    return {
      total:    list.length,
      web:      list.filter((r) => r.category === 'web').length,
      tools:    list.filter((r) => r.category === 'tools').length,
      systems:  list.filter((r) => r.category === 'systems').length,
      creative: list.filter((r) => r.category === 'creative').length,
    };
  }

  /**
   * Builds the `git clone <url>.git` command string shown in the project modal.
   *
   * @param {string} githubUrl - The HTTPS URL of the repository (no trailing `.git`).
   * @returns {string} Ready-to-paste clone command.
   */
  function buildCloneCommand(githubUrl) {
    if (!githubUrl) return '';
    return `git clone ${githubUrl}.git`;
  }

  return {
    escapeHtml,
    inferCategoryFromLanguage,
    filterRepos,
    countByCategory,
    buildCloneCommand,
  };
});
