export function sortLike<T, Y>(arrayA: T[], arrayB: Y[], getFieldToCompare: (element: T) => Y) {
  return arrayA.sort(function (a, b) {
    return arrayB.indexOf(getFieldToCompare(a)) - arrayB.indexOf(getFieldToCompare(b));
  });
}
