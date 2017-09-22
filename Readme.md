# Bootstrap a simple [innerself](https://github.com/stasm/innerself) app
[![npm version](https://badge.fury.io/js/innerself-app.svg)](https://badge.fury.io/js/innerself-app)

## Installing

```shell
npm install -g innerself-app
```

## Creating a new app

First, run the command to create the app

```
innerself-app my-app
```

Next, change into the directory and start the dev server

```shell
cd my-app
npm start
```

## CLI

```

  Usage: innerself-app [options] <dirname>

  bootstrap a new innserself app


  Options:

    -V, --version     output the version number
    -t, --typescript  create a typescript innerself app
    -i, --init        create a new innerself app in this directory
    -h, --help        output usage information
```

## Building your app

To produce a production build of your new app, run...

```shell
npm run build
```
