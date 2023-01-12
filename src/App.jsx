import React from "react";
import { useState, useEffect } from "react";
import QuizPage from "./components/QuizPage";
import { nanoid } from "nanoid";

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
      .then((data) => {
        let quizzes = data.results;
        quizzes = quizzes.map((q) => ({
          ...q,
          id: nanoid(),
          answers: q.incorrect_answers
            .map((a) => ({ value: a, id: nanoid() }))
            .concat({ value: q.correct_answer, id: nanoid(), correct: true }),
        }));
        setAllQuizzes(quizzes);
      });
  }, []);
  const apiResults = allQuizzes.map((item) => {
    return <QuizPage item={item} key={item.id} />;
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
