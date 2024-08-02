window.onload=function(){

    //document.getElementById("tab2-p").innerHTML="from main";

    //alert( localStorage.getItem("loginid") );

    //alert( window.location.href );

    if( window.location.pathname=="/load" ){
        getloadinfo();
    }

    if( window.location.href=="http://localhost:8100/load" ){
    
        //getloadinfo();

    }

    if( localStorage.getItem("loginid")==null ){

    }
    else{
        document.getElementById("dash-body").style.display="none";
        document.getElementById("refreshbutt").style.display="block";

        getload( localStorage.getItem("loginid") );




    }

}

function login(){
    
    var username=document.getElementById("username").value ;
    var password=document.getElementById("password").value ;

    //alert( username );
    //alert( password );

    if( username.length==0 ){ alert("Username Is Mendatory"); }
    else if( password.length==0 ){ alert("Password Is Mendatory"); }
    else{

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            
                //document.getElementById("txtHint").innerHTML = this.responseText;
                var res = this.responseText;

                //alert( res );

                if( res=="fail" ){ alert("Username Password Not Match"); }
                else{

                    localStorage.setItem( "loginid", res );

                    //alert( localStorage.getItem("loginid") );

                    window.location.href = '../tabs/tab1/';
                }
            
            }
        };
        xmlhttp.open("GET","https://app.smartdispatchsystem.com/api/driver-login.php?username="+username+"&password="+password,true);
        xmlhttp.send();


    }

}


function signup(){

    var fname=document.getElementById("fname").value;
    var lname=document.getElementById("lname").value;
    var email=document.getElementById("email").value;
    var username=document.getElementById("username").value;
    var pass=document.getElementById("pass").value;
    var conpass=document.getElementById("conpass").value;
    var ref=document.getElementById("ref").value;

    if( pass==conpass ){

        if( fname.length==0 ){ alert("FirstName Is Mendatory"); }
        else if( email.length==0 ){ alert("Email Is Mendatory"); }
        else if( username.length==0 ){ alert("Username Is Mendatory"); }
        else if( pass.length==0 ){ alert("Password Is Mendatory"); }
        else{

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            
                //document.getElementById("txtHint").innerHTML = this.responseText;
                var res = this.responseText;

                if( res=="f" ){ alert("Error:Failed To Create Account"); }
                else if( res=="a" ){ alert("Error: Username "+username +" Allready In Use. Try Another"  ); }
                else{

                    localStorage.setItem( "loginid", res );

                    //alert( localStorage.getItem("loginid") );

                    window.location.href = '../tabs/tab1/';

                }
            
            }
        };
        xmlhttp.open("GET","https://app.smartdispatchsystem.com/api/driver-signup.php?username="+username+"&password="+pass+"&fname="+fname+"&lname="+lname+"&email="+email+"&ref="+ref,true);
        xmlhttp.send();

        }

    }
    else{
        alert("Password Not Match");
    }

}

function openload( lid ){

    localStorage.setItem("loadid", lid );

    //alert( localStorage.getItem("loadid") );

    window.location.href="../../load/";

    

    

}

function getloadinfo(){
    //document.getElementById("loadall-body").innerHTML="Shubham";

    document.getElementById("loadall-body").innerHTML = '<br/><br/><br/><br/><img src="assets/loader.gif" style="width:70%; margin-left:15%;" /><p style="text-align:center;">Loading...</p>';

    var lid=localStorage.getItem("loadid");

    var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            
                document.getElementById("loadall-body").innerHTML = this.responseText;
                //var res = this.responseText;

            
            }
        };
        xmlhttp.open("GET","https://app.smartdispatchsystem.com/api/driver-loadinfo.php?loadid="+lid,true);
        xmlhttp.send();

}

function getload( dlid ){

    document.getElementById("load-body").innerHTML = '<br/><br/><br/><br/><img src="assets/loader.gif" style="width:70%; margin-left:15%;" /><p style="text-align:center;">Loading...</p>';

    var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            
                document.getElementById("load-body").innerHTML = this.responseText;
                //var res = this.responseText;

            
            }
        };
        xmlhttp.open("GET","https://app.smartdispatchsystem.com/api/driver-loadlist.php?loginid="+dlid,true);
        xmlhttp.send();


}

function logout(){

    localStorage.clear();
    window.location.href="../../login";

}

function refresh(){

    var logid=localStorage.getItem("loginid");

    getload( logid );
}

function status( sta ){

    var lid=localStorage.getItem("loadid");

    //alert(lid );

    var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            
                //document.getElementById("load-body").innerHTML = this.responseText;
                var res = this.responseText;
                alert( res );

                if( sta=="op" ){ 
                    document.getElementById("statustag").innerHTML='<ion-button  size="small" style="float:right;" color="danger">Open</ion-button>';
                }
                else if( sta=="ds" ){ 
                    document.getElementById("statustag").innerHTML='<ion-button  size="small" style="float:right;" color="tertiary">Dispatched</ion-button>';
                }
                else if( sta=="co" ){ 
                    document.getElementById("statustag").innerHTML='<ion-button  size="small" style="float:right;" color="primary">Loading</ion-button>';
                }
                else if( sta=="ul" ){ 
                    document.getElementById("statustag").innerHTML='<ion-button  size="small" style="float:right;" color="warning">UnLoading</ion-button>';
                }
                else if( sta=="or" ){ 
                    document.getElementById("statustag").innerHTML='<ion-button  size="small" style="float:right;" color="success">OnRoute</ion-button>';
                }
                else if( sta=="dl" ){ 
                    document.getElementById("statustag").innerHTML='<ion-button  size="small" style="float:right;" color="secondary">Delivered</ion-button>';
                } 
            
            }
        };
        xmlhttp.open("GET","https://app.smartdispatchsystem.com/api/driver-status.php?lid="+lid+"&status="+sta,true);
        xmlhttp.send();

}

function getfile(){

    var lid=localStorage.getItem("loadid");

    document.getElementById("loadall-body").innerHTML = '<br/><br/><br/><br/><img src="assets/loader.gif" style="width:70%; margin-left:15%;" /><p style="text-align:center;">Loading...</p>';
    
    document.getElementById("loadall-body").innerHTML = '<iframe style="border:0px solid red;" src="https://app.smartdispatchsystem.com/api/load/files.php?lid=' +lid +'&uid=0' +'" width="100%" height="600px"></iframe>';

}

function movetomyprofile(){
    //alert();

    window.location.href="../../status/";



}

function changepass(){

    var loginid=localStorage.getItem("loginid");

    var oldpass=document.getElementById("oldpass").value;
    var pass=document.getElementById("pass").value;
    var conpass=document.getElementById("conpass").value;

    if( oldpass.length==0 ){
        alert("Password Is Mendatory");
    }
    else if( pass.length==0 ){
        alert("New Password Is Mendatory");
    }
    else if( pass==conpass ){



        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            
                //document.getElementById("load-body").innerHTML = this.responseText;
                var res = this.responseText;

                alert(res);
                
                window.location.href="./tabs/tab1";

            }
        };
        xmlhttp.open("GET","https://app.smartdispatchsystem.com/api/driver-pass.php?oldpass="+oldpass+"&newpass="+pass+"&loginid="+loginid,true);
        xmlhttp.send();


    }
    else{
        alert("Password And Confirm Password Not Match");
    }

}

function delacc(){

    var loginid=localStorage.getItem("loginid");

    var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            
                //document.getElementById("load-body").innerHTML = this.responseText;
                var res = this.responseText;

                alert(res);
                
                logout();

            }
        };
        xmlhttp.open("GET","https://app.smartdispatchsystem.com/api/driver-delacc.php?loginid="+loginid ,true);
        xmlhttp.send();


}





