import gradio as gr
import json
from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from typing import List, Literal
from dotenv import load_dotenv

load_dotenv()

# -----------------------------
# 1. Schema
# -----------------------------

class TechnicalQuestion(BaseModel):
    question: str = Field(description="Technical interview question")
    intention: str = Field(description="Purpose of asking the question")
    answer: str = Field(description="Expected answer")


class BehavioralQuestion(BaseModel):
    question: str = Field(description="Behavioral interview question")
    intention: str = Field(description="Evaluation purpose")
    answer: str = Field(description="Suggested response")


class SkillGap(BaseModel):
    skill: str = Field(description="Skill gap")
    severity: Literal["low", "medium", "high"]


class PreparationPlan(BaseModel):
    day: int = Field(description="Day number")
    focus: str = Field(description="Focus area")
    tasks: List[str]


class InterviewReport(BaseModel):
    matchScore: int
    technicalQuestions: List[TechnicalQuestion]
    behavioralQuestions: List[BehavioralQuestion]
    skillGaps: List[SkillGap]
    preparationPlan: List[PreparationPlan]
    title: str


# -----------------------------
# 2. Prompt
# -----------------------------

prompt_template = PromptTemplate(
    template="""
You are an AI system that generates structured interview preparation reports.

CRITICAL INSTRUCTIONS:
1. Return ONLY valid JSON.
2. Follow the schema strictly.

---------------------------------------

ADDITIONAL REQUIREMENTS:

• Generate EXACTLY 10 technical questions.
• Generate EXACTLY 10 behavioral questions.
• Generate 5 skill gaps.
• Generate a preparation plan for EXACTLY 7 days.
• Each day must contain at least 3 tasks.

---------------------------------------

Candidate Resume:
{resume}

Self Description:
{selfDescription}

Job Description:
{jobDescription}
""",
    input_variables=["resume", "selfDescription", "jobDescription"],
)


# -----------------------------
# 3. LLM
# -----------------------------

base_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    temperature=0,
)

llm = base_llm.with_structured_output(InterviewReport)


# -----------------------------
# 4. Core Function (JSON output)
# -----------------------------

def generate_report(resume, self_desc, job_desc):
    try:
        prompt = prompt_template.format(
            resume=resume,
            selfDescription=self_desc,
            jobDescription=job_desc
        )

        result = llm.invoke(prompt)

        # print(result.model_dump())

        # Return pure JSON (formatted string)
        return result.model_dump()

    except Exception as e:
        return {"error": str(e)}

# -----------------------------
# 5. Gradio UI
# -----------------------------

with gr.Blocks(title="AI Interview Prep Generator") as app:
    gr.Markdown("# 🚀 AI Interview Preparation Report Generator")

    resume_input = gr.Textbox(label="Resume", lines=10)
    self_desc_input = gr.Textbox(label="Self Description", lines=5)
    job_desc_input = gr.Textbox(label="Job Description", lines=10)

    generate_btn = gr.Button("Generate Report")

    output = gr.JSON(label="JSON Output")

    generate_btn.click(
        fn=generate_report,
        inputs=[resume_input, self_desc_input, job_desc_input],
        outputs=output
    )


# -----------------------------
# 6. Launch
# -----------------------------

if __name__ == "__main__":
    app.launch(share=True)