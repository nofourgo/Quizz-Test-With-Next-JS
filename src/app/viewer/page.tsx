'use client'

import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'

interface Question {
  question_content: string
  answer_1: string
  explanation_answer_1: string
  answer_2: string
  explanation_answer_2: string
  answer_3: string
  explanation_answer_3: string
  answer_4: string
  explanation_answer_4: string
  isCorrect: string
  difficulty?: string
}

export default function Viewer() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError('')
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const rows = XLSX.utils.sheet_to_json(worksheet) as Question[]

        if (rows.length === 0) {
          throw new Error('File Excel trống hoặc không đúng định dạng.')
        }

        setQuestions(rows)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi không xác định')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Trình đọc file trắc nghiệm
        </h1>

        <div className="text-center mb-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="mb-4"
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Lỗi: {error}
          </div>
        )}

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="border border-gray-200 p-6 rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Câu {index + 1}: {question.question_content || 'Nội dung trống'}
              </h2>

              <div className="space-y-2">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={`p-3 rounded border-l-4 ${
                      parseInt(question.isCorrect) === num
                        ? 'border-l-green-500 bg-green-50'
                        : 'border-l-gray-300'
                    }`}
                  >
                    <strong>{String.fromCharCode(64 + num)}:</strong> {question[`answer_${num}` as keyof Question] || ''}
                    <br />
                    <small className="text-gray-600 italic">
                      {question[`explanation_answer_${num}` as keyof Question] || ''}
                    </small>
                  </div>
                ))}
              </div>

              {question.difficulty && (
                <div className="mt-4 text-blue-600">
                  Độ khó: {question.difficulty}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}