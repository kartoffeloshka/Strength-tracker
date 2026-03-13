import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';

function App() {
  return (
    <div className="App">
      <header>
        <h1>🏋️ Hardcore Strength Tracker</h1>
      </header>
      
      <main>
        {/* This component handles adding new data */}
        <section className="form-section">
          <WorkoutForm />
        </section>

        <hr />

        {/* This component fetches and displays the history */}
        <section className="list-section">
          <WorkoutList />
        </section>
      </main>
    </div>
  );
}

export default App;