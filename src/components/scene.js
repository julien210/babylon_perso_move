import React, { useRef } from 'react';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { ExecuteCodeAction } from '@babylonjs/core/Actions';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
//import { FollowCamera } from '@babylonjs/core/Cameras/followCamera'

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
/////////////////////////////////////////////// FIN DES IMPORTS ////////////////////////////////////

let boxTresor
let box;
let babylonLink;
let castRay
let dist = ""



const onSceneReady = async (scene) => {

  const canvas = scene.getEngine().getRenderingCanvas();

  let camera = new FreeCamera("FreeCamera", new Vector3(0, 250, 0), scene);
  camera._needMoveForGravity = true;
  
  scene.activeCamera = camera
  scene.activeCamera.attachControl(canvas, true);

 // let camera2 = new ArcRotateCamera("Camera2", 1, 1, 0,  new Vector3(0, 6, 2 ), scene);
  let camera2 = new ArcRotateCamera("Camera", 0, 0, 0, new Vector3(0, 6, 2), scene);
  setTimeout( ()=> ( scene.activeCamera = camera2), 8000)
  
  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  var light = new HemisphericLight("light", new Vector3(-5, -20, 0), scene);
  light.intensity = 0.5;
  var light1 = new DirectionalLight("DirectionalLight", new Vector3(5, -20, 0), scene);
  light1.intensity = 0.5;

 // scene.enablePhysics(null, new CannonJSPlugin(true, 10, cannon));

  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", {size: 1}, scene);
  box.position.y = 0.5;
  const matCV = new StandardMaterial("mat", scene);
  const texture = new Texture("https://cdn.onlinewebfonts.com/svg/img_571171.png", scene);
  matCV.glossiness = 1;
  matCV.diffuseTexture = texture;

  boxTresor = MeshBuilder.CreateBox("boxTres", {size: 3}, scene);  
  boxTresor.position = new Vector3(-20, 5, 50);
  camera.lockedTarget = boxTresor;
  boxTresor.material  = matCV

 /////////////////// joystick
function  makeThumbArea  (name, thickness, color, background, ...curves){
  let rect = new Ellipse();
      rect.name = name;
      rect.thickness = thickness;
      rect.color = color;
      rect.background = background;
  return rect;
  }

  let adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  // let xAddPos = 0;
  // let yAddPos = 0;
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
  const  image = Button.CreateImageOnlyButton('imageBabylonjs', "https://www.flaticon.com/svg/static/icons/svg/1371/1371211.svg");
  image.width = "75px";
  image.height = "75px";
  image.top = "150px"
  image.alpha = 0.5;
  image.color = "yellow";
  image.isHighlighted = true;
  image.shadowBlur = 11;
  image.border = "none"

  adt.addControl(image)
  image.onPointerDownObservable.add(function() {
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
  buttonCamera.color = "yellow";
 // buttonCamera.isHighlighted = true;
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

////////////////

  let inputMap ={};
    // scene.actionManager = new ActionManager(scene);
    // scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
    //     inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    // }));
    // scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
    //     inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    // }));
///////////////////// fin joystick

    // Ground
    // ===========================================================
    const subdivisions = 50;
    const width = 300;
    const height = 300;
    const options = {width: width, height: height, subdivisions: subdivisions, minHeight: 0 ,  maxHeight: 8};
    const ground = MeshBuilder.CreateGroundFromHeightMap("ground", "https://raw.githubusercontent.com/julien210/thion/julien210-assets/fredpaq.jpg", options, scene);
   
   // ground.rotation = new Vector3(0, Math.PI/2, 0);
    const groundMaterial = new StandardMaterial("ground", scene);

    groundMaterial.emissiveColor = new Color3.FromHexString("#FFFFCC")
    groundMaterial.diffuseTexture = new Texture("https://raw.githubusercontent.com/julien210/thion/julien210-assets/fredpaq.jpg", scene);
    groundMaterial.freeze();
    ground.material = groundMaterial;
    //ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 0 }, scene);
    ground.receiveShadows = true;

    const  shadowGenerator = new ShadowGenerator(1024, light1);

    const spriteManagerTrees = new SpriteManager("treesManager", "	https://playground.babylonjs.com/textures/palm.png", 2000, {width:1024, height: 1024}, scene);
    for (let i = 0; i < 200; i++) {
      const tree = new Sprite("tree", spriteManagerTrees)
      tree.position.x = Math.random() * (60);
      tree.position.z = 20 + Math.random() * -60 ;
      tree.position.y = 4
    }

    const mauveMaterial = new StandardMaterial("mauve", scene)
    mauveMaterial.emissiveColor = new Color3(1, 0, 1);
    SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/creationspirit/my-website/master/static/", "linkedin.babylon", scene, function (newMeshesLinkedin) {
      const linkedin = newMeshesLinkedin[0]
      linkedin.scaling = new Vector3(.5, .5, .5)
      linkedin.position.y = 5
      linkedin.position.x = 5
      linkedin.position.z = -4
      linkedin.rotation.y = Math.PI/4
      linkedin.material = mauveMaterial
      })
    
    SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/creationspirit/my-website/master/static/", "github.babylon", scene, function (newMeshesGithub) {
    const github = newMeshesGithub[0]
    github.position.y = 4
    github.position.x = 2
    github.position.z = 2
    })
   
    const blueMaterial = new StandardMaterial("blue", scene)
    blueMaterial.emissiveColor = new Color3(0, 0, 1);
    SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/creationspirit/my-website/master/static/", "facebook.babylon", scene, function (newMeshesFacebook) {
      const facebook = newMeshesFacebook[0]
      facebook.position.y = 5
      facebook.position.x = -4
      facebook.position.z = -6
      facebook.rotation.y = -Math.PI/4
      facebook.material = blueMaterial
      })
    // const hdrTexture = CubeTexture.CreateFromPrefilteredData("https://raw.githubusercontent.com/julien210/thion/julien210-assets/environment.dds", scene);
    // const  currentSkybox = scene.createDefaultSkybox(hdrTexture, true);

    const hdrTexture = new CubeTexture("https://playground.babylonjs.com/textures/forest.env", scene);
    const  currentSkybox = scene.createDefaultSkybox(hdrTexture, true);

//   SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/julien210/thion/julien210-assets/", "13.babylon", scene, function (newMeshes, particleSystems, skeletons) {
 SceneLoader.ImportMesh("", "https://cdn.jsdelivr.net/gh/julien210/thion@86cd091bbf1906b29bd38e200e99c9b17ba5003c/", "13.babylon", scene, function (newMeshes, particleSystems, skeletons) {
//  SceneLoader.ImportMesh("", "https://res.cloudinary.com/dj8ifctcd/raw/upload/v1608106498/", "dummy3_xmcxeu.babylon", scene, function (newMeshes, particleSystems, skeletons) {
    const  dude = newMeshes[0];
      dude.position.z = -4;
      dude.backFaceCulling = false;

      dude.scaling = new Vector3(.2, .2, .2);       // pour  un element d un seul mesh ou  avec parent ?
     // dude.showBoundingBox = true;
      //  dude.physicsImpostor = new PhysicsImpostor(dude, PhysicsImpostor.BoxImpostor, { mass: 1, friction: 0.0, restitution: 0.3 }, scene);

    const skeleton  =   skeletons[0];
      skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
      skeleton.animationPropertiesOverride.enableBlending = true;
      skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
      skeleton.animationPropertiesOverride.loopMode = 1;
      skeleton.needInitialSkinMatrix = false;

    const walkRange = skeleton.getAnimationRange("walk");
    const idleRange = skeleton.getAnimationRange("idle");
    const runJumpRange = skeleton.getAnimationRange("runJump");
    const fruitRange =  skeleton.getAnimationRange("fruit");

    // const idleRange = skeleton.getAnimationRange("YBot_Idle");
    // const walkRange = skeleton.getAnimationRange("YBot_Walk");
    // const runRange = skeleton.getAnimationRange("YBot_Run");
    // const leftRange = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
    // const rightRange = skeleton.getAnimationRange("YBot_RightStrafeWalk");

    const idleAnim = scene.beginWeightedAnimation(skeleton, idleRange.from, idleRange.to, 1.0, true, 1);
    const runJumpAnim = scene.beginWeightedAnimation(skeleton, runJumpRange.from, runJumpRange.to, 0, false, 1);
    const walkAnim = scene.beginWeightedAnimation(skeleton, walkRange.from, walkRange.to, 0, true);
    const pickAnim = scene.beginWeightedAnimation(skeleton, fruitRange.from, fruitRange.to, 0, true, 1);
    // definition de  shadow
    shadowGenerator.addShadowCaster(dude);
    shadowGenerator.useExponentialShadowMap = true;

    scene.onBeforeRenderObservable.add(()=>{

      // definition  des  ray  pour intersech
      let ray = new Ray(new Vector3(dude.position.x, ground.getBoundingInfo().boundingBox.maximumWorld.y + 1, dude.position.z), new Vector3(0, -1, 0)); // Direction
      const  worldInverse = new Matrix();
      ground.getWorldMatrix().invertToRef(worldInverse);
      ray = Ray.Transform(ray, worldInverse);
     // console.log (ray)
      let pickInfoDude = ground.intersects(ray);
        if (pickInfoDude.hit) {
            dude.position.y = pickInfoDude.pickedPoint.y + 0.01;
        };

      camera2.setTarget(newMeshes[0].position);
      camera2.lockedTarget = dude
      // distance entre  dude  et   boxCV

      const distanceDudeBoxTresor = Math.floor((Math.sqrt(Math.pow((dude.position.z - boxTresor.position.z), 2)+Math.pow((dude.position.z - boxTresor.position.z ), 2)))).toString()
      //console.log( distanceDudeBoxTresor)

      textblock.text = "Plus que "+distanceDudeBoxTresor +" metres"
      panel.addControl(textblock);
      //console.log(distanceDudeBox)

      let keydown = false;
        let walking = false;
        let  running = false;
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
      //    console.log(actualSpeed)
      }
      let deg = (Math.atan2(xAddRot, yAddRot) )
      
      // pour 13.babylon
      console.log(deg)
      let  position = 0 ;   //  identique a   2*Math.PI
       if (xAddRot>0) {  
        if (deg>0) {
          newMeshes[0].rotation.y = ( position - deg);
          newMeshes[0].position.z -= (yAddRot/1000)*actualSpeed;
          newMeshes[0].position.x +=  (xAddRot/1000)*actualSpeed;
        }
        keydown = true;
        walking = true; 
      }
      if (xAddRot < 0) {
        if (deg < 0) {
          newMeshes[0].rotation.y = position -deg  //  permet  d affiner  un  peu  le  chaamp  marche en avant  surtout  si vitesse 2
          newMeshes[0].position.z -= (yAddRot/1000)*actualSpeed;
          newMeshes[0].position.x +=  (xAddRot/1000)*actualSpeed;
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
      /// fibn de keypressed
      if(dude.intersectsMesh(boxTresor, true)){
        boxTresor.dispose()
         if(boxTresor._isDisposed = true){
          setTimeout(window.location.replace ( "http://doc.babylonjs.com/"), 200)
         }
      }
    })     // fin de BEFORE OBSERVABLE
//////////////////////////////////////////////////////////////////// LOGIQUE DE JEU //////////////////////////////////////
scene.gravity = new Vector3(0, -0.9, 0);

// Enable Collisions
scene.collisionsEnabled = true;

//Then apply collisions and gravity to the active camera
camera.checkCollisions = true;
camera.applyGravity = true;

//finally, say which mesh will be collisionable
ground.checkCollisions = true;
boxTresor.checkCollisions = true;

//////////////////////////////////////////////////////////////////// TERRAIN //////////////////////////////////////
    const ground1 =  GroundBuilder.CreateGround("ground", {width: 10, height: 10}, scene);
    ground1.material =  groundMaterial;
//////////////////////////////////////////////////////////////////// INTERSECH ////////////////////////////////////////
    // for (var i = 0; i < scene.meshes.length; i++) {
    //   if (dude !== scene.meshes[i]) {
    //       dude.intersectsMesh(scene.meshes[i], false);
    //   }
    // }

  const ray = new Ray();
  const rayHelper = new RayHelper(ray);
  const localMeshDirection = new Vector3(0, 0, -1);
  const localMeshOrigin = new Vector3(0, 2, 0);
  const length = 20;
  rayHelper.attachToMesh(dude, localMeshDirection, localMeshOrigin, length);

  //rayHelper.show(scene, new Color3(255,0,0));


  //scene.registerBeforeRender(function() {
  for (let index = 0; index < 50 - 1; index++) {
  let  instance = box.createInstance("box" + index);
    instance.position.x = 20 - Math.random() * 40;
    instance.position.y = 1 + Math.random() * 10;
    instance.position.z = 20 - Math.random() * 40;
  //   instance.alwaysSelectAsActiveMesh = true;
  }
  //})


 })    // finsceneLoader


  // Register click event on box mesh
  box.actionManager = new ActionManager(scene);
  box.actionManager.registerAction(
    new ExecuteCodeAction(
      ActionManager.OnPickTrigger,
      () => {
        babylonLink.current.click()
      }
    )
  ); 
}

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
const onRender = scene => {
  if (boxTresor !== undefined) {
    let deltaTimeInMillis = scene.getEngine().getDeltaTime();
    let rpm = 10;
    boxTresor.rotation.y += ((rpm / 60)* Math.PI * 2 * (deltaTimeInMillis / 1000));
  }
}


export default   () => {
  babylonLink = useRef(null);

  return (
    <>
       <BabylonScene antialias onSceneReady={onSceneReady} onRender={onRender} id='render-canvas' /> 
      <a ref={babylonLink} target="_blank" rel="noopener noreferrer" href="https://www.babylonjs.com/"> </a>
    </>
  )
}