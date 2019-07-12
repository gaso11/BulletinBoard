function login() {
    var email = $('#logemail').val();
    var pass = $('#logpassword').val();
    
    $.post("/login?user=" + email + "&pass=" + pass, function(data, status){
        if (data != null)
        {
            window.location = '/search';
        }
        else
        {
            alert("Login failed");
        }
    });
}

function register() {
    var email = $('#regemail').val();
    var pass = $('#regpassword').val();
    
    $.post("/register?user=" + email + "&pass=" + pass, function(data, status){
        if (data != "Failed") {
            //TODO: Make this a modal later
            alert("Registration Successful, you may now sign in");
        }
        else {
            //Here for debugging, the only reason it would fail after coding
            //is if the database died...which I guess it could
            alert("Registration failed");
        }
    })
}