export const getDayInMiliseconds = () => 86400000;

export const getFullYearTest = (currentDate: Date) => {
  return new Date(currentDate).getFullYear();
};

export const getMonth = (currentDate: Date) => {
  return new Date(currentDate).toLocaleString('default', { month: 'long' });
};

export const hasPassedAmountOfDays = (dateToCompare: Date, amountOfDays: number, expectedHours: number = 8) => {
  const oneDayInMiliseconds = getDayInMiliseconds();
  
  const dateToBeCompared = new Date(dateToCompare);
  dateToBeCompared.setHours(expectedHours - 1, 0, 0, 0);

  const currentDate =  new Date();
  currentDate.setHours(expectedHours, 0, 0, 0);

  const milisecondsDifference = currentDate.getTime() - dateToBeCompared.getTime();
  const daysDifference = milisecondsDifference / oneDayInMiliseconds;

  return daysDifference > amountOfDays;
}
