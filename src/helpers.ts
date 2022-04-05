export const convertHoursToAngle = (hours: number) => {
    let angle = (360 / 100) * ((hours / 12) * 100);

    if (angle < 0) {
        angle += 360;
    }

    if (angle > 360) {
        angle -= 360;
    }

    return angle;
};

export const convertAngleToHours = (angle: number) => {
    return Number(((angle / (360 / 100)) / 100 * 12).toFixed(2));
};

export const getFillAngle = (start: number, end: number) => {
    if (end === start) {
        return 360;
    }

    if (end < start) {
        return (360 - start + end) / 360 * 100;
    }

    return (end - start) / 360 * 100;
};

export const classnames = (...args: string[]) => {
    return args.filter(className => Boolean(className)).join(' ');
};
