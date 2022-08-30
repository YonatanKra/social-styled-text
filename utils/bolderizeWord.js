import punycode from '../node_modules/punycode/punycode.es6.js';

const encode = (charCode) => punycode.ucs2.encode([charCode]);
const decode = (char) => punycode.ucs2.decode(char)[0];

const UPPERCASE_A = decode("A");
const UPPERCASE_Z = decode("Z");
const LOWERCASE_A = decode("a");
const LOWERCASE_Z = decode("z");
const BOLD_UPPERCASE_A = decode("𝗔");
const BOLD_UPPERCASE_Z = decode("𝗭");
const BOLD_LOWERCASE_A = decode("𝗮");
const BOLD_LOWERCASE_Z = decode("𝘇");


const UPPERCASE_DIFF = BOLD_UPPERCASE_A - UPPERCASE_A;
const LOWERCASE_DIFF = BOLD_LOWERCASE_A - LOWERCASE_A;
const NUMBER_DIFF = 0x1D79E;

const isUpper = (n) => n >= UPPERCASE_A && n <= UPPERCASE_Z;
const isLower = (n) => n >= LOWERCASE_A && n <= LOWERCASE_Z;
const isUpperBold = (n) => n >= BOLD_UPPERCASE_A && n <= BOLD_UPPERCASE_Z;
const isLowerBold = (n) => n >= BOLD_LOWERCASE_A && n <= BOLD_LOWERCASE_Z;

const bolderize = (char) => {
  const n = decode(char);

  if (isUpper(n)) return encode(n + UPPERCASE_DIFF);
  if (isLower(n)) return encode(n + LOWERCASE_DIFF);

  return char;
};

const unbolderize = (char) => {
  const n = decode(char);

  if (isUpperBold(n)) return encode(n - UPPERCASE_DIFF);
  if (isLowerBold(n)) return encode(n - LOWERCASE_DIFF);

  return char;
}

const bolderizeNumbers = (text) => {
  return text.replace(/\d/g, (c) => encode([decode(c) + NUMBER_DIFF]));
}

const unbolderizeNumbers = (text) => {
  return text.replace(/\d/g, (c) => encode([decode(c) - NUMBER_DIFF]));
}

const bolderizeWord = (word) => bolderizeNumbers([...word].map(bolderize).join(""));
const unbolderizeWord = (word) => unbolderizeNumbers([...word].map(unbolderize).join(""));

export const bolderizeOrUnbolderizeWord = (text) => {
  const hasUnbolderizedCharacters = !!text.match(/[A-Za-z0-9]/g);
  return hasUnbolderizedCharacters ? bolderizeWord(text) : unbolderizeWord(text);
}
