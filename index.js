var express = require("express");
var app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    console.log("Recieved request for root");
    
    res.write("This is the root");
    res.end();
});

app.get("/info", function(req, res) {
    console.log("Recieved request for info");
    
    var weight = req.query.weight;
    var option = req.query.mailType;
    
    var total = calcRate(weight, option);
    var jsonstr = makeJsonStr(weight, option, total);
    var params = {weight: weight,
                  option: option,
                  total: total};
    
    res.render("info", {weight: weight,
                        option: option,
                        total: total,
                        jsonstr: jsonstr});
})

app.listen(PORT, function(req, res) {
    console.log("The server is running on port " + PORT);
});

function makeJsonStr(weight, option, total) {
    var text = "{ weight: \"";
    text += weight;
    text += "\", option: \"";
    text += option;
    text += "\", total: ";
    text += total;
    text += " }";
    
    return text;
}

function calcRate(weight, option) {
    var total = 0;
    
    if (option == "Letters(Stamped)")
    {
        if (weight <= 1)
            total = .50;
        else if (weight <= 2)
            total = .71;
        else if (weight <= 3)
            total = .92;
        else if (weight <= 4)
            total = 1.13;
        else {
            //There isn't any more data
            total = 1.13;
        }
    }
    else if (option == "Letters(Metered)")
    {
        if (weight <= 1)
            total = .47;
        else if (weight <= 2)
            total = .68;
        else if (weight <= 3)
            total = .89;
        else if (weight <= 4)
            total = 1.10;
        else {
            //There isn't any more data
            total = 1.10;
        }
    }
    else if (option == "Large Envelopes(Flats)")
    {
        if (weight <= 1)
            total = 1.00;
        else if (weight <= 2)
            total = 1.21;
        else if (weight <= 3)
            total = 1.42;
        else if (weight <= 4)
            total = 1.64;
        else if (weight <= 5)
            total = 1.84;
        else if (weight <= 6)
            total = 2.05;
        else if (weight <= 7)
            total = 2.26;
        else if (weight <= 8)
            total = 2.47;
        else if (weight <= 9)
            total = 2.68;
        else if (weight <= 10)
            total = 2.89;
        else if (weight <= 11)
            total = 3.10;
        else if (weight <= 12)
            total = 3.31;
        else if (weight <= 13)
            total = 3.52;
        else {
            //There isn't any more data
            total = 3.52;
        }
    }
    else if (option == "First-Class Package Service - Retail")
    {
        if (weight <= 1)
            total = 3.50;
        else if (weight <= 2)
            total = 3.50;
        else if (weight <= 3)
            total = 3.50;
        else if (weight <= 4)
            total = 3.50;
        else if (weight <= 5)
            total = 3.75;
        else if (weight <= 6)
            total = 3.75;
        else if (weight <= 7)
            total = 3.75;
        else if (weight <= 8)
            total = 3.75;
        else if (weight <= 9)
            total = 4.10;
        else if (weight <= 10)
            total = 4.45;
        else if (weight <= 11)
            total = 4.80;
        else if (weight <= 12)
            total = 5.15;
        else if (weight <= 13)
            total = 5.50;
        else {
            //There isn't any more data
            total = 5.50;
        }
    }
    
    return total;   
}

