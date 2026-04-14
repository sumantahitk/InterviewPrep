// // const { GoogleGenAI } = require("@google/genai")
// // const { z } = require("zod")
// // const { zodToJsonSchema } = require("zod-to-json-schema")
// // const puppeteer = require("puppeteer")
// import { Client } from "@gradio/client";

// // const ai = new GoogleGenAI({
// //     apiKey: process.env.GEMINI_API_KEY
// // })


// // const interviewReportSchema = z.object({
// //     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
// //     technicalQuestions: z.array(z.object({
// //         question: z.string().describe("The technical question can be asked in the interview"),
// //         intention: z.string().describe("The intention of interviewer behind asking this question"),
// //         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
// //     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
// //     behavioralQuestions: z.array(z.object({
// //         question: z.string().describe("The technical question can be asked in the interview"),
// //         intention: z.string().describe("The intention of interviewer behind asking this question"),
// //         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
// //     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
// //     skillGaps: z.array(z.object({
// //         skill: z.string().describe("The skill which the candidate is lacking"),
// //         severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
// //     })).describe("List of skill gaps in the candidate's profile along with their severity"),
// //     preparationPlan: z.array(z.object({
// //         day: z.number().describe("The day number in the preparation plan, starting from 1"),
// //         focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
// //         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
// //     })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
// //     title: z.string().describe("The title of the job for which the interview report is generated"),
// // })

// function convertToObjects(arr, keys) {
//   const result = [];

//   for (let i = 0; i < arr.length; i += keys.length * 2) {
//     const obj = {};
//     for (let j = 0; j < keys.length; j++) {
//       obj[keys[j]] = arr[i + j * 2 + 1];
//     }
//     result.push(obj);
//   }

//   return result;
// }

// async function generateInterviewReport({ resume, selfDescription, jobDescription }) {


// //   const prompt = `
// // Generate an interview preparation report.

// // Return ONLY valid JSON.

// // Do NOT return field names alone.
// // Do NOT return strings inside arrays.
// // Each array must contain OBJECTS.

// // Correct example format:

// // {
// //   "matchScore": 85,
// //   "technicalQuestions": [
// //     {
// //       "question": "Explain REST API",
// //       "intention": "Check backend knowledge",
// //       "answer": "Explain REST principles, HTTP methods and stateless architecture"
// //     }
// //   ],
// //   "behavioralQuestions": [
// //     {
// //       "question": "Tell me about a challenge you faced",
// //       "intention": "Assess problem solving ability",
// //       "answer": "Explain using STAR method"
// //     }
// //   ],
// //   "skillGaps": [
// //     {
// //       "skill": "System Design",
// //       "severity": "medium"
// //     }
// //   ],
// //   "preparationPlan": [
// //     {
// //       "day": 1,
// //       "focus": "Data Structures",
// //       "tasks": ["Solve array problems","Review time complexity"]
// //     }
// //   ],
// //   "title": "Software Developer Intern Interview Preparation Report"
// // }

// // Candidate Resume:
// // ${resume}

// // Self Description:
// // ${selfDescription}

// // Job Description:
// // ${jobDescription}
// // `;

// // const prompt = `
// // Generate an interview preparation report.

// // Return ONLY valid JSON.

// // Rules:
// // - Do NOT return explanations.
// // - Do NOT return strings inside arrays.
// // - Every array must contain OBJECTS.
// // - Follow the exact JSON structure below.

// // IMPORTANT REQUIREMENTS:
// // 1. Generate EXACTLY 10 technical interview questions.
// // 2. Generate EXACTLY 10 behavioral interview questions.
// // 3. Each question object MUST contain:
// //    - question
// //    - intention
// //    - answer
// // 4. Generate 3–5 skill gaps with severity levels (low | medium | high).
// // 5. Generate a preparation plan for EXACTLY 7 days.
// // 6. Day numbers must start from 1 and go up to 7.
// // 7. Each preparation day must contain at least 3 tasks.

// // Correct JSON format example:

// // {
// //   "matchScore": 85,
// //   "technicalQuestions": [
// //     {
// //       "question": "Explain REST API",
// //       "intention": "Check backend knowledge",
// //       "answer": "Explain REST principles, HTTP methods and stateless architecture"
// //     }
// //   ],
// //   "behavioralQuestions": [
// //     {
// //       "question": "Tell me about a challenge you faced",
// //       "intention": "Assess problem solving ability",
// //       "answer": "Explain using STAR method"
// //     }
// //   ],
// //   "skillGaps": [
// //     {
// //       "skill": "System Design",
// //       "severity": "medium"
// //     }
// //   ],
// //   "preparationPlan": [
// //     {
// //       "day": 1,
// //       "focus": "Data Structures",
// //       "tasks": ["Solve array problems", "Review time complexity", "Practice coding"]
// //     }
// //   ],
// //   "title": "Software Developer Intern Interview Preparation Report"
// // }

// // Candidate Resume:
// // ${resume}

// // Self Description:
// // ${selfDescription}

// // Job Description:
// // ${jobDescription}
// // `;

// // const prompt =`You are an AI system that generates structured interview preparation reports.

// // CRITICAL INSTRUCTIONS:

// // 1. Return ONLY valid JSON.
// // 2. Do NOT add explanations, markdown, or text before/after JSON.
// // 3. Every array MUST contain OBJECTS.
// // 4. Never return strings inside arrays.
// // 5. Follow the EXACT schema provided.
// // 6. If you cannot follow the schema, regenerate internally and return correct JSON.

// // ❌ WRONG FORMAT (DO NOT DO THIS)

// // "technicalQuestions": [
// // "Explain SQL vs NoSQL",
// // "What is EDA"
// // ]

// // ✅ CORRECT FORMAT

// // "technicalQuestions": [
// // {
// // "question": "Explain SQL vs NoSQL",
// // "intention": "Check database knowledge",
// // "answer": "Explain relational vs non-relational databases, their use cases, scalability and examples."
// // }
// // ]

// // ---------------------------------------

// // JSON STRUCTURE YOU MUST FOLLOW:

// // {
// // "matchScore": number (0-100),

// // "technicalQuestions": [
// // {
// // "question": string,
// // "intention": string,
// // "answer": string
// // }
// // ],

// // "behavioralQuestions": [
// // {
// // "question": string,
// // "intention": string,
// // "answer": string
// // }
// // ],

// // "skillGaps": [
// // {
// // "skill": string,
// // "severity": "low" | "medium" | "high"
// // }
// // ],

// // "preparationPlan": [
// // {
// // "day": number,
// // "focus": string,
// // "tasks": [string]
// // }
// // ],

// // "title": string
// // }

// // ---------------------------------------

// // ADDITIONAL REQUIREMENTS:

// // • Generate EXACTLY 10 technical questions.
// // • Generate EXACTLY 10 behavioral questions.
// // • Generate 5 skill gaps with severity levels.
// // • Generate a preparation plan for EXACTLY 7 days.
// // • Each day must contain at least 3 tasks.
// // • Day numbers must start from 1.

// // ---------------------------------------

// // Candidate Resume:
// // ${resume}

// // Self Description:
// // ${selfDescription}

// // Job Description:
// // ${jobDescription}`


// //     const response = await ai.models.generateContent({
// //         // model: "gemini-3-flash-preview",
// //         model: "gemini-2.5-flash",
// //         // model: "gemini-1.5-flash",
// //         contents: prompt,
// //         config: {
// //             responseMimeType: "application/json",
// //             responseSchema: zodToJsonSchema(interviewReportSchema),
// //             temperature: 0
// //         }
// //     })


// //     // console.log(JSON.parse(response.text))
// //     // return JSON.parse(response.text)
// //     const data = JSON.parse(response.text);
// //       console.log(data)


// const client = await Client.connect("http://127.0.0.1:7860");
// const data = await client.predict("/generate_report", {
// 		resume: resume,
// 		self_desc: selfDescription,
// 		job_desc: jobDescription,
// });

// console.log(data)

//       // technicalQuestions
// data.technicalQuestions = convertToObjects(
//   data.technicalQuestions,
//   ["question", "intention", "answer"]
// );

// // behavioralQuestions
// data.behavioralQuestions = convertToObjects(
//   data.behavioralQuestions,
//   ["question", "intention", "answer"]
// );

// // skillGaps
// data.skillGaps = convertToObjects(
//   data.skillGaps,
//   ["skill", "severity"]
// );

// // preparationPlan
// data.preparationPlan = convertToObjects(
//   data.preparationPlan,
//   ["day", "focus", "tasks"]
// );

// return data;
// //     function parseGeminiObject(str) {
// //     if (typeof str !== "string") return str;

// //     const cleaned = str
// //         .replace(/`/g, "")     // remove backticks
// //         .replace(/,$/, "")     // remove trailing comma
// //         .trim();

// //     try {
// //         return JSON.parse(cleaned);
// //     } catch (err) {
// //         console.error("JSON parse failed for:", cleaned);
// //         return null;
// //     }
// // }
// //   const data = JSON.parse(response.text);

// // data.technicalQuestions = data.technicalQuestions.map(parseGeminiObject);
// // data.behavioralQuestions = data.behavioralQuestions.map(parseGeminiObject);
// // data.skillGaps = data.skillGaps.map(parseGeminiObject);
// // data.preparationPlan = data.preparationPlan.map(parseGeminiObject);

// // return data;


// }



// async function generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" })

//     const pdfBuffer = await page.pdf({
//         format: "A4", margin: {
//             top: "20mm",
//             bottom: "20mm",
//             left: "15mm",
//             right: "15mm"
//         }
//     })

//     await browser.close()

//     return pdfBuffer
// }

// async function generateResumePdf({ resume, selfDescription, jobDescription }) {

//     const resumePdfSchema = z.object({
//         html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
//     })

//     const prompt = `Generate resume for a candidate with the following details:
//                         Resume: ${resume}
//                         Self Description: ${selfDescription}
//                         Job Description: ${jobDescription}

//                         the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
//                         The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
//                         The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
//                         you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
//                         The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
//                         The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
//                     `

//     const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         // model: "gemini-2.5-flash",
//         contents: prompt,
//         config: {
//             responseMimeType: "application/json",
//             responseSchema: zodToJsonSchema(resumePdfSchema),
//         }
//     })


//     const jsonContent = JSON.parse(response.text)

//     const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

//     return pdfBuffer

// }

// module.exports =  {generateInterviewReport,generateResumePdf} 










import puppeteer from "puppeteer";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Client } from "@gradio/client";

dotenv.config({ quiet: true });

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ---------------- HELPERS ----------------

function convertToObjects(arr, keys) {
  const result = [];

  for (let i = 0; i < arr.length; i += keys.length * 2) {
    const obj = {};
    for (let j = 0; j < keys.length; j++) {
      obj[keys[j]] = arr[i + j * 2 + 1];
    }
    result.push(obj);
  }

  return result;
}

// ---------------- INTERVIEW REPORT ----------------

export async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    const client = await Client.connect("sumanta795/interviewprep-ai");

    const response = await client.predict("/generate_report", {
      resume: resume,
      self_desc: selfDescription,
      job_desc: jobDescription,
    });

    let data = response.data[0];

    return data;
  } catch (error) {
    console.error("Error generating interview report:", error);
    throw error;
  }
}

// ---------------- PDF GENERATION ----------------

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

// ---------------- RESUME PDF ----------------

export async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    const resumePdfSchema = z.object({
      html: z.string(),
    });

    const prompt = `
Generate resume for a candidate:

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return ONLY JSON:
{
  "html": "<valid HTML resume>"
}

Requirements:
- Professional, clean design
- ATS friendly
- 1–2 pages max
- No AI-sounding text
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(resumePdfSchema),
      },
    });

    const jsonContent = JSON.parse(response.text);

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
  } catch (error) {
    console.error("Error generating resume PDF:", error);
    throw error;
  }
}
