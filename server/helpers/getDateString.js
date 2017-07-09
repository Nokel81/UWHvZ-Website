const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getGetOrdinal(n) {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getDateString(date) {
    let hours = date.getHours();
    let noonHalf = "AM"
    if (hours >= 12) {
        noonHalf = "PM";
    }
    return days[date.getDay()] + " " + months[date.getMonth()] + " " + getGetOrdinal(date.getDate()) + " " + date.getFullYear() + " at " + hours + ":" + date.getMinutes() + noonHalf;
}

module.exports = getDateString;
