export const getFullYearTest = (currentDate: Date) => {
  return new Date(currentDate).getFullYear();
};

export const getMonth = (currentDate: Date) => {
  return new Date(currentDate).toLocaleString('default', { month: 'long' });
};
