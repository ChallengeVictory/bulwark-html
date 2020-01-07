var open = false;
function openNav() {
    document.getElementById("myNav").style.width = "20%";
    menu(document.getElementById("menu"));
    menu(document.getElementById("menu2"));
  }  

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
    menu(document.getElementById("menu"));
    menu(document.getElementById("menu2"));
    
}

function navCtl(){
    
    if (open){
        closeNav();
    }
    else if (!open){
        openNav();
    }
}

function menu(x) {
    x.classList.toggle("change");
}

function getCookie(cname) { //gets the cookie if there is one
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') { //loops through any and all values in the cookie
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) { //and returns the right one
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }
function setCookie(key,val,days){ //sets a cookie and expiration date for it
    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000)); //setting up time for cookie expiration
    var expires = "expires="+d.toUTCString();
    document.cookie = key+'='+val+';'+expires+";path=/";
}
function checkCookie(cookie) { //simple and quick cookie check
    var name = getCookie(cookie);
    if (name != "") {
    return name;
    }
    else{
      return "";
    }
}

function check(){
    if (checkCookie("name") != "" && checkCookie("color") != ""){
        tmp = document.getElementById('unassigned');
        tmp.style.display = "none";
        tmp = document.getElementById('assigned');
        tmp.style.display = "inline";
        tmp = document.getElementById('wel');
        tmp.innerHTML = ('Welcome ' + name + '. You\'re already identified, please continue to the other pages.');
    }
    else{
    }
    accLoad();
}

function assign(){
    color = document.getElementById("colour").value;
    name = document.getElementById("name").value;
    setCookie("name",name,7);
    setCookie("color",color,7);
    console.log('set')
    check();
}

function accLoad(){
  if (getCookie("name") != "" && getCookie("color")){
    circ(getCookie("color"));
    acc = document.getElementById("acc");
    acc.innerHTML = getCookie("name");
  }
  else{
    acc = document.getElementById("acc");
    acc.innerHTML = "failure";
  }
}

function circ(color){
  var canvas = document.getElementById('circle');
      var context = canvas.getContext('2d');
      var centerX = canvas.width / 2;
      var centerY = canvas.height / 2;
      var radius = 15;

      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      context.fillStyle = color;
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#003300';
      context.stroke();
}