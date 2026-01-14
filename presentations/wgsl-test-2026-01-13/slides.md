---
theme: default
title: wgsl-test
info: Unit and image snapshot testing for WebGPU shaders
highlighter: shiki
shikiOptions:
  theme: github-light
drawings:
  persist: false
transition: none
---

# wgsl-test

Unit and image snapshot testing for WebGPU shaders

<div class="mt-8">

[wgsl-test](https://www.npmjs.com/package/wgsl-test) on npm

</div>

<!--
notes
-->

---

# Foundations

<div class="grid grid-cols-2 gap-8 mt-8">
<div class="box">

### [webgpu](https://www.npmjs.com/package/webgpu)

WebGPU (Dawn) in Node.js

</div>
<div class="box">

### [wesl](https://www.npmjs.com/package/wesl)

Shader linking, virtual modules, reflection

</div>

<div class="box">

### [wgpu](https://www.npmjs.com/package/wesl)

WebGPU (wgpu) in Deno

</div>


</div>

---

# Principles

<div class="mt-8 space-y-6">

### Unit tests _and_ image snapshot tests

### Write tests in WGSL/WESL

Ergonomic to call shader functions as they're meant to be used

### expect() validation in WGSL/WESL _or_ TypeScript

Simple validation - use shader code. Complex validation - use host code.

### Headless, fast, runs in CI

### Image snapshot tests are useful as demos too.. 

</div>

---

# WESL Unit Tests
Test in WGSL/WESL, validate in WGSL/WESL

```wgsl
/// mytests.wesl
import lygia::color::luminance::luminance; // source fn under test
import wgsl_test::expectNear; // wgsl-test expect()

@test // tag each test fn
fn luminanceOrange() {
  let color = vec3f(1.0, 0.5, 0.0);
  let value = luminance(color);
  expectNear(value, 0.5702);
}
```

Call test runner from TypeScript:

```ts
import { expectWesl, getGPUDevice } from "wgsl-test";

const device = getGpuDevice();

test("luminance", async () => {
  await expectWesl({ device, moduleName: "mytests" });
});


```
---

# TypeScript Unit Tests

Test in WGSL/WESL, validate in TypeScript.

```ts
import { testCompute, getGPUDevice } from "wgsl-test";

const device = await getGPUDevice();

test("random - distribution", async () => {
  const src = `
    import lygia::generative::random::random; // source fn under test

    @compute @workgroup_size(1)
    fn main() {
      for (var i = 0u; i < 1024; i++) {
        test::results[i] = random(f32(i));
      }
    }
  `;

  const samples = await testCompute({ src, device, size: 1024 })

  // can write your own custom validation in TypeScript
  expectDistribution(samples, [0.0, 1.0]);
});
```

---

# Image Regression Testing
Validate image with vitest-image-snapshot (pixel-match)

```ts
import { expectFragmentImage } from "wgsl-test";

test("2D SDF shapes - 14 shape grid", async () => {
  await expectFragmentImage(device, "draw-shapes.wesl");
});
```

---

# Demo

<div class="mt-8 space-y-4">

- TypeScript assertions
- Native WGSL assertions
- Image assertions
- Image failure report

<br>

Bonus Demo: `wgsl-studio` vscode plugin
- based on `<wgsl-play>` (WGSL/WESL example viewer)

</div>

---
layout: center
---
# Architecture

---

![Architecture](/architecture.png)

---
layout: center
---

# WGSL/WESL Wishlist

---

# Annotations for Reflection

```wgsl
@test
fn foo() {}
```

`wesl-js` has prototype support:
- Annotations available for reflection
- Filtered out during transpilation

---

# Allow Strings in Annotations

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

**Today:**
```wgsl
@test(divide_quaternion_by_scalar)
fn foo() {}
```

</div>
<div>

**Tomorrow, perhaps:**
```wgsl
@test("divide quaternion by scalar")
fn foo() {}
```

</div>
</div>

<div class="mt-4 text-sm">

- Strings are useful for reflection-based libraries like wgsl-test
- And for future libraries like debug logging

Should WGSL allow pass-thru annotations?
Or wait until WebGPU supports reflection?

</div>

---

# Function Overloading or Generics

```wgsl
expectNear()
expectNearVec2()
expectNearVec3()
expectNearVec4()
...
```

User and library code is duplicative without a language solution.

---

# Source Maps

<br>
It'd be nice to clean up user errors in the debugger.

---

# wgpu in Node
<br>

Deno + vitest means headless wgpu testing is possible now...

(but Deno is not popular for web dev)

---

# WebKit WebGPU in CLI
<br>

Can we hope to someday test on WebKit too?

---

# Status
<br>

### Lygia Port to WebGPU uses wgsl-test
**600+ tests** in Lygia using the new library.

<div class="mt-8">

### Library test mode 

`TEST_BUNDLES=true` to test built bundles before publishing

</div>

---

# Future Work
<br>

What history/advice on testing from other shader communities?

Suggestions welcome!
