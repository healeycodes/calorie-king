import React from 'react';
import './stylesheets/MealRow.css';

class MealRow extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: false
      };
    }
  
    render() {
      const { meal, deleteMeal } = this.props;
      const text =
        this.state.loading === true ? <div className="loading"></div> : "Delete";
      return (
        <div className="card">
          <div className="card-body">
            <div className="columns">
              <div className="column col-7 text-center cal-king-meal-text">
                <span className="h5">{meal.name}</span>
              </div>
              <div className="column col-2 cal-king-cal-text">
                <span className="h5">{meal.cals}</span>
              </div>
              <div className="column col-3 text-center">
                <button className="btn" onClick={deleteMeal.bind(this)}>
                  <div className="cal-king-delete">{text}</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  export default MealRow;