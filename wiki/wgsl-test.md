# wgsl-test

Test WGSL and WESL shaders with the CLI or vitest.

- **Native WESL** (`@test`) — Unit test shader functions, assertions run on the
  GPU
- **CLI** (`wgsl-test run`) — Run tests from the command line
- **TypeScript** — Optionally run tests from vitest or jest.

## Installation

```bash
npm install wgsl-test
```

## Native WESL Testing

Write tests directly in WESL with the `@test` attribute. Minimal boilerplate,
assertions run on the GPU:

```wgsl
/// interp_test.wesl
import package::interp::smootherstep;
import wgsl_test::expectNear;

@test
fn smootherstepQuarter() {
  expectNear(smootherstep(0.0, 1.0, 0.25), 0.103516);
}
```

See the
[assertion functions reference](https://github.com/wgsl-tooling-wg/wesl-js/blob/main/packages/wgsl-test/API.md#assertion-functions)
for `expect`, `expectNear`, `expectNearV2f`, and more.

## Annotated Resources

Declare GPU resources inline with `@buffer`, `@test_texture`, and `@sampler`.
wgsl-test assigns bindings and builds the bind group automatically:

```wgsl
import wgsl_test::expectNear;

@buffer var<storage, read_write> data: array<f32, 4>;

@test fn write_and_read() {
  data[0] = 42.0;
  expectNear(data[0], 42.0);
}
```

Fragment snapshots can combine textures and samplers the same way:

```wgsl
@test_texture(checkerboard, 256, 256, 16) var tex: texture_2d<f32>;
@sampler(nearest)                         var samp: sampler;

@fragment @extent(256, 256) @snapshot
fn test_checker(@builtin(position) pos: vec4f) -> @location(0) vec4f {
  let uv = pos.xy / 256.0;
  return textureSampleLevel(tex, samp, uv, 0.0);
}
```

Built-in texture sources: `checkerboard`, `gradient`, `radial_gradient`,
`color_bars`, `edge_pattern`, `noise`, `solid`, `lemur`. Sampler filter options:
`linear`, `nearest`.

## CLI

Run tests directly from the command line:

```bash
wgsl-test run                      # discover **/*.test.wesl, run all
wgsl-test run path/to/test.wesl    # run specific file(s)
wgsl-test run --projectDir ./foo   # specify project root
```

## Vitest Integration

Or run GPU shader tests from vitest with a minimal TypeScript wrapper:

```typescript
import { getGPUDevice, testWesl } from "wgsl-test";

const device = await getGPUDevice();

await testWesl({ device, moduleName: "interp_test" });
```

## Visual Regression Testing

Test complete rendered images in vitest:

```typescript
import { expectFragmentImage } from "wgsl-test";
import { imageMatcher } from "vitest-image-snapshot";

imageMatcher(); // setup once

test("blur shader matches snapshot", async () => {
  await expectFragmentImage(device, "effects/blur.wgsl");
  // snapshot compared against __image_snapshots__/effects-blur.png
});
```

Update snapshots with `vitest -u`.

See the
[visual regression testing reference](https://github.com/wgsl-tooling-wg/wesl-js/blob/main/packages/wgsl-test/API.md#visual-regression-testing)
for details.

## Testing Compute Shaders

If you want to validate results in TypeScript, use `testCompute()` for compute
shader tests. Declare each output as a `@buffer`; the contents come back keyed
by var name. Unwritten slots show as `-999.0` (sentinel pre-fill).

```typescript
import { testCompute, getGPUDevice } from "wgsl-test";

const device = await getGPUDevice();

const src = ` // test function can be an inline WESL string or a .wesl file
  import package::hash::lowbias32;

  @buffer var<storage, read_write> results: array<u32, 2>;

  @compute @workgroup_size(1)
  fn main() {
    results[0] = lowbias32(0u);
    results[1] = lowbias32(42u);
  }
`;

const { results } = await testCompute({ device, src });
// results = [0, 388445122]
```

Multiple `@buffer` declarations are returned together in the same record:

```typescript
const r = await testCompute({ device, src: `
  @buffer var<storage, read_write> sums:     array<u32, 2>;
  @buffer var<storage, read_write> products: array<u32, 2>;
  @compute @workgroup_size(1) fn main() { /* ... */ }
`});
// r.sums, r.products
```

## Links

- [API Reference](https://github.com/wgsl-tooling-wg/wesl-js/blob/main/packages/wgsl-test/API.md)
- [Examples](https://github.com/wgsl-tooling-wg/wesl-js/tree/main/examples)
- [npm](https://www.npmjs.com/package/wgsl-test)
- [GitHub](https://github.com/wgsl-tooling-wg/wesl-js/tree/main/packages/wgsl-test)
