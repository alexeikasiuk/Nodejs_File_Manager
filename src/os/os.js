import os from 'node:os';

// show system info
export const showSystemInfo = async (args, _self) => {
  if (args.length === 0)
    throw new Error(
      `$ os [--EOL | --cpus | --homedir | --username | --architecture]`
    );

  const osCommand = {
    '--EOL': JSON.stringify(os.EOL),
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
