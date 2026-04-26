const mongoose = require('mongoose');

const leaderboardEntrySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, index: true },
    handle: String,
    first_name: String,
    last_name: String,
    country: String,
    n_accounts: { type: Number, default: 0 },
    syncedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'clist_leaderboard',
    strict: false,
  }
);

leaderboardEntrySchema.index({ id: 1 }, { unique: true });

module.exports =
  mongoose.models.LeaderboardEntry ||
  mongoose.model('LeaderboardEntry', leaderboardEntrySchema, 'clist_leaderboard');
