function removeForbiddenChars(str: string) {
  return str
    .replace(/[^a-zA-Z0-9.| ]+/g, " ") // replace forbidden characters with spaces
    .replace(/  +/g, " ") // remove multiple spaces
    .trim();
}

function formatNumbers(str: string) {
  return str
    .replace(/[',](\d{3})/g, "$1") // removes thousands separators (' and ,)
    .replace(/(\d{1,3}),/g, "$1."); // replaces comma digit separator with dot
}

export function formatText(str: string) {
  return removeForbiddenChars(formatNumbers(str));
}
