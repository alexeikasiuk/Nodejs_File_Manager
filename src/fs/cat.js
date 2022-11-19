import path from 'path';
import { createReadStream } from 'fs';

// show the filedata in the console
export const printFile = async (args, _self) => {
  if (args.length !== 1) throw new Error(`$ cat [filepath]`);

  const filePath = path.resolve(_self.curDir, args[0]);

  await new Promise((resolve, reject) => {
    createReadStream(filePath)
      .on('data', (chunk) => console.log(chunk.toString()))
      .on('end', () => resolve())
      .on('error', (err) => reject(err));
  });
};
