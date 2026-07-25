const { GoogleGenAI } = require("@google/genai");
const z = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
});

const MODEL_CANDIDATES = [
    "gemini-3-flash-preview",
    "gemini-3.5-flash",
];

const interviewReportSchema = z.object({
    matchScore: z.number().describe("a score between 0 to 100 based on the resume and job description"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer to ask the question"),
        answer: z.string().describe("how to answer the question , points to be covered in the answer , approach to be followed"),
    })).min(5).describe("Exactly 5-8 technical interview questions with intention and answer"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer to ask the question"),
        answer: z.string().describe("how to answer the question , points to be covered in the answer , approach to be followed"),
    })).min(3).describe("Exactly 3-5 behavioral interview questions with intention and answer"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill gap can be asked in the interview"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap"),
    })).min(3).describe("At least 5 skill gaps relative to the job description"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan , starting from 1"),
        focus: z.string().describe("The focus of the day in the preparation plan , eg data structures and algorithms , web development , etc"),
        tasks: z.array(z.string().describe("List of tasks to be completed in the day")).min(2),
    })).min(5).describe("A day-wise preparation plan with at least 7 days for the candidate"),

    jobTitle: z.string().describe("The job title for which the interview report is being generated"),
});

const interviewReportJsonSchema = z.toJSONSchema(interviewReportSchema);

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error) {
    const status = error?.status || error?.code;
    const message = String(error?.message || "");
    return (
        status === 503 ||
        status === 429 ||
        message.includes("UNAVAILABLE") ||
        message.includes("high demand") ||
        message.includes("RESOURCE_EXHAUSTED")
    );
}

async function generateWithModel(model, prompt) {
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: interviewReportJsonSchema,
        },
    });

    return JSON.parse(response.text);
}

async function genrateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate a complete interview preparation report.
Requirements:
- matchScore: 0-100 based on resume vs job description fit
- technicalQuestions: 5 to 8 questions tailored to the resume and job
- behavioralQuestions: 3 to 5 questions
- skillGaps: at least 3 gaps with severity in order of priority
- preparationPlan: at least 5 days, each with focus and 2+ concrete tasks
- jobTitle: inferred role title from the job description

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

    let lastError;

    for (const model of MODEL_CANDIDATES) {
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                return await generateWithModel(model, prompt);
            } catch (error) {
                lastError = error;
                console.error(`AI generate failed [${model}] attempt ${attempt}:`, error?.message || error);

                if (!isRetryableError(error) || attempt === 2) {
                    break;
                }

                await sleep(800 * attempt);
            }
        }
    }

    throw lastError;
}

async function generatePdffromHtml({jsonContent}) {
  
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(jsonContent , {waitUntil: "domcontentloaded"});

    const pdfBuffer = await page.pdf({format: "A4" ,
         margin: {top: "10px", right: "10px", bottom: "10px", left: "10px"}});

    await browser.close();
    return pdfBuffer;
}


async  function genrateResumePdf({resume, selfDescription, jobDescription}) {   
    
    const resumePdfSchema = z.object({
        resumehtml: z.string().describe("The HTML code of the resume whihc can be used to generate the PDF using puppeteer"),
    })

    const prompt = `Generate a resume HTML code based on the following information:
    Resume: ${resume}
    Self Description: ${selfDescription}
    Job Description: ${jobDescription}

    Return only the HTML code of the resume, no other text or comments.
    the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(resumePdfSchema),
        },
    });

    const jsonContent = JSON.parse(response.text);

    const pdfBuffer = await generatePdffromHtml({jsonContent: jsonContent.resumehtml});
    return pdfBuffer;
}

module.exports = { genrateInterviewReport, genrateResumePdf };
