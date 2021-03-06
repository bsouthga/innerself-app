#!/usr/bin/env node

import * as commander from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { createProject } from './project';

const package$json = require('../package.json');

type NameFunction = (name: string) => typeof commander;

const program = ((commander.name as any) as NameFunction)('innerself-app')
  .version(package$json.version)
  .description('bootstrap a new innerself app')
  .usage('[options] <dirname>')
  .option('-t, --typescript', 'create a typescript innerself app')
  .option('-e, --esnext', "don't include babel for a js project")
  .option('-i, --init', 'create a new innerself app in this directory')
  .parse(process.argv);

const [dirname] = program.args;

if (!dirname && !program.init) {
  program.outputHelp();
  process.exit(0);
}

createProject({
  directory: dirname || '.',
  typescript: !!program.typescript,
  esnext: !!program.esnext
}).catch(err => {
  console.error(err);
});
