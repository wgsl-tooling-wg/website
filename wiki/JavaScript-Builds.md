
JavaScript / TypeScript applications use
a tool or library to transpile WESL for use in WebGPU.
To support the wide variety of JavaScript build environments,
there are many WESL integration options.

## WESL with JavaScript Bundlers

Most front end projects use a JavaScript bundler.
[WESL plugins][wesl-plugin] are available for many bundlers, including
**vite**, **webpack**, **rollup**, **esbuild**, and **rspack**.

#### Install

```sh
npm add --save-dev wesl-plugin
```

#### Configure your bundler

The WESL plugin supports both `?link` (runtime linking) and `?static` (build-time linking) import suffixes out of the box.

- **`?link`** — assembles shader files and libraries for runtime linking. Returns a [LinkParams] object ready to pass to `link()`.

- **`?static`** — links shader files at build time. Returns a WGSL string ready for `createShaderModule`.

Configuration varies by bundler of course. Here's a vite example:

```ts
  /// vite.config.ts
  import viteWesl from "wesl-plugin/vite";

  export default {
    plugins: [viteWesl()],
  };
```

The plugin optionally accepts `{ weslToml: "./path/to/wesl.toml" }` to specify an alternate configuration file.

### Controlling Dynamic Linking

The `link()` API enables runtime control of WESL shader transpilation.
See [Runtime Linking Options](Getting-Started-JavaScript#runtime-linking-options).

### Controlling Static Bundler Builds

To link statically at build time when using a JavaScript bundler,
import with the `?static` suffix in JavaScript or TypeScript:

```ts
import wgsl from "./shaders/app.wesl?static";
```

To set conditions during static linking, pass them as query parameters:

```ts
import wgsl from "./shaders/app.wesl?MOBILE=true&FUN&static";
```

### Adjusting existing vite configurations

If you started developing a project before switching to WESL, chances are that you imported your WGSL files as static assets, using the `assetsInclude` option:
```
/// vite.config.ts
assetsInclude: ['**/*.wgsl'],

/// Importing a file
import shader_url from './example.wgsl'
```

However, if this option is configured, bundler plugins (?static as well as ?link) will not work. The option must be removed first. Importing a file also works differently, as described above. E.g. for the `?static` option, the shader source will be returned instead of a static URL.

## No Bundler Dynamic Linking

See the
[unbundled example](
  https://github.com/wgsl-tooling-wg/wesl-js/blob/master/examples/wesl-unbundled)
which uses the **[wesl]** library API directly.

## No Bundler Static Linking

Use the [wesl-link] command line tool to link WGSL/WESL shaders together.
The linked WGSL is written to stdout.

- **--src**  WGSL/WESL shader files to bundle into the package, using glob syntax.
(_default: `./shaders/*.w[eg]sl`_)

- **--rootModule**  start linking from this module.
The linked result includes all WGSL/WESL elements
indirectly referenced from the root module.
(_default: `main`_)

- **--conditions**  enable these space-separated conditional compilation flags.
(_default: `<none>`_)

- **--baseDir**  root directory containing WGSL/WESL files.
  The source files are mapped to imports starting at the base directory.
  (_default: `./shaders`_)

- **--projectDir** directory containing package.json (_default: current directory_).

## Using WESL Without a Package Manager


###### CDN

- **jsdelivr** <https://cdn.jsdelivr.net/npm/wesl/+esm>
- **unpkg** <https://unpkg.com/wesl>
- **esm.sh** <https://esm.sh/wesl>

###### Deno

```sh
deno install npm:wesl
```

[wesl]: https://www.npmjs.com/package/wesl
[wesl-plugin]: https://www.npmjs.com/package/wesl-plugin
[LinkParams]: https://js.wesl-lang.dev/interfaces/LinkParams
[wesl-link]: https://www.npmjs.com/package/wesl-link