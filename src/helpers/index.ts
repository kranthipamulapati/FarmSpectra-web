function getMonthBounds(date: Date) {
    const firstDay = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
    const lastDay = new Date(date.getUTCFullYear(), date.getUTCMonth() + 2, 0);

    return { firstDay, lastDay };
}

function getUTCDate(inputDate: Date) {
    const date = new Date(inputDate);

    const year = date.getFullYear();
    const month = date.getMonth(); // zero-based
    const day = date.getDate();

    const midnightUTC = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));

    return midnightUTC.toISOString().replace("T", " ");
}

function getUTCRange(date: Date) {
    const startTime = new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            0,
            0,
            0,
            0
        )
    ).toISOString();

    const endTime = new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            23,
            59,
            59,
            999
        )
    ).toISOString();

    return { startTime, endTime };
}

export { getUTCDate, getUTCRange, getMonthBounds };
