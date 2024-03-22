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

export function wholeNumber(figure: any): number {
  // Check if figure is a number and not null/undefined/empty
  if (figure && !isNaN(parseFloat(figure))) {
    // Round the figure to the nearest whole number and return
    return Math.round(parseFloat(figure));
  }
  // If it's not a number, return 0
  return 0;
}