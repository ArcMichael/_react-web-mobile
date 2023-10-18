/*
 * Get style by dom or class
 */
export default function getStyle(selector, style) {
  if (!style) return;

  if (window && document && window.getComputedStyle && document.querySelector) {
    if (typeof selector === "string") {
      return window.getComputedStyle(document.querySelector(selector))[style];
    }
    return window.getComputedStyle(selector)[style];
  }
}
