function getMonthBounds(date: Date) {
    const firstDay = new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
    const lastDay = new Date(date.getUTCFullYear(), date.getUTCMonth() + 2, 0);

    return { firstDay, lastDay };
}

export { getMonthBounds };
