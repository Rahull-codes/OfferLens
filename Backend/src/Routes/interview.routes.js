const express = require('express');
const authMiddleware = require('../Middlewares/auth.middleware');
const interviewController = require('../Controller/interview.controller');
const upload = require('../Middlewares/file.middleware');

const interviewRouter = express.Router();


/**
 * @route POST /api/interview
 * @description Generate an interview report for the candidate in basis of resume, self description and job description
 * @access Private
 */
interviewRouter.post('/',authMiddleware.Authuser,upload.single('resume'), interviewController.generateInterviewReportController);


/**
 * @route GET /api/interview/report/:interviewId
 * @description Get an interview report by interview id
 * @access Private
 */
interviewRouter.get('/report/:interviewId',authMiddleware.Authuser, interviewController.getInterviewReportByIdController);


/**
 * @route GET /api/interview/reports
 * @description Get all interview reports
 * @access Private
 */
interviewRouter.get('/',authMiddleware.Authuser, interviewController.getAllInterviewReportsController);


/**
 * @route POST /api/interview/resumepdf/:interviewId
 * @description Generate a resume PDF based on the resume, self description and job description
 * @access Private
 */
interviewRouter.post('/resume/pdf/:interviewId',authMiddleware.Authuser, interviewController.generateResumePdfController);

module.exports = interviewRouter;