import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';
import { convertHoursToAngle, convertAngleToHours, isLongerThan12Hours, getFillAngle, classnames } from './helpers';
import styles from 'bundle-text:./styles.module.css';


interface Props {
    range: number[],
    classNames: Partial<{ [k in 'root' | 'range' | 'circle' | 'handle' | 'handleStart' | 'handleEnd']: string }>,
    onChange: (time: number[]) => void,
}

export const ClockRange = ({ classNames = {}, range, onChange }: Props) => {
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

        const newStartTime = convertAngleToHours(start + delta);
        const newEndTime = convertAngleToHours(end + delta);

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
            className={classnames(styles.root, classNames.root)}
            onMouseMove={onDrag}
            onTouchMove={onDrag}
            onMouseUp={onDragEnd}
            onMouseLeave={onDragEnd}
            onTouchEnd={onDragEnd}
        >
            <svg className={classnames(styles.range, classNames.range)} viewBox="0 0 20 20" style={{ transform: `rotate(${start}deg)` }}>
                {isLongerThan12Hours(range) && <circle
                    r="5"
                    cx="10"
                    cy="10"
                    className={classnames(styles.circle, classNames.circle)}
                />}
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    className={classnames(styles.circle, classNames.circle)}
                    strokeDasharray={`calc(${getFillAngle(start % 360, end % 360)} * 31.4 / 100) 31.4`}
                    onMouseDown={onDragStart('range')}
                    onTouchStart={onDragStart('range')}
                />
            </svg>
            <div
                className={classnames(styles.handle, styles.handle__start, classNames.handle, classNames.handleStart)}
                style={{ transform: `rotate(${start}deg)` }}
                onMouseDown={onDragStart('start')}
                onTouchStart={onDragStart('start')}
            />
            <div
                className={classnames(styles.handle, styles.handle__end, classNames.handle, classNames.handleEnd)}
                style={{ transform: `rotate(${end}deg)` }}
                onMouseDown={onDragStart('end')}
                onTouchStart={onDragStart('end')}
            />
        </div>
    );
};
