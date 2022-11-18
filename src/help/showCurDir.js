import path from 'path';

// show the current directory at the begin of the input command line
export const showCurDir = (curDir) => {
  process.stdout.write(`${path.join('root:/', curDir)} `);
};
