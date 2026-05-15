const Candidate = require('../models/Candidate');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// For node version < 18 we need node-fetch, but typically we can use native fetch in node >= 18.
// Since the environment is likely Node 18+, we can just use native fetch.
// I will use native fetch.

exports.shortlistBasic = async (req, res) => {
  try {
    const { requiredSkills, minExperience } = req.body;
    
    if (!requiredSkills || !Array.isArray(requiredSkills)) {
      return res.status(400).json({ error: 'requiredSkills array is required' });
    }

    const candidates = await Candidate.find();

    const matchedCandidates = candidates.map(candidate => {
      // Create case-insensitive skill matching
      const reqSkillsLower = requiredSkills.map(s => s.toLowerCase());
      const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase());

      const matchedSkills = candidateSkillsLower.filter(skill =>
        reqSkillsLower.includes(skill)
      );

      const score = requiredSkills.length > 0 
        ? matchedSkills.length / requiredSkills.length 
        : 0;

      // Experience check
      let matchLevel = 'Low';
      if (score >= 0.7 && candidate.experience >= (minExperience || 0)) {
        matchLevel = 'High';
      } else if (score >= 0.4) {
        matchLevel = 'Medium';
      }

      return {
        ...candidate.toObject(),
        matchScore: score,
        matchedSkillsCount: matchedSkills.length,
        matchLevel
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(matchedCandidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.shortlistAI = async (req, res) => {
  try {
    const { requiredSkills, minExperience, candidates } = req.body;

    if (!candidates || candidates.length === 0) {
      return res.status(400).json({ error: 'Candidates data is required for AI analysis' });
    }

    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY') {
      return res.status(400).json({ error: 'OpenRouter API Key is missing or invalid in server environment.' });
    }

    const candidatesSummary = candidates.map((c, i) => 
      `${i + 1}. ${c.name} - Skills: ${c.skills.join(', ')} - Experience: ${c.experience} years${c.bio ? ` - Bio: ${c.bio}` : ''}`
    ).join('\n');

    const prompt = `
      Job requires: ${requiredSkills.join(', ')} (${minExperience}+ years experience)
      
      Candidates:
      ${candidatesSummary}
      
      Please rank these candidates from best to worst fit. 
      For each candidate, provide:
      1. A brief 1-2 sentence explanation of why they are suitable or not suitable.
      2. 2 specific technical interview questions tailored to their skills and the job requirements.
      
      Return the output as a JSON array of objects, where each object has:
      - "candidateName": The name of the candidate
      - "rank": Number (1 is best)
      - "explanation": The brief explanation text
      - "interviewQuestions": An array of 2 strings (the questions)
      
      Output ONLY valid JSON. No markdown formatting, no backticks, just the JSON array.
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-exp:free", // Using a free model so you don't need to add credit!
        messages: [
          { role: "system", content: "You are an expert HR recruiter AI. You only respond with pure valid JSON arrays." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    let aiResult;
    try {
      const content = data.choices[0].message.content.trim();
      // Try to parse json, remove markdown if AI added it
      const jsonStr = content.replace(/^```json/g, '').replace(/```$/g, '').trim();
      aiResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", data.choices[0].message.content);
      return res.status(500).json({ error: 'AI returned malformed JSON response' });
    }

    res.status(200).json(aiResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
