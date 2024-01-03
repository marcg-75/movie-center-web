import { buildQueryString } from './fetch-utils';

describe('buildQueryString', () => {
  it('returns an empty string if no params are provided', () => {
    const params = undefined;
    const expected = '';

    expect(buildQueryString(params)).toBe(expected);
  });

  it('returns a query string for provided params', () => {
    const params = {
      param1: 'value1',
      param2: 'value2',
    };
    const expected = '?param1=value1&param2=value2';

    expect(buildQueryString(params)).toBe(expected);
  });

  it('ignores undefined values in the params', () => {
    const params = {
      param1: 'value1',
      param2: undefined,
    };
    const expected = '?param1=value1';

    expect(buildQueryString(params)).toBe(expected);
  });
});
