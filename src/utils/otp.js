const makeOtp = (number) => {
    var result = "";
    var characters = "123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < number; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = makeOtp