import * as path from 'path';
import * as ts from 'typescript';
import { format } from 'prettier';
import * as glob from 'glob';
import * as fs from 'fs-extra';
import { exec } from 'child_process';

const DIR = __dirname;

/**
 * project creation options
 */
export interface Options {
  directory: string;
  typescript?: boolean;
  esnext?: boolean;
}

/**
 * create a new innerself app
 *
 * @param options
 */
export async function createProject(options: Options) {
  const { directory, typescript, esnext } = options;
  const absdir = absolutize(directory);
  const template = path.join(DIR, '../template');

  if (ensureDirectory(absdir)) return;

  if ((await fs.readdir(absdir)).length) {
    log(`directory ${absdir} is not empty, exiting.`);
    return;
  }

  if (typescript) {
    await createTSApp(template, absdir);
  } else {
    await createJSApp(template, absdir, options);
  }

  await installDependencies(absdir);

  log(`done!

    To start developing, change to your directory
    and start the dev server...

      ~$ cd ${absdir}
      ~$ npm start
  `);
}

/**
 * create absolute path from directory string
 *
 * @param directory
 */
function absolutize(directory: string) {
  const cwd = process.cwd();

  return path.isAbsolute(directory) ? directory : path.join(cwd, directory);
}

/**
 * create directory if needed
 *
 * @param directory
 */
function ensureDirectory(directory: string) {
  if (directory !== absolutize('.')) {
    if (fs.existsSync(directory)) {
      log(`

  directory "${directory}" already exists, can't create new app.

  -> to initialize an innerself app within an existing directory,
     run \`innerself-app init\`
      `);
      return true;
    } else {
      fs.mkdirSync(directory);
    }
  }
}

/**
 * create new typescript app
 *
 * @param template template folder
 * @param absdir absolute path to new app folder
 */
async function createTSApp(template: string, absdir: string) {
  log(`creating new typescript app in ${absdir}...`);
  await fs.copy(template, absdir, { recursive: true });
  await removeBabelFromProject(absdir);
}

/**
 * create new javascript
 *
 * @param template template folder
 * @param absdir absolute path to new app folder
 */
async function createJSApp(
  template: string,
  absdir: string,
  opts: { esnext?: boolean }
) {
  log(`creating new app in ${absdir}...`);
  const tmp = path.join(absdir, `./____innerself-tmp-dir___`);
  ensureDirectory(tmp);

  await fs.copy(template, tmp, { recursive: true });

  const tsFiles = glob.sync(path.join(tmp, '/**/*.ts'));

  ts
    .createProgram(tsFiles, {
      noEmitOnError: false,
      noImplicitAny: false,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      removeComments: false
    })
    .emit();

  const jsFiles = glob.sync(path.join(tmp, '/**/*.js'));

  await Promise.all([
    Promise.all(tsFiles.map(file => fs.remove(file))),
    Promise.all(jsFiles.map(hackyReformatJS))
  ]);

  await fs.copy(tmp, absdir, { recursive: true });

  if (opts.esnext) {
    await removeBabelFromProject(absdir);
  }

  await fs.remove(path.join(absdir, './src/state.js'));
  await fs.remove(path.join(absdir, './tsconfig.json'));

  const packageJSON = await getPackageJson(absdir);
  delete packageJSON['devDependencies']['rollup-plugin-typescript2'];
  await fs.writeFile(
    path.join(absdir, './package.json'),
    JSON.stringify(packageJSON)
  );

  // cleanup
  await fs.remove(tmp);
}

/**
 * reformat JS emitted from TS compile
 *
 * @param file file path
 */
async function hackyReformatJS(file: string) {
  const source = await fs.readFile(file);

  let formatted: string;
  try {
    formatted = format(source.toString(), {
      singleQuote: true
    });
  } catch (err) {
    log(`prettier parse error for ${file}`);
    throw err;
  }

  return fs.writeFile(
    file,
    formatted
      .replace(/\nexport/g, '\n\nexport')
      .replace(/\nconst/g, '\n\nconst')
      .replace(/\nattach/g, '\n\nattach')
      .replace(/\n\/\*\*/g, '\n\n/**')
      .replace(/\n\s+typescript\(\),/g, '')
      .replace("input: 'src/index.ts',", "input: 'src/index.js',")
      .replace("\nimport typescript from 'rollup-plugin-typescript2';", '')
  );
}

/**
 * removes removes babel from project
 *
 * @param absdir absolute path to project directory
 */
async function removeBabelFromProject(absdir: string) {
  const packageJSON = await getPackageJson(absdir);
  const remove = [
    'babel-core',
    'babel-plugin-external-helpers',
    'babel-preset-es2015',
    'rollup-plugin-babel'
  ];

  remove.forEach(name => {
    delete packageJSON['devDependencies'][name];
  });
  await fs.writeFile(
    path.join(absdir, './package.json'),
    JSON.stringify(packageJSON)
  );

  await fs.remove(path.join(absdir, './.babelrc'));

  const rollupPath = path.join(absdir, './rollup.config.js');
  const rollupFile = await fs.readFile(rollupPath);
  const rollupFileString = rollupFile.toString();

  await fs.writeFile(
    rollupPath,
    rollupFileString
      .replace(`import babel from 'rollup-plugin-babel';`, '')
      .replace(/\]\),\n\s+babel\(\)/, '])\n')
  );
}

async function getPackageJson(absdir: string) {
  const packageJSONPath = path.join(absdir, './package.json');
  const packageJSONBuff = await fs.readFile(packageJSONPath);
  const packageJSON = JSON.parse(packageJSONBuff.toString());
  return packageJSON;
}

/**
 * install all deps for new app
 *
 * @param packageJsonFile path to package.json
 */
async function installDependencies(absdir: string) {
  log(`installing dependencies...`);
  await new Promise((res, rej) => {
    exec(`npm install`, { cwd: absdir }, err => {
      err ? rej(err) : res();
    });
  });
}

function log(msg: string) {
  console.log(`innerself-app: ${msg}`);
}
