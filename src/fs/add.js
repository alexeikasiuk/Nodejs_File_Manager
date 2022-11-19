import { writeFile, stat } from 'fs/promises';
import path from 'path';

// create a new empty file in the working directory
export const createFile = async (args, _self) => {
  if (args.length !== 1) throw new Error(`$ add [filepath]`);

  const fileName = args[0];

  // only working directory
  if (
    fileName.indexOf('\\') !== -1 ||
    fileName.indexOf('/') !== -1 ||
    fileName.indexOf('.') === -1
  )
    throw new Error(`$ Incorrect filepath`);

  const filePath = path.resolve(_self.curDir, fileName);

  // if the filepath already exists
  try {
    const file = await stat(filePath);
    if (file.isFile()) throw new Error('FE');
  } catch (e) {
    if (e.message === 'FE') throw new Error('File already exist');
  }

  await writeFile(filePath, '');
};
