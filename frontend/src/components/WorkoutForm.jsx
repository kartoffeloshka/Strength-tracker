import { useState } from 'react';
import axios from 'axios';

const WorkoutForm = () => {
  const [exercises, setExercises] = useState([
    { name: '', sets: [{ weight: '', reps: '', status: '' }] }
  ]);

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ weight: '', reps: '', status: '' }] }]);
  };

  const addSet = (exIndex) => {
    const newExercises = [...exercises];
    newExercises[exIndex].sets.push({ weight: '', reps: '', status: '' });
    setExercises(newExercises);
  };

  const handleSetChange = (exIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 🧹 Data Cleaning: Filter out exercises without names or sets without weight
    const cleanExercises = exercises
      .filter(ex => ex.name.trim() !== '')
      .map(ex => ({
        ...ex,
        sets: ex.sets.filter(set => set.weight !== '')
      }));

    try {
      await axios.post('http://localhost:5000/api/workouts', { exercises: cleanExercises });
      alert("Workout Logged! 💪");
      setExercises([{ name: '', sets: [{ weight: '', reps: '', status: '' }] }]); // Reset
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      <h2>New Training Session</h2>
      {exercises.map((ex, exIndex) => (
        <div key={exIndex} className="exercise-card">
          <input 
            placeholder="Exercise Name" 
            value={ex.name} 
            onChange={(e) => {
              const newEx = [...exercises];
              newEx[exIndex].name = e.target.value;
              setExercises(newEx);
            }} 
          />
          {ex.sets.map((set, setIndex) => (
            <div key={setIndex} className="set-row">
              <input type="number" placeholder="kg" onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)} />
              <input type="number" placeholder="reps" onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)} />
              <input type="text" placeholder="Note" onChange={(e) => handleSetChange(exIndex, setIndex, 'status', e.target.value)} />
            </div>
          ))}
          <button type="button" onClick={() => addSet(exIndex)}>+ Add Set</button>
        </div>
      ))}
      <button type="button" onClick={addExercise}>+ Add Exercise</button>
      <hr />
      <button type="submit" style={{ background: 'green', color: 'white' }}>Save Workout</button>
    </form>
  );
};

export default WorkoutForm;