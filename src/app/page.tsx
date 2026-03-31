import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Sexcalibur Quiz System
        </h1>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/editor" className="block">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold text-blue-600 mb-2">Question Editor</h2>
              <p className="text-gray-600">Edit and manage quiz questions with drag-and-drop functionality</p>
            </div>
          </Link>
          <Link href="/viewer" className="block">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold text-green-600 mb-2">Quiz Viewer</h2>
              <p className="text-gray-600">View quiz questions and answers from Excel files</p>
            </div>
          </Link>
          <Link href="/quiz" className="block">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold text-purple-600 mb-2">Take Quiz</h2>
              <p className="text-gray-600">Take interactive quizzes with timer and scoring</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}