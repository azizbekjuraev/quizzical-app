import React from "react";
function QuizPage({ item, selected, setSelected, isChecked }) {
  const isCorrect =
    isChecked && selected === item.answers.find((answer) => answer.correct)?.id;
  console.log(selected);
  return (
    <>
      <div className="quiz--page">
        <h1>{item.question}</h1>
        <div className="answer-btn">
          {item.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => setSelected(answer.id)}
              style={{
                backgroundColor:
                  selected === answer.id
                    ? isCorrect
                      ? "#94D7A2"
                      : "#e84f4f"
                    : "",
              }}
            >
              {answer.value}
            </button>
          ))}
        </div>
        <hr className="solid"></hr>
      </div>
    </>
  );
}

export default QuizPage;
