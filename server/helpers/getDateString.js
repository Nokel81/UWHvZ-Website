const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getGetOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getDateString(date, short) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    let hours = date.getHours();
    let noonHalf = "AM";
    if (hours >= 12) {
        noonHalf = "PM";
    }
    if (hours > 12) {
        hours -= 12;
    }
    if (hours < 10) {
        hours = "0" + hours.toString();
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes.toString();
    }
    if (short) {
        return days[date.getDay()] + " " + months[date.getMonth()] + " " + getGetOrdinal(date.getDate()) + " " + date.getFullYear();
    }
    return days[date.getDay()] + " " + months[date.getMonth()] + " " + getGetOrdinal(date.getDate()) + " " + date.getFullYear() + " at " + hours + ":" + minutes + noonHalf;
}

module.exports = getDateString;
