import React, { useState } from "react";
import "../styles/SeizureControlPage.css";

const SeizureControlPage = () => {
  const [gamePrompt, setGamePrompt] = useState("");
  const [breathingGuide, setBreathingGuide] = useState("");

  const startMemoryGame = () => {
    const tasks = ["Find 3 red objects!", "Name 5 animals!", "Count backward from 20!"];
    setGamePrompt(tasks[Math.floor(Math.random() * tasks.length)]);
  };

  const startBreathingExercise = () => {
    setBreathingGuide("Breathe in for 4 seconds... Hold for 4 seconds... Exhale for 4 seconds...");
  };

  return (
    <div className="seizure-control-container">
      <h2>🆘 Seizure Control Guide</h2>

      <h3>📌 Emergency Steps</h3>
      <ol>
        <li>Lay the person on their side.</li>
        <li>Do not restrain movements.</li>
        <li>Remove sharp objects nearby.</li>
        <li>Call for help if seizure lasts &gt;5 min.</li>
      </ol>

      <h3>🎮 Focus & Recovery Game</h3>
      <button onClick={startMemoryGame}>Start Memory Game</button>
      {gamePrompt && <p className="game-text">🧠 {gamePrompt}</p>}

      <h3>🧘 Breathing Exercise</h3>
      <button onClick={startBreathingExercise}>Start Exercise</button>
      {breathingGuide && <p className="breathing-text">{breathingGuide}</p>}
    </div>
  );
};

export default SeizureControlPage;
