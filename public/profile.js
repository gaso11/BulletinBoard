//Script for all company pages

//I couldn't figure out how to get promises or callbacks working in the
//way I wanted, so I'm doing this the gross way

function setup() {
    var company_id;
    var company_obj;

    //Find what page we are on
    var name = document.getElementById("company_name").textContent;
    name = name.replace(" ", "+");
    $.get("/getCompany?name=" + name, function(data, status){
    if (data != null)
        {
            id = data[0].company_id;   
        }
        
        //Now get companyComments
        $.post("/getCompanyComments?id=" + id, function(comments, newStatus){
           if (comments != null)
               {
                    company_obj = comments;   
               }
            //Now are going to have to organize all this data
            
            var totalsuggestions = 0;
            var totalupvotes = 0;
            var totaldownvotes = 0;
            
            //find totals suggestions until I find a fancy way to do it in sql
            for (i = 0; i < company_obj.length; i++) {
                totalsuggestions++;
                totalupvotes += company_obj[i].upvote;
                totaldownvotes += company_obj[i].downvote;
            }
            
            document.getElementsByClassName("pop-num")[0].innerHTML = totalsuggestions;
            document.getElementsByClassName("pop-num")[1].innerHTML = totalupvotes;
            document.getElementsByClassName("pop-num")[2].innerHTML = totaldownvotes;
            
            //Okay, the hard part. Here we would find the users, but nobody has a username
            //So its just going to be numbers, which we conviently have. So lets format the
            //comments into something presentable
            var commentString = "";
            
            //More loop-de-loops
            //This part will have to be re-worked to allow for high comments to be on top.
            //Add in an array or something and sort it by votes...sounds fun.
            
            //Sort object
            
            for (i = 0; i < company_obj.length; i++) {
                var votes = company_obj[i].upvote - company_obj[i].downvote;
                commentString += "<blockquote id=\"post" + i + "\" onclick=\"vote(" 
                              + company_obj[i].company_id + "," + company_obj[i].comment_id + ")\">";
                commentString += company_obj[i].comment;
                commentString += "<b> - posted by user ";
                commentString += company_obj[i].user_id;
                commentString += "</b><br><i> ";
                //I'm not sure I actually need to convert this, but just in case...
                commentString += votes.toString();
                commentString += " points</i></blockquote><br>";
            }
            
            document.getElementsByClassName("posts")[0].innerHTML = commentString;
        });
    });
}

function vote(companyID, commentID) {
    var str = "?companyID=" + companyID + "&commentID=" + commentID;
    $.post("/voteOnComment" + str, function(data, status){
        if (data != null)
            {
                location.reload(true);
            }
    });
}

function addComment() {
    //We will make this more complex as users are fully implemented
    var comment = document.getElementById("commentArea").value;
    comment = comment.replace(" ", "+");
    console.log(comment);
    
    //Find what page we are on
    var name = document.getElementById("company_name").textContent;
    name = name.replace(" ", "+");
    $.get("/getCompany?name=" + name, function(data, status){
    if (data != null)
        {
            id = data[0].company_id;   
        }
    
        $.get("/postComment?comment=" + comment +"&id=" + id, function(data, status){
            if (data != null)
                {
                    location.reload(true);
                }
        });
    });
}