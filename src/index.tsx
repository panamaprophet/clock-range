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


const is24 = (format: TimeFormat) => format === '24h';

const convert24to12 = (hours: number) => hours > 12 ? hours - 12 : hours;


const Circle = (customProps: {[k: string]: unknown}) => {
    const defaultProps = {
        r: 5,
        cx: 10,
        cy: 10,
        fill: 'transparent',
        stroke: 'tomato',
        strokeWidth: 10,
        strokeOpacity: 0.5, 
    };

    const props = {
        ...defaultProps,
        ...customProps,
    };

    return <circle { ...props } />;
}


export const Clocker = ({ format = '24h', time = [0, 18], onChange = () => {} }: Partial<Props>) => {
    const [isDragging, setDragging] = useState(false);

    const [centerPoint, setCenterPoint] = useState({ x: 0, y: 0 });
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

    const startHours = is24(format) ? convert24to12(time[0]) : time[0];
    const endHours = is24(format) ? convert24to12(time[1]) : time[1];

    const hasAdditionalCircle = Math.abs(time[1] - time[0]) > 12;

    const start = convertHoursToAngle(startHours);
    const end = convertHoursToAngle(endHours);

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
                {hasAdditionalCircle && <Circle />}
                <Circle strokeDasharray={`calc(${getFillAngle(start, end)} * 31.4 / 100) 31.4`} />
            </svg>
            <div className={classnames(styles.handle, styles.handle__start)} style={{ transform: `rotate(${start}deg)` }} />
            <div className={classnames(styles.handle, styles.handle__end)} style={{ transform: `rotate(${end}deg)` }} />
        </div>
    );
};
