/* global document navigator */
export const sharedTooltipTouchConfig = {
  enterTouchDelay: 0,
  leaveTouchDelay: 500,
};

export const hasTouch = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
