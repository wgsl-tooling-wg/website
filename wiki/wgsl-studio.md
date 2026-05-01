# wgsl-studio

VS Code extension for WESL/WGSL development with integrated test runner and live shader preview.

## Installation

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=webgpu-tools.wgsl-studio):

```
ext install webgpu-tools.wgsl-studio
```

## Quick Start

Create a fragment shader tagged with `@toy`:

```wgsl
@toy
fn main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let uv = pos.xy / uniforms.size;
  return vec4f(uv, 0.5, 1.0);
}
```

Then run command **"WGSL Studio: Preview Toy Shader"** (or right-click the file).

<img src="/presentations/symposium-2026-02-13/wgsl_studio_preview.png" alt="wgsl-studio shader preview" style="max-width: 560px">

## Built-in Uniforms

The preview provides these uniforms automatically:

| Uniform | Description |
|---------|-------------|
| `uniforms.time` | Elapsed time in seconds |
| `uniforms.size` | Viewport size in pixels |
| `uniforms.mouse` | Mouse position in pixels |

See [wgsl-play](wgsl-play) for full uniform documentation.

## GPU Test Runner

WGSL Studio includes a native test runner for GPU shader tests.
Tag functions with `@test` and use `expect` from `wgsl_test`:

```wgsl
import wgsl_test::expect;

@test fn myTest() { expect(1 == 1); }
```

Tests are discovered automatically and appear in the VS Code **Test Explorer**.
Run them from there, or use the command palette.

<img src="/presentations/symposium-2026-02-13/wgsl_studio_unit_test.png" alt="wgsl-studio test explorer" style="max-width: 560px">

The native test runner can be disabled in settings
(`wgslStudio.nativeTestRunner.enabled`) if you prefer using Vitest instead.

See [wgsl-test](wgsl-test) for more on writing GPU tests.

## Links

- [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=webgpu-tools.wgsl-studio)
- [GitHub](https://github.com/wgsl-tooling-wg/wesl-js/tree/main/packages/wgsl-studio)
