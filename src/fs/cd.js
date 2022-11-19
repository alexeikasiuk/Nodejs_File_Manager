import path from 'path';
import { stat } from 'fs/promises';

// go to the directory
export const goToPath = async (args, _self) => {
  if (args.length !== 1) throw new Error(`$ cd [.. | ./ | ../ | path]`);

  const dest = path.resolve(_self.curDir, args[0]);
  const info = await stat(dest);

  if (info.isDirectory()) _self.curDir = dest;
  else throw new Error(`$ Incorrect directory`);
};
