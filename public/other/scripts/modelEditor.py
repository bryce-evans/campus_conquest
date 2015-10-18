import os
import json

# key_path is the where in the tree the key is located
# e.g. key_path=["materials",0]
def changeKey(paths, key_path, orig, new):
  for p in paths:
    f = open(p,'r+')
    js = json.load(f)
    obj = js
    err = False
    for key in key_path:
      if key in obj and not err:
        obj = obj[key]
      else:
        err = True
    if err:
      print("error in ", p)
      continue
    val = obj[orig]
    obj.pop(orig, None)
    obj[new] = val
    # overwrite file
    f.seek(0)
    f.write(json.dumps(js))
    f.truncate()
    f.close()

  
def deleteKey(paths, key_path, to_delete):
 for p in paths:
    f = open(p,'r+')
    js = json.load(f)
    obj = js
    err = False
    for key in key_path:
      if key in obj and not err:
        obj = obj[key]
      else:
        err = True
    if err:
      print("error in ", p)
      continue
    obj.pop(to_delete, None)
    # overwrite file
    f.seek(0)
    f.write(json.dumps(js))
    f.truncate()
    f.close()

def addKey(paths, key_path, to_add, default_val):
 for p in paths:
    f = open(p,'r+')
    js = json.load(f)
    obj = js
    err = False
    for key in key_path:
      if key in obj and not err:
        obj = obj[key]
      else:
        err = True
    if err:
      print("error in ", p)
      continue
    obj[to_add] = default_val
    # overwrite file
    f.seek(0)
    f.write(json.dumps(js))
    f.truncate()
    f.close()
'''
Finds all paths to files 
'''
def getPaths(model_dir="../../rsc/models/map/buildings/"):
  ret = []
  paths = [x[0] for x in os.walk(model_dir)][1:]
  for p in paths:
    files = os.listdir(p)
    d = p.split("/")[-1]
    for f in files:
      parts = f.split(".")
      if parts[0] == d and parts[-1] == "js":
        ret.append(os.path.join(p,f))
  return ret
