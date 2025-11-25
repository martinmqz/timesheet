"use client";

import { useState } from "react";

interface LineItemFormData {
  date: string;
  minutes: string;
  description: string;
}

interface LineItem {
  id?: number;
  date: string;
  minutes: number;
  description: string;
}

interface Timesheet {
  id: number;
  userId: string;
  rate: number;
  createdAt: Date;
  lineItems: LineItem[];
}

export default function TimesheetForm({
  onCreated,
}: {
  onCreated?: (sheet: Timesheet) => void;
}) {
  const [rate, setRate] = useState("");
  const [lineItems, setLineItems] = useState<LineItemFormData[]>([
    { date: "", minutes: "", description: "" },
  ]);
  const [loading, setLoading] = useState(false);

  function handleLineItemChange(
    index: number,
    field: keyof LineItemFormData,
    value: string
  ) {
    const copy = [...lineItems];
    copy[index][field] = value;
    setLineItems(copy);
  }

  function addLineItem() {
    setLineItems([...lineItems, { date: "", minutes: "", description: "" }]);
  }

  function removeLineItem(index: number) {
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/timesheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rate: Number(rate),
          lineItems: lineItems.map((li) => ({
            date: new Date(li.date),
            minutes: Number(li.minutes),
            description: li.description,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && onCreated) {
        onCreated(data);
        setRate("");
        setLineItems([{ date: "", minutes: "", description: "" }]);
      }
    } catch (err) {
      console.error("Failed to create timesheet:", err);
    } finally {
      setLoading(false);
    }
  }

  // ✅ Grand totals calculation
  const totalMinutes = lineItems.reduce(
    (sum, li) => sum + (Number(li.minutes) || 0),
    0
  );
  const totalHours = totalMinutes / 60;
  const totalCost = totalHours * (Number(rate) || 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rate input */}
      <div>
        <label
          htmlFor="rate"
          className="block text-sm font-medium text-gray-200"
        >
          Rate ($/hr)
        </label>
        <input
          id="rate"
          type="number"
          step="0.01"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          className="mt-1 w-full rounded-md bg-gray-900 border border-gray-700 text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      {/* Line items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-100">Line Items</h3>
        {lineItems.map((li, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <input
              id={`date-${idx}`}
              type="date"
              value={li.date}
              onChange={(e) => handleLineItemChange(idx, "date", e.target.value)}
              className="rounded-md bg-gray-900 border border-gray-700 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              id={`minutes-${idx}`}
              type="number"
              value={li.minutes}
              onChange={(e) =>
                handleLineItemChange(idx, "minutes", e.target.value)
              }
              placeholder="Minutes"
              className="rounded-md bg-gray-900 border border-gray-700 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              required
            />
            <div className="flex gap-2">
              <input
                id={`description-${idx}`}
                type="text"
                value={li.description}
                onChange={(e) =>
                  handleLineItemChange(idx, "description", e.target.value)
                }
                placeholder="Description"
                className="flex-1 rounded-md bg-gray-900 border border-gray-700 text-gray-100 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                required
              />
              {lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLineItem(idx)}
                  className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addLineItem}
          className="px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600"
        >
          + Add Line Item
        </button>
      </div>

      {/* ✅ Grand Totals */}
      <div className="bg-gray-800 p-4 rounded-md text-gray-100">
        <p data-testid="total-time">
          Total Time: {totalMinutes} minutes ({totalHours.toFixed(2)} hours)
        </p>
        <p data-testid="total-cost">Total Cost: ${totalCost.toFixed(2)}</p>
      </div>

      {/* Submit button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Timesheet"}
        </button>
      </div>
    </form>
  );
}