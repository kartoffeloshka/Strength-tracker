import React, { useState } from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// --- Styled Components ---
const ChartContainer = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  margin: 20px 0;
  border: 1px solid #333;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 4px;
`;

const ToggleButton = styled.button`
  background: ${props => (props.active ? '#0f0' : 'transparent')};
  color: ${props => (props.active ? '#000' : '#888')};
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;

  &:hover {
    color: ${props => (props.active ? '#000' : '#fff')};
  }
`;

// --- Component Logic ---
const ProgressChart = ({ workouts, exerciseName }) => {
  const [viewMode, setViewMode] = useState('weight'); // 'weight' or 'volume'
  const [setIndex, setSetIndex] = useState(0); // 0 = Set 1, 1 = Set 2
  const [timeFrame, setTimeFrame] = useState(90); // 90 days, 365 days, or 0 (All)

  // 1. Filter by Date and Exercise Name
  const filteredData = workouts
    .filter(w => {
      if (timeFrame === 0) return true;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - timeFrame);
      return new Date(w.date) >= cutoff;
    })
    .filter(w => w.exercises.some(ex => ex.name.toLowerCase().includes(exerciseName.toLowerCase())))
    .map(w => {
      const ex = w.exercises.find(e => e.name.toLowerCase().includes(exerciseName.toLowerCase()));
      const targetSet = ex.sets[setIndex] || ex.sets[0];
      
      return {
        date: new Date(w.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        weight: Number(targetSet.weight),
        volume: ex.sets.reduce((sum, s) => sum + (Number(s.weight) * Number(s.reps)), 0)
      };
    })
    .reverse(); // Order from oldest to newest

  return (
    <ChartContainer>
      <Header>
        <h3>{exerciseName.toUpperCase()} PROGRESS</h3>
        
        <ButtonGroup>
          <ToggleButton active={timeFrame === 90} onClick={() => setTimeFrame(90)}>3M</ToggleButton>
          <ToggleButton active={timeFrame === 365} onClick={() => setTimeFrame(365)}>1Y</ToggleButton>
          <ToggleButton active={timeFrame === 0} onClick={() => setTimeFrame(0)}>ALL</ToggleButton>
        </ButtonGroup>

        <ButtonGroup>
          <ToggleButton active={viewMode === 'weight'} onClick={() => setViewMode('weight')}>Weight</ToggleButton>
          <ToggleButton active={viewMode === 'volume'} onClick={() => setViewMode('volume')}>Volume</ToggleButton>
        </ButtonGroup>
      </Header>

      <div style={{ marginBottom: '10px', fontSize: '14px', color: '#888' }}>
        Comparing <strong>Set {setIndex + 1}</strong>
        {[0, 1, 2].map(i => (
          <button key={i} onClick={() => setSetIndex(i)} style={{ marginLeft: '10px', cursor: 'pointer' }}>
            Set {i + 1}
          </button>
        ))}
      </div>

      <div style={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} unit={viewMode === 'weight' ? "kg" : ""} />
            <Tooltip 
              contentStyle={{ background: '#222', border: '1px solid #444', borderRadius: '8px' }}
              itemStyle={{ color: '#0f0' }}
            />
            <Line 
              type="monotone" 
              dataKey={viewMode} 
              stroke={viewMode === 'weight' ? '#0f0' : '#00aaff'} 
              strokeWidth={3}
              dot={{ r: 4, fill: '#0f0' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
};

export default ProgressChart;