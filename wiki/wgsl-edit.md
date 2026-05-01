# wgsl-edit

Web component for editing WESL/WGSL with CodeMirror 6. Features syntax
highlighting, linting, multi-file tabs, and light/dark themes out of the box.

<div class="demo-container">
<wgsl-edit id="edit-demo-editor" theme="auto" lint-from="edit-demo-player">
  <script type="text/wesl" data-name="main.wesl">
import package::utils; import env::u;

@fragment
fn main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let uv = pos.xy / u.resolution;
  return vec4f(utils::gradient(uv, u.time), 1.0);
}
  </script>
  <script type="text/wesl" data-name="utils.wesl">
fn gradient(uv: vec2f, time: f32) -> vec3f {
  return vec3f(uv, 0.5 + 0.5 * sin(time));
}
  </script>
</wgsl-edit>
<wgsl-play id="edit-demo-player" from="edit-demo-editor"></wgsl-play>
</div>

## Installation

```bash
npm install wgsl-edit
```

## Usage

```html
<script type="module">import "wgsl-edit";</script>

<wgsl-edit></wgsl-edit>
```

### Inline Source

Include shader code directly via `<script>` tags. Multiple tags create a
multi-file editor with tabs:

```html
<wgsl-edit>
  <script type="text/wesl" data-name="main.wesl">
    import package::utils;
    @fragment fn main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
      return vec4f(utils::gradient(pos.xy), 1.0);
    }
  </script>
  <script type="text/wesl" data-name="utils.wesl">
    fn gradient(uv: vec2f) -> vec3f { return vec3f(uv, 0.5); }
  </script>
</wgsl-edit>
```

### With wgsl-play

Link an editor to a player for live shader preview:

```html
<wgsl-edit id="editor" lint-from="player" theme="auto">
  <script type="text/wesl">/* shader code */</script>
</wgsl-edit>
<wgsl-play id="player" from="editor"></wgsl-play>
```

The play component reads sources from the editor and live-previews the shader.

### Programmatic Control

```typescript
const editor = document.querySelector("wgsl-edit");

editor.source = shaderCode;           // set active file content
editor.addFile("helpers.wesl", code); // add a file
editor.activeFile = "helpers.wesl";   // switch tabs
```

## Autosave (dev mode)
Edits can be persisted back to the source file on disk during Vite development.
Add the `wgslEditAutosave()` plugin alongside `wesl-plugin` and set `autosave`
on the editor:

```typescript
// vite.config.ts
import wgslEditAutosave from "wgsl-edit/autosave";
import { linkBuildExtension } from "wesl-plugin";
import viteWesl from "wesl-plugin/vite";

export default {
  plugins: [
    viteWesl({ extensions: [linkBuildExtension] }),
    wgslEditAutosave(),
  ],
};
```

```typescript
// app.ts
import shaderConfig from "./shader.wesl?link";

const editor = document.querySelector("wgsl-edit");
editor.project = shaderConfig;
editor.autosave = true;
```

`shader-root` is picked up automatically from the `?link` import, so edits land
in the right file on disk. Production builds never include the middleware, so
the same code is safe to ship.

## Using with wesl-plugin

For more control, use [wesl-plugin](https://www.npmjs.com/package/wesl-plugin)
to assemble shaders and libraries at build time.

```typescript
import shaderConfig from "./shader.wesl?link";

editor.project = {
  ...shaderConfig,
  conditions: { MOBILE: isMobileGPU },
  constants: { num_lights: 4 }
};
```

## API Reference

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `src` | URL | - | Load source from URL |
| `theme` | `light` `dark` `auto` | `auto` | Color theme |
| `readonly` | boolean | `false` | Disable editing |
| `tabs` | boolean | `true` | Show tab bar |
| `lint` | `on` `off` | `on` | Real-time WESL validation |
| `lint-from` | element ID | - | Element ID of a wgsl-play to receive compile errors from |
| `line-numbers` | `true` `false` | `false` | Show line numbers |
| `shader-root` | string | - | Root path for shader imports |
| `autosave` | `true` `false` | auto-detect | Save edits to disk via dev server (requires `shader-root`) |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `source` | `string` | Get/set active file content |
| `project` | `WeslProject` | Get/set full project config (weslSrc, conditions, constants, packageName, libs) |
| `activeFile` | `string` | Get/set active file name |
| `fileNames` | `string[]` | List all file names |

### Methods

| Method | Description |
|--------|-------------|
| `addFile(name, content?)` | Add a new file |
| `removeFile(name)` | Remove a file |
| `renameFile(oldName, newName)` | Rename a file |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `WeslProject` | Any edit or conditions change |
| `file-change` | `{ action, file }` | File add/remove/rename |

## CLI

Edit a shader file in the browser with live reload:

```bash
npx wgsl-edit path/to/shader.wesl
npx wgsl-edit shader.wgsl --port 3000 --no-open
```

## Bundle Size

~136 KB brotli for the full bundle with all dependencies.

| Component | Brotli |
|-----------|--------|
| CodeMirror | ~104 KB |
| lezer-wesl (grammar + lezer runtime) | ~26 KB |
| wesl linker (powers live linting) | ~14 KB |

## Links

- [npm](https://www.npmjs.com/package/wgsl-edit)
- [GitHub](https://github.com/wgsl-tooling-wg/wesl-js/tree/main/packages/wgsl-edit)
