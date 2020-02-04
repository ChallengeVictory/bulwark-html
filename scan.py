import xml.etree.ElementTree as et
import data
import sqlite3

def readscan(filename):
    items = []
    tree = et.parse(filename)
    root = tree.getroot()

    for n in range(3,len(root)-2):
        temp = {}
        try:
            temp['ipv4'] = root[n][1].attrib['addr']
        except:
            temp['ipv4'] = ''

        try:
            temp['hostname'] = root[n][3][0].attrib['name']
        except:
            temp['hostname'] = ''

        try:
            port = ''
            for each in root[n][4]:
                port+=':' + each.attrib['portid'] + '-' + each[1].attrib['name']
            temp['ports'] = port + ':'
        except:
            temp['ports'] = ''

        items.append(temp)

    return items

def scan(filename, ops):
    items = readscan(filename)
    if ops['target'] == True:
        targetload(items)
    if ops['scan'] == True:
        scandb(items)

def targetload(items):
    for each in items:
        jso = {'ip':each['ipv4'],'dns':each['hostname'],'ops':'add'}
        data.update(jso)

def scandb(items):
    startdb()
    con = sqlite3.connect('scanAgg.db')
    cur = con.cursor()
    for each in items:
        if (list(cur.execute("SELECT * FROM scan WHERE IP=?",(each['ipv4'],))) == []):
            temp = each['ipv4'].split('.')
            subnet = temp[0]+temp[1]+temp[2]
            cur.execute("INSERT INTO scan VALUES (?,?,?,?)",(each['ipv4'],each['hostname'],subnet,each['ports']))

def startdb():
    con = sqlite3.connect('scanAgg.db')
    cur = con.cursor()
    cur.execute('CREATE TABLE IF NOT EXISTS scan (IP,HOST,SUBNET,PORT)')
    con.commit()
    con.close()