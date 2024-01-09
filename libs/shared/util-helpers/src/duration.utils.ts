/**
 * A function to convert a number and a unit to a duration.
 */
export function convertToMilliseconds(
  value: number,
  unit: 'seconds' | 'minutes' | 'hours' | 'days'
): number {
  switch (unit) {
    case 'seconds':
      return value * 1000;
    case 'minutes':
      return value * 60 * 1000;
    case 'hours':
      return value * 60 * 60 * 1000;
    case 'days':
      return value * 60 * 60 * 24 * 1000;
  }
}
