# wgsl-play

Web component for rendering WESL/WGSL fragment shaders, or running compute
shaders and rendering their `@buffer` results as tables.

<div class="demo-container">
<wgsl-edit id="play-demo-editor" theme="auto" lint="off">
  <script type="text/wesl">
import env::u;

@fragment fn main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let uv = pos.xy / u.resolution;
  return vec4f(uv, sin(u.time) * 0.5 + 0.5, 1.0);
}
  </script>
</wgsl-edit>
<wgsl-play id="play-demo-player" from="play-demo-editor"></wgsl-play>
</div>

## Installation

```bash
npm install wgsl-play
```

## Usage

```html
<script type="module">import "wgsl-play";</script>

<wgsl-play src="./shader.wesl"></wgsl-play>
```

The component auto-fetches dependencies and starts animating.

### Shader API

`wgsl-play` runs in one of two modes, picked automatically from the entry
points in your shader:

- **fragment mode** -- exactly one `@fragment` function (and no `@compute`).
  Renders a fullscreen triangle using a built-in vertex shader; you write the
  fragment shader.
- **compute mode** -- exactly one `@compute` function (and no `@fragment`).
  See [Compute Mode](#compute-mode) below.

Mixed `@compute` + `@fragment`, or more than one `@compute`, are rejected.
WESL extensions are supported in both modes (imports, conditional compilation).

Standard uniforms are available via `env::u`:

```wgsl
import env::u;

@fragment fn main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let uv = pos.xy / u.resolution;
  return vec4f(uv, sin(u.time) * 0.5 + 0.5, 1.0);
}
```

When no `@uniforms` struct is declared, a default is provided with `resolution`
and `time`.

### Custom Uniforms

Declare a struct with `@uniforms` to add your own fields with UI controls:

```wgsl
import env::u;

@uniforms struct Params {
  @auto resolution: vec2f,
  @auto time: f32,
  @range(1.0, 20.0, 5.0, 6.0) frequency: f32,
  @color(0.2, 0.5, 1.0) tint: vec3f,
  @toggle(0) invert: u32,
}

@fragment fn main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let wave = sin(pos.x * u.frequency + u.time);
  var color = wave * u.tint;
  if u.invert == 1u { color = 1.0 - color; }
  return vec4f(color, 1.0);
}
```

### `@auto` -- Runtime Fields

The player fills these automatically each frame. The field name determines which
value is bound (or use `@auto(name)` when the field name differs):

| Name | Type | Description |
|------|------|-------------|
| `resolution` | `vec2f` | Canvas size in pixels |
| `time` | `f32` | Elapsed time in seconds |
| `delta_time` | `f32` | Delta time since last frame |
| `frame` | `u32` | Frame count |
| `mouse_pos` | `vec2f` | Pointer position in pixels |
| `mouse_delta` | `vec2f` | Pointer movement since last frame |
| `mouse_button` | `i32` | Active button: 0=none, 1=left, 2=middle, 3=right |

### UI Annotations

These generate interactive controls in the player.

#### `@range(min, max [, step [, initial]])`

Slider for `f32` or `i32`. Step defaults to `0.01` for `f32`, `1` for `i32`.
Initial defaults to `min`.

```wgsl
@range(1.0, 20.0)              frequency: f32,
@range(1.0, 20.0, 5.0)         frequency: f32,  // step=5
@range(1.0, 20.0, 0.5, 5.0)    frequency: f32,  // step=0.5, initial=5
```

#### `@color(r, g, b)`

Color picker for `vec3f`:

```wgsl
@color(0.2, 0.5, 1.0) tint: vec3f,
```

#### `@toggle([initial])`

Boolean toggle for `u32` (0 or 1). WGSL forbids `bool` in uniform buffers.

```wgsl
@toggle     invert: u32,    // default=0
@toggle(1)  invert: u32,    // default=1
```

### Plain Fields

Fields without annotations are zero-initialized and settable from JavaScript via
`setUniform()`. This works before or after compilation.

```wgsl
@uniforms struct Params {
  @auto resolution: vec2f,
  brightness: f32,           // no annotation — set from JS
}
```

```javascript
const player = document.querySelector("wgsl-play");
player.setUniform("brightness", 0.8);
```

### Resource Annotations

Bind GPU resources by annotating shader globals. The component owns `@group(0)`
— `@binding(0)` is the uniform buffer, and annotated resources occupy
`@binding(1)` and onward in declaration order.

#### `@texture(name)` — host-provided image

Resolves to a child `<img>` or `<canvas>` of the `<wgsl-play>` element. Lookup
matches `[data-texture="name"]` first, then falls back to `#name`. The image is
decoded and uploaded as `rgba8unorm`.

```html
<wgsl-play>
  <script type="text/wesl">
    import env::u;
    @texture(nebula) var photo: texture_2d<f32>;
    @sampler(linear) var samp: sampler;

    @fragment fn fs_main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
      return textureSample(photo, samp, pos.xy / u.resolution);
    }
  </script>
  <img data-texture="nebula" src="/images/nebula.jpg" hidden>
</wgsl-play>
```

Only `texture_2d<f32>` is supported; cube, array, and storage textures are not
supported. Image decoding pins `imageOrientation: "from-image"`,
`premultiplyAlpha: "none"`, and `colorSpaceConversion: "none"` for deterministic
uploads across browsers.

Changing an `<img>` `src` (or swapping `data-texture` / adding new texture
children) rebuilds the pipeline automatically.

#### `@sampler(filter)`

Creates a sampler with `clamp-to-edge` addressing. Filter is `linear` or
`nearest`.

```wgsl
@sampler(nearest) var samp: sampler;
```

#### `@buffer`

Zero-initialized storage buffer; size inferred from the WGSL type. `read` and
`read_write` are both allowed at fragment visibility.

```wgsl
@buffer var<storage, read> palette: array<vec4f, 8>;
```

`@test_texture` (a wgsl-test fixture annotation) is rejected at runtime; use
`@texture(name)` with a host element instead.

### Inline Source

Include shader code inline with a `<script type="text/wesl">` tag:

```html
<wgsl-play>
  <script type="text/wesl">
    import env::u;

    @fragment fn main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
      let uv = pos.xy / u.resolution;
      return vec4f(uv, sin(u.time) * 0.5 + 0.5, 1.0);
    }
  </script>
</wgsl-play>
```

### Programmatic Control

```typescript
const player = document.querySelector("wgsl-play");
player.shader = shaderCode;
player.pause();
player.rewind();
player.play();
```

## Compute Mode

When your shader has exactly one `@compute` entry point (and no `@fragment`),
`wgsl-play` switches to compute mode. It dispatches the compute shader once on
build, reads back every `@buffer`, and renders one HTML table per buffer in
place of the canvas.

```html
<wgsl-play>
  <script type="text/wesl">
    @buffer var<storage, read_write> result: array<f32, 8>;

    @compute @workgroup_size(8)
    fn main(@builtin(global_invocation_id) id: vec3u) {
      result[id.x] = f32(id.x * id.x);
    }
  </script>
</wgsl-play>
```

### Dispatch

Dispatch is **always a single workgroup** (`dispatchWorkgroups(1, 1, 1)`). Use
`@workgroup_size` to control the number of threads. The shader re-dispatches:

- On every build (e.g. when the source changes).
- When an `@uniforms` slider value changes.
- When the user clicks the refresh button in the controls.

In compute mode, play/pause and rewind are hidden -- compute mode is not
animation-driven, and the time-related auto values (`time`, `frame`,
`delta_time`) stay zero.

### Results Tables

Each `@buffer` is rendered as a table:

- An `array<T, N>` produces N rows of `T`.
- A struct row gets one column per field.
- A non-array buffer produces a single row.

Tables are truncated to 256 rows by default with a "show all" link.

The following are **not supported** for the results table and are rejected at
runtime:

- Runtime-sized arrays (`array<T>` with no length).
- Matrix element types (e.g. `array<mat4x4f, N>`).
- Element types other than `f32` / `i32` / `u32` scalars, vectors of those, or
  structs of those.

### Restrictions

- `@texture` and `@sampler` are not yet supported in compute mode.
- All other annotations (`@buffer`, `@uniforms`, `@range`, `@color`, `@toggle`,
  `@auto`) work the same as in fragment mode.

## Multi-file Shaders

For apps with multiple shader files, use `shader-root`:

```
public/
  shaders/
    utils.wesl           # import package::utils
    effects/
      main.wesl          # import super::common
      common.wesl
```

```html
<wgsl-play src="/shaders/effects/main.wesl" shader-root="/shaders"></wgsl-play>
```

Local shader modules referenced via `package::` or `super::` will be fetched
from the web server.

## Using with wesl-plugin

For more control, use [wesl-plugin](https://www.npmjs.com/package/wesl-plugin)
to assemble shaders and libraries at build time.

```typescript
import shaderConfig from "./shader.wesl?link";

player.project = {
  ...shaderConfig,
  conditions: { MOBILE: isMobileGPU },
  constants: { num_lights: 4 }
};
```

## API Reference

### Attributes

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `src` | URL | - | URL to .wesl/.wgsl file |
| `shader-root` | string | `/shaders` | Root path for internal imports |
| `from` | element ID | - | Source provider element to connect to (e.g., wgsl-edit) |
| `autoplay` | boolean | `true` | Start animating on load |
| `no-controls` | boolean | - | Hide playback controls |
| `no-settings` | boolean | - | Hide the uniform controls panel |
| `fetch-libs` | boolean | `true` | Auto-fetch missing npm libraries |
| `fetch-sources` | boolean | `true` | Auto-fetch local .wesl source files via HTTP |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `shader` | `string` | Get/set shader source (single-file convenience) |
| `project` | `WeslProject` | Get/set full project config (weslSrc, libs, conditions, constants) |
| `conditions` | `Record<string, boolean>` | Get/set conditions for conditional compilation |
| `uniforms` | `Record<string, number \| number[]>` | Current uniform values (readonly) |
| `isPlaying` | `boolean` | Playback state (readonly) |
| `time` | `number` | Animation time in seconds (readonly) |
| `hasError` | `boolean` | Compilation error state (readonly) |
| `errorMessage` | `string \| null` | Error message (readonly) |

### Methods

| Method | Description |
|--------|-------------|
| `play()` | Start/resume animation |
| `pause()` | Pause animation |
| `rewind()` | Reset to t=0 |
| `setUniform(name, value)` | Set a uniform value programmatically |
| `showError(message)` | Display error (empty string clears) |

### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `compile-error` | `{ message, source: "wesl"\|"webgpu", kind: "shader"\|"resource", resourceSource?, locations }` | Compilation or resource resolution failed. `kind: "resource"` covers missing `@texture` host elements, unsupported texture dims, and `@test_texture` rejection |
| `compile-success` | - | Shader compiled successfully |
| `init-error` | `{ message: string }` | WebGPU initialization failed |
| `playback-change` | `{ isPlaying: boolean }` | Play/pause state changed |
| `uniforms-layout` | `AnnotatedLayout` | Fired after each compile with layout metadata |

## Styling

```css
wgsl-play {
  width: 512px;
  height: 512px;
}

wgsl-play::part(canvas) {
  image-rendering: pixelated;
}
```

## Links

- [npm](https://www.npmjs.com/package/wgsl-play)
- [GitHub](https://github.com/wgsl-tooling-wg/wesl-js/tree/main/packages/wgsl-play)
