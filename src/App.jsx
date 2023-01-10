import React from "react";
import { useState, useEffect } from "react";
import QuizPage from "./components/QuizPage";
import list from "./Data";

function App() {
  const [state, setState] = useState(false);
  function startQuiz() {
    setState((prev) => !prev);
  }

  // https://opentdb.com/api.php?amount=5

  const [allQuizzes, setAllQuizzes] = useState([]);

  useEffect(function () {
    console.log("Effect ran");
    fetch("https://opentdb.com/api.php?amount=5")
      .then((res) => res.json())
      .then((data) => setAllQuizzes(data.results));
  }, []);
  const apiResults = allQuizzes.map((item) => {
    return <QuizPage item={item} />;
  });
  return (
    <main>
      {state ? (
        <>
          <section>{apiResults}</section>
          <button className="check">Check answers</button>
        </>
      ) : (
        <div className="starting--page">
          <h1>Quizzical</h1>
          <p>Solve problems</p>
          <button onClick={startQuiz} className="start--btn">
            Start Quiz
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
