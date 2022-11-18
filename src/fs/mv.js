import path from 'path';
import { rm, stat } from 'fs/promises';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';

// move the filepath to the directory
export const moveFileTo = async (args, _self) => {
  if (args.length !== 2)
    throw new Error(`Error! 'mv' must called with two path arguments!`);

  const src = path.resolve(_self.curDir, args[0]);
  const destDir = args[1];
  const fileName = path.basename(src);
  const dest = path.resolve(_self.curDir, destDir, fileName);

  // if the file doesn't exist -> don't make an empty copy.
  const fileInfo = await stat(src);
  if (!fileInfo.isFile()) throw new Error(`Error! An incorrect filepath`);

  await new Promise((resolve, reject) => {
    pipeline(createReadStream(src), createWriteStream(dest), (e) => {
      e ? reject(e) : resolve();
    });
  });
  await rm(src);
};
