/// <reference types="wesl-plugin/suffixes" />
import "wgsl-edit";
import "wgsl-play";
import drawShapesConfig from "./draw-shapes.wesl?link";
import starDemoConfig from "./main.wesl?link";
import mandelbrotConfig from "./mandelbrot.wesl?link";

export const drawShapesProject = drawShapesConfig;

export const starDemoProject = {
  ...starDemoConfig,
  conditions: { noise: true },
};

export const mandelbrotProject = mandelbrotConfig;

/** Stop keyboard events from bubbling to Slidev navigation */
function trapKeys(el: HTMLElement) {
  for (const evt of ["keydown", "keyup", "keypress"] as const) {
    el.addEventListener(evt, (e) => e.stopPropagation());
  }
}

export function initPlayer(id: string, project: Record<string, unknown>) {
  const el = document.getElementById(id);
  if (!el) return;
  trapKeys(el);
  (el as HTMLElement & { project: Record<string, unknown> }).project = project;
}

export function initEditor(id: string, project: Record<string, unknown>) {
  const el = document.getElementById(id);
  if (!el) return;
  trapKeys(el);
  (el as HTMLElement & { project: Record<string, unknown> }).project = project;
}

export function connectPlayerToEditor(playerId: string, editorId: string) {
  const player = document.getElementById(playerId);
  if (player) {
    trapKeys(player);
    player.setAttribute("source", editorId);
  }
  const editor = document.getElementById(editorId);
  if (editor) {
    editor.setAttribute("lint-from", playerId);
  }
}
