const upperDiff = "𝗔".codePointAt(0) - "A".codePointAt(0);
const lowerDiff = "𝗮".codePointAt(0) - "a".codePointAt(0);

const isUpper = (n) => n >= 65 && n < 91;
const isLower = (n) => n >= 97 && n < 123;

const bolderize = (char) => {
  const n = char.charCodeAt(0);
  if (isUpper(n)) return String.fromCodePoint(n + upperDiff);
  if (isLower(n)) return String.fromCodePoint(n + lowerDiff);
  return char;
};

function bolderizeNumbers(text) {
  return text.replace(/\d/g, (c) => String.fromCodePoint(0x1D79E + c.charCodeAt(0)));
}

export const bolderizeWord = (word) => bolderizeNumbers([...word].map(bolderize).join(""));
