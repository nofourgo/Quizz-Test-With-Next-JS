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
}

export default function Editor() {
  const [questions, setQuestions] = useState<Question[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as Question[]
      setQuestions(jsonData)
    }
    reader.readAsArrayBuffer(file)
  }

  const updateQuestion = (index: number, field: keyof Question, value: string) => {
    const newQuestions = [...questions]
    newQuestions[index][field] = value
    setQuestions(newQuestions)
  }

  const deleteQuestion = (index: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      setQuestions(questions.filter((_, i) => i !== index))
    }
  }

  const addNewQuestion = () => {
    const newQuestion: Question = {
      question_content: '',
      answer_1: '',
      explanation_answer_1: '',
      answer_2: '',
      explanation_answer_2: '',
      answer_3: '',
      explanation_answer_3: '',
      answer_4: '',
      explanation_answer_4: '',
      isCorrect: ''
    }
    setQuestions([...questions, newQuestion])
  }

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(questions)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Questions')
    XLSX.writeFile(workbook, 'Updated_Questions.xlsx')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Chỉnh sửa File Excel - Tự động cập nhật Đáp Án
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="mb-4"
          />
          <button
            onClick={downloadExcel}
            disabled={questions.length === 0}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Lưu và Tải xuống file Excel
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Câu hỏi {index + 1}</h2>
                <button
                  onClick={() => deleteQuestion(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Xóa
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung câu hỏi
                </label>
                <textarea
                  value={question.question_content}
                  onChange={(e) => updateQuestion(index, 'question_content', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Lựa chọn {num}
                    </label>
                    <textarea
                      value={question[`answer_${num}` as keyof Question] as string}
                      onChange={(e) => updateQuestion(index, `answer_${num}` as keyof Question, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={2}
                    />
                    <label className="block text-sm font-medium text-gray-700">
                      Giải thích {num}
                    </label>
                    <textarea
                      value={question[`explanation_answer_${num}` as keyof Question] as string}
                      onChange={(e) => updateQuestion(index, `explanation_answer_${num}` as keyof Question, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={2}
                    />
                  </div>
                ))}
              </div>

              <div className="bg-green-50 p-4 rounded-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đáp án đúng (1-4)
                </label>
                <input
                  type="text"
                  value={question.isCorrect}
                  onChange={(e) => updateQuestion(index, 'isCorrect', e.target.value)}
                  className="w-20 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={addNewQuestion}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            + Thêm câu hỏi mới
          </button>
        </div>
      </div>
    </div>
  )
}