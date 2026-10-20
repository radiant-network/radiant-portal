import { includeBundle } from './include/bundle';
import { kfBundle } from './kf/bundle';
import { qlinBundle } from './qlin/bundle';
import { radiantBundle } from './radiant/bundle';

export const THEMES = {
  radiant: radiantBundle,
  include: includeBundle,
  kf: kfBundle,
  qlin: qlinBundle,
};

export type ThemeName = keyof typeof THEMES;
