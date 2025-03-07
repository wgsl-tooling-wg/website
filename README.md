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

# Site architecture

The site uses the [Origami](https://weborigami.org) programming language to: a) define the source content, b) transform the source content into a virtual tree of HTML files and other resources, and c) copy that virtual tree to static files in a local `build` folder. These static files are then deployed to the Cloudflare CDN.

## Source content

This site pulls markdown content from two main sources:

1. [WESL Spec](https://github.com/wgsl-tooling-wg/wesl-spec) repository. This is information primarily for WESL implementors and advanced users. Edits to the spec are gated via pull requests. This set of files isn't expected to change frequently, so the [src/spec.ori](./src/spec.ori) file explicitly selects the markdown files the site wants.
1. [WESL Spec wiki](https://github.com/wgsl-tooling-wg/wesl-spec/wiki) attached to the above repository. This is more general information aimed at users. The wiki can be edited directly by project members. This set of files is more freely editable, so the [src/wiki.ori](./src/wiki.ori) file explicitly excludes the markdown files the site doesn't want.

By registering both sources as git submodules (see above), the project ends up with local copies of those projects, including all of their markdown files.

Separately, the [src/assets](./src/assets) folder defines styles, images, fonts, and other static resources.

## Transforming source content

The main [src/site.ori](./src/site.ori) file defines the virtual tree of HTML files and other resources for the site:

- The `assets/` area copied from `src/assets`
- An index page
- A search page
- The `docs/` area, obtained by mapping the wiki markdown files to HTML
- The `spec/` area, obtained by mapping the spec markdown files to HTML
- A `pagefind/` area containing static search index files generated by the [Pagefind](https://pagefind.app) indexer.

Each page includes navigation links so that a user can jump to any part of the site. To support that, the `site.ori` generates the pages in a series of steps:

1. Generate a tree of HTML page bodies, which do not include navigation
1. Use that tree to generate the HTML for the navigation links
1. Generate a final tree of HTML pages using a base page template, incorporating the navigation links

The final pages are merged into the site, and are also indexed for searching.

## Client

Nearly all the work to generate the pages happens at build time. One small task accomplished through client-side JavaScript is copying the navigation links from a side navigation element into a separate dropdown navigation menu for use at mobile screen sizes, and managing the closing of that menu.

# Deploying the site

1. Get your own cloudflare account (your account will need to be authorized on the wesl cloudflare account).
1. Authorize wrangler (to get cmd line access to cloudflare)

   ```sh
   pnpm wrangler login --browser=false
   ```

1. Build and deploy to cloudflare:

   ```sh
   pnpm deploy:site
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
