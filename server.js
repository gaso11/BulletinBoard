//Server Setup

var express = require("express");
var app = express();
var bcrypt = require("bcrypt");
var parseurl = require('parseurl');
var session = require('express-session');
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL || "postgres://postgres:gaso55@localhost:5432/seniorproject"
const pool = new Pool({connectionString: connectionString});

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'keyboard car',
    resave: false,
    saveUninitialized: true
}));

app.set("port", (process.env.PORT || 5000));
app.set('views', 'views');
app.set('view engine', 'ejs');


/****************************************************
* INDEX
****************************************************/
app.get("/", function(req, res) {
    var params = {};
    res.render("login", params);
});

app.get("/search", function(req, res) {
    var params = {};
    
    if (sessionUser != null)
        res.render("search", params);
    else
        res.render("login", params);
});

app.get("/tacobell", function(req, res) {
    var params = {};
    
    if (sessionUser != null)
        res.render("tacobell", params);
    else
        res.render("login", params);
})

app.post("/login", login);
app.post("/register", register);
app.post("/getCompanyComments", getCompanyComments);
app.post("/voteOnComment", voteOnComment);
app.get("/getList", getListOfCompanies);
app.get("/getURL", getURL);
app.get("/getCompany", getCompanyByName);
app.get("/postComment", postComment);

app.listen(app.get("port"), function() {
    console.log("Now listening for connections on port: ", app.get("port"));
});

//Use this for determining who is logged in
var sessionUser = null;

/*************************************************
SERVER FUNCTIONS
*************************************************/

function login(req, res) {
    console.log("Recieved request for login");
    
    //Get vars
    var username = req.query.user;
    var password = req.query.pass;
    var DBHash = "";
    
    console.log(username);
    console.log(password);
    
    getTableFromDBbyUser(username, function(error, result){
        //No login recognized - can't get it to return an error
        if (result[0] == null)
            return null;
        
        DBHash=result[0].hash;
        if(bcrypt.compareSync(password, DBHash)) {
            //"Login"
            req.session.user = result[0].email;
            
            //Pass the session back
            sessionUser = req.session.user;
            res.json(req.session.user);
        }
        else {
            res.send("Failed");
            res.end();
        }
    });
}

function register(req, res) {
	var username = req.query.user;
	var password = req.query.pass;
	var hash = bcrypt.hashSync(password, 10);

    //Maybe add a call here to check the table for an already
    //existing user
	addUserToDB(username, hash, function(err, result){
		res.json(result);
	});
}

function getListOfCompanies(req, res) {
    console.log("Getting List");
    getListOfCompaniesInDB(function(err, result){
        res.json(result);
    });
}

function getURL(req, res) {
    var search = req.query.search;
    
    getURLFromDB(search, function(err, result){
        res.json(result);
    });
}

function getCompanyByName(req, res) {
    var name = req.query.name;
    getCompanyIdByName(name, function(err, result){
        res.json(result);
    });
}

function getCompanyComments(req, res) {
    var id = req.query.id;
    getCompanyCommentsById(id, function(err, result){
        res.json(result);
    });    
}

function voteOnComment(req, res) {
    var companyID = req.query.companyID;
    var commentID = req.query.commentID;
    
    voteOnCommentByID(companyID, commentID, function(err, result){
        res.json(result);
    })
}

function postComment(req, res) {
    var comment = req.query.comment;
    var id = req.query.id;
    
    postCommentToDB(comment, id, function(err, result){
        res.json(result);
    })
}

/************************************************
* DATABASE FUNCTIONS
************************************************/
function addUserToDB(user, hash, callback) {

	var sql = "INSERT INTO users(email, hash) VALUES ($1::text, $2::text)";
	var params = [user, hash];

	pool.query(sql, params, function(error, result) {
		if (error) {
			console.log("Error adding user to Table");
			console.log(error);
			callback(error, null);
		}

		callback(null, result);
	});
}

function getTableFromDBbyUser(user, callback){
    console.log("Getting table with user:", user);
    
    var sql = "SELECT id, email, hash FROM users WHERE email = $1::text";
    var params = [user];
    
    pool.query(sql, params, function(error, result){
        if (error){
            console.log("An error has occured");
            console.log(error);
            callback(error, null);
        }
        
        console.log("Found result: " + JSON.stringify(result.rows));
        
        callback(null, result.rows);
    });
}

function getListOfCompaniesInDB(callback) {
    console.log("Getting list of countries in DB");
    
    var sql = "SELECT company_name FROM companies";
    
    pool.query(sql, function(error, result){
        if (error){
            console.log("An error has occured");
            console.log(error);
            callback(error, null);
        }
        
        console.log("Got list: " + JSON.stringify(result.rows));
        
        callback(null, result.rows);
    });
}

function getURLFromDB(search, callback) {
    console.log("Getting URL from search");
    
    var sql = "SELECT url FROM companies WHERE company_name = '" + search + "'";
    var params = [search];
    console.log(sql);
    pool.query(sql, function(error, result){
        if (error){
            console.log("An error has occured");
            console.log(error);
            callback(error, null);
        }
        console.log("Got result: " + JSON.stringify(result.rows));
        callback(null, result.rows);
    });
}

function getCompanyIdByName(name, callback) {
    console.log("Searching for id by name");
    
    var sql = "SELECT * FROM companies WHERE company_name = '" + name + "'";
    var params = [name];
    console.log(sql);
    pool.query(sql, function(error, result){
        if (error){
            console.log("An error has occured");
            console.log(error);
            callback(error, null);
        }
        console.log("Got result: " + JSON.stringify(result.rows));
        callback(null, result.rows);
    });
}

function getCompanyCommentsById(id, callback) {
    console.log("Searching for comments");
    
    var sql = "SELECT * FROM comments WHERE company_id = '" + id + "'";
    console.log(sql);
    pool.query(sql, function(error, result){
        if (error){
            console.log("An error has occured");
            console.log(error);
            callback(error, null);
        }
        console.log("Got result: " + JSON.stringify(result.rows));
        callback(null, result.rows);
    });    
}

function voteOnCommentByID(companyID, commentID, callback) {
    console.log("Attempting to add vote");
    
    //Just realized I don't need companyID
    var sql = "UPDATE comments SET upvote = upvote + 1 ";
        sql += "WHERE comment_id = " + "'" + commentID + "'" + "RETURNING comment_id, upvote";
    //var sql = "SELECT * FROM comments";
    
    console.log(sql);
    pool.query(sql, function(error, result){
        if (error){
            console.log("An error has occured");
            console.log(error);
            callback(error, null);
        }
        
        callback(null, result);
    });
}

function postCommentToDB(comment, id, callback) {
    console.log("Attempting to add comment");
    console.log(sessionUser);
    
    var sql = "INSERT INTO comments(company_id, user_id, comment, upvote, downvote)"
        sql += "VALUES (" + id + ", " + "(SELECT id FROM users WHERE email = '" + sessionUser + "'), '" + comment + "', 0, 0)";
    
    console.log(sql);
    
    pool.query(sql, function(error, result){
        if (error){
            console.log("An error has occured");
            console.log(error);
            callback(error, null);
        }
        
        callback(null, result);
    })
}

