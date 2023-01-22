import { useState, useRef, MouseEventHandler, useEffect } from 'react';
import styles from './styles.module.css';


type TimeRange = [start: number, end: number];


const convertHoursToAngle = (hours: number) => (360 / 12) * hours;

const convertAngleToHours = (angle: number) => angle / (360 / 12);

const getFillAngle = (start: number, end: number) => {
    if (end === start) {
        return 360;
    }

    if (end <= start) {
        return (360 - start + end) / 360 * 100;
    }

    return (end - start) / 360 * 100;
};

const classnames = (...args: string[]) => args.filter(Boolean).join(' ');


const Circle = (customProps: { [k: string]: unknown }) => {
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

    return <circle {...props} />;
};

export const Clocker = ({
    time = [0, 18],
    onChange = () => {},
}: {
    time: TimeRange,
    onChange: (time: TimeRange) => void,
}) => {
    const [isDragging, setDragging] = useState(false);

    const [centerPoint, setCenterPoint] = useState({ x: 0, y: 0 });
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

    const start = convertHoursToAngle(time[0]);
    const end = convertHoursToAngle(time[1]);

    // @todo: fix the second circle
    const hasAdditionalCircle = (end - start < 0) || (Math.abs(time[1] - time[0]) > 12);

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

        const startAngle = Math.atan2(startPoint.y - centerPoint.y, startPoint.x - centerPoint.x) * 180 / Math.PI;
        const currentAngle = Math.atan2(position.y - centerPoint.y, position.x - centerPoint.x) * 180 / Math.PI;

        let delta = (currentAngle - startAngle);

        // @todo:
        // sometimes delta surprisingly comes extrimely high 
        // need to figure out how to normalize it properly
        if (delta < -100) delta += 360;
        if (delta > 100) delta -= 360;

        let newStartTime = convertAngleToHours(start + delta) % 24;
        let newEndTime = convertAngleToHours(end + delta) % 24;

        if (newStartTime < 0) newStartTime += 24;
        if (newEndTime < 0) newEndTime += 24;

        onChange([newStartTime, newEndTime]);

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
                <Circle strokeDasharray={`calc(${getFillAngle(start % 360, end % 360)} * 31.4 / 100) 31.4`} />
            </svg>
            <div className={classnames(styles.handle, styles.handle__start)} style={{ transform: `rotate(${start}deg)` }} />
            <div className={classnames(styles.handle, styles.handle__end)} style={{ transform: `rotate(${end}deg)` }} />
        </div>
    );
};
