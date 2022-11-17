import { getUserName } from './cli/cli.js';
import path from 'node:path';
import os, { homedir } from 'node:os';
import {
  readdir,
  stat,
  appendFile,
  rename,
  rm,
  readFile,
} from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { fileURLToPath } from 'url';
import { pipeline } from 'node:stream';
import { createHmac } from 'node:crypto';

console.log(fileURLToPath(import.meta.url));
const userName = getUserName();
let curDir = homedir();

const showCurDir = () => {
  process.stdout.write(`${path.join('root:/', curDir).trim()} `);
};

// parse input command
const parseCommand = (str) => {
  const args = str.split(' ');
  // if (args.length > 2) {
  //   console.log(`ERROR! "${str}" incorrect command!!!`);
  //   showCurDir();
  //   return;
  // }
  const command = args[0];
  const commandArg = args.slice(1);

  if (command in commands) {
    commands[command](commandArg);
  } else {
    console.log(`ERROR! "${str}" incorrect command!!!`);
    showCurDir();
  }
};

// up
const goToParendDir = (args) => {
  if (args[0]) {
    console.log("ERROR! command 'up' have to used w/a any arguments!");
    showCurDir();
    return;
  }

  const isRoot = curDir.split(path.sep).length === 0;

  curDir = isRoot ? curDir : path.dirname(curDir);

  showCurDir();
};

// cd
const goToPath = async (dest) => {
  if (!dest || dest.length > 1) {
    console.log("ERROR! command 'cd' have to used with path argument!");
    showCurDir();
    return;
  }

  const destParse = path.resolve(curDir, dest[0]);

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
  if (arg[0]) {
    console.log("ERROR! command 'ls' have to used w/a any arguments!");
    showCurDir();
    return;
  }

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
  if (!dest || dest.length > 1) {
    console.log("ERROR! command 'cat' have to used with path argument!");
    showCurDir();
    return;
  }
  const filePath = path.join(curDir, dest[0]);

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      console.log(`ERROR! ${dest} isn't a file!`);
      showCurDir();
      return;
    }

    const readStream = createReadStream(filePath);
    readStream.on('data', (chunk) => {
      console.log(chunk.toString());
    });

    readStream.on('end', () => {
      showCurDir();
    });
  } catch (e) {
    console.log(`ERROR! ${dest} file doesn't exist!`);
    showCurDir();
  }
};

// add
const createFile = async (name) => {
  if (!name || name.length > 1) {
    console.log(`ERROR!  command 'add' have to used with filename argument!`);
    showCurDir();
    return;
  }

  if (!isCorrectFileName(name[0])) {
    console.log(`ERROR!  ${name} - incorrect filename argument!`);
    showCurDir();
    return;
  }

  const filePath = path.join(curDir, name[0]);

  appendFile(filePath, 'test');
};

// rn
const renameFile = async (args) => {
  if (!args || args.length !== 2) {
    console.log(`ERROR!  command 'rn' have to used with 2 filename argument!`);
    showCurDir();
    return;
  }

  const src = args[0];
  const dest = args[1];

  const srcParse = path.parse(args[0]);
  const destParse = path.parse(args[1]);

  const srcDir = srcParse.dir;
  const destDir = destParse.dir;

  if (srcDir !== destDir) {
    console.log(`ERROR! Different files directory argument!`);
    showCurDir();
    return;
  }

  const srcFileName = srcParse.base;
  const destFileName = destParse.base;

  if (!isCorrectFileName(src) || !isCorrectFileName(dest)) {
    console.log(`ERROR!  Incorrect filenames argument for rename!`);
    showCurDir();
    return;
  }

  try {
    // TODO: relative & absolute file path
    await rename(path.join(curDir, src), path.join(curDir, dest));
  } catch (e) {
    console.log(e);
  }
};

// cp
const copyFile = async (args) => {
  if (!args || args.length !== 2) {
    console.log(`ERROR!  command 'rn' have to used with 2 filename argument!`);
    showCurDir();
    return;
  }

  // TODO: validate
  const src = path.join(curDir, args[0]);
  const dest = path.join(curDir, args[1]);

  pipeline(createReadStream(src), createWriteStream(dest), () => {});

  showCurDir();
};

// mv
const moveFileTo = async (args) => {
  if (!args || args.length !== 2) {
    console.log(
      `ERROR!  command 'mv' have to used with 2 files path argument!`
    );
    showCurDir();
    return;
  }

  // const filePath = args[0];
  const filePath = path.join(curDir, args[0]);
  const destDir = args[1];
  // TODO relative & absolute path
  const fileName = path.basename(filePath);
  const destPath = path.join(curDir, destDir, fileName);
  console.log(fileName);
  console.log(filePath);
  console.log(destPath);
  // TODO: validate

  pipeline(createReadStream(filePath), createWriteStream(destPath), (err) => {
    if (err) console.log('error');
    else {
      console.log('ok');
      rm(filePath);
    }
    showCurDir();
  });
};

// rm
const deleteFile = (args) => {
  if (!args || args.length !== 1) {
    console.log(
      `ERROR!  command 'rn' have to used with ome file path argument!`
    );
    showCurDir();
    return;
  }

  // TODO: rel&abs path

  rm(path.join(curDir, args[0]));

  showCurDir();
};

// os
const showSystemInfo = (args) => {
  if (args.length === 0) {
    console.log(`ERROR! command 'os' have to used with some arguments!`);
  }

  const osCommand = {
    '--EOL': os.EOL,
    '--cpus': `${os.cpus().length} cpus, ${os.cpus()[0].model}`,
    '--homedir': os.homedir(),
    '--username': os.userInfo().username,
    '--architecture': os.arch(),
  };

  args.forEach((arg) => {
    if (arg in osCommand) {
      console.log(osCommand[arg]);
    }
  });

  showCurDir();
};

// hash
const calcHash = async (args) => {
  if (!args || args.length !== 1) {
    console.log(`ERROR! command 'hash' have to used file path argument!`);
    showCurDir();
    return;
  }
  // TODO correct parse/validate path
  const filePath = path.join(curDir, args[0]);

  const data = await readFile(filePath);
  const hash = createHmac('sha256', data).update(data).digest('hex');

  console.log(hash);
  showCurDir();
};

// compress
const compressFile = () => {};

// decompress
const decompressFile = () => {};

const isCorrectFileName = (name) => {
  return name.indexOf('/') === -1 && name.split('.').length == 2;
};

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
