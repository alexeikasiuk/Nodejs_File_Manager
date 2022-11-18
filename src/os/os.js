import os from 'node:os';

// show system info
export const showSystemInfo = async (args, _self) => {
  if (args.length === 0)
    throw new Error(`Error! 'os' must called with some arguments!`);

  const osCommand = {
    '--EOL': os.EOL,
    '--cpus': `${os.cpus().length} cpus, ${os.cpus()[0].model}`,
    '--homedir': os.homedir(),
    '--username': os.userInfo().username,
    '--architecture': os.arch(),
  };

  args.forEach((arg) => {
    if (arg in osCommand) {
      console.log(`${arg.slice(2)}: ${osCommand[arg]}`);
    }
  });
};
