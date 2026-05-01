## Quick Start

Here's a typical setup for a front end application using [wesl] and [wesl-plugin]/**vite**.

#### Install

```sh
npm install --save-dev wesl-plugin    # for bundler integration
npm install wesl                      # for runtime linking (unneeded for ?static)
```

#### Configure Vite

```ts
/// vite.config.ts
import viteWesl from "wesl-plugin/vite";

export default {
  plugins: [viteWesl()],
};
```

#### Link at Build Time

A simple approach is to link WESL into WGSL at build time:

```ts
/// <reference types="wesl-plugin/suffixes" />
import wgsl from "../shaders/app.wesl?static";

const shaderModule = device.createShaderModule({ code: wgsl });
```

#### Or Link at Runtime

Runtime linking enables shaders that are dynamic at runtime:
conditional compilation, virtual modules, const injection, [wgsl-edit](wgsl-edit):

```ts
/// <reference types="wesl-plugin/suffixes" />
import { link, createWeslDevice } from "wesl";
import appWesl from "../shaders/app.wesl?link";

async function example() {
  const device = createWeslDevice(await navigator.gpu.requestAdapter());
  const linked = await link(appWesl);
  const shaderModule = linked.createShaderModule(device, {});
}
```

### Other Build Environments

WESL is easy to integrate into a diverse variety of JavaScript/TypeScript
build environments.
See [JavaScript Builds](JavaScript-Builds).

## Default Project Organization

By default, WESL looks for `.wesl` and `.wgsl` files in a `./shaders` directory.

Optionally, create a `wesl.toml` file alongside `package.json`
to customize shader paths, dependencies, and other settings.
See the [wesl.toml reference](WeslToml) for details.

## Next Steps

See [Runtime Linking](JavaScript-Runtime-Linking)
for more options to control linking at runtime.

See [JavaScript Builds](JavaScript-Builds) for more ways to integrate WESL
into your JavaScript or TypeScript project.

See [WESL Features](WESL-Extensions) for shader language enhancements in WESL.

See [WESL-js Examples] for example projects.


[wesl]: https://www.npmjs.com/package/wesl
[wesl-plugin]: https://www.npmjs.com/package/wesl-plugin
[wesl-js examples]: https://github.com/wgsl-tooling-wg/wesl-js/tree/main/examples