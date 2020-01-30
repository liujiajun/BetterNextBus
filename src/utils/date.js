export function getTodayType() {
    let today = new Date();
    if (today.getDay() === 6) return "sat";
    else if (today.getDay() === 0) return "sun-and-ph";
    else return "weekday";
}

export function getTodayTypeDescription() {
    let today = new Date();
    if (today.getDay() === 6) return "Sat";
    else if (today.getDay() === 0) return "Sun/Public holiday";
    else return "Weekday";
}