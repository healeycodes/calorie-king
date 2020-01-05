import React from 'react';
import './GoalDisplay.css';

class GoalDisplay extends React.Component {
  render() {
    const { meals, sameDay, currentDay, goal } = this.props;
    const eaten = meals.reduce(
      (acc, meal) =>
        sameDay(new Date(currentDay), new Date(meal.date)) === false
          ? acc + meal.cals
          : acc,
      0
    );
    const percentLeft = Math.floor(100 - (eaten / goal) * 100);
    const kcalLeft = Math.floor(goal - eaten);

    return (
      <div className="card">
        <div className="card-body">
          <div>
            <span>Goal: {goal}</span>
            <span className="text-gray">
              <i
                onClick={this.props.setGoal}
                className="icon icon-edit cal-king-edit"
              ></i>
            </span>
            <div className="bar bar-lg">
              <div
                className="bar-item"
                role="progressbar"
                style={{ width: percentLeft + "%" }}
                aria-valuenow={kcalLeft}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {kcalLeft}kcals left
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GoalDisplay;