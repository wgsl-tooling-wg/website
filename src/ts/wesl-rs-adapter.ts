/** Adapter for compiling WESL using the wesl-rs WASM build. */

import type { Feature } from "wesl-rs-wasm";

interface WeslBundle {
  name: string;
  modules: Record<string, string>;
  dependencies?: WeslBundle[];
}

interface WeslEditor {
  sources: Record<string, string>;
  _libs?: WeslBundle[];
  conditions?: Record<string, boolean>;
  link(options: { virtualLibs: Record<string, () => string> }): Promise<string>;
}

type WeslWeb = typeof import("wesl-rs-wasm");

let weslWeb: WeslWeb | null = null;

/** Convert a WeslBundle file path to a module path for wesl-rs. */
function bundleFileToModulePath(filePath: string, packageName: string): string {
  return packageName + "::" + filePath
    .replace(/^\.\//, "")
    .replace(/\.wesl$/, "")
    .replace(/\.wgsl$/, "")
    .replaceAll("/", "::");
}

/** Collect all modules from a bundle and its dependencies. */
function collectBundleModules(
  bundle: WeslBundle,
  files: Record<string, string>,
  seen: Set<WeslBundle> = new Set(),
): void {
  if (seen.has(bundle)) return;
  seen.add(bundle);
  for (const [filePath, source] of Object.entries(bundle.modules)) {
    files[bundleFileToModulePath(filePath, bundle.name)] = source;
  }
  if (bundle.dependencies) {
    for (const dep of bundle.dependencies) {
      collectBundleModules(dep, files, seen);
    }
  }
}

/** Build the files map for wesl-rs from the editor's sources and libs. */
function buildFilesMap(
  editor: WeslEditor,
  testUniformsSrc: string,
): Record<string, string> {
  const files: Record<string, string> = { ...editor.sources };
  files["test"] = testUniformsSrc;
  for (const bundle of editor._libs || []) {
    collectBundleModules(bundle, files);
  }
  return files;
}

/** Load the WASM module (lazy, cached). */
async function loadWasm(): Promise<WeslWeb> {
  if (!weslWeb) {
    // @ts-ignore - WASM module served at site root by Origami
    const mod: WeslWeb = await import("/wesl_web.js");
    await mod.default();
    weslWeb = mod;
  }
  return weslWeb;
}

/** @returns true if the WASM module has been loaded. */
export function isLoaded(): boolean {
  return weslWeb !== null;
}

/**
 * Compile WESL sources using wesl-rs (WASM).
 * Lazily loads the WASM module on first call.
 */
export async function compile(
  editor: WeslEditor,
  testUniformsSrc: string,
): Promise<string> {
  await loadWasm();

  // Ensure libs are fetched by triggering a JS link first
  try {
    await editor.link({ virtualLibs: { test: () => testUniformsSrc } });
  } catch (_) { /* ignore link errors, we just need libs fetched */ }

  const files = buildFilesMap(editor, testUniformsSrc);

  // Map editor conditions to wesl-rs features
  const features: Record<string, Feature> = {};
  for (const [key, value] of Object.entries(editor.conditions || {})) {
    features[key] = value ? "enable" : "disable";
  }

  return weslWeb!.run({
    command: "Compile",
    files,
    root: "package::main",
    imports: true,
    condcomp: true,
    generics: false,
    strip: true,
    lower: false,
    validate: false,
    naga: false,
    lazy: true,
    sourcemap: false,
    mangler: "escape",
    keep_root: false,
    mangle_root: false,
    features,
    features_default: "disable",
  });
}
