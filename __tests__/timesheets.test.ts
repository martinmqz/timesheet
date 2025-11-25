import { describe, expect, it } from 'vitest'
import { calculateTotals } from "../utils/timesheet";

describe("calculateTotals", () => {
  it("calculates totals correctly for one line item", () => {
    const lineItems = [{ minutes: 120 }];
    const rate = 50; // $50/hr

    const { totalMinutes, totalHours, totalCost } = calculateTotals(lineItems, rate);

    expect(totalMinutes).toBe(120);
    expect(totalHours).toBe(2);
    expect(totalCost).toBe(100);
  });

  it("sums multiple line items", () => {
    const lineItems = [{ minutes: 30 }, { minutes: 45 }, { minutes: 15 }];
    const rate = 20;

    const { totalMinutes, totalHours, totalCost } = calculateTotals(lineItems, rate);

    expect(totalMinutes).toBe(90);
    expect(totalHours).toBe(1.5);
    expect(totalCost).toBe(30);
  });

  it("handles empty line items", () => {
    const lineItems: any[] = [];
    const rate = 40;

    const { totalMinutes, totalHours, totalCost } = calculateTotals(lineItems, rate);

    expect(totalMinutes).toBe(0);
    expect(totalHours).toBe(0);
    expect(totalCost).toBe(0);
  });

  it("handles fractional hours correctly", () => {
    const lineItems = [{ minutes: 75 }]; // 1.25 hours
    const rate = 80;

    const { totalMinutes, totalHours, totalCost } = calculateTotals(lineItems, rate);

    expect(totalMinutes).toBe(75);
    expect(totalHours).toBeCloseTo(1.25);
    expect(totalCost).toBeCloseTo(100);
  });
});