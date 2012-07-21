var cur_build;
var map = new Object;

const cur_build_color = 0x00ff33;
const connected_color = 0x0088cc;

map.territories = [];

/*
 * Generates an arrow between two buildings
 *
 * id1- string id of start building
 * id2- string id of end building
 * strength- thickness of arrow
 */
arrow = function(id1, id2, strength) {

    var p1 = getObj(id1).center;
    var p2 = getObj(id2).center;

    var mag = Math.sqrt(Math.pow((p1[0] - p2[0]), 2) + Math.pow((p1[2] - p2[2]), 2));
    var theta = -(Math.atan((p2[2] - p1[2]) / (p2[0] - p1[0]))) + Math.PI;

    //correct for atan range
    if(p2[0] < p1[0]) {
        theta += Math.PI;
    }

    var loader = new THREE.JSONLoader();
    loader.load("../rsc/obj/aaa_arrow/arrow.js", function(geometry) {

        geometry.computeMorphNormals();

        material = new THREE.MeshLambertMaterial({
            color : 0xff0000,
            shading : THREE.FlatShading
        });

        var mesh = new THREE.Mesh(geometry, material);

        mesh.scale.set((1 / (scale)) * mag * scale - .5*(scale), .1 * mag * scale, .5 * strength * scale);

        mesh.position.x = getObj(id1).center[0];
        mesh.position.z = getObj(id1).center[2];
        mesh.position.y = 15;
        mesh.rotation.y = theta;

        scene.add(mesh);

    });
}
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

            if(!contains(cur_build.id, map.territories)) {

                map.territories.push(cur_build.id);
                map.territories[cur_build.id] = [];

            } else {

                for(connected in map.territories[cur_build.id]) {
                    instance(map.territories[cur_build.id][connected]).material = new THREE.MeshBasicMaterial({
                        color : connected_color
                    });

                }
            }

        } else {

            //deselect current building
            if(hitobj == cur_build) {

                cur_build.material = new THREE.MeshBasicMaterial({
                    color : 0xffffff
                });

                for(connected in map.territories[cur_build.id]) {
                    console.log(map.territories[cur_build.id][connected]);
                    getObj(map.territories[cur_build.id][connected]).material = new THREE.MeshBasicMaterial({
                        color : 0xffffff
                    });
                }

                cur_build = null;

                //add connected to current building
            } else if(!contains(hitobj.id, map.territories[cur_build.id])) {

                hitobj.material = new THREE.MeshBasicMaterial({
                    color : connected_color
                });

                map.territories[cur_build.id].push(hitobj.id);

                // create non-directed graph

                //add connected to main list
                if(!contains(hitobj.id, map.territories)) {

                    map.territories.push(hitobj.id);
                    map.territories[hitobj.id] = [];

                }

                //append the cur_building to list of connected of this building
                map.territories[hitobj.id].push(cur_build.id);

                new arrow(cur_build.id, hitobj.id, 10);

                //removes from connected if connected already (deselect)
            } else {

                hitobj.material = new THREE.MeshBasicMaterial({
                    color : 0xffffff
                });

                map.territories[cur_build.id].pop(hitobj.id);

                // maintain non-directed graph
                map.territories[hitobj.id].pop(cur_build.id);

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

}

function panAuto(x, y) {

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

    for(index in array) {

        if(index == obj) {
            return true;
        }
    }
    return false;
}

//
function keyControls(e) {
    e = window.event || e;
    e = e.charCode || e.keyCode;

    //enter key
    if(e == 13 && cur_build) {

        cur_build.material = new THREE.MeshBasicMaterial({
            color : 0xffffff
        });

        for(connected in map.territories[cur_build.id]) {
            console.log(map.territories[cur_build.id][connected]);
            getObj(map.territories[cur_build.id][connected]).material = new THREE.MeshBasicMaterial({
                color : 0xffffff
            });
        }

        cur_build = null;
    }

}