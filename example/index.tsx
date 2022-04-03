import React, { useState } from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Clocker } from '../dist';


const App = () => {
    const [[startTime, endTime], setTimeRange] = useState([0, 3]);

    return (
        <>
            <Clocker
                format="24h"
                time={[startTime, endTime]}
                onChange={time => setTimeRange(time)}
            />
            <div>
                <label>
                    startTime [{startTime}]:
                    <br />
                    <input
                        type="range"
                        min="0"
                        max="12"
                        value={startTime}
                        onChange={event => setTimeRange([Number(event.target.value), endTime])}
                    />
                </label>

                <br />

                <label>
                    endTime [{endTime}]:
                    <br />
                    <input
                        type="range"
                        min="0"
                        max="12"
                        value={endTime}
                        onChange={event => setTimeRange([startTime, Number(event.target.value)])}
                    />
                </label>
            </div>
        </>
    );
};

const container = document.getElementById('root')!;
const root = ReactDOMClient.createRoot(container);

root.render(<App />);
