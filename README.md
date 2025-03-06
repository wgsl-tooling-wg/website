This is the source for the public WESL site.

## Getting started

You will need an LTS version of [Node.js](https://nodejs.org).

- Clone this repository locally with `git clone --recurse-submodules <repo url>`. Alternatively, clone normally and then `git submodule update --init --recursive`.
- `npm install`

This repository currently includes the [WESL wiki](https://github.com/wgsl-tooling-wg/wesl-spec/wiki) content as a submodule. To update the submodule after pulling new commits:

```console
$ git submodule update --recursive --remote
```

To run the project as a local web server:

```console
$ npm run start
```

To build the site as static files:

```console
$ npm run build
```

This will create a `build` folder with the files to be deployed.

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
