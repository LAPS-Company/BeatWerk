'use strict';

(function exposeFieldState(root) {
  function hydrateConfigTextareas(container, config) {
    if (!container || typeof container.querySelectorAll !== 'function') return 0;
    const textareas = container.querySelectorAll('textarea[data-config]');
    let count = 0;
    for (const element of textareas) {
      const key = element.dataset && element.dataset.config;
      const value = key && config && Object.prototype.hasOwnProperty.call(config, key) ? config[key] : '';
      // Set the live value property, not textContent/defaultValue. That preserves exact multi-line
      // URLs and other user-entered text independently of HTML parsing and localization.
      element.value = value == null ? '' : String(value);
      count += 1;
    }
    return count;
  }

  if (root) root.LAPSFlowFieldState = { hydrateConfigTextareas };
  if (typeof module !== 'undefined' && module.exports) module.exports = { hydrateConfigTextareas };
})(typeof window !== 'undefined' ? window : null);
