export function formatRating(rating = 0) {
  return `${Math.round(rating * 100) / 10} / 10`;
}
