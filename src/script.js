import { homedir } from 'node:os';

//project modules
import { getUserName } from './help/getUserName.js';
import { showCurDir } from './help/showCurDir.js';
import { goToParentDir } from './fs/up.js';
import { printFilesInFolder } from './fs/ls.js';
import { showSystemInfo } from './os/os.js';
import { goToPath } from './fs/cd.js';
import { printFile } from './fs/cat.js';
import { createFile } from './fs/add.js';
import { renameFile } from './fs/rn.js';
import { copyFile } from './fs/cp.js';
import { moveFileTo } from './fs/mv.js';
import { deleteFile } from './fs/rm.js';
import { calcHash } from './crypto/hash.js';
import { compressFile } from './gzip/compress.js';
import { decompressFile } from './gzip/decompress.js';

class FileManager {
  constructor() {
    this.userName = getUserName();
    this.curDir = homedir();
    this.commands = {
      up: goToParentDir,
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
    this.init();
  }

  init() {
    console.log(`Welcome to File Manager, ${this.userName}!`);
    showCurDir(this.curDir);

    // listen user input
    process.stdin.on('data', (chunk) => {
      const str = chunk.toString().trim();

      if (str === 'exit') process.exit();

      this.runCommand(str);
    });

    //exit by typing "exit"
    process.on('.exit', () =>
      console.log(
        `\nThank you for using File Manager, ${this.userName}, goodbye!`
      )
    );
    // exit by "ctrl+c"
    process.on('SIGINT', () => process.exit());
  }

  async runCommand(inputCommand) {
    const args = inputCommand.split(' ');
    const cmd = args[0];
    const cmdArgs = args.slice(1);

    try {
      if (!(cmd in this.commands))
        throw new Error(
          `Invalid input\n[up | cd | ls | cat | add | rn | cp | mv | rm | os | hash | compress | decompress][args]`
        );

      await this.commands[cmd](cmdArgs, this);
    } catch (e) {
      if (e.message.indexOf('$') !== -1)
        console.log(e.message.replace('$', 'Invalid input.'));
      else console.log(`Operation failed. ${e.message}`);
    } finally {
      showCurDir(this.curDir);
    }
  }
}

const fileManager = new FileManager();
