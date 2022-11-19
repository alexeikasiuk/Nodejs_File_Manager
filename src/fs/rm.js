import path from 'path';
import { rm } from 'fs/promises';

// delete the file
export const deleteFile = async (args, _self) => {
  if (args.length !== 1) throw new Error(`$ rm [filepath]`);

  const src = path.resolve(_self.curDir, args[0]);
  await rm(src);
};
