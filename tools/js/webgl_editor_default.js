@info
Plasma Shader
Based Upon:
<http://mrdoob.github.com/three.js/examples/webgl_shader_lava.html>
@libs
../js/lib/jQuery.js
../js/lib/Three.js
../js/lib/shaders/ConvolutionShader.js
../js/lib/shaders/CopyShader.js
../js/lib/shaders/FilmShader.js

../js/lib/postprocessing/EffectComposer.js
../js/lib/postprocessing/ShaderPass.js
../js/lib/postprocessing/MaskPass.js
../js/lib/postprocessing/RenderPass.js
../js/lib/postprocessing/BloomPass.js
../js/lib/postprocessing/FilmPass.js

../js/lib/Detector.js
../js/lib/Stats.js
@main
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
if (view == "torus"){

camera = new THREE.PerspectiveCamera(35, windowHalfX / windowHalfY, 1, 3000);

camera.position.z = 4;}else{  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100.0);
camera.position.z = 1.0;}

scene = new THREE.Scene();

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
if(view == "torus"){
mesh = new THREE.Mesh(new THREE.TorusGeometry(size, 0.3, 30, 30), material);
mesh.rotation.x = 0.3;
scene.add(mesh);
}else{
var geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(-1, -1, 0)));
geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(1, -1, 0)));
geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(1, 1, 0)));
geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(-1, 1, 0)));
geometry.faces.push(new THREE.Face4(0,1,2,3));

var s = viewportWidth/512.0;
var t = viewportHeight/512.0;

// Three.js does not support flipping y coordinate of a loaded textures
// so we do it manually
geometry.faceVertexUvs[0].push([
new THREE.UV(0,t),
new THREE.UV(s,t),
new THREE.UV(s,0),
new THREE.UV(0,0)
]);

var mesh = new THREE.Mesh(geometry, material);
scene.addObject(mesh);}            //

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

mesh.rotation.y += 0.0125 * delta;
mesh.rotation.x += 0.05 * delta;

renderer.clear();
composer.render(0.01);
renderer.render(scene, camera);
}
@glsl_vs1
uniform vec2 uvScale;
varying vec2 vUv;

void main()
{

vUv = uvScale * uv;
vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
gl_Position = projectionMatrix * mvPosition;

}
@glsl_fs1

uniform float time;
uniform vec2 resolution;

uniform float fogDensity;
uniform vec3 fogColor;

uniform sampler2D texture1;
uniform sampler2D texture2;

varying vec2 vUv;

void main( void ) {

vec2 position = -1.0 + 2.0 * vUv;

vec4 noise = texture2D( texture1, vUv );
vec2 T1 = vUv + vec2( 1.5, -1.5 ) * time  *0.02;
vec2 T2 = vUv + vec2( -0.5, 2.0 ) * time * 0.01;

T1.x += noise.x * 2.0;
T1.y += noise.y * 2.0;
T2.x -= noise.y * 0.2;
T2.y += noise.z * 0.2;

float p = texture2D( texture1, T1 * 2.0 ).a;

vec4 color = texture2D( texture2, T2 * 2.0 );
vec4 temp = color * ( vec4( p, p, p, p ) * 2.0 ) + ( color * color - 0.1 );

if( temp.r > 1.0 ){ temp.bg += clamp( temp.r - 2.0, 0.0, 100.0 ); }
if( temp.g > 1.0 ){ temp.rb += temp.g - 1.0; }
if( temp.b > 1.0 ){ temp.rg += temp.b - 1.0; }

gl_FragColor = temp;

float depth = gl_FragCoord.z / gl_FragCoord.w;
const float LOG2 = 1.442695;
float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );
fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );

gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

}

