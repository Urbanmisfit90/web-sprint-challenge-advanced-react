// AppClass.js
// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
// ❗ OPTIONAL, not required to pass the sprint
import React from "react";

// Suggested initial states
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  state = { ...initialState };

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const row = Math.floor(this.state.index / 3);
    const col = this.state.index % 3;
    return { x: col, y: row };
  };

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    const { x, y } = this.getXY();
    return `Coordinates (${x + 1}, ${y + 1})`;
  };

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState({ ...initialState });
  };

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    const currentRow = Math.floor(this.state.index / 3);
    const currentCol = this.state.index % 3;
    let newRow = currentRow;
    let newCol = currentCol;

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

    const newIndex = newRow * 3 + newCol;

    return newIndex >= 0 && newIndex <= 8 ? newIndex : this.state.index;
  };

  move = (direction) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    const newIndex = this.getNextIndex(direction);

    if (direction === "up" && newIndex === this.state.index) {
      this.setState({ message: "You can't go up" });
      return;
    }

    if (direction === "down" && newIndex === this.state.index) {
      this.setState({ message: "You can't go down" });
      return;
    }

    if (direction === "left" && newIndex === this.state.index) {
      this.setState({ message: "You can't go left" });
      return;
    }

    if (direction === "right" && newIndex === this.state.index) {
      this.setState({ message: "You can't go right" });
      return;
    }

    this.setState((prevState) => ({
      index: newIndex,
      steps: prevState.steps + 1,
      message: "",
    }));
  };

  onChange = (evt) => {
    // You will need this to update the value of the input.
    this.setState({ email: evt.target.value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(this.state.email);
    if (this.state.email.length == 0 ) {
      this.setState({ message: "Ouch: email is required"});
      return;
    }
    if (!isValidEmail) {
      this.setState({ message: "Ouch: email must be a valid email"});
      this.setState({ email: "" });
      return;
    }

    this.setState({ message: "" });

    const { x, y } = this.getXY();

    const payload = {
      email: this.state.email,
      x: x + 1,
      y: y + 1,
      steps: this.state.steps,
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
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Handle the response from the server if needed
        // You might update the UI or perform other actions based on the server response
        this.setState({ message: `${data.message}`, email: ""});
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  render() {
    const { className } = this.props;
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? 'time' : 'times'}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === this.state.index ? " active" : ""}`}
            >
              {idx === this.state.index ? "B" : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move("left")}>
            LEFT
          </button>
          <button id="up" onClick={() => this.move("up")}>
            UP
          </button>
          <button id="right" onClick={() => this.move("right")}>
            RIGHT
          </button>
          <button id="down" onClick={() => this.move("down")}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}
