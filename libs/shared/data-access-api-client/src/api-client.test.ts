import { buildPath } from './fetch-utils';

describe('buildPath', () => {
  it('adds noauth to the path when the user is not authenticated', () => {
    const path = 'mathem-service/some/path';
    const authenticated = false;
    const expected = 'mathem-service/noauth/some/path';

    expect(buildPath(path, authenticated)).toBe(expected);
  });

  it('returns the path as is when the user is authenticated', () => {
    const path = 'mathem-service/some/path';
    const authenticated = true;
    const expected = 'mathem-service/some/path';

    expect(buildPath(path, authenticated)).toBe(expected);
  });
});
