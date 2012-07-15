loadBoard = function() {
	var loader = new THREE.JSONLoader();
	var material;
	var rhodes, upson, hoy, sage;

	var dir = "rsc/obj/";
	var unfinished_models = ["duffield_phillips", "taylor", "statler", "rhodes", "goldwin", "olin", "hoy", "upson"];
	var models = ["sage", "mcgraw_uris","uris"];

	loader.load(dir + "aaa_ground/ground.js", function(geometry) {

		var material = new THREE.MeshFaceMaterial();
		var mesh = new THREE.Mesh(geometry, material);

		mesh.scale.set(scale, scale, scale);
		mesh.position.y = 0;

		scene.add(mesh);

	});

	load = function(model) {

		loader.load(dir + model + "/" + model + ".js", function(geometry) {

			geometry.computeMorphNormals();

			material = new THREE.MeshLambertMaterial({
				map : THREE.ImageUtils.loadTexture(dir + model + "/" + model + ".png"),
				color : 0xffffff,
				shading : THREE.FlatShading
			});

			var mesh = new THREE.Mesh(geometry, material);

			mesh.scale.set(scale, scale, scale);

			mesh.position.y = 0;
			board.push(mesh);
			scene.add(mesh);

		});
	}
	loadBasic = function(model) {

		loader.load(dir + model + "/" + model + ".js", function(geometry) {

			geometry.computeMorphNormals();

			material = new THREE.MeshLambertMaterial({
				color : 0xff00ff,
				shading : THREE.FlatShading
			});

			var mesh = new THREE.Mesh(geometry, material);

			mesh.scale.set(scale, scale, scale);

			mesh.position.y = 0;
			board.push(mesh);
			scene.add(mesh);
		});
	}
	for (index in unfinished_models) {
		var model = unfinished_models[index];
		loadBasic(model);
	}

	for (index in models) {
		var model = models[index];
		load(model);
	}
}