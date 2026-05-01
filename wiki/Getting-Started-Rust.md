[wesl-rs][2] can be operated in a few different ways:
* Using the standalone command-line tool to generate WGSL files.
* At build-time, using a [build Script][1].
* At run-time.

These are the quick setup instructions. Read the [crate documentation](https://docs.rs/wesl/) and visit the [code samples](https://github.com/wgsl-tooling-wg/wesl-rs/tree/main/examples) for a more in-depth explanation.

## Using `wesl-rs` at compile-time

* Add the crate to your build-dependencies: `cargo add --build wesl`
* Add the crate to your dependencies: `cargo add wesl`
* Create the file `build.rs` next to your `Cargo.toml`.
* Paste this content:
  ```rs
  fn main() {
      wesl::Wesl::new("src/shaders").build_artifact(&"package::main".parse().unwrap(), "my_shader");
  }
  ```
* Place your shader in `src/shaders/main.wesl`.
* Paste this code where you want to access your shader string in Rust code:
  ```rs
  use wesl::include_wesl;
  let shader_string = include_wesl!("my_shader");
  ```

## Using `wesl-rs` at run-time

* Add the crate to your dependencies: `cargo add wesl`
* Place your shader in `src/shaders/main.wesl`.
* Paste this code where you want to access your shader string in Rust code:
  ```rs
  let shader_string = Wesl::new("src/shaders")
      .compile(&"package::main".parse().unwrap())
      .inspect_err(|e| eprintln!("WESL error: {e}")) // pretty errors with `display()`
      .unwrap()
      .to_string();
  ```

## Using the standalone CLI

* Install the CLI: `cargo install wesl-cli`
* Compile a shader: `wesl compile <path/to/shader.wesl> > <path/to/generated-shader.wgsl>`
* Type `wesl --help` or visit the [crate documentation][3] for more configuration options.

## Next Steps

Visit the [Writing Shaders](Writing-Shaders) page to learn how to write your first WESL shaders.

Visit the [Reference](Reference) page for the complete documentation of WESL Extensions.


[1]: https://doc.rust-lang.org/cargo/reference/build-scripts.html
[2]: https://github.com/wgsl-tooling-wg/wesl-rs
[3]: https://docs.rs/crate/wesl-cli/latest