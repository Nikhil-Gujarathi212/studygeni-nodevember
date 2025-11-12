import File from "../model/file.model.js";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getFileInsights = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file || !file.fileUrl) {
      return res.status(404).json({ message: "File not found" });
    }

    // Download PDF
    const response = await fetch(file.fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Request structured summary
    const contents = [
      {
        text: `
        You are a study material generator.
        Summarize the PDF in the following strict JSON structure:

        {
          "title": "Short title of the document",
          "overview": "3-4 sentence explanation of what the document is about",
          "key_points": [
            "Point 1",
            "Point 2",
            "Point 3",
            "Add 5-7 points total"
          ],
          "conclusion": "Final takeaway message"
        }

        Do NOT add commentary or explanation outside of JSON.
        `
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Data
        }
      }
    ];

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents
    });

    let summaryText = aiResponse.text;

    // Parse JSON safely
    let structuredSummary;
    try {
      structuredSummary = JSON.parse(summaryText);
    } catch (e) {
      // Some models wrap JSON in extra text. Try to extract it.
      const jsonMatch = summaryText.match(/\{[\s\S]*\}/);
      structuredSummary = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: summaryText };
    }

    return res.status(200).json({
      success: true,
      summary: structuredSummary
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "AI Processing Failed" });
  }
};


//quiz

export const getQuizQuestions = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await File.findById(id);
    if (!file || !file.fileUrl) {
      return res.status(404).json({ message: "File not found" });
    }

    // Download the PDF from Cloudinary
    const response = await fetch(file.fileUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    // Tell Gemini to create 3 MCQs in structure
    const contents = [
      {
        text: `
        You are an educational quiz generator.
        Create EXACTLY 3 multiple-choice questions based on the PDF.

        Respond ONLY in this JSON structure:

        {
          "questions": [
            {
              "question": "Question text?",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": "A"
            }
          ]
        }

        No commentary. No explanations.
        `
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: base64Data
        }
      }
    ];

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents
    });

    let quizText = aiResponse.text;

    // Parse returned JSON cleanly
    let quiz;
    try {
      quiz = JSON.parse(quizText);
    } catch (e) {
      // If model wrapped JSON in text, extract JSON only
      const jsonMatch = quizText.match(/\{[\s\S]*\}/);
      quiz = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: quizText };
    }

    return res.status(200).json({
      success: true,
      quiz
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Quiz generation failed" });
  }
};