import bottle
import data
import sys
import json
import os
import scan



@bottle.route('')
def home():
    return bottle.static_file('home.html',root='static')

@bottle.route('/<page>')
def static(page):
    return bottle.static_file(page,root='static')

@bottle.route('/')
def redir():
    bottle.redirect('/home')

@bottle.post('/get')
def datareturn():
    tmp = json.loads(bottle.request.body.read().decode())
    return data.jsonset(tmp)

@bottle.post('/change')
def dataupdate():
    tmp = json.loads(bottle.request.body.read().decode())
    return data.update(tmp)

scancount=0
@bottle.post('/fileupload')
def fileup():
    global scancount
    upload = bottle.request.files.get('scan')
    name, ext = os.path.splitext(upload.filename)

    if ext != '.xml':
        return "Please upload an XML nmap scan"

    else:
        path = "scans"
        if not os.path.exists(path):
            os.makedirs(path)
        file_path = "{path}/{file}".format(path=path, file='scan'+str(scancount)+'.xml')
        upload.save(file_path)
        scancount+=1
        scan.scan(file_path,{'target':False,'scan':True})

if "--h" in sys.argv:
    out = """Bullwark is a cybersecurity collaboration tool developed by Sean "brad" Manly for the UB NetDef Club and personal use. 

    Options:
        --c > Create a new table (use for first time startup and for clearing the targets)

        --h > Display help"""
    print(out)
    sys.exit()
if "--c" in sys.argv:
    data.create()


bottle.run(host='0.0.0.0',port=8080,debug=True)