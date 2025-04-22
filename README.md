[![npm][npm]][npm-url]
[![node][node]][node-url]
[![downloads][downloads]][downloads-url]

## About


```sh
n8n list:workflow staging
n8n export:workflow prod
```

## Getting Started

### Installation

```sh
# install n8n-cli globally
npm i -g n8n-cli
# with yarn:
yarn global add n8n-cli
# with pnpm:
pnpm global add n8n-cli

# or locally
npm i n8n-cli
# with yarn:
yarn add n8n-cli
# with pnpm:
pnpm i n8n-cli
```

### Configuration

n8n-cli uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig), so you just need to create a file `.n8nrc.yaml` (or `.n8nrc.json`, `.n8nrc.js`) with the following sample config:

```yaml
instances:
  prod:
    output: n8n-workflows
    url: https://n8n.self-hosted.tld
    token: abc•••def
  staging:
    output: n8n-workflows
    url: https://n8n.self-hosted-staging.tld
    token: ghi•••jkl
```

### Usage

```
Usage: n8n [options] [command]

Manage n8n instances

Options:
  -h, --help                            display help for command

Commands:
  list:workflow [options] <instance>    List workflows
  export:workflow [options] <instance>  Export workflows
  import:workflow [options] <instance>  Import workflows
  list:user [options] <instance>        List users
  help [command]                        display help for command
```

[npm]: https://img.shields.io/npm/v/n8n-cli.svg
[npm-url]: https://npmjs.com/package/n8n-cli
[node]: https://img.shields.io/node/v/n8n-cli.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/webpack-contrib/n8n-cli.svg
[deps-url]: https://david-dm.org/webpack-contrib/n8n-cli
[tests]: http://img.shields.io/travis/webpack-contrib/n8n-cli.svg
[tests-url]: https://travis-ci.org/webpack-contrib/n8n-cli
[downloads]: https://img.shields.io/npm/dt/n8n-cli.svg
[downloads-url]: https://npmjs.com/package/n8n-cli
