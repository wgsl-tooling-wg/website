# Internals

Resources for those interested in the internal design of WESL.

## Grammars

- [lezer-wesl](https://github.com/wgsl-tooling-wg/wesl-js/tree/main/packages/lezer-wesl) —
  Lezer grammar for WESL/WGSL, used by CodeMirror editors (including [wgsl-edit](wgsl-edit)).
- [tree-sitter-wesl](https://github.com/wgsl-tooling-wg/tree-sitter-wesl) —
  Tree-sitter grammar for WESL/WGSL, used by Neovim, Emacs, Zed, and other editors.

## Forthcoming Tools

- [wgsl-analyzer](https://github.com/wgsl-analyzer/wgsl-analyzer) —
  Language server for WESL providing go-to-definition, hover docs, and diagnostics across the module graph.
  Multi-editor support (VS Code, Emacs, Neovim).
- [wesldoc](https://github.com/jannik4/wesldoc) —
  Documentation generator for web documentation from shader code.

## Reference

- [Glossary](/spec/GLOSSARY.html) — Key terms and definitions

## Design Documents

- [Conditional Translation Design](/spec/ConditionalTranslationDesign.html) —
  Design rationale for structured `@if` vs unstructured `#ifdef`
- [Visibility](/spec/Visibility.html) — Module visibility rules
- [Name Mangling](/spec/NameMangling.html) — How declarations are renamed in output WGSL
- [Versioning](/spec/Versioning.html) — Edition versioning strategy
- [Packaging](/spec/Packaging.html) — Package format design

## Historical Discussions

- [Import syntax discussion](https://hackmd.io/ljkByEcnQa2NdNLWed2M6Q)
- [Community use of WGSL string interpolation](https://hackmd.io/mz1upr_YSu62nLftLoJBow)
- [Plugin design ideas](https://hackmd.io/gXCVcz_NRVm8uOJzvrKCjg)
- [Old generics discussion](https://docs.google.com/document/d/1ITV3MfQly0xszrKv_fURpcz-NdhONYl_-EHxyPL6w-I)
- [Packaging design](https://docs.google.com/document/d/15keY7Ktj4zoAiFlEGosxVnCqkR48zVnEPRcVe9NFDZY)
