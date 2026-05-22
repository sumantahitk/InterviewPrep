const pdfParse = require("pdf-parse")
const  {generateInterviewReport,generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")




/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}



async function generateInterViewReportControllerUpdate(req, res) {

    const resumeContent = await (
        new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))
    ).getText()

    const { selfDescription, jobDescription } = req.body

    // -----------------------------
    // Input Size Validation
    // -----------------------------
    const MAX_RESUME_CHARS = 6000
    const MAX_SELF_DESC_CHARS = 1000
    const MAX_JOB_DESC_CHARS = 5000

    if (resumeContent.text.length > MAX_RESUME_CHARS) {
        return res.status(400).json({
            message: "Resume content is too large. Please upload a shorter resume."
        })
    }

    if (!selfDescription || selfDescription.trim().length === 0) {
        return res.status(400).json({
            message: "Self description is required."
        })
    }

    if (selfDescription.length > MAX_SELF_DESC_CHARS) {
        return res.status(400).json({
            message: "Self description is too long."
        })
    }

    if (!jobDescription || jobDescription.trim().length === 0) {
        return res.status(400).json({
            message: "Job description is required."
        })
    }

    if (jobDescription.length > MAX_JOB_DESC_CHARS) {
        return res.status(400).json({
            message: "Job description is too long."
        })
    }

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
}


/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }