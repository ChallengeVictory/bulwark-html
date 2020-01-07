function openMenu(elem){
    cur = elem.innerHTML;
    addon = targetid(elem.title,elem.id);
    elem.innerHTML = cur + addon;
    elem.onclick = function() {closeMenu(this,cur)};

}

function closeMenu(elem,past){
    elem.onclick = function() {openMenu(this)};
    elem.innerHTML = past;
}

function unclaimed(ip){
    return "<h3>Unclaimed</h3><br><button onclick=claim(this) title=" + ip + ">Claim</button><button onclick='drop(this)' title="+ip+">Drop Target</button>";
}

function claimed(title,ip){
    var name = title.substring(8,title.length);
    if ( name == cookie('name')){
        return "Claimed by: You<br><button onclick='unclaim(this)' title="+ip+">Unclaim</button><button onclick='drop(this)' title="+ip+">Drop Target</button>";
    }
    else{
        return "Claimed by: " + name;
    }
}

function cookie(cname) { //gets the cookie if there is one
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

function targetid(title,ip){
    console.log(title);
    if (title == 'unclaimed'){
        return unclaimed(ip);
    }
    else if (title.substring(0,7) == 'claimed'){
        return claimed(title,ip);
    }
}

function ajaxGetRequest(path, callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
          if (this.readyState===4 && this.status ===200) {
              callback(this.response,path);
            }
    }
    request.open("GET", path);
    request.send();
}

function ajaxPostRequest(path,data,callback) {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState===4 && this.status ===200) {
            if (path == "return"){
                
                return this.response;
            }
            else{
                callback(this.response,path);
            }
          }
  }
  request.open("POST", path);
  request.send(data);
}

function modulo(data){
    use = JSON.parse(data);
    for (each of use){
        console.log(each)
        var tar = document.createElement('div');
        tar.id=each[0];
        var bod = document.getElementById("add");
        bod.appendChild(tar);
        var item = document.getElementById(each[0]);
        item.onclick=function() {openMenu(this)};
        item.className = "target";
        item.innerHTML = "<h3>"+each[0]+'</h3><p>'+each[1]+"</p>";
        if (each[4] == "unclaimed"){
            item.title = each[4];
        }
        else if (each[4] == "claimed"){
            item.title = each[4] + ":" + each[2];
            item.style.borderColor = each[3];
        }
        

    }
}

function update(){
    let set = {};
    set.ops = '';
    set.ids = '';
    ajaxPostRequest('/get',JSON.stringify(set),modulo);
}

function addTarget(){
    let ip = document.getElementById('ip').value;
    let dns = document.getElementById('dns').value;

    if (verifyIP(ip)){
        var set = {};
        set.ops = "add";
        set.ip = ip;
        set.dns = dns;
        ajaxPostRequest('/change',JSON.stringify(set),reload);
    }
    else{
        alert("You have entered a non-valid IP");
    }
}

function verifyIP(ip){
    let counter = 0
    for (each of ip){
        if (each == '.'){
            counter++;
        }
    }
    if (counter==3){
        return true;
    }
    else{
        return false;
    }
}

function reload(a,b){
    location.reload();
}

function claim(item){
    
    var set = {};
    set.ip = item.title;
    set.ops = "claim";
    set.name = cookie("name");
    set.color = cookie("color");
    console.log(set);
    ajaxPostRequest('/change',JSON.stringify(set),reload);
}

function unclaim(item){
    var set = {};
    set.ip = item.title;
    set.ops = "unclaim";
    set.name = cookie("name");
    set.color = cookie("color");
    ajaxPostRequest('/change',JSON.stringify(set),reload);
}

function drop(item){
    var set = {};
    set.ip = item.title;
    set.ops = "drop";
    ajaxPostRequest('/change',JSON.stringify(set),reload);
}