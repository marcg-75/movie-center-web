import { buildPath } from './fetch-utils';

describe('buildPath', () => {
  it('returns the path as is', () => {
    const path = 'mathem-service/some/path';
    const expected = 'mathem-service/some/path';

    expect(buildPath(path)).toBe(expected);
  });
});
