### Learning WESL

WESL is very similar to [WGSL], the WebGPU shading language.
See [Writing Shaders](Writing-Shaders)
for resources to learn about WGSL and the WESL additions.

### Using WESL Tools and Libraries

WESL is transpiled by tools or libraries into WGSL for use in WebGPU.
We have distinct implementations of WESL
designed for **Rust** and **JavaScript/TypeScript** applications.
For documentation describing typical build environments, see:
- [Getting Started (Rust)](Getting-Started-Rust)
- [Getting Started (JavaScript)](Getting-Started-JavaScript)

If you are not a JavaScript/TypeScript or Rust developer,
or if your build environment is unusual,
come and talk to us on [Discord](https://discord.gg/5UhkaSu4dt)
or open an issue on
[wesl-spec](https://github.com/wgsl-tooling-wg/wesl-spec/issues/new).
The WESL tools are flexible and embeddable.
We'll be happy to help you set up WESL in your workflow.

[WGSL]: https://www.w3.org/TR/WGSL