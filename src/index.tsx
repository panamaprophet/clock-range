import { useState, useRef, MouseEventHandler, useEffect, useMemo } from 'react';
import styles from './styles.module.css';


type TimeRange = [start: number, end: number];

type TimeFormat = '12h' | '24h';

interface Props {
    format: TimeFormat,
    time: TimeRange,
    onChange: (time: TimeRange) => void,
}

const normalize = (value: number): number => value > 360 ? normalize(value - 360) : value;

// function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
// //     const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

// //     return {
// //         x: centerX + (radius * Math.cos(angleInRadians)),
// //         y: centerY + (radius * Math.sin(angleInRadians))
// //     };
// // }


// 0 - 3
// 90 - 6
// -180 - 9
// -90 - 12

const convertHoursToAngle = (hours: number) => {
    let angle = (360 / 100) * ((hours / 12) * 100);

    if (angle < 0) {
        angle += 360;
    }

    if (angle > 360) {
        angle -= 360;
    }

    return angle;
};

const convertAngleToHours = (angle: number) => +((angle / (360 / 100)) / 100 * 12).toFixed(2);


export const Clocker = ({ time = [0, 18], onChange = () => {} }: Partial<Props>) => {
    const [isDragging, setDragging] = useState(false);

    const [centerPoint, setCenterPoint] = useState({ x: 0, y: 0 });
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

    const start = convertHoursToAngle(time[0]);
    const end = convertHoursToAngle(time[1]);

    const handle = useRef<HTMLDivElement | null>(null);
    const container = useRef<HTMLDivElement | null>(null);


    const onMouseDown: MouseEventHandler = (event) => {
        setDragging(true);
        setStartPoint({ x: event.clientX, y: event.clientY });
    };

    const onMouseUp: MouseEventHandler = () => {
        setDragging(false);
        onChange(time);
    };

    const onMouseLeave: MouseEventHandler = () => {
        setDragging(false);
        onChange(time);
    };

    const onMouseMove: MouseEventHandler = (event) => {
        if (!isDragging) {
            return;
        }

        const position = {
            x: event.clientX,
            y: event.clientY,
        };

        const startAngle = Math.atan2(startPoint.y - centerPoint.y, startPoint.x - centerPoint.x);
        const currentAngle = Math.atan2(position.y - centerPoint.y, position.x - centerPoint.x);
        const delta = (currentAngle - startAngle) * 180 / Math.PI;

        onChange([
            convertAngleToHours(start + delta),
            convertAngleToHours(end + delta),
        ]);

        setStartPoint(position);
    };


    useEffect(() => {
        const containerPosition = container.current?.getBoundingClientRect()!;

        const x = containerPosition.x + containerPosition.width / 2;
        const y = containerPosition.y + containerPosition.height / 2;

        setCenterPoint({ x, y });
    }, []);


    return (
        <div
            ref={container}
            className={styles.root}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            <div
                ref={handle}
                className={styles.handle}
                style={{ transform: `rotate(${start}deg)` }}
            />
            <div
                className={[styles.handle, styles['handle--end']].join(' ')}
                style={{ transform: `rotate(${end}deg)` }}
            />
        </div>
    );
};
