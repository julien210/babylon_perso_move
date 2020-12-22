import React, { useRef } from 'react';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { ExecuteCodeAction } from '@babylonjs/core/Actions';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { FollowCamera } from '@babylonjs/core/Cameras/followCamera'

import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { GroundBuilder } from '@babylonjs/core/Meshes/Builders/groundBuilder'
//import '@babylonjs/core/Meshes/Builders/groundBuilder'
import BabylonScene from 'babylonjs-hook';
import './scene.css';

import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import {AnimationPropertiesOverride} from '@babylonjs/core/Animations/animationPropertiesOverride'
import { Color3, Color4, Vector3 } from '@babylonjs/core/Maths/math'
import {ShadowGenerator} from  '@babylonjs/core/Lights/Shadows/shadowGenerator'
import {Ellipse} from '@babylonjs/gui/2D/controls/ellipse'
import {Control} from '@babylonjs/gui/2D/controls/control'

import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial"
import { Texture } from "@babylonjs/core/Materials/Textures/texture"
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';

import {StackPanel } from  '@babylonjs/gui/2D/controls/stackPanel'
import { Button } from '@babylonjs/gui/2D/controls/button'
import { Image } from '@babylonjs/gui/2D/controls/image'
import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock'

import { Ray } from '@babylonjs/core/Culling/ray'
import { RayHelper } from '@babylonjs/core/Debug/rayHelper'
import '@babylonjs/core/Debug/rayHelper'
import {Matrix} from '@babylonjs/core'

import { AssetsManager } from '@babylonjs/core/Misc/assetsManager'
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture'
//PHYSICS
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor'
import * as cannon from "cannon";
import { CannonJSPlugin } from "@babylonjs/core/Physics/Plugins/cannonJSPlugin"
//SPRITES
import { SpriteManager } from '@babylonjs/core/Sprites/spriteManager'
import { Sprite } from '@babylonjs/core/Sprites/sprite'

import { Animation } from '@babylonjs/core/Animations/animation'
import { Easing } from '@babylonjs/core/Animations/easing'
import {Curve3 } from '@babylonjs/core'
import {TransformNode } from '@babylonjs/core'
/////////////////////////////////////////////// FIN DES IMPORTS ////////////////////////////////////



let  ground; let tree; let dude; let boxTresor; let box
// let idleAnim ; let walkAnim; let pickAnim; let  runJumpAnim ;let inputMap ;let xAddRot; let yAddRot; 

const onSceneReady = async (scene) => {
const canvas = scene.getEngine().getRenderingCanvas();
scene.autoClear = false; // Color buffer
scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously

var  camera = new FreeCamera("FreeCamera", new Vector3(0, 250, 0), scene);
camera.attachControl(canvas, true);


var  camera1 = new FreeCamera("FreeCamera1", new Vector3(50, 200, 0), scene);
camera1.setTarget(Vector3.Zero());

var camera2 = new FreeCamera("FreeCamera2", new Vector3(0, 6, 3), scene);
// var camera2 = new ArcRotateCamera("Camera", 0, 0, 0, new Vector3(0, 1, -2), scene);
// camera2.setPosition(new Vector3(0, 10, -1));
//var camera2 = new FollowCamera("FollowCam", new Vector3(0, 6, 4), scene);
//The goal distance of camera from target
//camera2.radius = 10;
//camera2.heightOffset = 10;
//camera2.rotationOffset = 0;
	


var light = new HemisphericLight("hemiLight", new Vector3(-5, -10, -15), scene);
light.intensity = 0.6
var light1 = new DirectionalLight("DirectionalLight", new Vector3(5, -20, 0), scene);
light1.intensity = 0.4;
    
// var sphere= MeshBuilder.CreateSphere("sfera",{diameter:1,segments:12},scene);    
// sphere.position.y=0.5;

// Skybox
var skybox = MeshBuilder.CreateBox("skyBox",{size: 1000}, scene);
//skybox.position  = new Vector3(0,100,0)
var skyboxMaterial = new StandardMaterial("skyBox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new CubeTexture("https://playground.babylonjs.com/textures/TropicalSunnyDay", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
skyboxMaterial.specularColor = new Color3(0, 0, 0);
skyboxMaterial.disableLighting = true;
skybox.material = skyboxMaterial;   

var animationCamera = new Animation("cameraSwoop", "position", 100, Animation.ANIMATIONTYPE_VECTOR3)

var keyFrames = []
keyFrames.push({
    frame: 0,
    value: camera.position.clone()
})

let step = 200
let path = (new Curve3.CreateCatmullRomSpline([camera.position.clone(), camera.position.clone().add(new Vector3(-5, 5, 10)), camera.position.clone().add(new Vector3(-5, -40, 10))], step, false)).getPoints()

for(var i=1; i<=path.length; i++){
    var ap = path[i-1]
    keyFrames.push({
        frame: i,
        value: ap
    })
}

animationCamera.setKeys(keyFrames)

let target = new TransformNode('target', scene)
target.animations = [animationCamera]
const animation = scene.beginAnimation(target, 0, path.length, false, 1)

 // Ground
    // ===========================================================
const subdivisions = 200;
const width = 200;
const height = 200;
const options = {width: width, height: height, subdivisions: subdivisions, minHeight: 0 ,  maxHeight: 8};
const ground = MeshBuilder.CreateGroundFromHeightMap("ground", "https://raw.githubusercontent.com/julien210/thion/julien210-assets/fredpaq.jpg", options, scene);
ground.rotation.y  = -Math.PI/3 
//ground.position.y  = -50 
const groundMaterial = new StandardMaterial("ground", scene);
groundMaterial.emissiveColor = new Color3.FromHexString("#FFFFCC")
groundMaterial.diffuseTexture = new Texture("https://raw.githubusercontent.com/julien210/thion/julien210-assets/fredpaq.jpg", scene);
groundMaterial.freeze();
ground.material = groundMaterial;
ground.receiveShadows = true;
ground.isVisible  = false

const  shadowGenerator = new ShadowGenerator(1024, light1);

scene.onBeforeCameraRenderObservable.add(()=>{
  camera.setTarget(target.position)
})

function perteCamera() {
setTimeout(function(){ camera.dispose(); }, 5500);
}

perteCamera()

 
 var yellowMat = new StandardMaterial("green", scene);
 yellowMat.diffuseColor = new Color3(0.9, 1, 0);
 yellowMat.freeze()

 const matCV = new StandardMaterial("mat", scene);
 const texture = new Texture("https://cdn.onlinewebfonts.com/svg/img_571171.png", scene);
 matCV.diffuseTexture = texture;
 matCV.freeze()

 // Our built-in 'box' shape.
 box = MeshBuilder.CreateBox("box", {size: 1}, scene);
 box.position.y = 0.5;
 box.material = yellowMat
 box.isVisible = false

 boxTresor = MeshBuilder.CreateBox("boxTres", {size: 3}, scene);  
 boxTresor.position = new Vector3(-5, 5, 10);
 boxTresor.material  = matCV
 boxTresor.isVisible = false

 const  assetsManager1 = new AssetsManager(scene);
 assetsManager1.useDefaultLoadingScreen = false;
 const meshTask = assetsManager1.addMeshTask("dude", "", "https://raw.githubusercontent.com/julien210/thion/julien210-assets/", "13.babylon")

meshTask.onSuccess = task => {
dude = task.loadedMeshes[0]
const skeleton = task.loadedSkeletons[0];

skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
skeleton.animationPropertiesOverride.enableBlending = true;
skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
skeleton.animationPropertiesOverride.loopMode = 1;
skeleton.needInitialSkinMatrix = false;

const walkRange = skeleton.getAnimationRange("walk");
const idleRange = skeleton.getAnimationRange("idle");
const runJumpRange = skeleton.getAnimationRange("runJump");
const fruitRange =  skeleton.getAnimationRange("fruit");

const idleAnim = scene.beginWeightedAnimation(skeleton, idleRange.from, idleRange.to, 1.0, true, 1);
const runJumpAnim = scene.beginWeightedAnimation(skeleton, runJumpRange.from, runJumpRange.to, 0, false, 1);
const walkAnim = scene.beginWeightedAnimation(skeleton, walkRange.from, walkRange.to, 0, true);
const pickAnim = scene.beginWeightedAnimation(skeleton, fruitRange.from, fruitRange.to, 0, true, 1);

dude.position  =  new Vector3(0, 4, 0);
dude.scaling = new Vector3(.1, .1, .1);  

shadowGenerator.addShadowCaster(dude);
shadowGenerator.useExponentialShadowMap = true;

scene.onBeforeRenderObservable.add(()=>{

  // definition  des  ray  pour intersech
  let ray = new Ray(new Vector3(dude.position.x, ground.getBoundingInfo().boundingBox.maximumWorld.y + 1, dude.position.z), new Vector3(0, -1, 0)); // Direction
  const  worldInverse = new Matrix();
  ground.getWorldMatrix().invertToRef(worldInverse);
  ray = Ray.Transform(ray, worldInverse);
  let pickInfoDude = ground.intersects(ray);
    if (pickInfoDude.hit) {
        dude.position.y = pickInfoDude.pickedPoint.y + 0.01;
    };
  

  const distanceDudeBoxTresor = Math.floor((Math.sqrt(Math.pow((dude.position.z - boxTresor.position.z), 2)+Math.pow((dude.position.z - boxTresor.position.z ), 2)))).toString()
  textblock.text = "Plus que "+distanceDudeBoxTresor +" metres"
  panel.addControl(textblock);

  if(dude){
    panel.removeControl(loadingAssets)
    // camera2.setPosition(new Vector3(0, 6, 2));  si  ArcRotateCamera
    camera2.setTarget(dude.position);
    camera2.lockedTarget = dude
  }

    let inputMap = []
    let keydown = false;
    let walking = false;
    let running = false;
    let picking = false;
    let keyPressed = "";
    let characterSpeed = 1
    let actualSpeed= 1
    let characterRunningSpeed =""

    if(inputMap["Shift"]){
        running = true;
        keydown=false;
        // keyPressed = keyPressed+", SHIFT";
    }
    if(running){
        actualSpeed = characterRunningSpeed;
    }else{
        actualSpeed = characterSpeed;
    }
    let deg = (Math.atan2(xAddRot, yAddRot) )
    
    let  position = 0 ;   //  identique a   2*Math.PI
    if (xAddRot>0) {  
      if (deg>0) {
        dude.rotation.y = ( position - deg);
        dude.position.z -= (yAddRot/1000)*actualSpeed;
        dude.position.x +=  (xAddRot/1000)*actualSpeed;
      }
      keydown = true;
      walking = true; 
    }
    if (xAddRot < 0) {
      if (deg < 0) {
        dude.rotation.y = position -deg  //  permet  d affiner  un  peu  le  chaamp  marche en avant  surtout  si vitesse 2
        dude.position.z -= (yAddRot/1000)*actualSpeed;
        dude.position.x +=  (xAddRot/1000)*actualSpeed;
      }
    keydown = true;
    walking = true
    }
    if(inputMap["Q"] ||inputMap["q"] ){
      picking = true;
      keydown=true;
      keyPressed = keyPressed+", D";
    }
    if(keydown){
      if(walking){
        console.log('walking');
        walkAnim.weight  = 1;
        idleAnim.weight = 0;
        pickAnim.weight = 0;
      }
      if (picking){
        console.log('picking');
        pickAnim.weight = 1;
        idleAnim.weight = 0;
        walkAnim.weight  = 0;
      }
      if (running){
        console.log('Jump')
        dude.position.z =+ 0.1;
        runJumpAnim.speedRatio = 0.5;
        runJumpAnim.weight = 1;
        walkAnim.weight  = 1;
        idleAnim.weight = 0;
        pickAnim.weight = 0;
      }
    }else{
      //   console.log(keydown)
        idleAnim.weight = 1;
        idleAnim.speedRatio = 0.7;
        walkAnim.weight  = 0;
      //  pickAnim.weight = 0;
    }
    // fibn de keypressed
    if(dude.intersectsMesh(boxTresor, true)){
      boxTresor.dispose()
      // panel.removeControl(textblock)
      // panel.addControl(redirectionFin)
        if(boxTresor._isDisposed = true){
        setTimeout(window.location.replace ( "http://doc.babylonjs.com/"), 200)
        }
    }
   })  

}


setTimeout( 
  function activationCamera1 (){
  camera1.attachControl(canvas, true)
  ground.isVisible =  true
  boxTresor.isVisible = true
  box.isVisible = true

  for (let index = 0; index < 50 - 1; index++) {
    let  instance = box.createInstance("box" + index);
      instance.position.x = 20 - Math.random() * 40;
      instance.position.y = 1 + Math.random() * 10;
      instance.position.z = 20 - Math.random() * 40;
  }
  
  const spriteManagerTrees = new SpriteManager("treesManager", "	https://playground.babylonjs.com/textures/palm.png", 100, {width:512, height: 1024}, scene);
    for (let i = 0; i < 200; i++) {
      tree = new Sprite("tree", spriteManagerTrees)
      tree.position.x = Math.random() * (60);
      tree.position.z = 20 + Math.random() * -60 ;
      tree.position.y = 4
      tree.isVisible = true
    }
    assetsManager1.load()
  }, 5450)


  setTimeout( 
    function activationCamera2 (){
    camera1.dispose()
    camera2.attachControl(canvas, true)   
    }, 8000)

    //BON
  ///////////////JOYSTICK
  function  makeThumbArea  (name, thickness, color, background, ...curves){
    let rect = new Ellipse();
        rect.name = name;
        rect.thickness = thickness;
        rect.color = color;
        rect.background = background;
    return rect;
    }
  
    let adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    let xAddRot = 0;
    let yAddRot = 0;
    let sideJoystickOffset = adt._canvas.width/2 - 80
    let bottomJoystickOffset = -20;
    let translateTransform;    

    const panel = new StackPanel();
    panel.verticalAlignment =  Control.VERTICAL_ALIGNMENT_TOP
    panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
    adt.addControl(panel);
  
    //const image = new Image('imageBabylonjs', "https://d33wubrfki0l68.cloudfront.net/3c934afefb2da5f35adefb52716ba9cc9ffa37ab/061c6/img/layout/logo-babylonjs-v3.svg");
    const  buttonLogin = Button.CreateImageOnlyButton('buttonLoginBabylonjs', "https://www.flaticon.com/svg/static/icons/svg/1371/1371211.svg");
    buttonLogin.width = "50px";
    buttonLogin.height = "50px";
    buttonLogin.top = "100px"
    buttonLogin.alpha = 0.5;
    buttonLogin.color = "yellow";
    buttonLogin.isHighlighted = true;
    buttonLogin.shadowBlur = 11;
    buttonLogin.border = "none"
  
    adt.addControl(buttonLogin)
    buttonLogin.onPointerDownObservable.add(function() {
      window.location.replace ( "http://doc.babylonjs.com/")
    });
  
  let rightThumbContainer = makeThumbArea("rightThumb", 2, "yellow", null);
      rightThumbContainer.height = "160px";
      rightThumbContainer.width = "160px";
      rightThumbContainer.isPointerBlocker = true;
      rightThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
      rightThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
      rightThumbContainer.alpha = 0.4;
      rightThumbContainer.left = -sideJoystickOffset;
      rightThumbContainer.top = bottomJoystickOffset;

  let rightInnerThumbContainer = makeThumbArea("rightInnterThumb", 6, "yellow", null);
      rightInnerThumbContainer.height = "80px";
      rightInnerThumbContainer.width = "80px";
      rightInnerThumbContainer.isPointerBlocker = true;
      rightInnerThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
      rightInnerThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  
  let rightPuck = makeThumbArea("rightPuck",0, "yellow", "yellow");
    rightPuck.height = "50px";
    rightPuck.width = "50px";
    rightPuck.isPointerBlocker = true;
    rightPuck.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    rightPuck.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

    rightThumbContainer.onPointerDownObservable.add(function(coordinates) {
      rightPuck.isVisible = true;
      rightPuck.floatLeft = adt._canvas.width - coordinates.x-(rightThumbContainer._currentMeasure.width*.5)-sideJoystickOffset;
      rightPuck.left = rightPuck.floatLeft*-1;
      rightPuck.floatTop = adt._canvas.height - coordinates.y-(rightThumbContainer._currentMeasure.height*.5)+bottomJoystickOffset;
      rightPuck.top = rightPuck.floatTop*-1;
      rightPuck.isDown = true;
      rightThumbContainer.alpha = 0.9;
    });

    rightThumbContainer.onPointerUpObservable.add(function(coordinates) {
      xAddRot = 0;
      yAddRot = 0;
      rightPuck.isDown = false;
      rightPuck.isVisible = false;
      rightThumbContainer.alpha = 0.4;
    });

  rightThumbContainer.onPointerMoveObservable.add(function(coordinates) {
    if (rightPuck.isDown) {
      xAddRot = adt._canvas.width - coordinates.x-(rightThumbContainer._currentMeasure.width*.5)-sideJoystickOffset;
      yAddRot = adt._canvas.height - coordinates.y-(rightThumbContainer._currentMeasure.height*.5)+bottomJoystickOffset;
      rightPuck.floatLeft = xAddRot*-1;
      rightPuck.floatTop = yAddRot*-1;
      rightPuck.left = rightPuck.floatLeft;
      rightPuck.top = rightPuck.floatTop;
    }
  });

  adt.addControl(rightThumbContainer);
  rightThumbContainer.addControl(rightInnerThumbContainer);
  rightThumbContainer.addControl(rightPuck);
  rightPuck.isVisible = false;

  const  buttonCamera = Button.CreateImageOnlyButton('butCam', "https://www.flaticon.com/svg/static/icons/svg/1160/1160041.svg");
  buttonCamera.width = "60px";
  buttonCamera.height = "40px";
  buttonCamera.paddingTop = "10px"
  buttonCamera.alpha = 0.5;
  buttonCamera.isHighlighted = true;
  buttonCamera.shadowBlur = 11;
  buttonCamera.border = "none"
  panel.addControl(buttonCamera)

  
  buttonCamera.onPointerDownObservable.add(function() {
  // buttonCamera.onPointerClickObservable.add(function(){
  scene.activeCamera = (scene.activeCamera === camera ? camera2 : camera);
  });
  
  const textblock = new TextBlock("textblock" );
  textblock.width = 0.5;
  textblock.height = "100px";
  textblock.color = "yellow";     


  const loadingAssets = new TextBlock("loadingAssets" );
  loadingAssets.width = 0.5;
  loadingAssets.height = "150px";
  loadingAssets.color = "yellow";     
  loadingAssets.text = "Loading...";
  loadingAssets.alpha = 0.5;
  panel.addControl(loadingAssets)

  const redirectionFin = new TextBlock("redirectionFin" );
  redirectionFin.width = 1;
  redirectionFin.height = "150px";
  redirectionFin.color = "red";     
  redirectionFin.text = "Gagné...Vous allez être redirigé !";

  ///////////////////// fin joystick
}

const onRender = scene => {
  if ( dude && boxTresor !== undefined) {
    let deltaTimeInMillis = scene.getEngine().getDeltaTime();
    let rpm = 10;
    boxTresor.rotation.y += ((rpm / 60)* Math.PI * 2 * (deltaTimeInMillis / 1000));
  }
}



export default   () => {
 // babylonLink = useRef(null);

  return (
    <>
       <BabylonScene antialias onSceneReady={onSceneReady} onRender={onRender} id='render-canvas' />
    
    </>
  )
}