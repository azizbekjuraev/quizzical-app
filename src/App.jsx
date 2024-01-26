import React, { useState } from "react";
import QuizPage from "./components/QuizPage";
import CircularProgress from "./utils/LoadingSpinner";
import { nanoid } from "nanoid";

function App() {
  const [state, setState] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [allQuizzes, setAllQuizzes] = useState([]);

  function resetState() {
    setState(true);
    setUserAnswers({});
    setScore(null);
    setIsChecked(false);
    setIsPopupOpen(false);
    fetchData();
    setIsFetching(false);
  }

  function start() {
    resetState();
  }
  function startAgain() {
    resetState();
  }

  async function fetchData() {
    try {
      const response = await fetch("https://opentdb.com/api.php?amount=5");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.results) {
        throw new Error("Invalid data format");
      }

      const quizzes = data.results.map((q) => ({
        ...q,
        id: nanoid(),
        answers: [
          ...q.incorrect_answers.map((a) => ({ value: a, id: nanoid() })),
          { value: q.correct_answer, id: nanoid(), correct: true },
        ].sort(() => Math.random() - 0.5),
      }));

      setAllQuizzes(quizzes);
      setIsFetching(true);
    } catch (error) {
      console.log(error);
      console.error("Error fetching data:", error);
      // Handle the error as needed, e.g., set an error state
    }
  }

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
        isFetching ? (
          <div className="results">
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
                        onClick={startAgain}
                      >
                        Start again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <CircularProgress />
        )
      ) : (
        <div className="starting--page">
          <h1>Quizzical</h1>
          <p>Solve problems</p>
          <button
            onClick={start}
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
