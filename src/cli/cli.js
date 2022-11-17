export const getUserName = () => {
  const args = process.argv.slice(2);
  let userData = args
    .find((arg) => arg.startsWith('--username'))
    .slice(2)
    .split('=');

  const userName = userData[1];

  return userName;
};
