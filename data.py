import sqlite3
import json

def jsonset(set):
    if set["ids"] != '':
        return json.dumps(onePull(set["ids"]))
    else:
        return json.dumps(allPull())


def allPull():
    con = sqlite3.connect('targets.db')
    cur = con.cursor()
    item = list(cur.execute('SELECT * FROM targets'))
    con.close()
    return item

def onePull(idd):
    con = sqlite3.connect('targets.db')
    cur = con.cursor()
    item = list(cur.execute('SELECT * FROM targets WHERE IP = ?',(idd,)))
    con.close()
    return item 

def create():
    con = sqlite3.connect('targets.db')
    cur = con.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS targets (IP,DNS,USER,COLOR,CLAIM)')
    cur.execute('DELETE FROM targets')
    con.commit()
    con.close()

def add(sett):
    con = sqlite3.connect('targets.db')
    cur = con.cursor()
    cur.execute('INSERT INTO targets VALUES (?,?,?,?,?)',tuple(sett))
    con.commit()
    con.close()

def delete(sett):
    con = sqlite3.connect('targets.db')
    cur = con.cursor()
    cur.execute('DELETE FROM targets WHERE IP = ?',(sett["ip"],))
    con.commit()
    con.close()

def change(sett):
    con = sqlite3.connect('targets.db')
    cur = con.cursor()
    use = []
    if (list(cur.execute("SELECT * FROM targets WHERE IP=?",(sett[0],))) != []):
        ex = list(list(cur.execute("SELECT * FROM targets WHERE IP=?",(sett[0],)))[0])
        for e in range(0,5):
            if sett[e] == "keep":
                use.append(ex[e])
            else:
                use.append(sett[e])
        cur.execute("DELETE FROM targets WHERE IP=?",(use[0],))
        cur.execute("INSERT INTO targets VALUES (?,?,?,?,?)",tuple(use))
    con.commit()
    con.close()

def update(jso):
    try:
        setdef = [jso["ip"],jso["dns"],"","","unclaimed"]
    except:
        setdef = [jso["ip"],"","","","unclaimed"]
    if jso["ops"] == "add":
        add(setdef)
    elif jso["ops"] == "drop":
        delete(jso)
    elif jso["ops"] == "chg":
        change(setdef)
    elif jso["ops"] == "claim":
        setdef = [jso["ip"],"keep",jso["name"],jso["color"],"claimed"]
        change(setdef)
    elif jso["ops"] == "unclaim":
        setdef = [jso["ip"],"keep",'','',"unclaimed"]
        change(setdef)