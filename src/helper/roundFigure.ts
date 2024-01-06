export function roundFigure(figure: any) {
  // Check if figure is a number and not null/undefined/empty
  if (figure && !isNaN(figure)) {
    return Math.round(figure);
  }
  return 0;
}