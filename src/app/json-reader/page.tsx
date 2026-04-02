'use client'

import React, { useState } from 'react'
import * as XLSX from 'xlsx'

export default function JsonReaderPage() {
  const [jsonData, setJsonData] = useState<any[] | null>(null)
  const [error, setError] = useState<string>('')

  const [copySuccess, setCopySuccess] = useState<string>('')

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setError('Chưa chọn file. Vui lòng chọn file .xlsx hoặc .xls.')
      setJsonData(null)
      return
    }

    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      setError('Chỉ hỗ trợ file .xlsx hoặc .xls')
      setJsonData(null)
      return
    }

    try {
      setError('')
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })

      if (!workbook.SheetNames.length) {
        throw new Error('File Excel không chứa sheet nào.')
      }

      const parsed = workbook.SheetNames.flatMap((sheetName) => {
        const sheet = workbook.Sheets[sheetName]
        return XLSX.utils.sheet_to_json(sheet, { defval: null })
      })

      setJsonData(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi đọc file Excel')
      setJsonData(null)
    }
  }

  const handleCopyJson = async () => {
    if (!jsonData) return

    try {
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
      setCopySuccess('Đã copy JSON thành công!')
      setTimeout(() => setCopySuccess(''), 2500)
    } catch (err) {
      setCopySuccess('Copy thất bại. Vui lòng thử lại.')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-8">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-3 text-blue-700">Excel to JSON</h1>
        <p className="text-center text-gray-600 mb-6">Chỉ cần chọn file Excel, trang trả lại dữ liệu JSON.</p>

        <div className="text-center mb-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="mx-auto block rounded-md border border-gray-300 bg-white p-2"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Lỗi: {error}
          </div>
        )}

        {jsonData && (
          <>
            <div className="flex justify-end mb-2">
              <button
                onClick={handleCopyJson}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Copy JSON
              </button>
            </div>

            {copySuccess && (
              <p className="text-sm text-green-700 mb-2">{copySuccess}</p>
            )}

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[60vh] overflow-auto">
              <pre className="whitespace-pre-wrap break-words text-xs sm:text-sm text-gray-800">{JSON.stringify(jsonData, null, 2)}</pre>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
