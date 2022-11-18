import { readdir } from 'fs/promises';

// show first level childen for the directory
export const printFilesInFolder = async (args, _self) => {
  if (args.length > 0)
    throw new Error("Error! 'ls' must used w/a any arguments!");

  const files = await readdir(_self.curDir, { withFileTypes: true });

  const filesTable = files
    .map((file) => ({
      name: file.name,
      type: file.isDirectory() ? 'directory' : 'file',
    }))
    .sort((a, b) => {
      // sort by type, if equal -> by name
      return a.type < b.type
        ? -1
        : a.type > b.type
        ? 1
        : a.name < b.name
        ? -1
        : a.name > b.name
        ? 1
        : 0;
    });

  console.table(filesTable);
};
