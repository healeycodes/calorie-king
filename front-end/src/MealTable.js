import React from 'react';
import MealRow from './MealRow';

class MealTable extends React.Component {
    render() {
        const { meals, sameDay, currentDay, getMeals } = this.props;
        const rows = [];

        meals.forEach(meal => {
            // Filter by day
            if (sameDay(new Date(meal.date), currentDay)) {
                return;
            }
            rows.push(
                <MealRow
                    meal={meal}
                    key={meal.id}
                    deleteMeal={this.props.deleteMeal}
                    getMeals={getMeals}
                />
            );
        });

        return <div>{rows}</div>;
    }
}

export default MealTable;