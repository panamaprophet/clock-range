import React, { useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Clocker } from '../dist';


const formatTime = (time: number) =>
    [
        (time | 0),
        (time % 1) * 60 | 0
    ]
        .map(n => n
            .toString()
            .padStart(2, '0')
        )
        .join(':');

const App = () => {
    const [[startTime, endTime], setTimeRange] = useState([0, 13]);

    return (
        <>
            <Clocker time={[startTime, endTime]} onChange={time => setTimeRange(time)} />
            <div>
                start time = {formatTime(startTime)}
                <br />
                <input
                    type="range"
                    min="0"
                    max="24"
                    value={startTime}
                    onChange={event => setTimeRange([Number(event.target.value), endTime])}
                />
            </div>
            <div>
                end time = {formatTime(endTime)}
                <br />
                <input
                    type="range"
                    min="0"
                    max="24"
                    value={endTime}
                    onChange={event => setTimeRange([startTime, Number(event.target.value)])}
                />
            </div>
        </>
    );
};

const container = document.getElementById('root')!;
const root = ReactDOMClient.createRoot(container);

root.render(<App />);
