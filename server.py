import bottle
import data
import sys
import json

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