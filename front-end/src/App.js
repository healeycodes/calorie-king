import React from 'react';
import AddMealBar from './AddMealBar';
import GoalDisplay from './GoalDisplay';
import Navigate from './Navigate';
import MealTable from './MealTable';
import UserBar from './UserBar';
import Points from './Points';
import './Spectre.css';
import './Background.css';
import './App.css';
import header from './header.png';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: document.location.href.split('/').pop(),
      isLoaded: false,
      meals: [],
      currentDay: new Date(),
      goal: 0,
      points: 0,
      visited: '',
      visitedBonus: false
    };
  }

  componentDidMount() {
    this.getMeals();
    this.getStats();
  }

  componentDidUpdate(_, prev) {
    // do we have new `visited` data from the server
    if (prev.visited !== this.state.visited) {
      this.calculateStats();
    }
  }

  calculateStats() {
    let curPoints = this.state.points;
    // calculate if a daily login bonus should be applied to this user
    if (this.state.visited !== new Date().toISOString().slice(0, 10)) {
      curPoints += 5;
      this.setVisited();
      this.setState({ visitedBonus: true });
      this.setPoints(curPoints);
    }
    this.setState({ points: curPoints });
  }

  setGoal() {
    const newGoal = prompt('New daily goal:', this.state.goal);
    if (newGoal === null || isNaN(newGoal) === true || newGoal < 1) {
      return;
    }
    fetch(`/api/goal/edit/${this.state.user}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ goal: newGoal })
    }).then(response => {
      if (response.status === 200) {
        this.getStats();
      }
    });
  }

  setPoints(points) {
    if (points === null || isNaN(points) === true) {
      return;
    }
    fetch(`/api/points/edit/${this.state.user}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ points: points })
    }).then(res => {
      if (res.status !== 200) {
        this.connectError();
      }
    });
  }

  setVisited() {
    fetch(`/api/visited/edit/${this.state.user}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (res.status !== 200) {
        this.connectError();
      }
    });
  }

  addMeal(meal) {
    fetch(`/api/meals/add/${this.state.user}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meal)
    }).then(res => {
      if (res.status !== 200) {
        this.connectError();
        return;
      }
      this.getMeals();
    });
  }

  deleteMeal() {
    const { meal, getMeals } = this.props;
    this.setState({ loading: true });
    fetch(`/api/meals/delete/${meal.user}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: meal.id })
    }).then(response => {
      if (response.status === 200) {
        getMeals();
      }
    });
  }

  getMeals() {
    fetch(`/api/meals/get/${this.state.user}`)
      .then(res => {
        if (res.status !== 200) {
          this.connectError();
          return;
        }
        return res.json();
      })
      .then(meals => {
        this.setState({
          isLoaded: true,
          meals: meals
        });
      });
  }

  getStats() {
    fetch(`/api/stats/get/${this.state.user}`)
      .then(res => {
        if (res.status !== 200) {
          this.connectError();
          return;
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          goal: data.goal,
          points: data.points,
          visited: data.visited
        });
      });
  }

  moveDay(dir) {
    const current = this.state.currentDay;
    const next = new Date();
    next.setDate(current.getDate() - dir);
    this.setState({
      currentDay: next
    });
  }

  sameDay(d1, d2) {
    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
  }

  connectError() {
    console.log('Error reaching server.');
  }

  render() {
    const {
      isLoaded,
      meals,
      currentDay,
      goal,
      user,
      visitedBonus,
      points
    } = this.state;

    let pointsDisplay = null;
    const delay = 4000;
    if (visitedBonus === true) {
      pointsDisplay = (
        <Points delay={delay} points={points} msg={'Daily login +5 points'} />
      );
    } else {
      pointsDisplay = (
        <Points delay={delay} points={points} msg={'Welcome back!'} />
      );
    }

    if (!isLoaded) {
      return <div className="loading loading-lg cal-king-loading" />;
    } else {
      return (
        <div className="text-center">
          <div
            className="text-left"
            style={{
              display: 'inline-block',
              maxWidth: '550px',
              width: '100vw',
              position: 'relative'
            }}
          >
            <img className="img-responsive cal-king-head-img" src={header} alt="Calorie King header"/>
            {pointsDisplay}
            <UserBar />
            <Navigate
              currentDay={currentDay}
              sameDay={this.sameDay}
              nextDay={this.moveDay.bind(this, 1)}
              prevDay={this.moveDay.bind(this, -1)}
            />
            <GoalDisplay
              setGoal={this.setGoal.bind(this)}
              goal={goal}
              meals={meals}
              sameDay={this.sameDay}
              currentDay={currentDay}
            />
            <MealTable
              user={user}
              meals={meals}
              getMeals={this.getMeals.bind(this)}
              deleteMeal={this.deleteMeal}
              sameDay={this.sameDay}
              currentDay={currentDay}
            />
            <AddMealBar addMeal={this.addMeal.bind(this)} />
          </div>
        </div>
      );
    }
  }
}

export default App;
