var cur_build;
var jsonobj = new Object;

jsonobj.Cornell = new Object;
var map = jsonobj.Cornell;

map.Territories = new Object;

const cur_build_color = 0x55dd80;
const connected_color = 0x544aaaa;
const included_color = 0x44aa66;
const excluded_color = 0xcc6666;


function zoom(event) {
    const sensitivity = 0.6;
    const ceiling = 800;
    const floor = 50;

    var delta = 0;
    delta = event.wheelDelta * sensitivity;
    var newPos = camera.position.y - delta;
    if(delta && newPos < ceiling && newPos > floor) {
        camera.position.y = newPos;
    }

    //prevent default scrolling on page
    if(event.preventDefault)
        event.preventDefault();
    event.returnValue = false;
}

/**
 *click function, colors buildings for territory grab
 *
 */
var weight = .8;
function onMouseDown(event) {

    event.preventDefault();

    var hitobj = getHitObject();

    if(hitobj) {

        console.log(hitobj);

        //select building
        if(!cur_build) {

            cur_build = hitobj;

            cur_build.material = new THREE.MeshBasicMaterial({
                color : cur_build_color
            });

            if(!contains(cur_build.id, map.Territories)) {

				// map.Territories := {}
                map.Territories[cur_build.id] = []

            } else {

                for(connected in map.Territories[cur_build.id]) {
                    objLookup(map.Territories[cur_build.id][connected]).material = new THREE.MeshBasicMaterial({
                        color : connected_color
                    });

                }
            }

        } else {

            //deselect current building
            if(hitobj == cur_build) {

                cur_build.material = new THREE.MeshBasicMaterial({
                    color : included_color
                });

                for(connected in map.Territories[cur_build.id]) {
                    console.log(map.Territories[cur_build.id][connected]);
                    objLookup(map.Territories[cur_build.id][connected]).material = new THREE.MeshBasicMaterial({
                        color : included_color
                    });
                }

                cur_build = null;

                //add connected to current building
            } else if(!contains(hitobj.id, map.Territories[cur_build.id])) {

                hitobj.material = new THREE.MeshBasicMaterial({
                    color : connected_color
                });

                map.Territories[cur_build.id].push(hitobj.id);

                // create non-directed graph

                //add connected to main list
                if(!contains(hitobj.id, map.Territories)) {
                    map.Territories[hitobj.id] = [];
                }

                //append the cur_building to list of connected of this building
                map.Territories[hitobj.id].push(cur_build.id);

                //add line

                var geo = new THREE.Geometry();
                geo.vertices.push(new THREE.Vector3(hitobj.center[0], 2 * hitobj.center[1] + 5, hitobj.center[2]));
                geo.vertices.push(new THREE.Vector3(cur_build.center[0], 2 * cur_build.center[1] + 5, cur_build.center[2]));

                var mat = new THREE.LineBasicMaterial({
                    color : 0x00ff33,
                });

                var line = new THREE.Line(geo, mat);
                scene.add(line);
                //removes from connected if connected already (deselect)
            } else {

                hitobj.material = new THREE.MeshBasicMaterial({
                    color : included_color
                });

                map.Territories[cur_build.id].pop(hitobj.id);

                // maintain non-directed graph
                map.Territories[hitobj.id].pop(cur_build.id);

            }

        }

    }

}

const sensitivity = 6;
const border = .08;

var old_obj;
var cur_obj;
var mat;

function onMouseMove(event) {

    const highlight = new THREE.Color(0xffff00);

    //refresh mouse location for use in other functions
    mouseX = event.x;
    mouseY = event.y;

    // //*****highlights hovered
    // cur_obj = getHitObject();
    //
    // //if mouse is over a new object than last frame
    // //make sure you:
    // // have a current object
    // // either don't have an old one (was over nothing previously)
    // //or the old object isnt the same as the current
    // if(cur_obj && (!old_obj || (cur_obj !== old_obj))) {
    //
    // //set old obj mat back
    // if(old_obj) {
    // old_obj.material["color"] = new THREE.Color(colors[old_obj.team]);
    // }
    //
    // //set new obj to highlight
    // mat = cur_obj.material;
    //
    // //***SOLID HIGHLIGHT
    // //cur_obj.object.material["color"] = highlight;
    //
    // curmat = blend(cur_obj.material["color"], highlight);
    //
    // old_obj = cur_obj;
    // }
    //
    // //undoes highlight if no obj hovered over
    // else if(!cur_obj) {
    // if(old_obj) {
    // old_obj.material["color"] = new THREE.Color(colors[old_obj.team]);
    // old_obj = null;
    // }
    // }

}

function panAuto(x, y) {

    // if(x > (1 - border) * window.innerWidth) {
    // camera.position.x += sensitivity;
    // camera.target.x += sensitivity;
    //
    // } else if(x < border * window.innerWidth) {
    // camera.position.x -= sensitivity;
    // camera.target.x -= sensitivity;
    //
    // }
    //
    // if(y > (1 - border) * window.innerHeight) {
    // camera.position.z += sensitivity;
    // camera.target.z += sensitivity;
    //
    // } else if(y < border * window.innerHeight) {
    // camera.position.z -= sensitivity;
    // camera.target.z -= sensitivity;
    //
    // }

}

function getHitObject() {
    try {
        var vector = new THREE.Vector3((mouseX / window.innerWidth ) * 2 - 1, -(mouseY / window.innerHeight ) * 2 + 1, 0.5);
        projector.unprojectVector(vector, camera);

        var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

        return ray.intersectObjects(board)[0].object;
    } catch(err) {
        return null;
    }
}

function blend(mat1, mat2) {
    mat1.r = (mat1.r + mat2.r) / 2;
    mat1.g = (mat1.g + mat2.g) / 2;
    mat1.b = (mat1.b + mat2.b) / 2;
    return mat1;
}

function contains(obj, array) {

    var ret = false;
    jQuery.each(array, function(key, value) {

        if((String(key)).localeCompare(obj) == 0)
            ret = true;
    });

    return ret;

}

//
function keyControls(e) {
    e = window.event || e;
    e = e.charCode || e.keyCode;

    //enter key
    if(e == 13 && cur_build) {

        cur_build.material = new THREE.MeshBasicMaterial({
            color : included_color
        });

        for(connected in map.Territories[cur_build.id]) {
            console.log(map.Territories[cur_build.id][connected]);
            objLookup(map.Territories[cur_build.id][connected]).material = new THREE.MeshBasicMaterial({
                color : included_color
            });
        }

        cur_build = null;

        //s key
    } else if(e == 115) {

        var JSONstr = JSON.stringify(jsonobj);
        alert("EXPORTING");

        alert(JSONstr);

    }

}