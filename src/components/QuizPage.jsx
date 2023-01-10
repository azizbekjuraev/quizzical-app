import React from "react";
import { useEffect, useState } from "react";
function QuizPage({ item }) {
  console.log(item);
  return (
    <div className="quiz--page">
      <h1>{item.question}</h1>
      <div className="answer-btn">
        {item.map((item, ind) => {
          return <button key={ind}>{item.incorrect_answers}</button>;
        })}

        <button>{item.correct_answer}</button>
      </div>
      <hr className="solid"></hr>
    </div>
  );
}

export default QuizPage;
