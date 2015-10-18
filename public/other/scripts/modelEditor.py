import os
import json

# key_path is the where in the tree the key is located
# e.g. key_path=["materials",0]
def changeKey(key_path, orig, new):
  paths = getPaths()
  for p in paths:
    f = open(p,'r+')
    js = json.load(f)
    obj = js
    for key in key_path:
      obj = obj[key]
    val = obj[orig]
    obj.pop(orig, None)
    obj[new] = val
    # overwrite file
    f.seek(0)
    f.write(json.dumps(js))
    f.truncate()
    f.close()

  
def deleteKey(to_delete):
  print "todo"

def addKey(to_add, default_val):
  print "todo"

'''
Finds all paths to files 
'''
def getPaths(model_dir):
  ret = []
  paths = [x[0] for x in os.walk(model_dir)][1:]
  for p in paths:
    files = os.listdir(p)
    d = p.split("/")[-1]
    for f in files:
      parts = f.split(".")
      if parts[0] == d and parts[-1] == "js":
        ret.append(os.path.join(p,f))
      else:
        print("parts[0]",parts[0])
        print("d",d)
        print("parts[-1]", parts[-1])
        print(p, parts)
  return ret
