import path from 'path';
import { readFile } from 'fs/promises';
import { createHmac } from 'crypto';

// show the filePath hash in the console
export const calcHash = async (args, _self) => {
  if (args.length !== 1) throw new Error(`$ hash [filepath]`);

  const src = path.resolve(_self.curDir, args[0]);
  const data = await readFile(src);
  const hash = createHmac('sha256', data).update(data).digest('hex');

  console.log(hash);
};
