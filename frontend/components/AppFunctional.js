// AppFunctional.js
import React, { useState } from "react";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at
const initialSuccessMessage = ""; // Add this line to define initialSuccessMessage

export default function AppFunctional(props) {
 // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
 // You can delete them and build your own logic from scratch.
 const [index, setIndex] = useState(initialIndex);
 const [emailValue, setEmailValue] = useState(initialEmail);
 const [moveCount, setMoveCount] = useState(initialSteps);
 const [errorMessage, setErrorMessage] = useState(initialMessage);
 const [successMessage, setSuccessMessage] = useState(initialSuccessMessage);

 function getXY(index) {
  // It's not necessary to have a state to track the coordinates.
  // It's enough to know what index the "B" is at, to be able to calculate them.
  const row = Math.floor(index / 3);
  const col = index % 3;
  return { x: col, y: row };
 }

 function getXYMessage() {
  // It's not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
  // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
  // returns the fully constructed string.
  const { x, y } = getXY(index);
  return `Coordinates (${x + 1}, ${y + 1})`;
 }

 function reset() {
  // Use this helper to reset all states to their initial values.
  setIndex(initialIndex);
  setMoveCount(initialSteps);
  setErrorMessage(initialMessage); // Set error message to initial value
  setSuccessMessage(initialSuccessMessage); // Set success message to initial value
  setEmailValue(initialEmail); // Reset the email value
 }

 function getNextIndex(direction) {
  const currentRow = Math.floor(index / 3);
  const currentCol = index % 3;

  let newRow = currentRow;
  let newCol = currentCol;

  // Update newRow and newCol based on the direction
  switch (direction) {
   case "up":
    newRow = Math.max(currentRow - 1, 0);
    break;
   case "down":
    newRow = Math.min(currentRow + 1, 2);
    break;
   case "left":
    newCol = Math.max(currentCol - 1, 0);
    break;
   case "right":
    newCol = Math.min(currentCol + 1, 2);
    break;
   default:
    break;
  }

  // Calculate the new index
  const newIndex = newRow * 3 + newCol;

  // Return the new index if it's within the grid, otherwise, return the current index
  return newIndex >= 0 && newIndex <= 8 ? newIndex : index;
 }

 function move(direction) {
  // Reset the 'message' and 'successMessage' when a button is clicked
  setErrorMessage("");
  setSuccessMessage("");
  // Use the getNextIndex helper to obtain a new index for the "B"
  const newIndex = getNextIndex(direction);

  // Check if moving up or down is allowed
  if (direction === "up" && newIndex === index) {
   setErrorMessage("You can't go up");
   return;
  }

  if (direction === "down" && newIndex === index) {
   setErrorMessage("You can't go down");
   return;
  }

  if (direction === "left" && newIndex === index) {
   setErrorMessage("You can't go left");
   return;
  }

  if (direction === "right" && newIndex === index) {
   setErrorMessage("You can't go right");
   return;
  }

  // Update move count and index
  setMoveCount(moveCount + 1);
  setIndex(newIndex);
 }

 function onChange(evt) {
  // Update the email input value when it changes
  setEmailValue(evt.target.value);
 }

 function isValidEmail(email) {
  // This is a basic email validation, you might want to use a more robust solution
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
 }

 function onSubmit(evt) {
  // Prevent the default form submission behavior
  evt.preventDefault();
  if (emailValue.length == 0) {
   setErrorMessage("Ouch: email is required");
   setEmailValue("");
   return;
  }
  // Check if the email is valid (you can customize this validation)
  if (!isValidEmail(emailValue)) {
   // Set an error message or handle invalid email input
   setErrorMessage("Ouch: email must be a valid email");
   setEmailValue("");
   return;
  }

  // Clear the error message
  setErrorMessage("");
  setEmailValue("");

  const { x, y } = getXY(index);
  // Here, you can send a POST request to the server with the payload
  const payload = {
   email: emailValue,
   x: x + 1,
   y: y + 1,
   steps: moveCount,
   // Add other data you want to send to the server
  };

  // Example: You can use fetch to send a POST request
  fetch("http://localhost:9000/api/result", {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
    // Add other headers if needed
   },
   body: JSON.stringify(payload),
  })
   .then(async (response) => {
    if (!response.ok) {
        // If response is not in JSON format, handle it accordingly
        const isJson = response.headers.get("content-type")?.includes("application/json");
        const data = isJson ? await response.json() : await response.text();
        setErrorMessage(data.message || "Unknown error");
     throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
   })
   .then((data) => {
    // Handle the response from the server if needed
    // You might update the UI or perform other actions based on the server response
    // Update success message based on the email
    setSuccessMessage(`${data.message}`);
   })
   .catch((error) => {
    // Handle errors if the request fails
    console.error("Error:", error);
   });
 }

 return (
  <div id="wrapper" className={props.className}>
   <div className="info">
    <h3 id="coordinates">{getXYMessage()}</h3>
    <h3 id="steps">
     You moved {moveCount} {moveCount === 1 ? "time" : "times"}
    </h3>
   </div>
   <div id="grid">
    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
     <div key={idx} className={`square${idx === index ? " active" : ""}`}>
      {idx === index ? "B" : null}
     </div>
    ))}
   </div>
   <div className="info">
    <h3 id="message" style={{ color: "#00808C" }}>
     {errorMessage}
    </h3>
    <h3 id="successMessage" style={{ color: "#00808C" }}>
     {successMessage}
    </h3>
   </div>
   <div id="keypad">
    <button id="left" onClick={() => move("left")}>
     LEFT
    </button>
    <button id="up" onClick={() => move("up")}>
     UP
    </button>
    <button id="right" onClick={() => move("right")}>
     RIGHT
    </button>
    <button id="down" onClick={() => move("down")}>
     DOWN
    </button>
    <button id="reset" onClick={reset}>
     reset
    </button>
   </div>
   <form onSubmit={onSubmit}>
    <input
     id="email"
     type="email"
     placeholder="type email"
     value={emailValue}
     onChange={onChange} // Attach the onChange handler
    ></input>
    <input id="submit" type="submit" value="submit"></input>
   </form>
  </div>
 );
}
