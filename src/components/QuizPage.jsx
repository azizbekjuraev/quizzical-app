import React from "react";

function QuizPage({ item }) {
  const [selected, setSelected] = React.useState({});
  console.log(selected);

  return (
    <div className="quiz--page">
      <h1>{item.question}</h1>
      <div className="answer-btn">
        {item.answers.map((answer, idx) => (
          <button
            key={idx}
            onClick={() =>
              setSelected((prev) => ({ ...prev, [item.id]: answer.id }))
            }
            style={{
              backgroundColor: selected[item.id] === answer.id ? "#94D7A2" : "",
              // color: selected[item.id] === answer.id ? "white" : "",
            }}
          >
            {answer.value}
          </button>
        ))}
      </div>
      <hr className="solid"></hr>
    </div>
  );
}

export default QuizPage;
