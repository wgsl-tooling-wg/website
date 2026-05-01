# wgsl-analyzer

_...coming soon_

<br>

Language server for WGSL/WESL, based on [rust-analyzer](https://rust-analyzer.github.io/).

- **Multi-editor** — VS Code, Emacs, Neovim, and other LSP-compatible editors
- **Incremental and error-resilient** — continues analysis even with syntax errors
- **Cross-module** — go-to-definition, hover docs, and diagnostics across the module graph

## Features

### Syntax Highlighting

Semantic syntax highlighting for WGSL and WESL files.

<img src="/presentations/symposium-2026-02-13/syntax_highlighted.png" alt="Syntax highlighting demo" style="max-width: 420px">

### Autocomplete

Semantic-aware code suggestions that work across modules and libraries.

<img src="/presentations/symposium-2026-02-13/tab-complete.png" alt="Autocomplete demo" style="max-width: 520px">

### Error Reporting

Resilient parser reports multiple errors simultaneously.
Type-checking continues on valid code even when other parts of the file contain errors.

<img src="/presentations/symposium-2026-02-13/lang-server-errors.png" alt="Error reporting demo" style="max-width: 520px">

### Formatting

Standard code formatter for consistent code layout across teams.

<img src="/presentations/symposium-2026-02-13/formatted.png" alt="Code formatting demo" style="max-width: 420px">

## Links

- [GitHub](https://github.com/wgsl-analyzer/wgsl-analyzer)
