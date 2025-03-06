This is the source for the public WESL site.

## Getting started

You will need an LTS version of [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io/installation).

1. Clone this repository and install dependencies:

    ```sh
    git clone https://github.com/wgsl-tooling-wg/website.git
    ```

    ```sh
    cd website
    pnpm install
    ```

1. Setup submodules

    This repository currently includes the
    [WESL wiki](https://github.com/wgsl-tooling-wg/wesl-spec/wiki) and
    [WESL Spec](https://github.com/wgsl-tooling-wg/wesl-spec) content via submodules.

    Initialize the submodules.

    ```sh
    git submodule init
    ```

    Setup future git commands (like git pull) to automatically work on submodules too.

    ```sh
    git config submodule.recurse true
    ```

    Install submodule content too

    ```sh
    git pull
    ```

1. run locally

    To run the project as a local web server:

    ```console
    pnpm run start
    ```

    To build the site as static files
    (creates a `build` folder with the files to be deployed):

    ```console
    pnpm run build
    ```

## License

Except where noted (below and/or in individual files), all code in this repository is dual-licensed under either:

- MIT License ([LICENSE-MIT](LICENSE-MIT) or [http://opensource.org/licenses/MIT](http://opensource.org/licenses/MIT))
- Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0))

at your option.

### Your contributions

Unless you explicitly state otherwise,
any contribution intentionally submitted for inclusion in the work by you,
as defined in the Apache-2.0 license,
shall be dual licensed as above,
without any additional terms or conditions.
