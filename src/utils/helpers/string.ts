export const prefixWithAtSymbol = (username: string): string => {
  if (!username) return '@'; // Handle empty input
  return username.startsWith('@') ? username : `@${username}`;
};

export const isValidFacebookProfileUrl = (url: string) => {
  const facebookRegex =
    /^(https?:\/\/)?(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/;

  return (
    facebookRegex.test(url) || 'Please enter a valid Facebook profile URL.'
  );
};

export const isValidInstagramProfileUrl = (url: string) => {
  const instagramRegex = /^https:\/\/www\.instagram\.com\/[a-zA-Z0-9_.]+\/?$/;

  return (
    instagramRegex.test(url) || 'Please enter a valid Instagram profile URL.'
  );
};

export const isValidLinkedinProfileUrl = (url: string) => {
  const linkedinRegex = /^https:\/\/www\.linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;

  return (
    linkedinRegex.test(url) || 'Please enter a valid Linkedin profile URL.'
  );
};

export const isValidTwitterProfileUrl = (url: string) => {
  const twitterRegex = /^https:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/;

  return twitterRegex.test(url) || 'Please enter a valid X profile URL.';
};

export const isValidWebsiteUrl = (url: string) => {
  const websiteRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

  return websiteRegex.test(url) || 'Please enter a valid website URL.';
};
