import React, { useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { ClockRange, formatTime } from '../src';


const App = () => {
    const [timeRange, setTimeRange] = useState([0, 13]);
    const [startTime, endTime] = timeRange;

    return (
        <>
            <ClockRange range={timeRange} onChange={range => setTimeRange(range)} />

            {/* optional stuff */}

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
