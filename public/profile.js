//Script for all company pages

//I couldn't figure out how to get promises or callbacks working in the
//way I wanted, so I'm doing this the gross way

function setup() {
    var company_id;
    var company_obj;

    //Find what page we are on
    var name = document.getElementById("company_name").textContent;
    name = name.replace(" ", "+");
    console.log(name);
    $.get("/getCompany?name=" + name, function(data, status){
    if (data != null)
        {
            id = data[0].company_id;   
        }
        
        console.log("Database returned " + id);
        
        //Now get companyComments
        $.post("/getCompanyComments?id=" + id, function(comments, newStatus){
           if (comments != null)
               {
                    company_obj = comments;
                    console.log(comments);   
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
        });
    });
}