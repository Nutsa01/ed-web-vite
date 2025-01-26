import React from 'react';

function AverageRemainingTime({ triage_category, elapsed_time }) {
    let average_time;

    switch (triage_category) {
        case 1:
            average_time = 2;
            break;
        case 2:
            average_time = 20;
            break;
        case 3:
            average_time = 75;
            break;
        case 4:
            average_time = 150;
            break;
        case 5:
            average_time = 240;
            break;
        default:
            average_time = 240;
    }

    let remaining_time = average_time - elapsed_time;

    if (remaining_time <= 0) {
        remaining_time = 0;
    }

    return (
        <div>
            {remaining_time > 0 ? (
                <span>{remaining_time} minutes remaining</span>
            ) : (
                <span>Time has elapsed</span>
            )}
        </div>
    );
}


export default AverageRemainingTime;
