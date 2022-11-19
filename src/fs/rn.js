import { rename } from 'fs/promises';
import path from 'path';

// rename the filepath to the name
export const renameFile = async (args, _self) => {
  if (args.length !== 2) throw new Error(`$ rn [filepath, newname]`);

  const src = path.resolve(_self.curDir, args[0]);
  const name = args[1];

  if (name.indexOf('/') !== -1 || name.indexOf('\\') !== -1)
    throw new Error(`$ An incorrect newname!`);
  const { dir, ext } = path.parse(src);
  const dest = path.format({
    dir: dir,
    name: name,
    ext: ext,
  });

  // TODO: check if the new name already exists
  await rename(src, dest);
};
