'use client'

import { useState, useEffect, useRef } from 'react'
import * as XLSX from 'xlsx'

interface Question {
  question_content: string
  answer_1: string
  answer_2: string
  answer_3: string
  answer_4: string
  explanation_answer_1: string
  explanation_answer_2: string
  explanation_answer_3: string
  explanation_answer_4: string
  isCorrect: string
}

interface UserState {
  selected: number | null
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [userState, setUserState] = useState<UserState[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes
  const [showUpload, setShowUpload] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!showUpload && !isFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!)
            handleSubmit(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [showUpload, isFinished, timeLeft])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })
      const questionsData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as Question[]

      setQuestions(questionsData)
      setUserState(questionsData.map(() => ({ selected: null })))
      setShowUpload(false)
    }
    reader.readAsArrayBuffer(file)
  }

  const selectOption = (optionIndex: number) => {
    if (isFinished) return
    const newUserState = [...userState]
    newUserState[currentIndex].selected = optionIndex
    setUserState(newUserState)
  }

  const changeQuestion = (step: number) => {
    const newIndex = currentIndex + step
    if (newIndex >= 0 && newIndex < questions.length) {
      setCurrentIndex(newIndex)
    }
  }

  const handleSubmit = (forceSubmit = false) => {
    if (isFinished) return

    if (!forceSubmit && !confirm('Bạn có chắc chắn muốn nộp bài?')) return

    if (timerRef.current) clearInterval(timerRef.current)
    setIsFinished(true)

    const correctCount = userState.reduce((count, state, index) => {
      return state.selected === parseInt(questions[index].isCorrect) ? count + 1 : count
    }, 0)

    const score = ((correctCount / questions.length) * 10).toFixed(2)
    alert(`KẾT QUẢ CUỐI CÙNG:\n- Số câu đúng: ${correctCount}/${questions.length}\n- Điểm số: ${score}`)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (showUpload) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-8">
        <div className="bg-white p-12 rounded-2xl shadow-2xl text-center max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Rikkei Quiz System</h1>
          <p className="text-gray-600 mb-8">Chọn file Excel (.xlsx) để bắt đầu</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx,.xls"
            className="mb-6"
          />
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const currentUserState = userState[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Quiz Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-500 text-white text-xl font-bold text-right p-4 rounded-t-lg">
              Thời gian: {formatTime(timeLeft)}
            </div>

            <div className="bg-white p-8 rounded-b-lg shadow-lg">
              <div className="mb-6">
                <div className="text-lg text-gray-600 mb-2">
                  Câu hỏi {currentIndex + 1} / {questions.length}
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {currentQuestion?.question_content}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-8">
                {[1, 2, 3, 4].map((num) => {
                  const isSelected = currentUserState?.selected === num
                  const isCorrect = isFinished && parseInt(currentQuestion.isCorrect) === num
                  const isWrong = isFinished && isSelected && !isCorrect

                  let buttonClass = 'p-4 border-2 border-gray-200 rounded-lg text-left hover:border-blue-300 transition-colors'
                  if (isFinished) {
                    if (isCorrect) buttonClass += ' bg-green-100 border-green-500 text-green-800'
                    else if (isWrong) buttonClass += ' bg-red-100 border-red-500 text-red-800'
                  } else if (isSelected) {
                    buttonClass += ' border-blue-500 bg-blue-50'
                  }

                  return (
                    <button
                      key={num}
                      onClick={() => selectOption(num)}
                      disabled={isFinished}
                      className={buttonClass}
                    >
                      <strong>{String.fromCharCode(64 + num)}.</strong> {currentQuestion?.[`answer_${num}` as keyof Question]}
                    </button>
                  )
                })}
              </div>

              {isFinished && (
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <strong>Giải thích:</strong>
                  <p className="mt-2 text-gray-700">
                    {currentQuestion?.[`explanation_answer_${currentQuestion.isCorrect}` as keyof Question] || 'Không có giải thích'}
                  </p>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <button
                  onClick={() => changeQuestion(-1)}
                  disabled={currentIndex === 0}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:bg-gray-300"
                >
                  Câu trước
                </button>

                {!isFinished && (
                  <button
                    onClick={() => handleSubmit()}
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Kiểm tra đáp án
                  </button>
                )}

                <button
                  onClick={() => changeQuestion(1)}
                  disabled={currentIndex === questions.length - 1}
                  className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
                >
                  Câu tiếp theo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Danh sách câu hỏi</h3>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((_, index) => {
              let buttonClass = 'w-12 h-12 border border-gray-300 rounded flex items-center justify-center font-semibold hover:border-blue-500'
              if (index === currentIndex) buttonClass += ' bg-blue-500 text-white border-blue-500'
              else if (isFinished) {
                const correct = parseInt(questions[index].isCorrect)
                const selected = userState[index].selected
                if (selected === correct) buttonClass += ' bg-green-500 text-white'
                else if (selected !== null) buttonClass += ' bg-red-500 text-white'
              } else if (userState[index].selected !== null) {
                buttonClass += ' bg-blue-100'
              }

              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={buttonClass}
                >
                  {index + 1}
                </button>
              )
            })}
          </div>

          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              Đúng
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              Sai
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
              Đang chọn
            </div>
          </div>

          <button
            onClick={() => handleSubmit()}
            className="w-full mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Kết thúc bài thi
          </button>
        </div>
      </div>
    </div>
  )
}