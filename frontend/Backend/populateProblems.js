const mongoose = require('mongoose');

// MongoDB Atlas Connection (Same as server.js)
const MONGO_URI = 'mongodb://db_user:db-project-password@ac-rosqmsc-shard-00-00.f5p9msj.mongodb.net:27017,ac-rosqmsc-shard-00-01.f5p9msj.mongodb.net:27017,ac-rosqmsc-shard-00-02.f5p9msj.mongodb.net:27017/CompetitionPortal?ssl=true&replicaSet=atlas-kdpz6n-shard-0&authSource=admin&appName=CS-220-Database-Project-1';

// Problem Schema Definition
const problemSchema = new mongoose.Schema({
  platform: { type: String, enum: ['leetcode', 'codeforces'], required: true },
  problemId: { type: String, required: true },
  title: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'Unknown'] },
  tags: [String],
  acceptanceRate: Number,
  url: String,
  isPremium: { type: Boolean, default: false },
  rating: Number, // Codeforces rating
  createdAt: { type: Date, default: Date.now }
});

problemSchema.index({ platform: 1, problemId: 1 }, { unique: true });
const Problem = mongoose.model('Problem', problemSchema, 'coding_problems');

// Helper to wait a short bit
const delay = ms => new Promise(res => setTimeout(res, ms));

async function storeLeetCodeProblems() {
  console.log('Fetching 500 LeetCode problems...');
  let allProblems = [];
  let skip = 0;
  const limit = 100;
  
  // We want strictly up to 500 problems
  while (allProblems.length < 500) {
    const query = {
      query: `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int) {
        problemsetQuestionList: questionList(
          categorySlug: $categorySlug
          limit: $limit
          skip: $skip
          filters: {}
        ) {
          total: totalNum
          questions: data {
            acRate
            difficulty
            frontendQuestionId: questionFrontendId
            paidOnly: isPaidOnly
            title
            titleSlug
            topicTags {
              name
            }
          }
        }
      }`,
      variables: {
        categorySlug: "",
        limit: limit,
        skip: skip
      }
    };
    
    let data;
    try {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        },
        body: JSON.stringify(query)
      });
      
      if (!response.ok) {
          console.error("LeetCode fetch error", response.status, response.statusText);
          const bd = await response.text();
          console.error("Body:", bd);
          break;
      }

      data = await response.json();
    } catch(e) {
      console.error("Fetch exceptionally failed: ", e.message, e.stack);
      break;
    }
    const problemset = data.data.problemsetQuestionList;
    
    if (!problemset.questions.length) break;
    
    const transformedProblems = problemset.questions.map(q => ({
      platform: 'leetcode',
      problemId: q.frontendQuestionId,
      title: q.title,
      difficulty: q.difficulty, // Leetcode already returns Easy/Medium/Hard
      tags: q.topicTags.map(tag => tag.name),
      acceptanceRate: q.acRate,
      url: `https://leetcode.com/problems/${q.titleSlug}/`,
      isPremium: q.paidOnly
    }));
    
    // Bulk upsert into MongoDB
    for (const problem of transformedProblems) {
      await Problem.findOneAndUpdate(
        { platform: 'leetcode', problemId: problem.problemId },
        problem,
        { upsert: true, new: true }
      );
    }
    
    allProblems.push(...transformedProblems);
    skip += limit;
    console.log(`Fetched ${allProblems.length}/500 LeetCode problems...`);
    
    // Brief polite delay
    await delay(1000);
  }
  
  console.log(`✅ Stored ${allProblems.length} LeetCode problems successfully.`);
  return allProblems;
}

// Fetch and store Codeforces problems
async function storeCodeforcesProblems() {
  console.log('Fetching first 500 Codeforces problems...');
  
  const response = await fetch('https://codeforces.com/api/problemset.problems');
  const data = await response.json();
  
  if (data.status !== 'OK') {
    throw new Error('Failed to fetch Codeforces problems');
  }
  
  // Cut down to the first 500 problems
  const problemsSubset = data.result.problems.slice(0, 500);

  const transformedProblems = problemsSubset.map(problem => {
    // Custom Codeforces rating logic
    let difficultyScore = 'Unknown';
    if (problem.rating) {
        if (problem.rating < 1000) difficultyScore = 'Easy';
        else if (problem.rating <= 1500) difficultyScore = 'Medium';
        else difficultyScore = 'Hard';
    }

    return {
      platform: 'codeforces',
      problemId: `${problem.contestId}${problem.index}`,
      title: problem.name,
      difficulty: difficultyScore,
      tags: problem.tags,
      rating: problem.rating,
      url: `https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`,
      acceptanceRate: null
    };
  });
  
  // Bulk insert/update
  for (const problem of transformedProblems) {
    await Problem.findOneAndUpdate(
      { platform: 'codeforces', problemId: problem.problemId },
      problem,
      { upsert: true, new: true }
    );
  }
  
  console.log(`✅ Stored ${transformedProblems.length} Codeforces problems successfully.`);
  return transformedProblems;
}

// Main population function execution
async function populateDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB Atlas...');
    
    await storeLeetCodeProblems();
    await storeCodeforcesProblems();
    
    console.log('🎉 Finalizing: Database population completed successfully!');
    
    const stats = await Problem.aggregate([
      { $group: { _id: '$platform', count: { $sum: 1 } } }
    ]);
    console.log('Final Database statistics:', stats);
    
  } catch (error) {
    console.error('Error populating database:', error);
  } finally {
    process.exit(0);
  }
}

// Spark the execution
populateDatabase();
