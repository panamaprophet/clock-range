export const classnames = (...args: unknown[]) => args.filter(Boolean).filter(item => typeof item !== 'object').join(' ');

export const convertHoursToAngle = (hours: number) => (360 / 12) * hours;

export const convertAngleToHours = (angle: number) => {
    const result = (angle / (360 / 12)) % 24;

    return result < 0 ? result + 24 : result;
}

export const getFillAngle = (start: number, end: number) => {
    if (end === start) {
        return 360;
    }

    if (end <= start) {
        return (360 - start + end) / 360 * 100;
    }

    return (end - start) / 360 * 100;
};

export const isLongerThan12Hours = ([startTime, endTime]: number[]) => {
    if (endTime - startTime < 0) {
        return (24 + endTime - startTime) > 12;
    }

    return (endTime - startTime) > 12;
};

export const formatTime = (time: number) => {
    const hours = time | 0;
    const minutes = (time % 1) * 60 | 0;

    return [hours, minutes]
        .map(t => t
            .toString()
            .padStart(2, '0'))
        .join(':');
};
