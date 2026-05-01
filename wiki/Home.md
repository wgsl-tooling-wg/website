# WESL - Enhanced WebGPU Shaders

_Lightweight extensions to the WebGPU shading language._

---

Use standard extensions to enable WebGPU community tools for shader libraries, shader testing, web page examples, and more. WESL adds:

- **imports** — split shaders into modular, reusable files
- **conditional compilation** — configure shader variants at build time or runtime
- **packages** — share shader libraries on npm and cargo

WESL integrates into existing toolchains (Vite, Webpack, build.rs) with a couple lines of config.

## Live Example

<!-- include homeDemo.html -->

## Why WESL?

- **Easy to adopt** — WESL is a strict superset of WGSL.
  WESL extensions are proposed WebGPU features that you can use today.
  Existing `.wgsl` files work as-is.

- **Tool supported** — WebGPU community tools integrate into standard dev tools like Vite and VS Code, with WESL support today. Community tools don't support app-specific custom string preprocessors.
- **Libraries** — Use shader libraries like [lygia](https://www.npmjs.com/package/lygia), or publish your own. Libraries can be cross published across JavaScript/TypeScript npm and Rust cargo.

## Tooling Ecosystem

WebGPU community tools rely on standard WESL extensions:

| Tool | Description |
|------|-------------|
| [wgsl-test](wgsl-test) | GPU shader testing with `@test`, CLI runner, vitest integration |
| [wgsl-studio](wgsl-studio) | VS Code extension with test runner and shader preview |
| [wgsl-play](wgsl-play) | Web component for live shader rendering |
| [wgsl-edit](wgsl-edit) | Web component shader editor with syntax highlighting and linting |
| [wgsl-analyzer](https://github.com/wgsl-analyzer/wgsl-analyzer) | Language server for IDE support _(forthcoming)_ |

WESL linkers are available in both **Rust** ([wesl crate](https://crates.io/crates/wesl))
and **JavaScript** ([wesl package](https://www.npmjs.com/package/wesl)),
with [bundler plugins](https://www.npmjs.com/package/wesl-plugin)
for Vite, Webpack, Rollup, and more.

Linking is fast and WESL linkers are small (< 20kb), easy to embed 
in editor applications and other tools.

## Get Started

- [Getting Started with Rust](Getting-Started-Rust)
- [Getting Started with JavaScript/TypeScript](Getting-Started-JavaScript)
- [C bindings](https://github.com/wgsl-tooling-wg/wesl-rs/tree/main/crates/wesl-c) are available in the Rust implementation

For other languages or unusual build setups, come talk to us.

_Using a coding agent? Refer your agent to [llms.txt](/llms.txt) for a concise description of using WESL._

## Get Involved

We discuss on [Discord](https://discord.gg/5UhkaSu4dt) and on [GitHub](https://github.com/wgsl-tooling-wg) issues.
Tell us about something that doesn't work smoothly for you in WGSL/WESL?
Maybe we can fix it with tools or language extensions.