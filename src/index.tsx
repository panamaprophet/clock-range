import { useState, useRef, MouseEventHandler, useEffect } from 'react';
import { convertHoursToAngle, convertAngleToHours, classnames, getFillAngle } from './helpers';
import styles from './styles.module.css';


type TimeRange = [start: number, end: number];

type TimeFormat = '12h' | '24h';

interface Props {
    format: TimeFormat,
    time: TimeRange,
    onChange: (time: TimeRange) => void,
}


export const Clocker = ({ time = [0, 18], onChange = () => {} }: Partial<Props>) => {
    const [isDragging, setDragging] = useState(false);

    const [centerPoint, setCenterPoint] = useState({ x: 0, y: 0 });
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

    const start = convertHoursToAngle(time[0]);
    const end = convertHoursToAngle(time[1]);

    const container = useRef<HTMLDivElement | null>(null);


    const onDragStart: MouseEventHandler = (event) => {
        setDragging(true);
        setStartPoint({ x: event.clientX, y: event.clientY });
    };

    const onDragEnd: MouseEventHandler = () => {
        setDragging(false);
    };

    const onDrag: MouseEventHandler = (event) => {
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
            onMouseDown={onDragStart}
            onMouseMove={onDrag}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
        >
            <svg className={styles.filler} viewBox="0 0 20 20" style={{ transform: `rotate(${start}deg)` }}>
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    fill="transparent"
                    stroke="tomato"
                    strokeWidth="10"
                    strokeDasharray={`calc(${getFillAngle(start, end)} * 31.4 / 100) 31.4`}
                />
            </svg>
            <div className={classnames(styles.handle, styles.handle__start)} style={{ transform: `rotate(${start}deg)` }} />
            <div className={classnames(styles.handle, styles.handle__end)} style={{ transform: `rotate(${end}deg)` }} />
        </div>
    );
};
