"use client";

import { useState } from "react";

type HistoryItem = {
  date: string;
  tender: string;
  location: string;
  status: "Won" | "Lost" | "Pending";
  amount?: string;
};

// Sample data
const sampleHistory: HistoryItem[] = Array.from({ length: 35 }, (_, i) => ({
  date: `2026-01-${String(35 - i).padStart(2, "0")}`,
  tender: `Tender Project #${i + 1}`,
  location: ["New York", "Los Angeles", "Chicago"][i % 3] + ", USA",
  status: ["Won", "Lost", "Pending"][i % 3] as "Won" | "Lost" | "Pending",
  amount: `$${(i + 1) * 1000}`,
}));

export default function History() {
  const [page, setPage] = useState(1);
  const perPage = 10;

  const totalPages = Math.ceil(sampleHistory.length / perPage);
  const currentItems = sampleHistory.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-(--gray)">
        <thead className="bg-(--primary)">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-(--white)">Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-(--white)">Tender</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-(--white)">Location</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-(--white)">Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-(--white)">Amount</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-(--gray)">
          {currentItems.map((item, idx) => (
            <tr key={idx} className="bg-(--white) hover:bg-(--surface) transition">
              <td className="px-4 py-2 text-sm text-(--text-main)">
                {new Date(item.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-sm text-(--text-main)">{item.tender}</td>
              <td className="px-4 py-2 text-sm text-(--text-muted)">{item.location}</td>
              <td className="px-4 py-2 text-sm">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold
                    ${
                      item.status === "Won"
                        ? "bg-(--success) text-(--white)"
                        : item.status === "Lost"
                        ? "bg-(--danger) text-(--white)"
                        : "bg-(--focus) text-(--white)"
                    }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-2 text-sm text-(--text-main)">{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-(--focus) text-(--white) disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-(--focus) text-(--white) disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <p className="text-sm text-(--text-muted) mt-1">
        Page {page} of {totalPages}
      </p>
    </div>
  );
}
