export const removeDuplicatesByKey = (array, keyName: string) => {
  const cleanedArray = [];
  const reference = {};

  array.forEach(element => {
    const existsReference = reference[element[keyName]];

    if (!existsReference) {
      cleanedArray.push(element);
    }

    reference[element[keyName]] = true;
  });

  return cleanedArray;
}
