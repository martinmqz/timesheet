
export interface LineItem {
  minutes: number;
}

export function calculateTotals(lineItems: LineItem[], rate: number) {
  const totalMinutes = lineItems.reduce((sum, li) => sum + li.minutes, 0);
  const totalHours = totalMinutes / 60;
  const totalCost = rate * totalHours;

  return { totalMinutes, totalHours, totalCost };
}