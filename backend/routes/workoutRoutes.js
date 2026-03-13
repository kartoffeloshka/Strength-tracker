const express = require('express');
const router = express.Router();
const Workout = require('../models/workout');

// POST a new workout
router.post('/', async (req, res) => {
  // Check if exercises exist and aren't empty
  if (!req.body.exercises || req.body.exercises.length === 0) {
    return res.status(400).json({ message: "A workout must have at least one exercise!" });
  }

  try {
    const newWorkout = new Workout(req.body);
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET workouts with filters
router.get('/', async (req, res) => {
  try {
    const { limit, name } = req.query; // Look for ?limit=X or ?name=Y in the URL
    
    let query = {};
    if (name) {
      query["exercises.name"] = name; // Only fetch workouts containing a specific exercise
    }

    const workouts = await Workout.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit) || 0); // Apply the limit if provided
      
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a workout
router.put('/:id', async (req, res) => {
  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // This returns the modified document rather than the original
    );
    res.json(updatedWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a workout
router.delete('/:id', async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;