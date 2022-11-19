import path from 'path';
import { createGzip } from 'zlib';
import { stat } from 'fs/promises';
import { pipeline } from 'stream';
import { createReadStream, createWriteStream } from 'fs';

// compress the filePath to the directory
export const compressFile = async (args, _self) => {
  if (args.length !== 2) throw new Error(`$ compress [filepath, directory]`);

  const gzip = createGzip();
  const src = path.resolve(_self.curDir, args[0]);
  const file = path.basename(src);
  const dest = path.resolve(_self.curDir, args[1], `${file}.gz`);

  // if the file doesn't exist -> don't make an empty gzip in the pipeline.
  const fileInfo = await stat(src);
  if (!fileInfo.isFile()) throw new Error(`$ An incorrect filepath`);

  // TODO: check the save directory by unique filename
  await new Promise((resolve, reject) => {
    pipeline(createReadStream(src), gzip, createWriteStream(dest), (e) => {
      e ? reject(e) : resolve();
    });
  });
};
