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
  // const randomArr = (arr) => {
  //   arr.sort(() => Math.random() -0.5);
  // };

  useEffect(function () {
    fetch("https://opentdb.com/api.php?amount=5")
      .then((res) => res.json())
      .then((data) => {
        let quizzes = data.results;
        quizzes = quizzes.map((q) => ({
          ...q,
          id: nanoid(),
          answers: q.incorrect_answers
            .map((a) => ({ value: a, id: nanoid() }))
            .concat({ value: q.correct_answer, id: nanoid(), correct: true })
            .sort(() => Math.random() - 0.5),
        }));
        setAllQuizzes(quizzes);
      });
  }, []);
  // console.log(allQuizzes);
  function checkBtn() {
    console.log(`cheking...`);
  }

  const apiResults = allQuizzes.map((item) => {
    return <QuizPage item={item} key={item.id} />;
  });

  return (
    <main>
      {state ? (
        <>
          <section>{apiResults}</section>
          <button className="check" onClick={checkBtn}>
            Check answers
          </button>
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
