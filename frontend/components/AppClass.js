import React from "react";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4;

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
};

export default class AppClass extends React.Component {
  state = { ...initialState };

  getXY = () => {
    const row = Math.floor(this.state.index / 3);
    const col = this.state.index % 3;
    return { x: col, y: row };
  };

  getXYMessage = () => {
    const { x, y } = this.getXY();
    return `Coordinates (${x + 1}, ${y + 1})`;
  };

  reset = () => {
    this.setState({ ...initialState });
  };

  getNextIndex = (direction) => {
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
    this.setState({ email: evt.target.value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(this.state.email);

    if (this.state.email.length === 0) {
      this.setState({ message: "Ouch: email is required" });
      return;
    }

    if (!isValidEmail) {
      this.setState({ message: "Ouch: email must be a valid email", email: "" });
      return;
    }

    this.setState({ message: "" });

    const { x, y } = this.getXY();

    const payload = {
      email: this.state.email,
      x: x + 1,
      y: y + 1,
      steps: this.state.steps,
    };

    fetch("http://localhost:9000/api/result", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        this.setState({ message: `${data.message}`, email: "" });
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
          <h3 id="steps">
            You moved {this.state.steps}{" "}
            {this.state.steps === 1 ? "time" : "times"}
          </h3>
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