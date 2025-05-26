export const removeSpecialCharacters = (value: string) =>
  value.replace(/[^\w\s]/gi, "");
