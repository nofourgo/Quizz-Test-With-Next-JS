"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function JsonToExcelPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getJsonErrorLocation = (errMessage: string, content: string): string | null => {
    const match = /at position (\d+)/.exec(errMessage)
    if (!match) return null

    const pos = Number(match[1])
    const prefix = content.slice(0, pos)
    const lines = prefix.split("\n")
    const line = lines.length
    const column = lines[lines.length - 1].length + 1
    return `dòng ${line}, cột ${column}`
  }

  const handleConvert = () => {
    setError("");
    setMessage("");

    if (!jsonInput.trim()) {
      setError("Vui lòng nhập dữ liệu JSON");
      return;
    }

    try {
      // clean input (nếu user paste từ markdown)
      let cleanInput = jsonInput
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const jsonData = JSON.parse(cleanInput);

      const workbook = XLSX.utils.book_new();

      // ===== CASE 1: Array =====
      if (Array.isArray(jsonData)) {
        if (jsonData.length === 0) {
          throw new Error("Mảng JSON rỗng");
        }

        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      }

      // ===== CASE 2: Object =====
      else if (typeof jsonData === "object" && jsonData !== null) {
        const keys = Object.keys(jsonData);

        if (keys.length === 0) {
          throw new Error("JSON rỗng");
        }

        // check multi sheet
        const isMultiSheet = keys.every((key) => Array.isArray(jsonData[key]));

        // ===== MULTI SHEET =====
        if (isMultiSheet) {
          keys.forEach((sheetName) => {
            const sheetData = jsonData[sheetName];

            if (sheetData.length === 0) return;

            const worksheet = XLSX.utils.json_to_sheet(sheetData);

            XLSX.utils.book_append_sheet(
              workbook,
              worksheet,
              sheetName.substring(0, 31), // excel limit
            );
          });
        }

        // ===== SINGLE OBJECT =====
        else {
          const worksheet = XLSX.utils.json_to_sheet([jsonData]);

          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        }
      } else {
        throw new Error("JSON phải là object hoặc array");
      }

      XLSX.writeFile(workbook, "converted.xlsx");

      setMessage("Xuất Excel thành công");
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        const location = getJsonErrorLocation(err.message, jsonInput)
        setError(
          `JSON không hợp lệ${location ? ` tại ${location}` : ''}: ${err.message}`,
        )
      } else {
        setError(err?.message || "Lỗi khi convert")
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-4 text-green-700">
          JSON to Excel
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Dán JSON → xuất file XLSX
        </p>

        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste JSON..."
          className="w-full min-h-[250px] rounded-lg border p-3 text-sm mb-4"
        />

        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleConvert}
            className="rounded bg-green-500 px-5 py-2 text-white hover:bg-green-600"
          >
            Xuất Excel
          </button>

          {message && <span className="text-sm text-green-600">{message}</span>}

          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      </div>
    </main>
  );
}
