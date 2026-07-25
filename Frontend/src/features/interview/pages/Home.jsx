import React, { useState, useRef, useEffect } from 'react'
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { SpinnerDiamond } from 'spinners-react';

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const Home = () => {
  const { generateReport, getReports, getReportById, loading, reports } = useInterview();
  const navigate = useNavigate();
  const [jobDescription, setJobDescription] = useState('');
  const [selfDescription, setSelfDescription] = useState('');
  const [historyLoading, setHistoryLoading] = useState(true);
  const [openingId, setOpeningId] = useState(null);
  const resumeInputRef = useRef();

  useEffect(() => {
    const loadHistory = async () => {
      setHistoryLoading(true);
      await getReports();
      setHistoryLoading(false);
    };
    loadHistory();
  }, []);

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];

    if (!resumeFile) {
      toast.error('Please upload a resume PDF');
      return;
    }
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile });
      if (!data?._id) {
        toast.error('Failed to generate interview report');
        return;
      }
      navigate(`/interview/${data._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to generate interview report');
    }
  };

  const handleOpenReport = async (interviewId) => {
    setOpeningId(interviewId);
    try {
      const data = await getReportById({ interviewId });
      if (!data?._id) {
        toast.error('Failed to open interview report');
        return;
      }
      navigate(`/interview/${data._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to open interview report');
    } finally {
      setOpeningId(null);
    }
  };

  if (loading && !openingId) {
    return (
      <main className="loading-container">
        <SpinnerDiamond size={70} color="#1781c3" secondaryColor="#ffffff" speed={100} />
      </main>
    );
  }

  return (
    <main className="home">
      <header className="home-header">
        <h1>Interview Prep</h1>
        <p>Upload your resume and job details to generate a tailored interview report.</p>
      </header>

      <aside className="history">
        <div className="history-header">
          <h2>Chat History</h2>
          <span>{reports?.length || 0}</span>
        </div>

        <div className="history-list">
          {historyLoading ? (
            <p className="history-empty">Loading history...</p>
          ) : !reports?.length ? (
            <p className="history-empty">No reports yet. Generate one to get started.</p>
          ) : (
            reports.map((item) => (
              <button
                key={item._id}
                type="button"
                className={`history-item${openingId === item._id ? ' loading' : ''}`}
                onClick={() => handleOpenReport(item._id)}
                disabled={Boolean(openingId)}
              >
                <span className="history-name">{item.jobTitle || 'Untitled interview'}</span>
                <span className="history-meta">
                  {item.matchScore != null && <em>{item.matchScore}% match</em>}
                  <time dateTime={item.createdAt}>{formatDate(item.createdAt)}</time>
                </span>
              </button>
            ))
          )}
        </div>
      </aside>

      <div className="left">
        <textarea
          onChange={(e) => setJobDescription(e.target.value)}
          name="jobDescription"
          id="jobDescription"
          placeholder="Enter your job description here"
        ></textarea>
      </div>

      <div className="right">
        <div className="input-group">
          <label htmlFor="resume">Upload your resume</label>
          <input ref={resumeInputRef} type="file" id="resume" name="resume" accept=".pdf" />
        </div>
        <div className="input-group">
          <label htmlFor="selfDescription">Enter your self description</label>
          <textarea
            onChange={(e) => setSelfDescription(e.target.value)}
            name="selfDescription"
            id="selfDescription"
            placeholder="Enter your self description here"
          ></textarea>
        </div>
        <button onClick={handleGenerateReport} type="submit">
          Generate Interview Report
        </button>
      </div>
    </main>
  );
};

export default Home;
