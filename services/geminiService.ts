import { GoogleGenAI } from "@google/genai";
import { Teacher, ScheduleItem, Rule, SubstituteHistoryItem, Approval, RuleAnalysisResult } from "../types";

// Ensure API key is present; in a real app, handle missing key gracefully
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function chatWithAI(message: string, history: string[] = []): Promise<string> {
  if (!apiKey) return "API Key not configured.";
  
  try {
    const model = 'gemini-3-pro-preview';
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history.map(h => ({ role: 'user', parts: [{ text: h }] })), // Simplified history for demo
        { role: 'user', parts: [{ text: message }] }
      ]
    });
    return response.text || "ขออภัย ไม่สามารถตอบคำถามได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini";
  }
}

export async function suggestSubstitute(
  absentTeacher: Teacher, 
  availableTeachers: Teacher[], 
  schedule: ScheduleItem
): Promise<string> {
  if (!apiKey) return "API Key not configured. Using fallback logic.";

  try {
    const context = `
      Absent Teacher: ${absentTeacher.name} (${absentTeacher.subject}, ${absentTeacher.grade_level}, Workload: ${absentTeacher.workload}%)
      Class needing sub: ${schedule.class_name} - ${schedule.subject}
      
      Available Teachers Candidates:
      ${availableTeachers.map(t => `- ${t.name} (${t.subject}, ${t.grade_level}, Workload: ${t.workload}%)`).join('\n')}
      
      Task: Recommend the best substitute teacher from the list. Consider subject match first, then grade level match, then workload balance.
      Provide the recommendation in JSON format: { "teacher_name": string, "reason": string }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return response.text || "{}";
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return "{}";
  }
}

export async function editImage(base64Image: string, prompt: string): Promise<string | null> {
  if (!apiKey) return null;

  try {
    // Extract base64 data if it has prefix
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming PNG or JPEG, API is flexible usually but best to match
              data: base64Data
            }
          },
          { text: prompt }
        ]
      }
    });

    // Check for image in response parts
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
    }
    
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
}

export async function analyzeRuleEffectiveness(
  rules: Rule[],
  history: SubstituteHistoryItem[],
  approvals: Approval[]
): Promise<RuleAnalysisResult | null> {
  if (!apiKey) return null;

  try {
    const context = `
      Current Rules: ${JSON.stringify(rules)}
      Substitution History: ${JSON.stringify(history)}
      Approvals/Rejections: ${JSON.stringify(approvals)}

      Task: Analyze the effectiveness of the current substitution rules based on the history.
      - Calculate an overall effectiveness score (0-100).
      - Provide a textual analysis of why rules are working or failing (e.g. "High cancellation rate in Science department").
      - Suggest specific improvements (modify weights, new rules) to improve success rates.

      Output JSON format:
      {
        "analysis": "string description",
        "overallScore": number,
        "suggestions": [
          {
            "ruleId": "id of rule to modify or 'new'",
            "title": "Short title of suggestion",
            "description": "Why this change is needed",
            "action": "modify" | "create" | "remove",
            "suggestedChanges": { "weight": number, "priority": "string", "name": "string (if new)" }
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: context,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as RuleAnalysisResult;
  } catch (error) {
    console.error("Gemini Rule Analysis Error:", error);
    return null;
  }
}