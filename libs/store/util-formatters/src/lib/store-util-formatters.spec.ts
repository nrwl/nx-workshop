import { formatRating } from './store-util-formatters';

describe('formatRating', () => {
  it('should pretty print decimal rating', () => {
    expect(formatRating(0.491243)).toEqual('4.9 / 10');
  });
});
