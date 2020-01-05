import React from 'react';
import './AddMealBar.css';

class AddMealBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      cals: 0,
      calsError: false,
      nameError: false
    };
  }

  handleChange(event) {
    const content = event.target.value;
    const from = event.target.className;
    if (from.includes('input-meal') === true) {
      this.setState({ name: content });
    } else if (from.includes('input-cals') === true) {
      this.setState({ cals: content });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const { name, cals } = this.state;
    const nameValid = name.length > 0;
    const calsValid = cals > 0;

    nameValid === true
      ? this.setState({ nameError: false })
      : this.setState({ nameError: true });
    calsValid === true
      ? this.setState({ calsError: false })
      : this.setState({ calsError: true });

    if (nameValid === false || calsValid === false) {
      return;
    }
    this.props.addMeal({ name: name, cals: cals, date: Date.now() });
    this.setState({ name: '', cals: 0, nameError: false, calsError: false });
  }

  render() {
    const { name, cals, nameError, calsError } = this.state;
    const nameHint =
      nameError === true ? (
        <p className="form-input-hint">No invisible meals allowed <span role="img" aria-label="shrug">🤷</span></p>
      ) : null;
    const calsHint =
      calsError === true ? (
        <p className="form-input-hint">
          You ate something that is zero calories.. Really? <span role="img" aria-label="rolls eyes">🙄</span>
        </p>
      ) : null;

    return (
      <div className="card">
        <div className="card-body">
          <form className="form-group" onSubmit={this.handleSubmit.bind(this)}>
            <label className="form-label label-lg">Meal</label>
            <div className="has-icon-right">
              <input
                type="text"
                className={`form-input input-lg input-meal ${
                  nameError === true ? 'is-error' : null
                }`}
                placeholder="Meal"
                value={name}
                onChange={this.handleChange.bind(this)}
              />
              {nameHint}
              {nameError === false ? (
                <i className="form-icon icon icon-emoji text-gray" />
              ) : null}
            </div>
            <label className="form-label label-lg">Calories</label>
            <div className="has-icon-right">
              <input
                type="number"
                className={`form-input label-lg input-cals ${
                  calsError === true ? 'is-error' : null
                }`}
                placeholder="Calories"
                value={cals}
                onChange={this.handleChange.bind(this)}
              />
              {calsHint}
              {calsError === false ? (
                <i className="form-icon icon icon-check text-gray" />
              ) : null}
            </div>
            <button
              className="btn btn-primary input-group-btn btn-lg cal-king-add"
              type="submit"
            >
              Add item
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default AddMealBar;
