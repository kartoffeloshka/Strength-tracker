const mongoose = require('mongoose');

// 1. The smallest unit: A single set
const SetSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  reps: { type: Number, required: true },
  status: String // e.g., "lengthened partials", "failed rep"
});

// 2. The Exercise: Contains multiple sets
const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  exerciseNote: String,
  sets: [SetSchema] // This is an array of the schema we defined above
});

// 3. The Workout: The top-level document
const WorkoutSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  exercises: [ExerciseSchema]
});

module.exports = mongoose.model('Workout', WorkoutSchema);