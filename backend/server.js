require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // CRITICAL: Allows mobile app to connect
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Cloud DB Connected"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// Workout Schema
const workoutSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  exercises: [{
    name: String,
    sets: [{ weight: Number, reps: Number }]
  }]
});

const Workout = mongoose.model('Workout', workoutSchema);

// API Endpoints
app.get('/api/workouts', async (req, res) => {
  const workouts = await Workout.find().sort({ date: -1 });
  res.json(workouts);
});

app.post('/api/workouts', async (req, res) => {
  try {
    const newWorkout = new Workout(req.body);
    await newWorkout.save();
    res.status(201).json(newWorkout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));