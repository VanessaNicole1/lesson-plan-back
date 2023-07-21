export const generateUniqueIdentifier = () => {
  const timestamp = Date.now().toString(36);
  const randomNum = Math.random().toString(36).substr(2, 5);
  const identifier = timestamp + randomNum;
  return identifier;
}
