"use client";

import { useCallback, useEffect, useState } from "react";
import TimesheetForm from "@/src/components/TimesheetForm"; // import your form
import { calculateTotals } from "@/src/utils/timesheet";

interface LineItem {
  id: number;
  date: string;
  minutes: number;
  description: string;
}

interface Timesheet {
  id: number;
  userId: string;
  rate: number;
  createdAt: string;
  lineItems: LineItem[];
}

export default function TimesheetsPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTimesheets = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/timesheets");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setTimesheets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Your Timesheets</h1>

      {/* 👉 Form to create new timesheet */}
      <div className="mb-8">
        <TimesheetForm onCreated={() => fetchTimesheets()} />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded text-red-100">
          Error: {error}
        </div>
      )}
      {/* 👉 List of saved timesheets */}
      {loading ? (
        <p className="text-gray-200">Loading timesheets...</p>
      ) : timesheets.length === 0 ? (
        <p className="text-gray-200">No timesheets yet.</p>
      ) : (
        <div className="space-y-6">
          {timesheets.map((sheet) => {
            const { totalMinutes, totalHours, totalCost } = calculateTotals(
              sheet.lineItems,
              sheet.rate
            );

            const rate = Number(sheet.rate);

            return (
              <div
                key={sheet.id}
                className="bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">
                    Timesheet #{sheet.id} —{" "}
                    {new Date(sheet.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-300 mb-2">
                  Rate: ${rate.toFixed(2)} / hr
                </p>
                <p className="text-gray-300 mb-2">
                  Total Time: {totalMinutes} minutes ({totalHours.toFixed(2)}{" "}
                  hours)
                </p>
                <p className="text-gray-300 mb-4">
                  Total Cost: ${totalCost.toFixed(2)}
                </p>

                <ul className="space-y-1 text-gray-200">
                  {sheet.lineItems.map((li) => (
                    <li key={li.id} className="flex justify-between text-sm">
                      <span>
                        {new Date(li.date).toLocaleDateString()} —{" "}
                        {li.description}
                      </span>
                      <span>{li.minutes} min</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
