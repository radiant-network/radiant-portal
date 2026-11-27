import { createElement } from 'react';
import { afterEach, beforeAll, expect } from 'vitest';
import { page } from 'vitest/browser';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { type Decorator, setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';

type ScreenshotParams = false | { fullWidth?: boolean; viewports?: Record<string, [number, number]> };

const SCREENSHOT_ROOT = 'data-screenshot-root';

const withScreenshotRoot: Decorator = (Story, { parameters }) => {
  const screenshot = parameters.screenshot as ScreenshotParams | undefined;
  const fullWidth = screenshot !== false && screenshot?.fullWidth === true;
  return createElement(
    'div',
    { [SCREENSHOT_ROOT]: '', style: { display: fullWidth ? 'block' : 'inline-block', padding: 8 } },
    createElement(Story),
  );
};

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
// Storybook itself stays in a11y "todo" mode; the test run fails on any axe violation.
// Colour contrast is skipped: the palette is imposed by the theme and cannot be fixed per component.
const a11y = { test: 'error', options: { rules: { 'color-contrast': { enabled: false } } } };

const project = setProjectAnnotations([
  a11yAddonAnnotations,
  projectAnnotations,
  { decorators: [withScreenshotRoot], parameters: { a11y } },
]);

beforeAll(project.beforeAll);

// Screenshots must not depend on where a transition or an animation happens to be when captured.
const disableMotion = document.createElement('style');
disableMotion.textContent =
  '*, *::before, *::after { transition: none !important; animation: none !important; caret-color: transparent !important; }';
document.head.appendChild(disableMotion);

const settle = async () => {
  await document.fonts.ready;
  await new Promise(requestAnimationFrame);
};

afterEach(async context => {
  const { task } = context;
  const { storyId } = task.meta as { storyId?: string };
  const story = (context as { story?: { parameters?: { screenshot?: ScreenshotParams } } }).story;
  const screenshot = story?.parameters?.screenshot;
  if (!storyId || task.result?.state === 'fail' || screenshot === false) return;

  const root = page.elementLocator(document.querySelector(`[${SCREENSHOT_ROOT}]`) ?? document.body);
  const viewports = Object.entries(screenshot?.viewports ?? {});

  if (!viewports.length) {
    await settle();
    await expect.element(root).toMatchScreenshot(storyId);
    return;
  }

  const initial: [number, number] = [window.innerWidth, window.innerHeight];
  try {
    for (const [name, [width, height]] of viewports) {
      await page.viewport(width, height);
      await settle();
      await expect.element(root).toMatchScreenshot(`${storyId}-${name}`);
    }
  } finally {
    await page.viewport(...initial);
  }
});
