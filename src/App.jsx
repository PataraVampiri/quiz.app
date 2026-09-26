import { useState } from 'react'
import { categories } from './data/questions.js'
import './App.css'

const LETTERS = ['A', 'B', 'C', 'D']
const totalQuestions = categories.reduce((total, category) => total + category.questions.length, 0)

function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
      title={`Switch to ${dark ? 'light' : 'dark'} theme`}
    >
      <span aria-hidden="true">{dark ? '☀' : '☾'}</span>
      <span className="toggle-track"><span /></span>
    </button>
  )
}

function SiteHeader({ dark, onToggle }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Sports Quiz home">
        <span className="brand-mark">S</span>
          <span>THE <span className="brand-light">QUIZ CLUB</span></span>
      </a>
      <span className="header-note">A little friendly competition</span>
      <ThemeToggle dark={dark} onToggle={onToggle} />
    </header>
  )
}

function Home({ onSelect }) {
  return (
    <main className="screen home" id="home">
      <section className="home-intro">
        <span className="eyebrow"><span className="eyebrow-dot" /> THE ULTIMATE TRIVIA CHALLENGE</span>
        <h1>Ready to play<br />the <span className="accent-text">game?</span></h1>
        <p className="subtitle">
          From movie nights to mind-bending science. Put your knowledge to the test, one question at a time.
        </p>
        <div className="home-stats" aria-label="Quiz details">
          <div><strong>{String(categories.length).padStart(2, '0')}</strong><span>TOPICS</span></div>
          <span className="stat-divider" />
          <div><strong>{String(totalQuestions).padStart(2, '0')}</strong><span>QUESTIONS</span></div>
          <span className="stat-divider" />
          <div><strong>04</strong><span>CHOICES EACH</span></div>
        </div>
        <div className="intro-decoration" aria-hidden="true">✳</div>
      </section>

      <section className="category-section" aria-labelledby="category-heading">
        <div className="section-heading">
          <div>
            <span className="eyebrow">PICK YOUR PLAYGROUND</span>
            <h2 id="category-heading">Choose a category</h2>
          </div>
          <span className="category-total">01 — {String(categories.length).padStart(2, '0')}</span>
        </div>
        <div className="categories">
          {categories.map((category, index) => (
            <button
              key={category.id}
              type="button"
              className={`category-card category-${category.id}`}
              onClick={() => onSelect(category)}
            >
              <span className="category-icon">{category.emoji}</span>
              <span className="category-copy">
                <span className="category-name">{category.name}</span>
                <span className="category-meta">{category.questions.length} questions <span>·</span> ~3 min</span>
              </span>
              <span className="category-arrow" aria-hidden="true">↗</span>
              <span className="card-index">0{index + 1}</span>
            </button>
          ))}
        </div>
        <p className="category-footnote"><span aria-hidden="true">✦</span> Pick a topic. Prove you know it.</p>
      </section>
    </main>
  )
}

function Quiz({ category, onFinish, onExit }) {
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(false)

  const question = category.questions[index]
  const total = category.questions.length

  function handleSubmit() {
    if (picked === null) {
      setError(true)
      return
    }
    setError(false)
    setSubmitted(true)
    if (picked === question.correct) {
      setScore((currentScore) => currentScore + 1)
    }
  }

  function handleNext() {
    if (index + 1 >= total) {
      onFinish(score)
    } else {
      setIndex((currentIndex) => currentIndex + 1)
      setPicked(null)
      setSubmitted(false)
      setError(false)
    }
  }

  return (
    <main className="screen quiz-screen">
      <div className="quiz-topline">
        <button type="button" className="back-btn" onClick={onExit}>
          <span aria-hidden="true">←</span> All sports
        </button>
        <span className="quiz-category"><span>{category.emoji}</span> {category.name}</span>
        <span className="quiz-score"><span aria-hidden="true">✦</span> {score} pts</span>
      </div>

      <div className="quiz-progress" aria-label={`Question ${index + 1} of ${total}`}>
        <div className="quiz-progress-fill" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <div className="quiz-layout">
        <section className="question-panel">
          <p className="question-number">QUESTION <span>{String(index + 1).padStart(2, '0')}</span><i /> {String(total).padStart(2, '0')}</p>
          <h1 className="question-text">{question.question}</h1>
          <p className="question-hint">Choose the best answer from the options.</p>
          <div className="question-progress">
            <span>YOUR PROGRESS</span>
            <strong>{String(index + 1).padStart(2, '0')} <small>/ {String(total).padStart(2, '0')}</small></strong>
          </div>
        </section>

        <section className="answer-panel" aria-label="Answer choices">
          <div className="answers">
            {question.answers.map((answer, answerIndex) => {
              let className = 'answer'
              if (picked === answerIndex) className += ' selected'
              if (submitted && answerIndex === question.correct) className += ' correct'
              if (submitted && answerIndex === picked && answerIndex !== question.correct) className += ' wrong'
              return (
                <button
                  key={answer}
                  type="button"
                  className={className}
                  onClick={() => {
                    if (!submitted) {
                      setPicked(answerIndex)
                      setError(false)
                    }
                  }}
                  disabled={submitted}
                  aria-pressed={picked === answerIndex}
                >
                  <span className="answer-letter">{LETTERS[answerIndex]}</span>
                  <span className="answer-text">{answer}</span>
                  {submitted && answerIndex === question.correct && <span className="answer-indicator" aria-label="Correct answer">✓</span>}
                  {submitted && answerIndex === picked && answerIndex !== question.correct && <span className="answer-indicator" aria-label="Your answer">×</span>}
                </button>
              )
            })}
          </div>

          {submitted && (
            <p className={`feedback ${picked === question.correct ? 'feedback-correct' : 'feedback-wrong'}`} aria-live="polite">
              {picked === question.correct ? 'That’s right. Nice play!' : `Not quite. The answer is ${question.answers[question.correct]}.`}
            </p>
          )}
          {error && <p className="validation-message" role="alert">Please select an answer first.</p>}
          <button
            type="button"
            className="submit-btn"
            onClick={submitted ? handleNext : handleSubmit}
          >
            {submitted ? (index + 1 >= total ? 'See your score' : 'Next question') : 'Submit answer'}
            <span aria-hidden="true">→</span>
          </button>
        </section>
      </div>
      <div className="quiz-bottomline"><span>TAKE YOUR TIME. TRUST YOUR INSTINCTS.</span><span>{String(total - index - 1).padStart(2, '0')} QUESTIONS LEFT</span></div>
    </main>
  )
}

function Result({ category, score, onRestart, onExit }) {
  const total = category.questions.length
  const percent = Math.round((score / total) * 100)

  let title = 'Keep practicing!'
  let message =
    'Don\u2019t worry — every expert was a beginner once. Try again!'
  if (percent >= 80) {
    title = 'Outstanding!'
    message = 'You know this sport inside out. Impressive!'
  } else if (percent >= 50) {
    title = 'Good job!'
    message = 'You have solid knowledge, keep it up!'
  }

  return (
    <main className="screen result-screen">
      <section className="result-intro">
        <span className="eyebrow"><span className="eyebrow-dot" /> QUIZ COMPLETED</span>
        <h1>{title}<br /><span className="accent-text">You showed up.</span></h1>
        <p className="result-message">{message}</p>
      </section>
      <section className="result-card">
        <span className="result-category">{category.emoji} {category.name}</span>
        <div className="result-score">{score}<span>/{total}</span></div>
        <span className="result-label">CORRECT ANSWERS</span>
        <div className="result-meter"><span style={{ width: `${percent}%` }} /></div>
        <p className="result-percent">{percent}% accuracy</p>
        <div className="result-actions">
          <button type="button" className="submit-btn" onClick={onRestart}>Play again <span aria-hidden="true">↻</span></button>
          <button type="button" className="secondary-btn" onClick={onExit}>Choose another sport <span aria-hidden="true">→</span></button>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [screen, setScreen] = useState('home')
  const [category, setCategory] = useState(null)
  const [score, setScore] = useState(0)
  const [dark, setDark] = useState(false)

  function startCategory(category) {
    setCategory(category)
    setScore(0)
    setScreen('quiz')
  }

  function finishQuiz(score) {
    setScore(score)
    setScreen('result')
  }

  return (
    <div className={`app-shell${dark ? ' dark' : ''}`}>
      <SiteHeader dark={dark} onToggle={() => setDark((current) => !current)} />
      {screen === 'quiz' && category ? (
        <Quiz category={category} onFinish={finishQuiz} onExit={() => setScreen('home')} />
      ) : screen === 'result' && category ? (
        <Result
          category={category}
          score={score}
          onRestart={() => startCategory(category)}
          onExit={() => setScreen('home')}
        />
      ) : (
        <Home onSelect={startCategory} />
      )}
      <footer className="site-footer"><span>THE QUIZ CLUB</span><span>MADE FOR THE LOVE OF LEARNING <span aria-hidden="true">✳</span></span></footer>
    </div>
  )
}

export default App