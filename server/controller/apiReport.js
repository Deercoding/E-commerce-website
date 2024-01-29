export function groupById(input) {
  const counterSum = {};
  input.forEach((item) => {
    const itemKey = item.user_id;
    const itemValue = item.total;

    if (counterSum[itemKey]) {
      counterSum[itemKey] += itemValue;
    } else {
      counterSum[itemKey] = itemValue;
    }
  });
  return counterSum;
}
