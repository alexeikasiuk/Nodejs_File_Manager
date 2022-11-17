import { getUserName } from './cli/cli.js';
import path from 'node:path';
import { homedir } from 'node:os';
import { readdir, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'url';

console.log(fileURLToPath(import.meta.url));
const userName = getUserName();
let curDir = homedir();

const showCurDir = () => {
  process.stdout.write(`${path.join('root:/', curDir).trim()} `);
};

// parse input command
const parseCommand = (str) => {
  const args = str.split(' ');
  if (args.length > 2) {
    console.log(`ERROR! "${str}" incorrect command!!!`);
    showCurDir();
    return;
  }
  const command = args[0];
  const commandArg = args[1];

  if (command in commands) {
    commands[command](commandArg);
  } else {
    console.log(`ERROR! "${str}" incorrect command!!!`);
    showCurDir();
  }
};

// up
const goToParendDir = (args) => {
  if (args)
    return console.log("ERROR! command 'up' have to used w/a any arguments!");

  const isRoot = curDir.split(path.sep).length === 0;

  curDir = isRoot ? curDir : path.dirname(curDir);

  showCurDir();
};

// cd
const goToPath = async (dest) => {
  if (!dest)
    return console.log("ERROR! command 'cd' have to used with path argument!");

  const destParse = path.resolve(curDir, dest);

  try {
    const info = await stat(destParse);
    if (!info.isDirectory()) {
      console.log(`ERROR! ${dest} isn't directory!`);
      showCurDir();
      return;
    }
  } catch (e) {
    console.log("ERROR! Wrong path or directory doesn't exist!");
    showCurDir();
    return;
  }

  curDir = destParse;

  showCurDir();
};

//ls
const printFilesInFolder = async (arg) => {
  if (arg)
    return console.log("ERROR! command 'ls' have to used w/a any arguments!");

  const files = await readdir(curDir, { withFileTypes: true });

  const filesTable = files
    .map((file) => ({
      name: file.name,
      type: file.isDirectory() ? 'directory' : 'file',
    }))
    .sort((a, b) => {
      return a.type < b.type
        ? -1
        : a.type > b.type
        ? 1
        : a.name < b.name
        ? -1
        : a.name > b.name
        ? 1
        : 0;
      // if (a.type < b.type) return -1;
      // else if (a.type > b.type) return 1;
      // else {
      //   if (a.name < b.name) return -1;
      //   else if (a.name > b.name) return 1;
      //   else return 0;
      // }
    });

  console.table(filesTable);
  showCurDir();
};

//cat
const printFile = async (dest) => {
  if (!dest)
    return console.log("ERROR! command 'cat' have to used with path argument!");
};

// add
const createFile = () => {};

// rn
const renameFile = () => {};

// cp
const copyFile = () => {};

// mv
const moveFileTo = () => {};

// rm
const deleteFile = () => {};

// os
const showSystemInfo = () => {};

// hash
const calcHash = () => {};

// compress
const compressFile = () => {};

// decompress
const decompressFile = () => {};

const commands = {
  up: goToParendDir,
  cd: goToPath,
  ls: printFilesInFolder,
  cat: printFile,
  add: createFile,
  rn: renameFile,
  cp: copyFile,
  mv: moveFileTo,
  rm: deleteFile,
  os: showSystemInfo,
  hash: calcHash,
  compress: compressFile,
  decompress: decompressFile,
};

console.log(`Welcome to File Manager, ${userName}!`);
showCurDir();

process.on('exit', () => {
  console.log(`\nThank you for using File Manager, ${userName}, goodbye!`);
});

process.stdin.on('data', (chunk) => {
  const str = chunk.toString().trim();

  if (str === 'exit') process.exit();

  parseCommand(str);
});

process.on('SIGINT', () => process.exit());
