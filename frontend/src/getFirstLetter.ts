const numberLetters: { [index: string]: string } = {
  0: "z",
  1: "o",
  2: "t",
  3: "t",
  4: "f",
  5: "f",
  6: "s",
  7: "s",
  8: "e",
  9: "n",
};

export default function getFirstLetter(vendorId: string) {
  let firstLetter = vendorId.slice(0, 1).toLowerCase();
  if (/^[0-9]/.test(firstLetter)) {
    firstLetter = numberLetters[firstLetter];
  }

  return firstLetter.toLowerCase();
}
