import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview';
import { SpinnerDiamond } from 'spinners-react';

const NAV_ITEMS = [
  {
    id: 'technical',
    label: 'Technical Questions',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.2 5.5 10.8 18.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'behavioral',
    label: 'Behavioral Questions',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5 17.5V8.2A2.2 2.2 0 0 1 7.2 6h9.6A2.2 2.2 0 0 1 19 8.2v5.1A2.2 2.2 0 0 1 16.8 15.5H10l-5 3v-1z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: 'roadmap',
    label: 'Road Map',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M8 5v14M16 5v14M4 8.5h5.5L12 12l2.5-3.5H20M4 15.5h5.5L12 12l2.5 3.5H20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

const matchLabel = (score) => {
  if (score >= 80) return 'Strong match for this role'
  if (score >= 60) return 'Good match with some gaps'
  return 'Needs focused preparation'
}

const MatchRing = ({ score }) => {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="match-ring" style={{ '--progress': `${score}%` }}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ring-track" cx="50" cy="50" r={radius} />
        <circle
          className="ring-value"
          cx="50"
          cy="50"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-label">
        <strong>{score}</strong>
        <span>%</span>
      </div>
    </div>
  )
}

const QuestionAccordion = ({ questions }) => {
  const [openIndexes, setOpenIndexes] = useState(() => new Set([0]))

  const toggleQuestion = (index) => {
    setOpenIndexes((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="accordion">
      {questions.map((item, index) => {
        const isOpen = openIndexes.has(index)
        return (
          <article
            key={item.question}
            className={`accordion-item${isOpen ? ' open' : ''}`}
          >
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={isOpen}
              onClick={() => toggleQuestion(index)}
            >
              <span className="q-badge">Q{index + 1}</span>
              <span className="q-title">{item.question}</span>
              <span className="q-chevron" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M6 9l6 6 6-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="accordion-body">
                <div className="detail-block">
                  <span className="detail-badge intention">Intention</span>
                  <p>{item.intention}</p>
                </div>
                <div className="detail-block">
                  <span className="detail-badge answer">Model Answer</span>
                  <p>{item.answer}</p>
                </div>
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

const Interview = () => {
  const [activeSection, setActiveSection] = useState('technical')
  const [downloading, setDownloading] = useState(false)
  const { report, loading, getResumePdf } = useInterview();
  const { interviewId } = useParams();
  const navigate = useNavigate();

  if (loading) {
    return <main className="loading-container"><SpinnerDiamond size={70} color="#1781c3" secondaryColor="#ffffff" speed={100} /></main>;
  }

  if (!report) {
    return <div>No report found</div>
  }

  const questions =
    activeSection === 'technical'
      ? report.technicalQuestions
      : activeSection === 'behavioral'
        ? report.behavioralQuestions
        : []

  const sectionTitle =
    activeSection === 'technical'
      ? 'Technical Questions'
      : activeSection === 'behavioral'
        ? 'Behavioral Questions'
        : 'Road Map'

  const handleDownloadResume = async () => {
    const id = interviewId || report._id;
    if (!id) {
      toast.error('Interview id not found');
      return;
    }

    setDownloading(true);
    try {
      await getResumePdf({ interviewId: id });
      toast.success('Resume downloaded');
    } catch (error) {
      toast.error(error.message || 'Failed to download resume');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="interview">
      <div className="interview-shell">
        <aside className="interview-nav">
          <button
            type="button"
            className="home-button"
            onClick={() => navigate('/')}
          >
            <span className="home-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M15 18l-6-6 6-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Home
          </button>
          <p className="sidebar-label">Sections</p>
          <nav>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => setActiveSection(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="download-resume-button"
            onClick={handleDownloadResume}
            disabled={downloading}
          >
            <span className="download-icon" aria-hidden="true">
              <i className="ri-bard-fill"></i>
            </span>
            <span className="download-text">
              {downloading ? 'Preparing...' : 'Download Resume'}
            </span>
          </button>
        </aside>

        <section className="interview-main">
          <div className="main-heading">
            <h1>{sectionTitle}</h1>
            {activeSection !== 'roadmap' && (
              <span className="count-pill">{questions.length} questions</span>
            )}
            {activeSection === 'roadmap' && (
              <span className="count-pill">
                {report.preparationPlan.length} days
              </span>
            )}
          </div>

          {activeSection === 'roadmap' ? (
            <div className="roadmap">
              <ol className="roadmap-list">
                {report.preparationPlan.map((day) => (
                  <li key={day.day} className="roadmap-day">
                    <span className="timeline-node" aria-hidden="true" />
                    <div className="day-content">
                      <div className="day-heading">
                        <span className="day-badge">Day {day.day}</span>
                        <h3>{day.focus}</h3>
                      </div>
                      <ul>
                        {day.tasks.map((task) => (
                          <li key={task}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <QuestionAccordion key={activeSection} questions={questions} />
          )}
        </section>

        <aside className="interview-side">
          <div className="side-block">
            <p className="sidebar-label">Match Score</p>
            <MatchRing score={report.matchScore} />
            <p className="match-copy">{matchLabel(report.matchScore)}</p>
          </div>

          <div className="side-block">
            <p className="sidebar-label">Skill Gaps</p>
            <div className="skill-tags">
              {report.skillGaps.map((gap) => (
                <span
                  key={gap.skill}
                  className={`skill-tag severity-${gap.severity}`}
                  title={`${gap.severity} priority`}
                >
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Interview
