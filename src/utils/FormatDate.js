const formatDataTime = (isoDateString) => {
    const originalDate = new Date(isoDateString);
    const localDateString = originalDate.toLocaleString();
    return localDateString;
}

export {
    formatDataTime
}