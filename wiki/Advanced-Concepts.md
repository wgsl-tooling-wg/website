## Virtual modules and the `constants` module

*related discussion: [#74](https://github.com/wgsl-tooling-wg/wesl-spec/issues/74)*

In many cases shader authors want to write generic shaders that can be specialized for different purposes and constraints. Sometimes, the specialization needs to happen at runtime (e.g., if it depends on the hardware/platform where the shader is executed). WGSL has a mechanism for such specialization: [`override` declarations](https://www.w3.org/TR/WGSL/#override-decls). But overrides do not cover all use-cases ([#74](https://github.com/wgsl-tooling-wg/wesl-spec/issues/74)).

WESL has a mechanism called "Virtual Modules", which creates an importable module that does not exist on the filesystem but contains declarations defined during linker invocation. For convenience, the WESL linkers have a special API to generate a virtual module named `constants` and push const-declarations to it.

## Stripping (Dead Code Elimination)

*related discussion: [#68](https://github.com/wgsl-tooling-wg/wesl-spec/issues/68)*

When your WESL linker bundles your shader files into one final WGSL output, it may remove unused declarations.
Unused declarations are those not accessed by any entrypoint function or `const_assert`s (recursively).

In general, code stripping has no observable effect. But in rare cases,
it can indirectly cause bugs. Here are the things to keep in mind:
* WESL linkers generally don't validate eliminated code. If an invalid function suddenly becomes used, it will trigger an error in a place you didn't expect.
* If all imported items in a module are unused, then the module will not be loaded at all. The linker will not even check that the file exists.
* `const_assert`s declared in function bodies are removed if the function is unused.

## Mangling

*See also the [Name Mangling](https://github.com/wgsl-tooling-wg/wesl-spec/blob/main/NameMangling.md) discussion in the spec wiki*

Name mangling is a common [compiler practice](https://en.wikipedia.org/wiki/Name_mangling) of renaming declarations to avoid conflicts when two declarations have the same name.
Don't be surprised if you see functions and structs renamed in the WGSL output.

The rust implementation of WESL renames *all* declarations, except those in the root module (because they are exposed in the host code, as function entry-points, bindings and overrides).

The js implementation of WESL renames only declarations that conflict, and never renames
declarations in the root module.

Consider this WESL example:

```rs
// file util.wesl:
fn foo() { ... }

// file main.wesl:
fn foo() { ... }

@compute @workgroup_size(1)
fn main() {
    super::util::foo();
    foo();
}
```

With name mangling, rust WESL generates this:
```
fn package_util_foo() { ... } // the `foo` function from util.wesl gets renamed with its mangled absolute path (package::util::foo)

fn foo() { ... } // the `foo` function in the root module is not renamed

@compute @workgroup_size(1)
fn main() {
    package_util_foo(); // references to package::util::foo also get renamed.
    foo();
}
```

## Incremental Conditional Translation

Similarly, there are situations where you want to run the conditional compilation at runtime because the feature flags depend on the hardware/platform.
Linkers can help with that by running the translation in two phases:
* At compile-time, provide only the feature flags that you can. `@if` attributes that can't be resolved are left in the output code.
* At run-time, fully specialize the shader with the missing feature flags.

Currently only the rust implementation of WESL supports incremental conditional translation.

## Behavior of `const_assert`s and directives

Module-scope `const_assert`s and directives are only included in the output WGSL if they are declared in the root module or in any module for which one declaration is included. Identical directives across modules are de-duplicated.

There are additional rules ([#71](https://github.com/wgsl-tooling-wg/wesl-spec/issues/71)) for directives: 
* [`enable`](https://www.w3.org/TR/WGSL/#enable-extensions-sec) directives *must* be included in all modules that use a given extension. This way, the file is self-documenting.
* The root module must repeat all `enable` directives included in referenced modules. (Only the root module has to do that)
* [`requires`](https://www.w3.org/TR/WGSL/#language-extensions-sec) directives are optional in WGSL. Nonetheless we *recommend* library authors to spell `requires` directives in all modules using a language extension, and repeat them in the root module, exactly like the `enable` directives.