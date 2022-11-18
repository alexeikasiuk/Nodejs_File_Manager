import { writeFile } from 'fs/promises';
import path from 'path';

// create a new empty file in the working directory
export const createFile = async (args, _self) => {
  if (args.length !== 1)
    throw new Error(`Error! 'add' must called with a one path argument!`);

  const fileName = args[0];

  // only working directory
  if (
    fileName.indexOf('\\') !== -1 ||
    fileName.indexOf('/') !== -1 ||
    fileName.indexOf('.') === -1
  )
    throw new Error(`Error! Only current directory!`);

  const filePath = path.resolve(_self.curDir, fileName);

  await writeFile(filePath, '');
};
