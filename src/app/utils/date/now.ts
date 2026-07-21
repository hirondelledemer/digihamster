export const now = () => new Date();

export const getTodayWithZeroHours = () => {
  const today = now();
  today.setHours(0, 0, 0, 0);
  return today;
};
