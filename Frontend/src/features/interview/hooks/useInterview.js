import {getAllInterviewReports , getInterviewReportById , generateInterviewReport , getResumePdfById} from '../services/Interview.api';
import {useContext , useEffect} from 'react';
import { InterviewContext } from '../interview.context';
import { useParams } from 'react-router';


export const useInterview = () => {

   const context = useContext(InterviewContext);
   const {interviewId} = useParams();

   if(!context){
    throw new Error('useInterview must be used within an InterviewProvider');
   }

   const {loading, report, setLoading, setReport, reports, setReports} = context;

   const generateReport = async ({jobDescription, selfDescription, resumeFile}) => {
    setLoading(true);
    try {
        const response = await generateInterviewReport({jobDescription, selfDescription, resumeFile});
        setReport(response.interviewReport);
        return response.interviewReport;
    } catch (error) {
        console.error(error);
        const message =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to generate interview report';
        throw new Error(message);
    } finally {
        setLoading(false);
    }
   }

   const getReportById = async ({interviewId}) => {
    setLoading(true);
    try {
        const response = await getInterviewReportById({interviewId});
        setReport(response.interviewReport);
        return response.interviewReport;
    } catch (error) {
        console.error(error);
        return null;
    } finally {
        setLoading(false);
    }
   }

  const getReports = async () => {
    try {
        const response = await getAllInterviewReports();
        setReports(response.interviewReports);
        return response.interviewReports;
    } catch (error) {
        console.error(error);
        return null;
    }
   }

   useEffect(() => {
    if(interviewId){
        getReportById({interviewId});
    }
   }, [interviewId]);

   const getResumePdf = async ({interviewId}) => {
    try {
        const response = await getResumePdfById({interviewId});
        const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `resume_${interviewId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return true;
    } catch (error) {
        console.error(error);
        const message =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to download optimized resume';
        throw new Error(message);
    }
   }


   return {
    getResumePdf,
    generateReport,
    getReportById,
    getReports,
    loading,
    report,
    reports,
   }

}