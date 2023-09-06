// ------UTILITAIRES------ //
export const query = (selector, parent = document) =>
  parent.querySelector(selector);
export const queryAll = (selector, parent = document) =>
  parent.querySelectorAll(selector);
export const closest = (selector, elem) => elem.closest(selector);
export const contains = (parent, child) => parent.contains(child);
export const createElem = (tag, attributes = {}) => {
  const elem = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    elem.setAttribute(key, value);
  }
  return elem;
};

export const addEvent = (type, elem, callback) =>
  elem.addEventListener(type, callback);
export const toggleClass = (elem, className, condition) =>
  elem.classList.toggle(className, condition);
export const cloneNode = (selector, deep = true) =>
  document.querySelector(selector).cloneNode(deep);
export const getElem = (id) => document.getElementById(id);
export const getDOMValue = (selector) =>
  document.querySelector(selector)?.value || null;
