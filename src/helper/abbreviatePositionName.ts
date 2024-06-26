export function abbreviateBasketballPosition(position: string): string {
  const abbreviationMap: { [key: string]: string } = {
    'Point Guard': 'PG',
    'Shooting Guard': 'SG',
    'Small Forward': 'SF',
    'Power Forward': 'PF',
    'Center': 'C',
    'Forward': 'F',
    'Guard': 'G'
  };

  // Normalize the position string to match the keys in the map (e.g., case-insensitive)
  const normalizedPosition = position?.trim().replace(/\s+/g, ' ');
  return abbreviationMap[normalizedPosition] || position;
}
