export const roundUpToDecimal = (value: number, decimalPlaces: number) => {
  const factor = Math.pow(10, decimalPlaces);
  return Math.ceil(value * factor) / factor;
};