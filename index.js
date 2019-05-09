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