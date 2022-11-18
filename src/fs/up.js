import path from 'path';

// go to the parent directory
export const goToParendDir = async (args, _self) => {
  if (args.length > 0)
    throw new Error(`Error! 'up' must called w/o any arguments!`);

  _self.curDir = path.dirname(_self.curDir);
};
