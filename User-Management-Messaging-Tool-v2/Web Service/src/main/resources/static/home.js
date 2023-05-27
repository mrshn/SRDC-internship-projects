let curUser = null;
let regUser = null;
let isAdmin = null;
let adminPrivilege = null;
let userInbox = null;
let userOutbox = null;
let userList = null;
let adminList = null;
let oldUser = null;
let globalAdminCount = null;
let globalUserCount = null;

class Message{
    xmlToMessage(xmlDoc){
        this.Msender = xmlDoc.getElementsByTagName("ns2:Msender")[0].innerHTML;
        this.Mreciever = xmlDoc.getElementsByTagName("ns2:Mreciever")[0].innerHTML;
        this.Mtitle = xmlDoc.getElementsByTagName("ns2:Mtitle")[0].innerHTML;
        this.Mdate = xmlDoc.getElementsByTagName("ns2:Mdate")[0].innerHTML;
        this.theMessage = xmlDoc.getElementsByTagName("ns2:theMessage")[0].innerHTML;
        this.availability = xmlDoc.getElementsByTagName("ns2:availability")[0].innerHTML;
        this.mid = xmlDoc.getElementsByTagName("ns2:mid")[0].innerHTML;
    }
    messageToXml(){
        return  "<gs:Msender>" + this.Msender + "</gs:Msender>" +
            "<gs:Mreciever>" + this.Mreciever + "</gs:Mreciever>" +
            "<gs:Mtitle>" + this.Mtitle + "</gs:Mtitle>" +
            "<gs:Mdate>" + this.Mdate + "</gs:Mdate>" +
            "<gs:theMessage>" + this.theMessage + "</gs:theMessage>" +
            "<gs:availability>" + this.availability + "</gs:availability>" +
            "<gs:mid>" + this.mid + "</gs:mid>";
    }
}

class User{
    xmlToUser(xmlDoc){
        this.username = xmlDoc.getElementsByTagName("ns2:username")[0].innerHTML;
        this.password = xmlDoc.getElementsByTagName("ns2:password")[0].innerHTML;
        this.name = xmlDoc.getElementsByTagName("ns2:name")[0].innerHTML;
        this.surname = xmlDoc.getElementsByTagName("ns2:surname")[0].innerHTML;
        this.gender = xmlDoc.getElementsByTagName("ns2:gender")[0].innerHTML;
        this.mail = xmlDoc.getElementsByTagName("ns2:mail")[0].innerHTML;
        this.birthdate = xmlDoc.getElementsByTagName("ns2:birthdate")[0].innerHTML;
    }
    userToXml(){
        return  "<gs:username>" + this.username + "</gs:username>" +
            "<gs:password>" + this.password + "</gs:password>" +
            "<gs:name>" + this.name + "</gs:name>" +
            "<gs:surname>" + this.surname + "</gs:surname>" +
            "<gs:gender>" + this.gender + "</gs:gender>" +
            "<gs:mail>" + this.mail + "</gs:mail>" +
            "<gs:birthdate>" + this.birthdate + "</gs:birthdate>" ;
    }
}

function login(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', true);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
            "<soapenv:Header/>" +
            "<soapenv:Body>" +
                "<gs:loginRequest>" +
                    "<gs:username>" + document.getElementById("username").value + "</gs:username>" +
                    "<gs:password>" + document.getElementById("password").value + "</gs:password>" +
                "</gs:loginRequest>" +
            "</soapenv:Body>" +
        "</soapenv:Envelope>";
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let error = xmlhttp.responseXML.getElementsByTagName("ns2:error")[0];
            if(error !== undefined){
                document.getElementById("error").innerHTML = error.innerHTML;
            }else{
                curUser = new User();
                curUser.xmlToUser(xmlhttp.responseXML.getElementsByTagName("ns2:user")[0]);
                let userType = xmlhttp.responseXML.getElementsByTagName("ns2:user")[0].attributes.length;
                isAdmin= userType===2 ? true : false;
                //adminPrivilege=0;
                setHomeLogin();
            }
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}

function setRegister(){
    curUser = new User();
    curUser.username="xkraltr";
    curUser.password="123";

    document.getElementById("content").innerHTML =
        "<label>Username:</label>" +
        "<input id=\"username\" type=\"text\" placeholder=\"Enter ur username\" required>" +
        "<label>Password:</label>" +
        "<input id=\"password\" type=\"text\" placeholder=\"Enter ur password\" required>" +
        "<label>Name:</label>" +
        "<input id=\"name\" type=\"text\" placeholder=\"Enter name\" required>" +
        "<label>Surname:</label>" +
        "<input id=\"surname\" type=\"text\" placeholder=\"Enter surname\" required>" +
        "<label>Gender:</label>" +
        "<input id=\"gender\" type=\"text\" placeholder=\"Male or Female or Not Stated\" required>" +
        "<label>Mail:</label>" +
        "<input id=\"mail\" type=\"text\" placeholder=\"Enter mail\" required>" +
        "<label>Birthdate:</label>" +
        "<input id=\"birthdate\" type=\"text\" placeholder=\"YYYY-MM-dd\" required>" +
        "<input type=\"submit\" value=\"add\" onclick=\"registerNewUser()\">" +
        "<div id = \"response\" style =\"color: red;\"></div>";
}

function registerNewUser(){
    regUser = new User();
    regUser.username = document.getElementById("username").value;
    regUser.password = document.getElementById("password").value;
    regUser.name = document.getElementById("name").value;
    regUser.surname = document.getElementById("surname").value;
    regUser.gender = document.getElementById("gender").value;
    regUser.mail = document.getElementById("mail").value;
    regUser.birthdate = document.getElementById("birthdate").value;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', true);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
            "<soapenv:Header/>" +
            "<soapenv:Body>" +
                "<gs:addUserRequest>" +
                    "<gs:curAdmin>" +
                        curUser.userToXml() +
                    "</gs:curAdmin>" +
                    "<gs:newUser>" +
                        regUser.userToXml() +
                    "</gs:newUser>" +
                "</gs:addUserRequest>" +
            "</soapenv:Body>" +
        "</soapenv:Envelope>";
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let response = xmlhttp.responseXML.getElementsByTagName("ns2:response")[0].innerHTML;

            if(response === "Please login first"){
                alert(response);
                logout();
            }else{
                document.getElementById("response").innerHTML = response;
                curUser=null;
                curUser=regUser;
                isAdmin=false;
                setHomeLogin();
            }
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}


function setHomeLogin(){
    document.getElementById("content").innerHTML = "";
    let navbar = document.getElementById("navbar");

    let element = document.createElement("a");
    let text = document.createTextNode("Inbox");
    element.appendChild(text);
    element.setAttribute("onclick", "inbox()");
    navbar.appendChild(element);

    element = document.createElement("a");
    text = document.createTextNode("Outbox");
    element.appendChild(text);
    element.setAttribute("onclick", "outbox()");
    navbar.appendChild(element);

    element = document.createElement("a");
    text = document.createTextNode("Send message");
    element.appendChild(text);
    element.setAttribute("onclick", "setSendMessage()");
    navbar.appendChild(element);

    if(isAdmin === true){
        element = document.createElement("a");
        text = document.createTextNode("List users");
        element.appendChild(text);
        element.setAttribute("onclick", "listUsers()");
        navbar.appendChild(element);

        element = document.createElement("a");
        text = document.createTextNode("Add user");
        element.appendChild(text);
        element.setAttribute("onclick", "setAddUser()");
        navbar.appendChild(element);

        element = document.createElement("a");
        text = document.createTextNode("Add admin");
        element.appendChild(text);
        element.setAttribute("onclick", "setAddAdmin()");
        navbar.appendChild(element);
    }


    element = document.createElement("a");
    text = document.createTextNode("Logout");
    element.style.float = "right";
    element.appendChild(text);
    element.setAttribute("onclick", "logout()");
    navbar.appendChild(element);

    element = document.createElement("a");
    text = document.createTextNode("Hi " + curUser.username );
    element.style.float = "right";
    element.appendChild(text);
    navbar.appendChild(element);



}

function logout(){
    curUser = null;
    //regUser= null;
    isAdmin = null;
    adminPrivilege = null;
    userInbox = null;
    userOutbox = null;
    userList = null;
    adminList = null;
    oldUser = null;
    globalAdminCount = null;
    globalUserCount = null;
    location.href = "home.html";
}

function inbox(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', true);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
        "<soapenv:Header/>" +
        "<soapenv:Body>" +
            "<gs:getInboxRequest>" +
                "<gs:curUser>" +
                    curUser.userToXml() +
                "</gs:curUser>" +
            "</gs:getInboxRequest>" +
        "</soapenv:Body>" +
        "</soapenv:Envelope>";
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let error = xmlhttp.responseXML.getElementsByTagName("ns2:error")[0];
            if(error !== undefined){
                alert(error.innerHTML);
                logout();
            }else{
                let len = xmlhttp.responseXML.getElementsByTagName("ns2:message").length;
                userInbox = new Array(len);
                for(let i = 0; i < len; i++){
                    let message = new Message();
                    message.xmlToMessage(xmlhttp.responseXML.getElementsByTagName("ns2:message")[i]);
                    userInbox[i] = message;
                }
                setInbox();
            }
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}

function setInbox(){
    document.getElementById("content").innerHTML = "";

    let table = document.createElement("table");
    let node = document.createElement("tr");

    let col = document.createElement("th");
    col.innerHTML = "select";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "from";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "date";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "title";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "message";
    node.appendChild(col);

    table.appendChild(node);
    let i = 0;

    for(const message of userInbox){
        node = document.createElement("tr");
        col = document.createElement("td");
        col.innerHTML = "<input type=\"checkbox\" value =" + i + ">";
        i++;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = message.Msender;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = message.Mdate;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = message.Mtitle;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = message.theMessage;
        node.appendChild(col);

        table.appendChild(node);
    }

    document.getElementById("content").appendChild(table);
    //TODO: CHECK
    node = document.createElement("input");
    node.setAttribute("type","submit");
    node.setAttribute("value","delete");
    node.setAttribute("onclick","deleteMessagesFromInbox()");
    document.getElementById("content").appendChild(node);

    node = document.createElement("div");
    node.setAttribute("id", "response");
    node.setAttribute("style", "color: red;");
    document.getElementById("content").appendChild(node);
}
function deleteMessagesFromInbox(){
    let checkboxes = document.getElementsByTagName("input");

    for(var checkbox of checkboxes){
        if(checkbox.checked){
            deleteEachMessage(userInbox[checkbox.value]);
        }
    }
    if(document.getElementById("response").innerHTML === "Please login first"){
        alert("Please login first");
        logout();
    }else{
        inbox();
    }
}



function outbox(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', true);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
            "<soapenv:Header/>" +
            "<soapenv:Body>" +
                "<gs:getOutboxRequest>" +
                    "<gs:curUser>" +
                        curUser.userToXml() +
                    "</gs:curUser>" +
                "</gs:getOutboxRequest>" +
            "</soapenv:Body>" +
        "</soapenv:Envelope>";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let error = xmlhttp.responseXML.getElementsByTagName("ns2:error")[0];
            if(error !== undefined){
                alert(error.innerHTML);
                logout();
            }else{
                let len = xmlhttp.responseXML.getElementsByTagName("ns2:message").length;
                userOutbox = new Array(len);
                for(let i = 0; i < len; i++){
                    let message = new Message();
                    message.xmlToMessage(xmlhttp.responseXML.getElementsByTagName("ns2:message")[i]);
                    userOutbox[i] = message;
                }
                setOutbox();
            }
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}

function setOutbox(){
    document.getElementById("content").innerHTML = "";
    let table = document.createElement("table");

    let node = document.createElement("tr");

    let col = document.createElement("th");
    col.innerHTML = "select";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "to";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "date";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "title";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "message";
    node.appendChild(col);
    table.appendChild(node);
    let i = 0;
    for(const message of userOutbox){
        node = document.createElement("tr");
        col = document.createElement("td");
        col.innerHTML = "<input type=\"checkbox\" value =" + i + ">";
        i++;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = message.Mreciever;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = message.Mdate;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = message.Mtitle;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = message.theMessage;
        node.appendChild(col);

        table.appendChild(node);
    }

    document.getElementById("content").appendChild(table);

    node = document.createElement("input");
    node.setAttribute("type","submit");
    node.setAttribute("value","delete");
    node.setAttribute("onclick","deleteMessagesFromOutbox()");
    document.getElementById("content").appendChild(node);

    node = document.createElement("div");
    node.setAttribute("id", "response");
    node.setAttribute("style", "color: red;");
    document.getElementById("content").appendChild(node);
}


function deleteMessagesFromOutbox(){
    let checkboxes = document.getElementsByTagName("input");
    for(var checkbox of checkboxes){
        if(checkbox.checked){
            deleteEachMessage(userOutbox[checkbox.value]);
        }
    }
    if(document.getElementById("response").innerHTML === "Please login first"){
        alert("Please login first");
        logout();
    }else{
        outbox();
    }
}

function deleteEachMessage(message){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', false);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
            "<soapenv:Header/>" +
            "<soapenv:Body>" +
                "<gs:deleteMessageRequest>" +
                    "<gs:curUser>" +
                        curUser.userToXml() +
                    "</gs:curUser>" +
                    "<gs:message>" +
                        message.messageToXml() +
                    "</gs:message>" +
                "</gs:deleteMessageRequest>" +
            "</soapenv:Body>" +
        "</soapenv:Envelope>";
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let response = xmlhttp.responseXML.getElementsByTagName("ns2:response")[0].innerHTML;
            document.getElementById("response").innerHTML = response;
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}

function setSendMessage(){
    document.getElementById("content").innerHTML =
        "<label>Reciever:</label>" +
        "<input id=\"reciever\" type=\"text\" placeholder=\"Enter recievers username\" required>" +
        "<label>Title:</label>" +
        "<input id=\"title\" type=\"text\" placeholder=\"Enter Message Title\" required>" +
        "<br>"+
        "<label>Message:</label>" +
        "<input id=\"themessage\" type=\"text\" placeholder=\"Enter ur message\" required>" +
        "<br>"+
        "<input type=\"submit\" value=\"send\" onclick=\"sendMessage()\">" +
        "<div id = \"response\" style =\"color: red;\"></div>";
}
function sendMessage(){
    let message = new Message();
    message.Msender = curUser.username;
    message.Mreciever = document.getElementById("reciever").value;
    message.Mtitle = document.getElementById("title").value;
    message.theMessage = document.getElementById("themessage").value;
    message.Mdate = new Date().toISOString().slice(0, 10);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', true);

    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
            "<soapenv:Header/>" +
            "<soapenv:Body>" +
                "<gs:sendMessageRequest>" +
                    "<gs:curUser>" +
                        curUser.userToXml() +
                    "</gs:curUser>" +
                    "<gs:message>" +
                        message.messageToXml() +
                    "</gs:message>" +
                "</gs:sendMessageRequest>" +
            "</soapenv:Body>" +
        "</soapenv:Envelope>";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let response = xmlhttp.responseXML.getElementsByTagName("ns2:response")[0].innerHTML;
            if(response === "Please login first"){//TODO: CHECK
                alert(response);
                logout();
            }else{
                document.getElementById("response").innerHTML = response;
            }
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}

function listUsers(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', true);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
            "<soapenv:Header/>" +
            "<soapenv:Body>" +
                "<gs:getUsersRequest>" +
                    "<gs:curAdmin>" +
                        curUser.userToXml() +
                    "</gs:curAdmin>" +
                "</gs:getUsersRequest>" +
            "</soapenv:Body>" +
        "</soapenv:Envelope>";
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let error = xmlhttp.responseXML.getElementsByTagName("ns2:error")[0];
            if(error !== undefined){
                alert(error.innerHTML);
                logout();
            }else{
                let len = xmlhttp.responseXML.getElementsByTagName("ns2:user").length;
                userList = new Array(len);
                adminList = new Array(len);
                let adminIndex = 0;
                let userIndex = 0;
                for(let i = 0; i < len; i++){
                    let user = new User();
                    let userType = xmlhttp.responseXML.getElementsByTagName("ns2:user")[i].getAttribute('xsi:type');
                    console.log(userType);
                    if(userType==="ns2:admin"){
                        user.xmlToUser(xmlhttp.responseXML.getElementsByTagName("ns2:user")[i]);
                        //user.adminPrivilege = xmlhttp.responseXML.getElementsByTagName("ns2:user")[i].getElementsByTagName("ns2:adminPrivilege")[0].innerHTML;
                        //user.adminPrivilege = xmlhttp.responseXML.getElementsByTagName("ns2:adminPrivilege")[0].innerHTML;
                        adminList[adminIndex] = user;
                        adminIndex++;
                        console.log("aaa");
                    }
                    else {
                        user.xmlToUser(xmlhttp.responseXML.getElementsByTagName("ns2:user")[i]);
                        userList[userIndex] = user;
                        userIndex++;
                        console.log("uuuuu");
                    }
                }
                globalAdminCount = adminIndex;
                globalUserCount =userIndex;
                console.log("xx");console.log(globalAdminCount);console.log("xxx");console.log(globalUserCount);console.log("xxxx");
                setListUsers();
            }
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}
function setListUsers(){
    document.getElementById("content").innerHTML = "";
    let table = document.createElement("table");
    let node = document.createElement("tr");

    let col = document.createElement("th");
    col.innerHTML = "select";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "username";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "name";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "surname";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "gender";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "mail";
    node.appendChild(col);

    col = document.createElement("th");
    col.innerHTML = "birthdate";
    node.appendChild(col);

    // col = document.createElement("th");
    // col.innerHTML = "adminPrivilege";
    // node.appendChild(col);

    table.appendChild(node);

    let i = 0;
    let count = 0 ;
    for(const user of adminList){
        if(count===globalAdminCount){break;}
        count++;
        node = document.createElement("tr");
        col = document.createElement("td");
        col.innerHTML = "<input type=\"checkbox\" value =" + i + ">";
        i++;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.username;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.name;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.surname;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.gender;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.mail;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.birthdate;
        node.appendChild(col);

        // col = document.createElement("td");
        // col.innerHTML = user.adminPrivilege;
        // node.appendChild(col);

        table.appendChild(node);
    }
    count=0;
    for(const user of userList){
        if(count===globalUserCount){break;}
        count++;
        node = document.createElement("tr");
        col = document.createElement("td");
        col.innerHTML = "<input type=\"checkbox\" value =" + i + ">";
        i++;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.username;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.name;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.surname;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.gender;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.mail;
        node.appendChild(col);

        col = document.createElement("td");
        col.innerHTML = user.birthdate;
        node.appendChild(col);

        table.appendChild(node);
    }

    document.getElementById("content").appendChild(table);

    node = document.createElement("input");
    node.setAttribute("type","submit");
    node.setAttribute("value","delete");
    node.setAttribute("onclick","deleteUsers()");
    document.getElementById("content").appendChild(node);

    node = document.createElement("input");
    node.setAttribute("type","submit");
    node.setAttribute("value","update");
    node.setAttribute("onclick","setUpdateUser()");
    document.getElementById("content").appendChild(node);

    node = document.createElement("div");
    node.setAttribute("id", "response");
    node.setAttribute("style", "color: red;");
    document.getElementById("content").appendChild(node);
}

function deleteUsers(){
    let checkboxes = document.getElementsByTagName("input");
    let count=0;
    console.log(globalAdminCount);
    for(var checkbox of checkboxes){
        if(checkbox.checked){
            if(count<globalAdminCount){
                deleteAdmin(adminList[checkbox.value]);console.log("admin is called");
            }
            else{
                deleteUser(userList[checkbox.value-globalAdminCount]);console.log("user is called");
            }
        }
        count++;
    }
    if(document.getElementById("response").innerHTML === "Please login first"){
        alert("Please login first");
        logout();
    }else{
        listUsers();
    }
}

function deleteUser(user){
    console.log("user is called");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', false);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
            "<soapenv:Header/>" +
            "<soapenv:Body>" +
                "<gs:removeUserRequest>" +
                    "<gs:curAdmin>" +
                        curUser.userToXml() +
                    "</gs:curAdmin>" +
                    "<gs:removedUser>" +
                        user.userToXml() +
                    "</gs:removedUser>" +
                "</gs:removeUserRequest>" +
            "</soapenv:Body>" +
        "</soapenv:Envelope>";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let response = xmlhttp.responseXML.getElementsByTagName("ns2:response")[0].innerHTML;
            document.getElementById("response").innerHTML = response;
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}

function deleteAdmin(admin){
    console.log("admin is called");
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', false);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
            "<soapenv:Header/>" +
            "<soapenv:Body>" +
                "<gs:removeAdminRequest>" +
                    "<gs:curAdmin>" +
                        curUser.userToXml() +
                    "</gs:curAdmin>" +
                    "<gs:removedAdmin>" +
                        admin.userToXml() +
                        "<gs:adminPrivilege>"+ admin.adminPrivilege+"</gs:adminPrivilege>\n"+
                    "</gs:removedAdmin>" +
                "</gs:removeAdminRequest>" +
            "</soapenv:Body>" +
        "</soapenv:Envelope>";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let response = xmlhttp.responseXML.getElementsByTagName("ns2:response")[0].innerHTML;
            document.getElementById("response").innerHTML = response;
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}

function setAddUser(){
    document.getElementById("content").innerHTML =
        "<br>"+
        "<label>Username:</label>" +
        "<input id=\"usernamee\" type=\"text\" placeholder=\"Enter ur username\" required>" +
        "<label>Password:</label>" +
        "<input id=\"passwordd\" type=\"text\" placeholder=\"Enter ur password\" required>" +
        "<label>Name:</label>" +
        "<input id=\"name\" type=\"text\" placeholder=\"Enter name\" required>" +
        "<br>"+
        "<label>Surname:</label>" +
        "<input id=\"surname\" type=\"text\" placeholder=\"Enter surname\" required>" +
        "<label>Gender:</label>" +
        "<input id=\"gender\" type=\"text\" placeholder=\"Male or Female or Not Stated\" required>" +
        "<label>Mail:</label>" +
        "<input id=\"mail\" type=\"text\" placeholder=\"Enter mail\" required>" +
        "<br>"+
        "<label>Birthdate:</label>" +
        "<input id=\"birthdate\" type=\"text\" placeholder=\"YYYY-MM-dd\" required>" +
        "<input type=\"submit\" value=\"add\" onclick=\"addUser()\">" +
        "<div id = \"response\" style =\"color: red;\"></div>";
}

function addUser(){
    let newUser = new User();

    newUser.username = document.getElementById("usernamee").value;
    newUser.password = document.getElementById("passwordd").value;
    newUser.name = document.getElementById("name").value;
    newUser.surname = document.getElementById("surname").value;
    newUser.gender = document.getElementById("gender").value;
    newUser.mail = document.getElementById("mail").value;
    newUser.birthdate = document.getElementById("birthdate").value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', true);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
        "<soapenv:Header/>" +
        "<soapenv:Body>" +
            "<gs:addUserRequest>" +
                "<gs:curAdmin>" +
                    curUser.userToXml() +
                "</gs:curAdmin>" +
                "<gs:newUser>" +
                    newUser.userToXml() +
                "</gs:newUser>" +
            "</gs:addUserRequest>" +
        "</soapenv:Body>" +
        "</soapenv:Envelope>";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let response = xmlhttp.responseXML.getElementsByTagName("ns2:response")[0].innerHTML;

            if(response === "Please login first"){
                alert(response);
                logout();
            }else{
                document.getElementById("response").innerHTML = response;
            }
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}

function setAddAdmin(){
    document.getElementById("content").innerHTML =
        "<br>"+
        "<label>Username:</label>" +
        "<input id=\"usernamee\" type=\"text\" placeholder=\"Enter ur username\" required>" +
        "<label>Password:</label>" +
        "<input id=\"passwordd\" type=\"text\" placeholder=\"Enter ur password\" required>" +
        "<label>Name:</label>" +
        "<input id=\"name\" type=\"text\" placeholder=\"Enter name\" required>" +
        "<br>"+
        "<label>Surname:</label>" +
        "<input id=\"surname\" type=\"text\" placeholder=\"Enter surname\" required>" +
        "<label>Gender:</label>" +
        "<input id=\"gender\" type=\"text\" placeholder=\"Male or Female or Not Stated\" required>" +
        "<label>Mail:</label>" +
        "<input id=\"mail\" type=\"text\" placeholder=\"Enter mail\" required>" +
        "<br>"+
        "<label>Birthdate:</label>" +
        "<input id=\"birthdate\" type=\"text\" placeholder=\"YYYY-MM-dd\" required>" +
        "<label>adminPrivilege:</label>" +
        "<input id=\"adminPrivilege\" type=\"number\" placeholder=\"Enter privilege\" required>" +
        "<input type=\"submit\" value=\"add\" onclick=\"addAdmin()\">" +
        "<div id = \"response\" style =\"color: red;\"></div>";
}

function addAdmin(){
    let newUser = new User();

    newUser.username = document.getElementById("usernamee").value;
    newUser.password = document.getElementById("passwordd").value;
    newUser.name = document.getElementById("name").value;
    newUser.surname = document.getElementById("surname").value;
    newUser.gender = document.getElementById("gender").value;
    newUser.mail = document.getElementById("mail").value;
    newUser.birthdate = document.getElementById("birthdate").value;
    newUser.adminPrivilege = document.getElementById("adminPrivilege").value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', true);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
            "<soapenv:Header/>" +
            "<soapenv:Body>" +
                "<gs:addAdminRequest>" +
                    "<gs:curAdmin>" +
                        curUser.userToXml() +
                    "</gs:curAdmin>" +
                    "<gs:newAdmin>" +
                        newUser.userToXml() +
                        "<gs:adminPrivilege>"+ newUser.adminPrivilege+"</gs:adminPrivilege>\n"+
                    "</gs:newAdmin>" +
                "</gs:addAdminRequest>" +
            "</soapenv:Body>" +
        "</soapenv:Envelope>";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let response = xmlhttp.responseXML.getElementsByTagName("ns2:response")[0].innerHTML;
            if(response === "Please login first"){
                alert(response);
                logout();
            }else{
                document.getElementById("response").innerHTML = response;
            }
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}



function setUpdateUser(){
    let checkboxes = document.getElementsByTagName("input");
    let count = 0;
    for(var checkbox of checkboxes){
        if(checkbox.checked){
            if(count<globalAdminCount){
                oldUser =(adminList[checkbox.value]);
                break;
            }
            else{
                oldUser =(userList[checkbox.value - globalAdminCount]);
                break;
            }
        }
        count++;
    }
    if(count<globalAdminCount){
        document.getElementById("content").innerHTML =
            "<label>Username:</label>" +
            "<input id=\"username\" type=\"text\" value=\"" + oldUser.username + "\" required>" +
            "<label>Password:</label>" +
            "<input id=\"password\" type=\"text\" value=\"" + "***" + "\" required>" +
            "<label>Name:</label>" +
            "<input id=\"name\" type=\"text\" value=\"" + oldUser.name + "\" required>" +
            "<label>Surname:</label>" +
            "<input id=\"surname\" type=\"text\" value=\"" + oldUser.surname + "\" required>" +
            "<label>Gender:</label>" +
            "<input id=\"gender\" type=\"text\" value=\"" + oldUser.gender + "\" required>" +
            "<label>Mail:</label>" +
            "<input id=\"mail\" type=\"text\" value=\"" + oldUser.mail + "\" required>" +
            "<label>Birthdate:</label>" +
            "<input id=\"birthdate\" type=\"text\" value=\"" + oldUser.birthdate + "\" required>" +
            "<label>Adminprivilege:</label>" +
            "<input id=\"adminPrivilege\" type=\"text\" value=\"" + "***" + "\" required>" +
            "<input type=\"submit\" value=\"update\" onclick=\"updateAdmin()\">" +
            "<div id = \"response\" style =\"color: red;\"></div>";
    }else{
        document.getElementById("content").innerHTML =
            "<label>Username:</label>" +
            "<input id=\"username\" type=\"text\" value=\"" + oldUser.username + "\" required>" +
            "<label>Password:</label>" +
            "<input id=\"password\" type=\"text\" value=\"" + "***" + "\" required>" +
            "<label>Name:</label>" +
            "<input id=\"name\" type=\"text\" value=\"" + oldUser.name + "\" required>" +
            "<label>Surname:</label>" +
            "<input id=\"surname\" type=\"text\" value=\"" + oldUser.surname + "\" required>" +
            "<label>Gender:</label>" +
            "<input id=\"gender\" type=\"text\" value=\"" + oldUser.gender + "\" required>" +
            "<label>Mail:</label>" +
            "<input id=\"mail\" type=\"text\" value=\"" + oldUser.mail + "\" required>" +
            "<label>Birthdate:</label>" +
            "<input id=\"birthdate\" type=\"text\" value=\"" + oldUser.birthdate + "\" required>" +
            "<input type=\"submit\" value=\"update\" onclick=\"updateUser()\">" +
            "<div id = \"response\" style =\"color: red;\"></div>";
    }
}

function updateUser(){
    let newUser = new User();

    newUser.username = document.getElementById("username").value;
    newUser.password = document.getElementById("password").value;
    newUser.name = document.getElementById("name").value;
    newUser.surname = document.getElementById("surname").value;
    newUser.mail = document.getElementById("mail").value;
    newUser.birthdate = document.getElementById("birthdate").value;
    newUser.gender = document.getElementById("gender").value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', true);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
        "<soapenv:Header/>" +
        "<soapenv:Body>" +
            "<gs:updateUserRequest>" +
                "<gs:curAdmin>" +
                    curUser.userToXml() +
                "</gs:curAdmin>" +
                "<gs:oldUser>" +
                    oldUser.userToXml() +
                "</gs:oldUser>" +
                "<gs:newUser>" +
                    newUser.userToXml() +
                "</gs:newUser>" +
            "</gs:updateUserRequest>" +
        "</soapenv:Body>" +
        "</soapenv:Envelope>";
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            let response = xmlhttp.responseXML.getElementsByTagName("ns2:response")[0].innerHTML;
            if(response === "Please login first"){
                alert(response);
                logout();
            }else{
                document.getElementById("response").innerHTML = response;
            }
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}

function updateAdmin(){
    let newUser = new User();

    newUser.username = document.getElementById("username").value;
    newUser.password = document.getElementById("password").value;
    newUser.name = document.getElementById("name").value;
    newUser.surname = document.getElementById("surname").value;
    newUser.mail = document.getElementById("mail").value;
    newUser.birthdate = document.getElementById("birthdate").value;
    newUser.gender = document.getElementById("gender").value;
    newUser.adminPrivilege = document.getElementById("adminPrivilege").value;

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/ws', true);
    var soupRequest =
        "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:gs=\"http://spring.io/guides/gs-producing-web-service\">" +
        "<soapenv:Header/>" +
        "<soapenv:Body>" +
            "<gs:updateAdminRequest>" +
                "<gs:curAdmin>" +
                    curUser.userToXml() +
                "</gs:curAdmin>" +
                "<gs:oldAdmin>" +
                    oldUser.userToXml() +
                    "<gs:adminPrivilege>"+ oldUser.adminPrivilege+"</gs:adminPrivilege>\n"+
                "</gs:oldAdmin>" +
                "<gs:newAdmin>" +
                    newUser.userToXml() +
                    "<gs:adminPrivilege>"+ newUser.adminPrivilege+"</gs:adminPrivilege>\n"+
                "</gs:newAdmin>" +
            "</gs:updateAdminRequest>" +
        "</soapenv:Body>" +
        "</soapenv:Envelope>";

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            let response = xmlhttp.responseXML.getElementsByTagName("ns2:response")[0].innerHTML;
            if(response === "Please login first"){
                alert(response);
                logout();
            }else{
                document.getElementById("response").innerHTML = response;
            }
        }
    };
    xmlhttp.setRequestHeader('Content-Type', 'text/xml');
    xmlhttp.send(soupRequest);
}