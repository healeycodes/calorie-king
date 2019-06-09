import React from 'react';
import './stylesheets/Navigate.css';

class Navigate extends React.Component {
  render() {
    const { sameDay, currentDay, prevDay, nextDay } = this.props;
    const day =
      sameDay(new Date(), currentDay) === false
        ? "Today"
        : currentDay.toISOString().substring(0, 10);
    return (
      <div className="card">
        <div className="card-body">
          <div className="columns">
            <div
              className="column col-3 text-center cal-king-btn-con"
            >
              <button
                className="btn btn-primary btn-lg cal-king-day-btn"
                onClick={prevDay}
              >
                Prev
                </button>
            </div>
            <div
              className="column col-6 text-center cal-king-today"
            >
              <span className="h5">{day}</span>
            </div>
            <div
              className="column col-3 text-center cal-king-btn-con"
            >
              <button
                className="btn btn-primary btn-lg cal-king-day-btn"
                onClick={nextDay}
              >
                Next
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navigate;