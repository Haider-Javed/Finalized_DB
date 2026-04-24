const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const https    = require('https');

const app = express();
app.use(cors());
app.use(express.json());

// ── Debug mode ─────────────────────────────────────────────────────────────
mongoose.set('debug', true);

// ── MongoDB (CompetitionPortal) ─────────────────────────────────────────────
const MONGO_URI = 'mongodb://db_user:db-project-password@ac-rosqmsc-shard-00-00.f5p9msj.mongodb.net:27017,ac-rosqmsc-shard-00-01.f5p9msj.mongodb.net:27017,ac-rosqmsc-shard-00-02.f5p9msj.mongodb.net:27017/CompetitionPortal?ssl=true&replicaSet=atlas-kdpz6n-shard-0&authSource=admin&appName=CS-220-Database-Project-1';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to CompetitionPortal'))
  .catch(err => console.error('❌ Connection error:', err));

// ── Resources Route ─────────────────────────────────────────────────────────
const resourceRoutes = require('./routes/resources');
app.use('/api/resources', resourceRoutes);

const competitionSchema = new mongoose.Schema({
  competition_name: String,
  host_university: String,
  typical_venue: String,
  recurring_month: String,
  registration_fee: String,
  participation_certificate: Boolean,
  format: String,
  is_physical: Boolean,
  programming_languages: [String],
}, {
  collection: 'Pakistan_Competition',
  strict: false,
});

const Competition = mongoose.model('Competition', competitionSchema, 'Pakistan_Competition');

// ── Problems (MongoDB) ──────────────────────────────────────────────────────
const problemSchema = new mongoose.Schema({
  platform: String,
  problemId: String,
  title: String,
  difficulty: String,
  tags: [String],
  acceptanceRate: Number,
  url: String,
  isPremium: Boolean,
  rating: Number,
  createdAt: Date
}, { collection: 'coding_problems' });

const Problem = mongoose.model('Problem', problemSchema);

// ── National Competitions (MongoDB) ────────────────────────────────────────
app.get('/api/competitions', async (req, res) => {
  try {
    const data = await Competition.aggregate([
      { $group: { _id: '$competition_name', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
      { $project: { __v: 0 } },
    ]);
    const mapped = data.map(obj => ({ ...obj, fee_label: obj.registration_fee }));
    res.status(200).json(mapped);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── CLIST API credentials ───────────────────────────────────────────────────
const CLIST_USERNAME = 'hajaved1023';
const CLIST_API_KEY  = 'f55baad1e17c76f80c2f026b819a2d9caf9acc8c';

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'ContestHub/1.0' } }, (res) => {
      let raw = '';
      res.on('data', chunk => (raw += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(raw)); }
        catch (e) { reject(new Error('JSON parse error: ' + e.message)); }
      });
    }).on('error', reject);
  });
}

// ── International Competitions (CLIST proxy) ───────────────────────────────
app.get('/api/international-competitions', async (req, res) => {
  try {
    const params = [
      `username=${CLIST_USERNAME}`,
      `api_key=${CLIST_API_KEY}`,
      'format=json',
      'upcoming=true',
      'order_by=start',
      'limit=50',
      'with_resources=true',
    ].join('&');

    const url  = `https://clist.by/api/v4/contest/?${params}`;
    const data = await fetchJSON(url);

    res.status(200).json(data.objects || []);
  } catch (err) {
    console.error('CLIST API error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Problems Endpoint ───────────────────────────────────────────────────────
app.get('/api/problems', async (req, res) => {
  try {
    const filters = {};
    if (req.query.platform) filters.platform = req.query.platform;
    if (req.query.difficulty) filters.difficulty = req.query.difficulty;

    const problems = await Problem.find(filters);
    res.status(200).json(problems);
  } catch (err) {
    console.error('Problems API error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Start ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Running on http://localhost:${PORT}`));