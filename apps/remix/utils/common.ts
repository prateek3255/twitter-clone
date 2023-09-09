export const isEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatDistanceForTweet = (fomattedDate: string) => {
  const [amount, unit] = fomattedDate.split(" ");
  return `${amount}${unit[0]}`;
};
