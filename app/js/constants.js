const AppSettings = {
    appTitle: "Humans vs Zombies",
    apiUrl: "/v1/api",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    buildingMarkerLocations: require("../json/buildingMarkers.json")
};

module.exports = AppSettings;
