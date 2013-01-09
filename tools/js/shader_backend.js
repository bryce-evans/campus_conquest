const bg = 0x000006;

var container, stats;
var view = "torus";

var renderer = new THREE.WebGLRenderer({
	antialias : true,
	clearColor : bg,
	clearAlpha : 1
});
renderer.setSize(viewportWidth, viewportHeight);
$('#' + containerId).append(renderer.domElement);
var clock = new THREE.Clock();

var camera, scene, renderer, composer;

var uniforms, material, mesh;

var mouseX = 0, mouseY = 0, lat = 0, lon = 0, phy = 0, theta = 0;

var width = window.innerWidth || 2;
var height = window.innerHeight || 2;

var windowHalfX = width / 2;
var windowHalfY = height / 2;

init();
animate();

function init() {

	scene = new THREE.Scene();

	if (view == "torus" || view == "sphere") {
		camera = new THREE.PerspectiveCamera(35, windowHalfX / windowHalfY, 1, 3000);
		camera.position.z = 4;
	} else {
		camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100.0);
		camera.position.z = 1.0;
	}

	scene.add(camera);

	var size = 0.65;

	uniforms = {

		fogDensity : {
			type : "f",
			value : 0.45
		},
		fogColor : {
			type : "v3",
			value : new THREE.Vector3(0, 0, 0)
		},
		time : {
			type : "f",
			value : 1.0
		},
		resolution : {
			type : "v2",
			value : new THREE.Vector2()
		},
		uvScale : {
			type : "v2",
			value : new THREE.Vector2(3.0, 1.0)
		},
		texture1 : {
			type : "t",
			value : THREE.ImageUtils.loadTexture("images/cloud.png")
		},
		texture2 : {
			type : "t",
			value : THREE.ImageUtils.loadTexture("images/icetile.png")
		}

	};

	uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
	uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

	var size = 0.65;

	material = new THREE.ShaderMaterial({
		uniforms : uniforms,
		vertexShader : glsl_vs1,
		fragmentShader : glsl_fs1
	});
	var res = 32;
	if (view == "torus") {
		mesh = new THREE.Mesh(new THREE.TorusGeometry(size, 0.3, res, res), material);
		mesh.rotation.x = 0.3;
		scene.add(mesh);
	} else	if (view == "sphere") {
		mesh = new THREE.Mesh(new THREE.SphereGeometry ( size *1.5, res, res, 0, 2*Math.PI, 0, Math.PI) , material);
		scene.add(mesh);
	} else  if(view = "plane") {
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(-1, -1, 0));
		geometry.vertices.push(new THREE.Vector3(1, -1, 0));
		geometry.vertices.push(new THREE.Vector3(1, 1, 0));
		geometry.vertices.push(new THREE.Vector3(-1, 1, 0));
		geometry.faces.push(new THREE.Face4(0, 1, 2, 3));

		var s = viewportWidth / 512.0;
		var t = viewportHeight / 512.0;

		// Three.js does not support flipping y coordinate of a loaded textures
		// so we do it manually
		geometry.faceVertexUvs[0].push([new THREE.UV(0, t), new THREE.UV(s, t), new THREE.UV(s, 0), new THREE.UV(0, 0)]);

		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);
	}//

	renderer.autoClear = false;

	//

	var renderModel = new THREE.RenderPass(scene, camera);
	var effectBloom = new THREE.BloomPass(1.25);
	var effectFilm = new THREE.FilmPass(0.35, 0.5, 4096, false);

	effectFilm.renderToScreen = true;

	composer = new THREE.EffectComposer(renderer);

	composer.addPass(renderModel);
	composer.addPass(effectBloom);
	composer.addPass(effectFilm);
}

//

function animate() {

	requestAnimationFrame(animate);

	render();

}

function render() {

	var delta = 5 * clock.getDelta();

	uniforms.time.value += 0.2 * delta;
	if (view == "torus") {
		mesh.rotation.y += 0.0125 * delta;
		mesh.rotation.x += 0.05 * delta;
	}else 	if (view == "sphere") {
		mesh.rotation.y += 0.02 * delta;
	}
	renderer.clear();
	composer.render(0.01);
	renderer.render(scene, camera);
}

