export const formatAmount = (
  amount: number,
  flipSign: boolean = false,
): string => {
  const isNegative = amount * (flipSign ? -1 : 1) < 0;
  const maybeMinusSign = isNegative ? '- ' : '';
  const trimmedAmount = Math.abs(amount).toFixed(2).toString();
  const amountWithCommas = trimmedAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${maybeMinusSign}$ ${amountWithCommas}`;
};
