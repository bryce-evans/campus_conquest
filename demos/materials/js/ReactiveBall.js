/**
 * Creates a metallic looking sphere that reacts
 * like a liquid when you click and drag on it
 *
 * @author Paul Lewis [http://aerotwist.com]
 */
var AEROTWIST = {};
AEROTWIST.ReactiveBall = (function() {

  /* Variables */
  var camera            = null,
      scene             = null,
      renderer          = null,

      // the sphere
      sphereGeometry    = null,
      sphereMaterial    = null,
      sphere            = null,

      // the floor plane
      planeGeometry     = null,
      planeMaterial     = null,
      plane             = null,

      // two lights
      lightFront        = null,
      lightBottom       = null,

      // other misc vars
      callbacks         = null,
      mousePressed      = false,
      cameraOrbit       = 0,
      autoDistortTimer  = null,

  /* Constants */
      CAMERA_ORBIT      = 0.0025,
      DISPLACEMENT      = 0.15,
      SPRING_STRENGTH   = 0.0005,
      DAMPEN            = 0.998,
      ORIGIN            = new THREE.Vector3(),
      DEPTH             = 600;

  /**
   * Creates the 3D scene, camera and WebGL renderer.
   * Then goes ahead and adds the renderer to the body
   */
  function init() {

    var width   = window.innerWidth,
        height  = window.innerHeight,
        ratio   = width / height;

    // set up the scene and camera
    scene       = new THREE.Scene();
    camera      = new THREE.PerspectiveCamera(
      75,       // camera angle,
      ratio,    // viewport ratio
      1,        // near plane, and far plane below
      10000);

    // create a renderer with antialiasing on
    renderer    = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.setSize(width, height);

    // now add the camera to the scene
    // and the WebGL context to the DOM
    scene.add(camera);
    document.body.appendChild(renderer.domElement);

    // do everything else
    createObjects();
    createSprings();
    bindCallbacks();
    displaceRandomFace();
    requestAnimationFrame(animate);
  }

  /**
   * Creates the sphere and the plain (floor) geometries
   */
  function createObjects() {

    // first create the environment map
    var path = "envmap/",
        format = '.jpg',
        urls = [
          path + 'posx' + format, path + 'negx' + format,
          path + 'posy' + format, path + 'negy' + format,
          path + 'posz' + format, path + 'negz' + format
        ],
        textureCube = THREE.ImageUtils.loadTextureCube(urls);

    // create the sphere geometry, based
    // on the Octahedron primitive (since it has no seams)
    sphereGeometry = new THREE.TorusKnotGeometry(120,60,100),
    // new THREE.SphereGeometry(
      // 200,      // radius
      // 60,       // resolution x
      // 30);      // resolution y

    sphereMaterial = new THREE.MeshLambertMaterial({
      color     : 0xEEEEEE,
      envMap    : textureCube,
      shininess : 200,
      shading   : THREE.SmoothShading});

    // now create the sphere and then
    // declare its geometry to be dynamic
    // so we can update it later on
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.geometry.dynamic = true;

    // distance the sphere from the ground
    // a little bit
    sphere.position.y = 100;
    scene.add(sphere);

    // create the floor
    planeGeometry = new THREE.PlaneGeometry( 400, 400, 1 );
    planeMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      map: THREE.ImageUtils.loadTexture("floor.png"),
      transparent: true
    });

    plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // position the floor down a little
    // and rotate it to be perpendicular
    // to the centre of the sphere
    plane.rotation.x = Math.PI * -0.5;
    plane.position.y = -150;
    scene.add(plane);

    // create a light which
    // we can position to the front
    lightFront = new THREE.PointLight(0xFFFFFF, 1.5);
    lightFront.position.y = 400;
    scene.add(lightFront);

    // and another from the bottom
    lightBottom = new THREE.DirectionalLight(0xFFFFFF, 1.3);
    lightBottom.position.y = -240;
    scene.add(lightBottom);

  }

  /**
   * Creates a virtual spring between adjacent vertices in a
   * face. Since vertices are shared between faces
   * in the geometry, the faces are inherently connected to
   * each other
   */
  function createSprings() {

    var sphereFaces = sphere.geometry.faces;

    for(var f = 0; f < sphereFaces.length; f++) {
      var face = sphereFaces[f];

      // these may be Face3s, i.e. composed of
      // three vertices, or Face4s, so we need
      // to double check and not use face.d if
      // it doesn't exist.
      if(face instanceof THREE.Face3) {

        createSpring(face.a, face.b);
        createSpring(face.b, face.c);
        createSpring(face.c, face.a);

      } else {

        createSpring(face.a, face.b);
        createSpring(face.b, face.c);
        createSpring(face.c, face.d);
        createSpring(face.d, face.a);

      }
    }
  }

  /**
   * Creates an individual spring
   *
   * @param {Number} start The index of the vertex for the spring's start
   * @param {Number} end The index of the vertex for the spring's start
   */
  function createSpring(start, end) {
    var sphereVertices = sphere.geometry.vertices;
    var startVertex    = sphereVertices[start];
    var endVertex      = sphereVertices[end];

    // if the springs array does not
    // exist for a particular vertex
    // create it
    if(!startVertex.springs) {
      startVertex.springs = [];

      // take advantage of the one-time init
      // and create some other useful vars
      startVertex.normal = startVertex.position.clone().normalize();
      startVertex.originalPosition = startVertex.position.clone();
    }

    // repeat the above for the end vertex
    if(!endVertex.springs) {
      endVertex.springs = [];
      endVertex.normal = startVertex.position.clone().normalize();
      endVertex.originalPosition = endVertex.position.clone();
    }

    if(!startVertex.velocity) {
      startVertex.velocity = new THREE.Vector3();
    }

    // finally create a spring
    startVertex.springs.push({

      start   : startVertex,
      end     : endVertex,
      length  : startVertex.position.length(
        endVertex.position
      )

    });
  }

  /**
   * Displaces the vertices of a face
   *
   * @param {THREE.Face3|4} face The face to be displaced
   * @param {Number} magnitude By how much the face should be displaced
   */
  function displaceFace(face, magnitude) {

    // displace the first three vertices
    displaceVertex(face.a, magnitude);
    displaceVertex(face.b, magnitude);
    displaceVertex(face.c, magnitude);

    // if this is a face4 do the final one
    if(face instanceof THREE.Face4) {
      displaceVertex(face.d, magnitude);
    }

  }

  /**
   * Displaces an individual vertex
   *
   * @param {Number} vertex The index of the vertex in the geometry
   * @param {Number} magnitude The degree of displacement
   */
  function displaceVertex(vertex, magnitude) {

    var sphereVertices = sphere.geometry.vertices;

    // add to the velocity of the vertex in question
    // but make sure we're doing so along the normal
    // of the vertex, i.e. along the line from the
    // sphere centre to the vertex
    sphereVertices[vertex].velocity.addSelf(

      sphereVertices[vertex].normal.
      clone().
      multiplyScalar(magnitude)

    );
  }

  /**
   * Binds on the callbacks for the mouse
   * clicks and drags as well as the browser
   * resizing events
   */
  function bindCallbacks() {

    // create our callbacks object
    callbacks = {

      /**
       * Called when the browser resizes
       */
      onResize: function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
      },

      /**
       * Called when the user clicks
       *
       * @param {Event} evt The mouse event
       */
      onMouseDown: function(evt) {
        mousePressed = true;
        checkIntersection(evt);

        // clear the timer for the automatic wibble
        clearTimeout(autoDistortTimer);
      },

      /**
       * Called when the user moves the mouse
       *
       * @param {Event} evt The mouse event
       */
      onMouseMove: function(evt) {
        if(mousePressed) {
          checkIntersection(evt);
        }
      },

      /**
       * Called when the user releases
       *
       * @param {Event} evt The mouse event
       */
      onMouseUp: function() {
        mousePressed = false;

        // reset the timer for the automatic wibble
        autoDistortTimer = setTimeout(displaceRandomFace, 2000);
      },

      /**
       * Prevent the user getting the text
       * selection cursor
       */
      onSelectStart: function() {
        return false;
      }
    };

    // now bind them on
    window.addEventListener('resize', callbacks.onResize, false);
    window.addEventListener('mousedown', callbacks.onMouseDown, false);
    window.addEventListener('mousemove', callbacks.onMouseMove, false);
    window.addEventListener('mouseup', callbacks.onMouseUp, false);

    renderer.domElement.addEventListener('selectstart', callbacks.onSelectStart, false);
  }

  /**
   * Chooses a face at random and displaces it
   * then sets the timeout for the next displacement
   */
  function displaceRandomFace() {

    var sphereFaces     = sphere.geometry.faces,
        randomFaceIndex = Math.floor(Math.random() * sphereFaces.length),
        randomFace      = sphereFaces[randomFaceIndex];

    displaceFace(randomFace, DISPLACEMENT);

    autoDistortTimer = setTimeout(displaceRandomFace, 100);
  }

  /**
   * Goes through each vertex's springs
   * and determines what forces are acting on the
   * spring's vertices. It then updates the vertices
   * and also dampens them back to their original
   * position.
   */
  function updateVertexSprings() {

    // go through each spring and
    // work out what the extension is
    var sphereVertices = sphere.geometry.vertices,
        vertexCount    = sphereVertices.length,
        vertexSprings  = null,
        vertexSpring   = null,
        extension      = 0,
        length         = 0,
        force          = 0,
        vertex         = null,
        acceleration   = new THREE.Vector3(0, 0, 0);

    // go backwards, which should
    // be faster than a normal for-loop
    // although that's not always the case
    while(vertexCount--) {

      vertex = sphereVertices[vertexCount];
      vertexSprings = vertex.springs;

      // miss any verts with no springs
      if(!vertexSprings) {
        continue;
      }

      // now go through each individual spring
      for(var v = 0; v < vertexSprings.length; v++) {
        // calculate the spring length compared
        // to its base length
        vertexSpring = vertexSprings[v];
        length = vertexSpring.start.position.
        length(vertexSpring.end.position);

        // now work out how far the spring has
        // extended and use this to create a
        // force which will pull on the vertex
        extension = vertexSpring.length - length;

        // pull the start vertex
        acceleration.copy(vertexSpring.start.normal).multiplyScalar(extension * SPRING_STRENGTH);
        vertexSpring.start.velocity.addSelf(acceleration);

        // pull the end vertex
        acceleration.copy(vertexSpring.end.normal).multiplyScalar(extension * SPRING_STRENGTH);
        vertexSpring.end.velocity.addSelf(acceleration);

        // add the velocity to the position using
        // basic Euler integration
        vertexSpring.start.position.addSelf(
          vertexSpring.start.velocity);
        vertexSpring.end.position.addSelf(
          vertexSpring.end.velocity);

        // dampen the spring's velocity so it doesn't
        // ping back and forth forever
        vertexSpring.start.velocity.multiplyScalar(DAMPEN);
        vertexSpring.end.velocity.multiplyScalar(DAMPEN);

      }

      // attempt to dampen the vertex back
      // to its original position so it doesn't
      // get out of control
      vertex.position.addSelf(
        vertex.originalPosition.clone().subSelf(
          vertex.position
        ).multiplyScalar(0.03)
      );
    }
  }

  /**
   * Checks to see if the mouse click implies
   * a ray intersection with the sphere and, if
   * so, goes about displacing the face that it hit
   *
   * @param {Event} evt The mouse event
   */
  function checkIntersection(evt) {

    // get the mouse position and create
    // a projector for the ray
    var mouseX    = evt.offsetX || evt.clientX,
        mouseY    = evt.offsetY || evt.clientY,
        projector = new THREE.Projector();

    // set up a new vector in the correct
    // coordinates system for the screen
    var vector    = new THREE.Vector3(
       (mouseX / window.innerWidth) * 2 - 1,
      -(mouseY / window.innerHeight) * 2 + 1,
       0.5);

    // now "unproject" the point on the screen
    // back into the the scene itself. This gives
    // us a ray direction
    projector.unprojectVector(vector, camera);

    // create a ray from our current camera position
    // with that ray direction and see if it hits the sphere
    var ray     = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize()),
    intersects  = ray.intersectObject(sphere);

    // if the ray intersects with the
    // surface work out where and distort the face
    if(intersects.length) {
      displaceFace(intersects[0].face, DISPLACEMENT);
    }
  }

  /**
   * The main animation loop, the workhorse of
   * this little experiment of ours
   */
  function animate() {

    // update all the springs and vertex
    // positions
    updateVertexSprings();

    // move the camera around slightly
    // sin + cos = a circle
    cameraOrbit           += CAMERA_ORBIT;
    camera.position.x     = Math.sin(cameraOrbit) * DEPTH;
    camera.position.z     = Math.cos(cameraOrbit) * DEPTH;
    camera.lookAt(ORIGIN);

    // update the front light position to
    // match the camera's orientation
    lightFront.position.x = Math.sin(cameraOrbit) * DEPTH;
    lightFront.position.z = Math.cos(cameraOrbit) * DEPTH;

    // flag that the sphere's geometry has
    // changed and recalculate the normals
    sphere.geometry.__dirtyVertices = true;
    sphere.geometry.__dirtyNormals = true;
    sphere.geometry.computeFaceNormals();
    sphere.geometry.computeVertexNormals();

    // render
    renderer.render(scene, camera);

    // schedule the next run
    requestAnimationFrame(animate);
  }

  // finally get everything under way
  init();


})();