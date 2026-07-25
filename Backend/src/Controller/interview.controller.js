const { PDFParse } = require('pdf-parse');
const { generateInterviewReport, genrateResumePdf } = require('../services/ai.service');
const interviewReportModel = require('../model/interviewReport.model');


/** 
 * @route POST /api/interview
 * @description Generate an interview report for the candidate in basis of resume, self description and job description
 * @access Private
 */

async function generateInterviewReportController(req, res){
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume PDF is required",
            });
        }

        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required",
            });
        }

        const parser = new PDFParse({ data: req.file.buffer });
        const resumeContent = await parser.getText();
        await parser.destroy();

        const interviewReportByAi = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.userId || req.user._id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...interviewReportByAi,
        });

        return res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport,
        });
    } catch (error) {
        console.error("generateInterviewReportController:", error);

        const status = error?.status === 503 || error?.status === 429 ? error.status : 500;
        const message =
            status === 503
                ? "AI model is busy right now. Please try again in a moment."
                : status === 429
                    ? "AI rate limit reached. Please wait and try again."
                    : "Failed to generate interview report";

        return res.status(status).json({
            message,
            error: error.message,
        });
    }
}

/**
 * @route GET /api/interview/report/:interviewId
 * @description Get an interview report by interview id
 * @access Private
 */

async function getInterviewReportByIdController(req, res){  

    const {interviewId} = req.params;

    const interviewReport = await interviewReportModel.findOne({_id: interviewId, user: req.user.userId || req.user._id});

    if(!interviewReport){
        return res.status(404).json({
            message: "Interview report not found",
        });
    }

    return res.status(200).json({
        message: "Interview report fetched successfully",
        interviewReport,
    });

}

/**
 * @route GET /api/interview/reports
 * @description Get all interview reports
 * @access Private
 */

async function getAllInterviewReportsController(req, res){
    
    const interviewReports = await interviewReportModel.find({user: req.user.userId || req.user._id}).sort({createdAt: -1}).select('-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan');

    return res.status(200).json({
        message: "Interview reports fetched successfully",
        interviewReports
    });
}

/**
 * @description controller to generate a resume PDF based on the resume, self description and job description
 */

async function generateResumePdfController(req, res){
    try {
        const { interviewId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.userId || req.user._id,
        });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found",
            });
        }

        const { resume, selfDescription, jobDescription } = interviewReport;
        const pdfBuffer = await genrateResumePdf({ resume, selfDescription, jobDescription });

        if (!pdfBuffer) {
            return res.status(500).json({
                message: "Failed to generate resume PDF",
            });
        }

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="resume_${interviewId}.pdf"`,
        });

        return res.send(pdfBuffer);
    } catch (error) {
        console.error("generateResumePdfController:", error);

        const status = error?.status === 503 || error?.status === 429 ? error.status : 500;
        return res.status(status).json({
            message: "Failed to generate resume PDF",
            error: error.message,
        });
    }
}


module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
}
