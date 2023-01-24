import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import styles from './styles.module.css';


const classnames = (...args: string[]) => args.filter(Boolean).join(' ');

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

const isLongerThan12Hours = ([startTime, endTime]: number[]) => {
    if (endTime - startTime < 0) {
        return (24 + endTime - startTime) > 12;
    }

    return (endTime - startTime) > 12;
};


interface Props {
    range: number[],
    onChange: (time: number[]) => void,
}


export const formatTime = (time: number) => {
    const hours = time | 0;
    const minutes = (time % 1) * 60 | 0;

    return [hours, minutes]
        .map(t => t
            .toString()
            .padStart(2, '0'))
        .join(':');
};

export const ClockRange = ({ range = [0, 18], onChange }: Props) => {
    const [dragType, setDragType] = useState<'range' | 'start' | 'end' | null>(null);

    const [centerPoint, setCenterPoint] = useState({ x: 0, y: 0 });
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

    const start = convertHoursToAngle(range[0]);
    const end = convertHoursToAngle(range[1]);

    const container = useRef<HTMLDivElement | null>(null);

    const onDragStart =
        (type: 'range' | 'start' | 'end') =>
            <T,>(event: MouseEvent<T> | TouchEvent<T>) => {
                const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
                const y = 'touches' in event ? event.touches[0].clientY : event.clientY;

                setStartPoint({ x, y });
                setDragType(type);
            };

    const onDragEnd = () => {
        setDragType(null);
    };

    const onDrag = <T,>(event: MouseEvent<T> | TouchEvent<T>) => {
        if (!dragType) {
            return;
        }

        const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const y = 'touches' in event ? event.touches[0].clientY : event.clientY;

        const startAngle = Math.atan2(startPoint.y - centerPoint.y, startPoint.x - centerPoint.x) * 180 / Math.PI;
        const currentAngle = Math.atan2(y - centerPoint.y, x - centerPoint.x) * 180 / Math.PI;

        let delta = (currentAngle - startAngle);

        if (delta < -100) delta += 360;
        if (delta > 100) delta -= 360;

        let newStartTime = convertAngleToHours(start + delta) % 24;
        let newEndTime = convertAngleToHours(end + delta) % 24;

        if (newStartTime < 0) newStartTime += 24;
        if (newEndTime < 0) newEndTime += 24;

        if (dragType === 'range') {
            onChange([newStartTime, newEndTime]);
        }

        if (dragType === 'start') {
            onChange([newStartTime, range[1]]);
        }

        if (dragType === 'end') {
            onChange([range[0], newEndTime]);
        }

        setStartPoint({ x, y });
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
            onMouseMove={onDrag}
            onTouchMove={onDrag}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchEnd={onDragEnd}
        >
            <svg className={styles.range} viewBox="0 0 20 20" style={{ transform: `rotate(${start}deg)` }}>
                {isLongerThan12Hours(range) && <circle
                    r="5"
                    cx="10"
                    cy="10"
                    className={styles.circle}
                />}
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    className={styles.circle}
                    strokeDasharray={`calc(${getFillAngle(start % 360, end % 360)} * 31.4 / 100) 31.4`}
                    onMouseDown={onDragStart('range')}
                    onTouchStart={onDragStart('range')}
                />
            </svg>
            <div
                className={classnames(styles.handle, styles.handle__start)}
                style={{ transform: `rotate(${start}deg)` }}
                onMouseDown={onDragStart('start')}
                onTouchStart={onDragStart('start')}
            />
            <div
                className={classnames(styles.handle, styles.handle__end)}
                style={{ transform: `rotate(${end}deg)` }}
                onMouseDown={onDragStart('end')}
                onTouchStart={onDragStart('end')}
            />
        </div>
    );
};
