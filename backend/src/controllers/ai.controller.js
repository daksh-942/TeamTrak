import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const generateProjectDetails = async (req, res) => {
  try {
    const { idea } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are an expert product manager AI.

        Convert this idea into a full project structure with:
        - Title
        - Description
        - Goals (bulleted)
        - Suggested Tasks (bulleted)
        - Suggested Team Roles (bulleted)

        Idea: "${idea}"
    `;

    const result = await model.generateContentStream(prompt);
    // const response = await result.response;
    // const text = response.text();

    // res.json({ result: text });
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(text); // stream the text to client
      }
    }

    res.end(); // end the stream
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Gemini API call failed" });
  }
};
