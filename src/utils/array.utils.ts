export const removeDuplicatesByKey = (array, keyName: string) => {
  const cleanedArray = [];
  const reference = {};

  array.forEach(element => {
    const existsReference = reference[element[keyName]];

    if (!existsReference) {
      //@ts-ignore
      cleanedArray.push(element);
    }

    reference[element[keyName]] = true;
  });

  return cleanedArray;
}
