export const replaceWhiteSpaceWithUnderscore = (str: string): string => {
  return str.replace(/\s/g, "_");
};

export const makeLowerCaseAndReplaceWhiteSpaceWithUnderscore = (str: string): string => {
  return str.toLowerCase().replace(/\s/g, "_");
};

export const removeAllWhiteSpace = (str: string): string => {
  return str.replace(/\s/g, "");
}