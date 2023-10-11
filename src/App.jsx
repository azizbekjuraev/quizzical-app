import React, { useState, useEffect } from "react";
import QuizPage from "./components/QuizPage";
import { nanoid } from "nanoid";

function App() {
  const [state, setState] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  function startQuiz() {
    setState((prev) => !prev);
    setUserAnswers({});
    setScore(null);
    setIsChecked(false);
    setIsPopupOpen(false);
  }

  const [allQuizzes, setAllQuizzes] = useState([]);

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

  function checkBtn() {
    let correctAnswers = 0;

    allQuizzes.forEach((quiz) => {
      const selectedAnswerId = userAnswers[quiz.id];
      const correctAnswer = quiz.answers.find((answer) => answer.correct);

      if (selectedAnswerId === correctAnswer.id) {
        correctAnswers++;
        setIsChecked(true);
      }
    });

    setScore(correctAnswers);
    setIsPopupOpen(true);
  }

  const apiResults = allQuizzes.map((item) => {
    return (
      <QuizPage
        item={item}
        key={item.id}
        selected={userAnswers[item.id]}
        setSelected={(answerId) =>
          setUserAnswers((prev) => ({ ...prev, [item.id]: answerId }))
        }
        isChecked={isChecked}
      />
    );
  });

  return (
    <main>
      {state ? (
        <>
          <section>{apiResults}</section>
          <button
            className="check border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-teal-700 duration-[400ms,700ms] transition-[color,box-shadow]"
            onClick={checkBtn}
          >
            Check answers
          </button>
          {score !== null && isPopupOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="modal fixed inset-0 bg-gray-800 bg-opacity-80"></div>
              <div className="bg-white w-1/4 p-4 rounded-lg shadow-lg z-10">
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-red-600"
                  onClick={() => setIsPopupOpen(false)}
                >
                  X
                </button>
                <div className="text-center">
                  <div className="text-2xl font-semibold mb-4">
                    Your Score: {score} out of {allQuizzes.length}
                  </div>
                  <div className="flex gap-4 justify-center">
                    <button
                      className="bg-blue-500 text-white py-2 px-4  hover:bg-blue-600"
                      onClick={() => setIsPopupOpen(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-blue-500 text-white py-2 px-4 hover:bg-blue-600"
                      onClick={startQuiz}
                    >
                      Start again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="starting--page">
          <h1>Quizzical</h1>
          <p>Solve problems</p>
          <button
            onClick={startQuiz}
            className="start--btn bg-neutral-200 px-12 py-4 text-2xl border-neutral-400 border-2 text-neutral-600 hover:text-white hover:shadow-[inset_13rem_0_0_0] hover:shadow-teal-700 duration-[400ms,700ms] transition-[color,box-shadow]"
          >
            Start Quiz
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
