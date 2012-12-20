function overlayText() {
	ctx2d = renderer2D.domElement.getContext('2d');
	ctx2d.clearRect(0, 0, window.innerWidth, window.innerHeight);
	
	var size = 800 - camera.position.y;
	ctx2d.font = "30px helvetica";
	//ctx2d.font = coord.z + "px helvetica";
	ctx2d.fillStyle = "#0088ff";
	ctx2d.shadowOffsetX = 1;
	ctx2d.shadowOffsetY = 1;
	ctx2d.shadowBlur = 2;
	ctx2d.shadowColor = "#000000";
	ctx2d.textAlign = 'center';

	for (building in buildings) {

		var obj = getObj(building);
		var pos = new THREE.Vector3(obj.center[0], obj.center[1], obj.center[2]);

		coord = toScreenXY(pos);
		// ctx2d.fillText(obj.id, coord.x, coord.y);

		if (obj.troops > 0) {
			
			if(obj.id == "teagle"){
				var flag;
			}
			
			ctx2d.font = (size + 2) + "px helvetica";
			ctx2d.fillStyle = "#0088ff";
			ctx2d.fillText(obj.troops, coord.x, coord.y);

			ctx2d.font = "14px helvetica";
			ctx2d.fillStyle = "#4466aa";
			ctx2d.fillText(obj.id, coord.x, coord.y + 15);
			
			
			
		} else {
			ctx2d.fillText(obj.id, coord.x, coord.y);
		}

	}

	ctx2d.font = "22px helvetica";
	//ctx2d.font = coord.z + "px helvetica";
	ctx2d.fillStyle = "#ff8800";
	ctx2d.shadowOffsetX = 1;
	ctx2d.shadowOffsetY = 1;
	ctx2d.shadowBlur = 2;
	ctx2d.shadowColor = "#ffffff";
	ctx2d.textAlign = 'center';

	for (index in arrows) {

		var arr = arrows[index];
		var pos = new THREE.Vector3(arr.midpt[0], arr.midpt[1], arr.midpt[2]);

		coord = toScreenXY(pos);
		// ctx2d.fillText(obj.id, coord.x, coord.y);

		ctx2d.fillText(arr.strength, coord.x, coord.y);

	}

}

function toScreenXY(pos) {

	//schoellkopf feild
	//pos = new THREE.Vector3(5.414003, 0.313511, 6.415731);

	var projScreenMat = new THREE.Matrix4();
	projScreenMat.multiply(camera.projectionMatrix, camera.matrixWorldInverse);
	projScreenMat.multiplyVector3(pos);
	//var a = projScreenMat.multiply(camera.projectionMatrix, camera.matrixWorldInverse);
	//var b = a.multiplyVector3(pos);

	return {
		//  x:(1 + b[0]/b[3])*renderer2D.domElement.width/2,
		// y: (1 - b[1]/b[2])*renderer2D.domElement.height/2
		x : (pos.x + 1 ) * renderer3D.domElement.width / 2, //+ renderer3D.domElement.offsetLeft / 2,
		y : (-pos.y + 1) * renderer3D.domElement.height / 2, //+ renderer3D.domElement.offsetTop
		// z :  .1 *((-25*pos.z + 1 ) * renderer3D.domElement.width / 2) //+ renderer3D.domElement.offsetLeft / 2,

	};

}