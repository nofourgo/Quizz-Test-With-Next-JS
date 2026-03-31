'use client'

import Link from 'next/link'
import * as XLSX from 'xlsx'

export default function Home() {
  const downloadTemplate = () => {
    const templateData = [
      {
        question_content: '',
        answer_1: '',
        explanation_answer_1: '',
        answer_2: '',
        explanation_answer_2: '',
        answer_3: '',
        explanation_answer_3: '',
        answer_4: '',
        explanation_answer_4: '',
        isCorrect: '',
        difficult: '',
        type: ''
      }
    ]

    const worksheet = XLSX.utils.json_to_sheet(templateData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template')
    XLSX.writeFile(workbook, 'Quiz_Template.xlsx')
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 animate-fade-in">
            Quiz System
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Create, view, and take interactive quizzes with ease. Manage your questions, explore answers, and challenge yourself!
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Link href="/editor" className="block group">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl mb-4">✏️</div>
              <h2 className="text-2xl font-semibold text-blue-600 mb-3 group-hover:text-blue-700">Question Editor</h2>
              <p className="text-gray-600 leading-relaxed">Edit and manage quiz questions with drag-and-drop functionality. Create engaging content effortlessly.</p>
            </div>
          </Link>
          <Link href="/viewer" className="block group">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl mb-4">👁️</div>
              <h2 className="text-2xl font-semibold text-green-600 mb-3 group-hover:text-green-700">Quiz Viewer</h2>
              <p className="text-gray-600 leading-relaxed">View quiz questions and answers from Excel files. Analyze and review your quizzes in detail.</p>
            </div>
          </Link>
          <Link href="/quiz" className="block group">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-2xl font-semibold text-purple-600 mb-3 group-hover:text-purple-700">Take Quiz</h2>
              <p className="text-gray-600 leading-relaxed">Take interactive quizzes with timer and scoring. Test your knowledge and track your progress.</p>
            </div>
          </Link>
        </div>
        <div className="text-center mt-12">
          <button
            onClick={downloadTemplate}
            className="bg-green-500 text-white px-8 py-4 rounded-lg hover:bg-green-600 text-lg font-semibold shadow-lg"
          >
            📥 Tải Template Excel
          </button>
          <p className="text-gray-600 mt-2">Tải form mẫu để bắt đầu tạo câu hỏi quiz</p>
        </div>
        <footer className="text-center mt-16 text-gray-500">
          <p>&copy; 2024 Sexcalibur Quiz System. Built with Next.js and Tailwind CSS.</p>
        </footer>
      </div>
    </main>
  )
}