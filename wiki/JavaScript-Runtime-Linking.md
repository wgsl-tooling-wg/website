Runtime linking enables custom shaders
adapted to the user's application environment:

- Tune shaders based on runtime checks of GPU capabilities
- Customize shaders according to web application settings
- Augment shaders with frameworks that dynamically generate shader fragments,
- Extend the linker itself with [wesl-js extensions](wesl-js-extensions)

The `link()` API offers options for runtime control of WESL shader transpilation.

### requestWeslDevice for Source Mapped Errors

The [wesl] library includes `requestWeslDevice()` which can be optionally used
in place of WebGPU's `GPUAdapter.requestDevice()`
for improved error reporting.

Each WebGPU implementation analyzes WGSL
to find user errors or safety violations.
WESL is transpiled into WGSL,
and so it's handy to see any WGSL errors in terms of the original WESL.
`requestWeslDevice()` returns a [WeslDevice],
an extended WebGPU `GPUDevice`.
A [WESLDevice] captures compilation errors from WebGPU and
attaches the WESL source.

A [WeslDevice] is a `GPUDevice` and can be used everywhere a `GPUDevice` is used.

### Conditions

To set a condition for use in `@if` [conditional translation],
pass a `conditions` option to `link()` with boolean values for the conditions.
Unset conditions are presumed falsy.

```ts
    /// main.ts
    import appWesl from "../shaders/app.wesl?link";

    link({...appWesl, conditions: { MOBILE: true }});
```

```ts
    /// app.wesl
    @if(MOBILE) var size = 8;
```

### Runtime Constants

To inject constants from JavaScript/TypeScript for WESL shader compilation,
pass a `constants` option to `link()` with string or numeric values for the constants.
WESL shaders can use the constants by importing from the `constants` virtual module.

```ts
    /// main.ts
    link({..., constants: { NumLights: 7 }});
```

```ts
    /// app.wesl
    var<private> lights: array<vec3f, constants::NumLights>;
```

#### Virtual Modules

To use a function that generates WESL/WGSL shader code from JavaScript at runtime,
use the `virtualLibs` option.
Pass a record with the name of the virtual module as a key,
and the generating function as a value.

```ts
    /// main.ts
    link({..., virtualLibs: { MyCustom: () => "fn custom() {}" }});
```

```ts
    /// app.wesl
    import MyCustom::custom;

    fn example() {
      custom();
    }
```

### Custom Extensions

To plug in a custom extension that extends the linker itself with a WeslJsPlugin,
use the `config` option.

```ts
    /// main.ts
    link({..., config: { plugins: bindingStructsPlugin() }});
```

## Further Details

See [LinkParams](https://js.wesl-lang.dev/interfaces/LinkParams) for further details
on runtime linking options.

[conditional translation]: https://wesl-lang.dev/docs/Reference.html#conditional-translation
[wesl]: https://www.npmjs.com/package/wesl
[WeslDevice]: https://js.wesl-lang.dev/interfaces/WeslDevice