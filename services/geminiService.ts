
import { GoogleGenAI, Type } from "@google/genai";
import { PracticeTest, FormulaCard, TimeTable, PYQSolution } from "../types";

// Always use the process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePracticeTest = async (
  subject: string,
  topic: string,
  count: number,
  examLevel: string
): Promise<PracticeTest> => {
  const prompt = `Create a professional ${count}-question practice test for the following subject(s): ${subject}, specifically focusing on these topic(s): "${topic}" for the ${examLevel} examination. 
  
  Strict Requirements:
  1. Standards: Align perfectly with the latest NTA (National Testing Agency) standards, question patterns, and current syllabus.
  2. Question Types: Include a balanced mix of Single Correct Multiple Choice Questions (MCQs) and Numerical Value Type Questions (where the answer is a specific number).
  3. Mixed Content: If multiple subjects or topics are provided, distribute the questions proportionally across them.
  4. Difficulty Distribution: Simulate a real exam with approximately 20% Easy, 50% Moderate, and 30% Challenging questions.
  5. Quality: Focus on conceptual application, multi-step reasoning, and analytical depth. Avoid purely memory-based questions.
  6. Solutions: Provide a meticulous, step-by-step mathematical or logical derivation for every solution, ensuring conceptual clarity.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          topic: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                type: { type: Type.STRING, description: "MCQ or NUMERICAL" },
                questionText: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Array of 4 options for MCQs. Leave empty for NUMERICAL type."
                },
                correctAnswer: { type: Type.STRING, description: "The correct option (A/B/C/D) or the specific numerical value." },
                solution: { type: Type.STRING, description: "Detailed step-by-step pedagogical solution." }
              },
              required: ["id", "type", "questionText", "correctAnswer", "solution"]
            }
          }
        },
        required: ["subject", "topic", "questions"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as PracticeTest;
};

export const generateFormulaCards = async (
  topic: string,
  exam: string = 'JEE Main'
): Promise<FormulaCard> => {
  const prompt = `Summarize the key formulas, important reactions (if applicable), and essential concepts for ${topic} for the ${exam} syllabus. Present them as bulleted points for quick revision and include one common shortcut or tip for solving problems.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          formulas: { type: Type.ARRAY, items: { type: Type.STRING } },
          concepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          reactions: { type: Type.ARRAY, items: { type: Type.STRING } },
          proTip: { type: Type.STRING }
        },
        required: ["title", "formulas", "concepts", "proTip"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as FormulaCard;
};

export const generateAITimeTable = async (
  hours: number,
  exam: string,
  weakTopics: string,
  focusSubjects: string // Changed from focusSubject to focusSubjects (comma separated)
): Promise<TimeTable> => {
  const prompt = `Generate a high-productivity daily study time table for a student preparing for ${exam}. 
  Daily Study Capacity: ${hours} hours.
  Focus Subjects: ${focusSubjects}.
  Weak Areas to prioritize: ${weakTopics}.
  Provide a detailed hourly schedule including breaks, theory, and practice sessions. Ensure the distribution of time is balanced between the selected focus subjects.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          schedule: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                time: { type: Type.STRING },
                activity: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                type: { type: Type.STRING, description: "Theory, Practice, Revision, or Break" }
              },
              required: ["time", "activity", "subject", "topic", "type"]
            }
          },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description", "schedule", "tips"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as TimeTable;
};

// Added missing solvePYQ function
export const solvePYQ = async (
  question: string,
  exam: string,
  year: string,
  subject: string
): Promise<PYQSolution> => {
  // Use gemini-3-pro-preview for complex reasoning tasks
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Solve the following Previous Year Question (PYQ) from ${exam} ${year} ${subject}.
  Question: ${question}
  
  Provide:
  1. The underlying fundamental concept.
  2. A step-by-step mathematical derivation or logical explanation.
  3. A "Pro-Tip" or shortcut for solving similar questions faster in the actual exam.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          underlyingConcept: { type: Type.STRING },
          mathematicalDerivation: { type: Type.STRING },
          proTip: { type: Type.STRING }
        },
        required: ["underlyingConcept", "mathematicalDerivation", "proTip"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as PYQSolution;
};
