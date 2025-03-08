export const prefixWithAtSymbol = (username: string): string => {
  if (!username) return '@'; // Handle empty input
  return username.startsWith('@') ? username : `@${username}`;
};
