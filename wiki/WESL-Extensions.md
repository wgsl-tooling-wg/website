WESL adds features to WGSL:

* **Imports** allow splitting code in multiple files.
* **Packages** are collections of general-purpose shader modules
published to [npm][6] (JavaScript) and [crates.io][7] (Rust).
* **Conditional Translation** is a mechanism to conditionally
include/exclude chunks of code. Similar to `#ifdef` (C/C++) or `#[cfg]` (Rust).
* **Const Injection** _(experimental)_
* **Virtual Modules** _(experimental)_

## Module System

In WESL, shader code is divided into modules.
Modules have addressable names called module paths.
Module paths form a tree hierarchy.

### The Module Hierarchy Starts From the File Hierarchy

File and directory names in applications map automatically into the
module path hierarchy.
Typically, each module comes from a `.wesl` or `.wgsl` file.
The module's path comes from the filesystem path, with `::` as a separator.

<img src="https://docs.google.com/drawings/d/e/2PACX-1vS8xUgibuBKE_enFKUbZ8TmV7OoZGx_dUKDZD8-nCJru0sFV0VvMj7OMemqPHdo7IsCJiE5ICJQOPGI/pub?w=750&amp;">

Applications storing shader code in strings can label
module strings with a module path.

### Packages are Also in the Module Hierarchy

npm packages and cargo crates containing shaders also map into the module path hierarchy.
The module path for a package starts with the package name, followed by `::`.

The application's own shader modules are addressable with the reserved prefix
`package::`.

### Import Statements

```js
import sdf::primitives::box;      // fn `box` in module `primitives` in lib package `sdf`
import package::binds::mySampler; // var `mySampler` from file `./shaders/binds.wesl` 
import super::util;               // sibling module `./util.wesl`
import package::animals::{        // ok to nest imports with `{ }`
    bird,
    mammals::{ dog, cat }
};
```

* Import statements bring WGSL declarations and other modules into scope,
  so that subsequent statements may reference elements from other modules
  conveniently.
* Import statements have no side effects on their own.
* Import statements may be placed in any WESL file, and must be at the top of the file.
* All top-level declarations in a file may be imported:
  functions, structs, variables, consts and aliases.
  Modules may also be imported, as with `super::util` in the example above.

#### Special Import Targets

* `super` - move up one level in the module hierarchy.
* `package` - start at the root level of the application module hierarchy
* `constants` - shader const declarations injected from host Rust or JavaScript

### Qualified Names

WESL also allows module paths to elements in the shader code
wherever identifiers are usable.
If `foo()` is grammatical, then so is `super::util::foo()`.

Qualified names inline in the shader don't require a corresponding `import` statement.

```rs
import package::math;

fn main() {
    package::foo::bar::my_fn();   // import statement not required.
    let x = math::constants::PI;  // extend from imported module `math` 
}
```

### The Application Root Module

Linking begins from an application root module.
The assembled shader includes only modules
transitively referenced by the root module.
(The application developer is responsible for
specifying the root module when linking.)

Element names in the application root module are guaranteed not to be mangled during linking.
Developers should place shader elements that are visible from host code
into the root module. Host code visible shader elements are:
entry points (`@compute`, `@fragment`, etc.), `override`, and `@binding` `var`.
(Future versions of WESL will relax this restriction.)

### Further Import Details

Global `const_assert` statements in a module are included only if an
element from that module is transitively referenced from the root module.

Global `enable` statements in a module are included only if an
element from that module is transitively referenced from the root module.
A corresponding `enable` statement must be present in the root module.

Function `const_assert` statements are included only if
that function is transitively referenced from the root module.

See the [Imports spec](https://wesl-lang.dev/spec/Imports) for further details.

## `@if` attribute

The `@if(condition)` attribute makes the following element
optionally included in the final shader, depending on the `condition`.
The `condition` is determined by feature flags which are set when you invoke the linker ([wesl-js][1] or [wesl-rs][2]).

```rs
@if(debug_mode && !raytracing_disabled) // attributes on top-level declarations 
var<private> debug_count_iterations: i32 = 0;

@if(is_2d)
alias point = vec2f;
@if(!is_2d)
alias point = vec3f;

struct Line {
    start_point: point, end_point: point,
    @if(colored) color: vec4f, // attributes on struct members
}

fn fibonacci(n: u32) {
    @if(use_lookup_table) { // attributes on blocks `{ }`
        const lut = array(0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144);
        return lut[n];
    }
    // ...
}
```

The condition is a boolean expression containing:
feature names, `&&` (and), `||` (or), `!` (not), `true` and `false`.

You can place attributes on declarations (`fn`, `struct`, `var`, `const`, etc.),
statements, struct members, and function parameters.

### Further Conditional Details

See the [Conditional Translation spec](https://wesl-lang.dev/spec/ConditionalTranslation) for further details.

## Const Injection

The linkers allow host code (Rust or TypeScript/JavaScript)
to define shader constants.
The constant values will typically be available in the module hierarchy with
the `constants::` prefix.

See:

* in Rust, [set_custom_resolver][11]
* in JavaScript/TypeScript, [Runtime Constants][8]

## Virtual Modules

The linkers allow host code (Rust or TypeScript/JavaScript)
to provide a function that generates WESL shader code.
The generated code will be available in the module hierarchy with
a custom prefix provided by the caller.
e.g. `MyGenerated::`.

* in JavaScript/TypeScript, [Virtual Modules][9]
* in Rust, [VirtualResolver][10]

[1]: https://github.com/wgsl-tooling-wg/wesl-js
[2]: https://github.com/wgsl-tooling-wg/wesl-rs
[6]: https://www.npmjs.com/
[7]: https://crates.io/
[8]: https://wesl-lang.dev/docs/JavaScript-Runtime-Linking.html#runtime-constants
[9]: https://wesl-lang.dev/docs/JavaScript-Runtime-Linking.html#virtual-modules
[10]: https://docs.rs/wesl/0.1.2/wesl/struct.VirtualResolver.html
[11]: https://docs.rs/wesl/latest/wesl/struct.Wesl.html#method.set_custom_resolver