export function roundFigure(figure: any) {
  // Check if figure is a number and not null/undefined/empty
  if (figure && !isNaN(figure)) {
    // Check if the number has decimals
    if (Number.isInteger(figure)) {
      // If it's an integer, just round it
      return Math.round(figure);
    } else {
      // If it has decimals, round to three decimal places
      return parseFloat(figure.toFixed(3));
    }
  }
  return 0;
}