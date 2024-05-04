module.exports = {
    NAME: "",
    METHOD: "GET",
    disable: false,
    // ROUTEPARAMS: "abcdi",
    execute: function (req,res) {
        res.status(200).send("This is a INDEX PAGE at API route")
    }
}