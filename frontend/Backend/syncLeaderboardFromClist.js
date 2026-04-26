const https = require('https');
const mongoose = require('mongoose');
const LeaderboardEntry = require('./models/leaderboardEntry');

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://db_user:db-project-password@ac-rosqmsc-shard-00-00.f5p9msj.mongodb.net:27017,ac-rosqmsc-shard-00-01.f5p9msj.mongodb.net:27017,ac-rosqmsc-shard-00-02.f5p9msj.mongodb.net:27017/CompetitionPortal?ssl=true&replicaSet=atlas-kdpz6n-shard-0&authSource=admin&appName=CS-220-Database-Project-1';

const CLIST_USERNAME = process.env.CLIST_USERNAME || 'hajaved1023';
const CLIST_API_KEY = process.env.CLIST_API_KEY || 'f55baad1e17c76f80c2f026b819a2d9caf9acc8c';
const CLIST_LEADERBOARD_LIMIT = Number(process.env.CLIST_LEADERBOARD_LIMIT || 200);

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'ContestHub/1.0' } }, (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch (err) {
            reject(new Error(`JSON parse error: ${err.message}`));
          }
        });
      })
      .on('error', reject);
  });
}

async function syncLeaderboardFromClist() {
  await mongoose.connect(MONGO_URI);

  try {
    const params = [
      `username=${encodeURIComponent(CLIST_USERNAME)}`,
      `api_key=${encodeURIComponent(CLIST_API_KEY)}`,
      'format=json',
      'order_by=-n_accounts',
      `limit=${CLIST_LEADERBOARD_LIMIT}`,
    ].join('&');

    const url = `https://clist.by/api/v4/coder/?${params}`;
    const payload = await fetchJSON(url);
    const coders = Array.isArray(payload.objects) ? payload.objects : [];

    const now = new Date();
    const docs = coders
      .filter((coder) => coder && typeof coder.id === 'number')
      .map((coder) => ({ ...coder, syncedAt: now }));

    if (!docs.length) {
      throw new Error('No coders returned from CLIST API.');
    }

    await LeaderboardEntry.deleteMany({});
    await LeaderboardEntry.insertMany(docs, { ordered: false });

    console.log(`Synced ${docs.length} leaderboard records into MongoDB.`);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  syncLeaderboardFromClist()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('Leaderboard sync failed:', err.message);
      process.exit(1);
    });
}

module.exports = { syncLeaderboardFromClist };
