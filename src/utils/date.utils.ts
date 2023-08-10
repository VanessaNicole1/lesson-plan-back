export const getDayInMiliseconds = () => 86400000;

export const getFullYearTest = (currentDate: Date) => {
  return new Date(currentDate).getFullYear();
};

export const getMonth = (currentDate: Date) => {
  const monthName = new Date(currentDate).toLocaleDateString('es-ES', { month: 'long' });
  return monthName.charAt(0).toUpperCase() + monthName.slice(1);
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

export const getLastWeekFromMondayDay = () => {
  /**
   * Should be executed just on mondays.
   */
  const currentDate = new Date();

  const oneDayInMiliseconds = 24 * 60 * 60 * 1000;
  const sevenDaysInMiliseconds = oneDayInMiliseconds * 7;
  const threeDaysInMiliseconds = oneDayInMiliseconds * 3;

  const lastMonday = new Date(currentDate);
  lastMonday.setTime(lastMonday.getTime() - sevenDaysInMiliseconds);

  const lastFriday = new Date(currentDate);
  lastFriday.setTime(lastFriday.getTime() - threeDaysInMiliseconds);

  return { from: lastMonday, to: lastFriday }
};

export const convertToSpanishDate = (currrentDate: Date) => {
  const dateToConvert = new Date(currrentDate);
  const spanishDate = dateToConvert.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return spanishDate;
}
