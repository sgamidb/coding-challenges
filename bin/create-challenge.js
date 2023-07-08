#!/bin/node
const readline = require("node:readline/promises");
const fs = require("node:fs/promises");
const { stdin: input, stdout: output } = require("node:process");
const {stat} = require("node:fs/promises");
const path = require("path")
const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const PackageJson = require('@npmcli/package-json');
const deps = require("./base-deps.json");

const rl = readline.createInterface({ input, output });

async function run() {
  const nameOfChallenge = await rl.question(
    "What is the name of the new challenge ?\n",
  );
  // check

  const newChallengePath = path.join(process.cwd(), "challenges", nameOfChallenge);
  const directoryExists = await stat(newChallengePath).then(()=>true).catch(()=>false);

  if(directoryExists){
    throw new Error(`Path ${newChallengePath} already exists, check challenge name or empty the directory`);
  }

  console.log(`create new challenge in ${newChallengePath}`);
  await fs.mkdir(newChallengePath);

  console.log("init package.json");
  const pkgJson = await PackageJson.create(path.join(newChallengePath));
  pkgJson.update({
    "name": `@coding-challenges/${nameOfChallenge}`,
    "version": "1.0.0",
    "description": "",
    "main": "dist/index.js",
    "devDependencies": deps.devDependencies,
    "dependencies": deps.dependencies,
    "scripts": {
      "build": "tsc",
      "test": "jest",
      "start:dev": "ts-node src/index.ts"
    },
    "author": "",
    "license": "ISC"
  })
  await pkgJson.save()

  console.log("Init tsconfig");
  const tsConfigContent = `
  {
    "extends": "../../tsconfig-base.json",
    "compilerOptions": {
      "rootDir": "src",
      "outDir": "dist"
    }
  }
  `
  await fs.writeFile(path.join(newChallengePath, "tsconfig.json"), tsConfigContent);

  console.log("Create sample file");
  await fs.mkdir(path.join(newChallengePath, "src"));
  await fs.writeFile(path.join(newChallengePath, "src", "index.ts"),"console.log('Hello World');");

  console.log('New challenge created');
}

run().catch(console.error).finally(() => rl.close());
