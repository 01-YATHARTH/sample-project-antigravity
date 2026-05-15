const Candidate = require('../models/Candidate');

exports.addCandidate = async (req, res) => {
  try {
    const { name, email, skills, experience, bio, projects } = req.body;
    const newCandidate = new Candidate({
      name,
      email,
      skills,
      experience,
      bio,
      projects
    });
    const savedCandidate = await newCandidate.save();
    res.status(201).json(savedCandidate);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleSaveCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const candidate = await Candidate.findById(id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    
    candidate.isSaved = !candidate.isSaved;
    await candidate.save();
    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
