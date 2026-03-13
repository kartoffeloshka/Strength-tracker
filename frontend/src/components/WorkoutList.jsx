import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ProgressChart from './ProgressChart';
import styled from 'styled-components';

// --- Styled Components ---
const ListContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  color: #e0e0e0;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 30px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px;
  background: #1a1a1a;
  border: 2px solid #333;
  color: #0f0;
  border-radius: 10px;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0f0;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.1);
  }
`;

const SuggestionList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #252525;
  border: 1px solid #444;
  border-top: none;
  border-radius: 0 0 10px 10px;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 100;
  max-height: 250px;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
`;

const SuggestionItem = styled.li`
  padding: 12px 15px;
  cursor: pointer;
  border-bottom: 1px solid #333;
  transition: background 0.2s;

  &:hover {
    background: #333;
    color: #0f0;
  }
  &:last-child { border-bottom: none; }
`;

// --- Main Component ---
const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const url = searchTerm 
          ? `http://localhost:5000/api/workouts?name=${encodeURIComponent(searchTerm)}` 
          : 'http://localhost:5000/api/workouts';
        const res = await axios.get(url);
        setWorkouts(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchWorkouts();
  }, [searchTerm]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🧠 Logic: Extract all unique exercise names from the entire history
  const allExerciseNames = [...new Set(
    workouts.flatMap(w => w.exercises.map(ex => ex.name))
  )].sort();

  const suggestions = allExerciseNames.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    name.toLowerCase() !== searchTerm.toLowerCase()
  );

  const deleteWorkout = async (id) => {
    if (window.confirm("Delete this session permanently?")) {
      await axios.delete(`http://localhost:5000/api/workouts/${id}`);
      setWorkouts(workouts.filter(w => w._id !== id));
    }
  };

  return (
    <ListContainer>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Training History</h2>
      
      <SearchWrapper ref={searchRef}>
        <SearchInput 
          type="text" 
          placeholder="Search exercise (e.g. Pullups)..." 
          value={searchTerm}
          onFocus={() => setShowSuggestions(true)}
          onChange={(e) => setSearchTerm(e.target.value)} 
        />

        {showSuggestions && searchTerm && suggestions.length > 0 && (
          <SuggestionList>
            {suggestions.map((name, index) => (
              <SuggestionItem 
                key={index} 
                onClick={() => {
                  setSearchTerm(name);
                  setShowSuggestions(false);
                }}
              >
                {name}
              </SuggestionItem>
            ))}
          </SuggestionList>
        )}
      </SearchWrapper>

      {searchTerm && workouts.length > 0 && (
        <ProgressChart workouts={workouts} exerciseName={searchTerm} />
      )}

      {workouts.map(workout => (
        <div key={workout._id} className="history-card" style={{ background: '#1a1a1a', padding: '20px', borderRadius: '10px', marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', marginBottom: '10px' }}>
            <h3 style={{ color: '#888' }}>{new Date(workout.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
            <button onClick={() => deleteWorkout(workout._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🗑️</button>
          </div>
          {workout.exercises.map((ex, i) => (
            <div key={i} style={{ marginBottom: '15px' }}>
              <h4 style={{ color: '#0f0', margin: '5px 0' }}>{ex.name}</h4>
              {ex.sets.map((s, j) => (
                <div key={j} style={{ color: '#bbb', fontSize: '0.9rem', marginLeft: '10px' }}>
                  Set {j+1}: <strong>{s.weight}kg</strong> x {s.reps} {s.status && <span style={{ fontStyle: 'italic', color: '#666' }}> — {s.status}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </ListContainer>
  );
};

export default WorkoutList;
