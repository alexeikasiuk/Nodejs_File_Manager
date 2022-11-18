import path from 'path';
import { createGunzip } from 'zlib';
import { stat } from 'fs/promises';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';

//decompress the filepath  to the directory
export const decompressFile = async (args, _self) => {
  if (args.length !== 2)
    throw new Error(`Error! 'decompress' must called with 2 path arguments!`);

  const gunzip = createGunzip();

  const src = path.resolve(_self.curDir, args[0]);
  const name = path.parse(src).name;
  const dest = path.resolve(_self.curDir, args[1], name);

  // if the ile doesn't exist -> don't make an empty gzip in the pipeline.
  const fileInfo = await stat(src);
  if (!fileInfo.isFile()) throw new Error(`Error! An incorrect file path`);

  await new Promise((resolve, reject) => {
    pipeline(createReadStream(src), gunzip, createWriteStream(dest), (e) => {
      e ? reject(e) : resolve();
    });
  });
};
