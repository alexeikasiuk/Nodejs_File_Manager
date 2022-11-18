import path from 'path';
import { stat } from 'fs/promises';

// go to the directory
export const goToPath = async (args, _self) => {
  if (args.length !== 1)
    throw new Error("Error! 'cd' must called with a one path argument!");

  const dest = path.resolve(_self.curDir, args[0]);
  const info = await stat(dest);

  if (info.isDirectory()) _self.curDir = dest;
  else throw new Error(`Error! ${args[0]} isn't a directory!`);
};
