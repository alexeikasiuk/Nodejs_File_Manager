import path from 'path';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';
import { access, stat } from 'fs/promises';

// copy the filepath to the directory
export const copyFile = async (args, _self) => {
  if (args.length !== 2) throw new Error(`$ [filepath, copy directory]`);

  const src = path.resolve(_self.curDir, args[0]);
  const name = path.parse(src).base;
  const dest = path.resolve(_self.curDir, args[1], name);

  // if the file doesn't exist -> don't make an empty copy.
  const fileInfo = await stat(src);
  if (!fileInfo.isFile()) throw new Error(`$ An incorrect filepath`);

  await new Promise((resolve, reject) => {
    pipeline(createReadStream(src), createWriteStream(dest), (e) => {
      e ? reject(e) : resolve();
    });
  });
};
