// get the user name from the console input
export const getUserName = () => {
  const userName = process.argv
    .slice(2)
    .find((arg) => arg.startsWith('--username'))
    .split('=')[1];

  // TODO: validate the username
  return userName ? userName : 'unknown User';
};
