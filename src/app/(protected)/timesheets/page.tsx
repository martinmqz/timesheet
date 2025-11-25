"use client";

import { useEffect, useState } from "react";
import TimesheetForm from "@/src/components/TimesheetForm"; // import your form

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

  useEffect(() => {
    fetchTimesheets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Your Timesheets</h1>

      {/* 👉 Form to create new timesheet */}
      <div className="mb-8">
        <TimesheetForm onCreated={() => fetchTimesheets()} />
      </div>

      {/* 👉 List of saved timesheets */}
      {loading ? (
        <p className="text-gray-200">Loading timesheets...</p>
      ) : timesheets.length === 0 ? (
        <p className="text-gray-200">No timesheets yet.</p>
      ) : (
        <div className="space-y-6">
          {timesheets.map((sheet) => {
            const totalMinutes = sheet.lineItems.reduce(
              (sum, li) => sum + li.minutes,
              0
            );
            const totalHours = totalMinutes / 60;
            const rate = Number(sheet.rate);
            const totalCost = rate * totalHours;

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

  async function fetchTimesheets() {
    try {
      const res = await fetch("/api/timesheets");
      const data = await res.json();
      setTimesheets(data);
    } catch (err) {
      console.error("Failed to fetch timesheets:", err);
    } finally {
      setLoading(false);
    }
  }
}
