const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 profile pictures

// 1. Connect to MongoDB Atlas (so no local DB install is needed)
const MONGO_URI = 'mongodb://db_user:db-project-password@ac-rosqmsc-shard-00-00.f5p9msj.mongodb.net:27017,ac-rosqmsc-shard-00-01.f5p9msj.mongodb.net:27017,ac-rosqmsc-shard-00-02.f5p9msj.mongodb.net:27017/CompetitionPortal?ssl=true&replicaSet=atlas-kdpz6n-shard-0&authSource=admin&appName=CS-220-Database-Project-1';

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas!"))
  .catch(err => console.error("Connection error:", err));

// 2. Define the User Schema (The blueprint)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String, default: "" } // base64 string
});

const User = mongoose.model('User', userSchema);

// 3. Your Signup Route
app.post('/signup', async (req, res) => {
  try {
    const existing = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] });
    if (existing) return res.status(400).json({ error: "Username or email already exists" });

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      profilePic: ""
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ error: "Error saving user: " + error.message });
  }
});

// 4. Login Route
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ 
      email: req.body.email,
      password: req.body.password 
    });
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful!", user });
  } catch (error) {
    res.status(500).json({ error: "Error during login: " + error.message });
  }
});

// 5. Update Profile Picture
app.put('/update-profile', async (req, res) => {
  try {
    const { userId, profilePic } = req.body;
    const user = await User.findByIdAndUpdate(userId, { profilePic }, { new: true });
    res.status(200).json({ message: "Profile picture updated", user });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile: " + error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Auth Server running on port ${PORT}`));