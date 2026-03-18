> 🚧 **Work in progress** This plugin is still under active development. Expect changes.

# remark-inline-svg-flex

[![MIT License](https://img.shields.io/npm/l/rehype-svg-inline.svg?style=flat-square)](https://github.com/gass-git/remark-inline-svg-flex/blob/main/LICENSE)

Flexible Remark plugin that inlines and optimizes SVGs with SVGO, featuring customizable path resolution and wrappers.

## Instalation

`npm i remark-inline-svg-flex`

## Options

| Key                       | Default value                          | Description                                                |
| ------------------------- | -------------------------------------- | ---------------------------------------------------------- |
| [`suffix`](#suffix)       | `".svg"`                               | The plugin only processes SVG files ending with this value |
| [`assetsDir`](#assetsDir) | undefined                              | Base directory where SVG files are located                 |
| [`wrapper`](#wrapper)     | `<figure class="inline-svg"></figure>` | HTML wrapper used to wrap the inlined SVG                  |
