import type { Bounds } from "../types/Bounds.js";

export const gameConfigs = {
  velocity: 150,
  pixel: 20,
  width: 400,
  height: 400,
} as const;

export const bounds: Bounds = {
  width: gameConfigs.width,
  height: gameConfigs.height,
  pixelSize: gameConfigs.pixel,
};
