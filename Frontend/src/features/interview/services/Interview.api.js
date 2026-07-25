import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
});

/**
 * @route POST /api/interview
 * @description Generate an interview report for the candidate in basis of resume, self description and job description
 * @access Private
 */

export const generateInterviewReport = async ({jobDescription, selfDescription, resumeFile}) => {
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    formData.append('selfDescription', selfDescription);
    formData.append('resume', resumeFile);

    const response = await api.post('/api/interview', formData , {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

    return response.data;

}

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get an interview report by interview id
 * @access Private
 */

export const getInterviewReportById = async ({interviewId}) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);

    return response.data;
}

/**
 * @route GET /api/interview/reports
 * @description Get all interview reports
 * @access Private
 */

export const getAllInterviewReports = async () => {
    const response = await api.get('/api/interview');

    return response.data;
}

/**
 * @route POST /api/interview/resume/pdf/:interviewId
 * @description Generate a resume PDF by interview id
 * @access Private
 */

export const getResumePdfById = async ({interviewId}) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewId}`, null, {
        responseType: 'blob'
    });
    return response.data;
}