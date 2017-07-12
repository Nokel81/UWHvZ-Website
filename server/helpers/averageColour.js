/**
 * This function will produce the average colour between the two given colours
 * @param  {String} c1 The first colour in css format
 * @param  {String} c2 The second colour in css format
 * @return {String}    The average of c1 and c2 in css format
 */
var averageColour = function(c1, c2) {
    if (typeof c1 !== 'string' || typeof c2 !== 'string') {
        return null;
    }
    if (c1[0] != '#' || c2[0] != '#') {
        return null;
    }
    console.log(c1);
    console.log(c2);
    c1 = c1.substring(1).toLowerCase();
    c2 = c2.substring(1).toLowerCase();
    c1 = c1.length < 6 ? c1[0] + c1[0] + c1[1] + c1[1] + c1[2] + c1[2] : c1.substr(0, 6);
    c2 = c2.length < 6 ? c2[0] + c2[0] + c2[1] + c2[1] + c2[2] + c2[2] : c2.substr(0, 6);
    console.log(c1);
    console.log(c2);

    if (!c1.match(/[0-9a-f]+/g) || !c2.match(/[0-9a-f]+/g)) {
        return null;
    }
    let c1Red = parseInt(c1.substr(0, 2), 16);
    let c1Grn = parseInt(c1.substr(2, 2), 16);
    let c1Blu = parseInt(c1.substr(4, 2), 16);
    let c2Red = parseInt(c2.substr(0, 2), 16);
    let c2Grn = parseInt(c2.substr(2, 2), 16);
    let c2Blu = parseInt(c2.substr(4, 2), 16);

    let resRed = Math.floor(Math.sqrt((c1Red * c1Red + c2Red * c2Red) / 2)).toString(16);
    let resGrn = Math.floor(Math.sqrt((c1Grn * c1Grn + c2Grn * c2Grn) / 2)).toString(16);
    let resBlu = Math.floor(Math.sqrt((c1Blu * c1Blu + c2Blu * c2Blu) / 2)).toString(16);

    if (resRed.length === 1) {
        resRed = "0" + resRed;
    }
    if (resGrn.length === 1) {
        resGrn = "0" + resGrn;
    }
    if (resBlu.length === 1) {
        resBlu = "0" + resBlu;
    }

    return "#" + resRed + resGrn + resBlu;
};

module.exports = averageColour;
