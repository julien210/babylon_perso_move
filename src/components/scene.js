import React, { useRef } from 'react';
import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { ExecuteCodeAction } from '@babylonjs/core/Actions';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'

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
//import {GUI3DManager} from '@babylonjs/gui/3D/gui3DManager'
import {StackPanel } from  '@babylonjs/gui/2D/controls/stackPanel'
//import { Button } from '@babylonjs/gui/2D/controls/button'
import { Image } from '@babylonjs/gui/2D/controls/image'

import { Ray } from '@babylonjs/core/Culling/ray'
import { RayHelper } from '@babylonjs/core/Debug/rayHelper'
import '@babylonjs/core/Debug/rayHelper'
import {Matrix} from '@babylonjs/core'

import { AssetsManager } from '@babylonjs/core/Misc/assetsManager'
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture'

let box;
let babylonLink;
let castRay



const onSceneReady = scene => {
  // This creates and positions a free camera (non-mesh)
  //var camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);
  // This targets the camera to scene origin
  // camera.setTarget(Vector3.Zero());
  
  var camera = new ArcRotateCamera("Camera", 0, 0, 0, new Vector3(0, 1, -1), scene);
  camera.setPosition(new Vector3(2, 8, -16));
  
  
 
  const canvas = scene.getEngine().getRenderingCanvas();
  // This attaches the camera to the canvas
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  //var light = new HemisphericLight("light", new Vector3(0, -10, -2), scene);
  var light1 = new DirectionalLight("DirectionalLight", new Vector3(0, -20, 1), scene);
  // Default intensity is 1. Let's dim the light a small amount
  light1.intensity = 0.8;
  // Our built-in 'box' shape.
  box = MeshBuilder.CreateBox("box", {size: 7}, scene);
  // Move the box upward 1/2 its height
  box.position.x = -4;
  box.position.y = 0;


  scene.clearColor = new Color4(0.73, 0.76, 0.96, 0.1);


  /////////////////// joystick 
  
function  makeThumbArea  (name, thickness, color, background, curves){
  let rect = new Ellipse();
      rect.name = name;
      rect.thickness = thickness;
      rect.color = color;
      rect.background = background;
      rect.paddingLeft = "0px";
      rect.paddingRight = "0px";
      rect.paddingTop = "0px";
      rect.paddingBottom = "0px";
  return rect;
  }

const adt = AdvancedDynamicTexture.CreateFullscreenUI("UI");
  let xAddPos = 0;
  let yAddPos = 0;
  let xAddRot = 0;
  let yAddRot = 0;
  let sideJoystickOffset = 950;
  let bottomJoystickOffset = -50;
  let translateTransform;

const panel = new StackPanel();   
    adt.addControl(panel);   

  const image = new Image('name', "https://d33wubrfki0l68.cloudfront.net/3c934afefb2da5f35adefb52716ba9cc9ffa37ab/061c6/img/layout/logo-babylonjs-v3.svg");
  //var image = new GUI.Image('name', "");
  // image.paddingTop = "10%";
    image.width = "10%";
    image.height = "100px";
    image.paddingBottom = "10px";
    image.alpha = 0.5;
    image.color = "green";
    image.isHighlighted = true;
    image.shadowBlur = 11;  
  panel.addControl(image)
  //    adt.addControl(image)
    image.onPointerUpObservable.add(function() {        
       image.width = "360px";     
    });  
  
  const leftThumbContainer = makeThumbArea("leftThumb", 2, "blue", null);
    leftThumbContainer.height = "160px";
    leftThumbContainer.width = "160px";
    leftThumbContainer.isPointerBlocker = true;
    leftThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    leftThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    leftThumbContainer.alpha = 0.4;

  const leftInnerThumbContainer = makeThumbArea("leftInnterThumb", 4, "blue", null);
    leftInnerThumbContainer.height = "80px";
    leftInnerThumbContainer.width = "80px";
    leftInnerThumbContainer.isPointerBlocker = true;
    leftInnerThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    leftInnerThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

  const leftPuck = makeThumbArea("leftPuck",0, "blue", "blue");
    leftPuck.height = "60px";
    leftPuck.width = "60px";
    leftPuck.isPointerBlocker = true;
    leftPuck.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    leftPuck.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;

  leftThumbContainer.onPointerDownObservable.add(function(coordinates) {
    leftPuck.isVisible = true;
    leftPuck.floatLeft = coordinates.x-(leftThumbContainer._currentMeasure.width*.5);
    leftPuck.left = leftPuck.floatLeft;
    leftPuck.floatTop = adt._canvas.height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5);
    leftPuck.top = leftPuck.floatTop*-1;
    leftPuck.isDown = true;
    leftThumbContainer.alpha = 0.9;
  });

  leftThumbContainer.onPointerUpObservable.add(function(coordinates) {
    xAddPos = 0;
    yAddPos = 0;
    leftPuck.isDown = false;
    leftPuck.isVisible = false;
    leftThumbContainer.alpha = 0.4;
  });

  leftThumbContainer.onPointerMoveObservable.add(function(coordinates) {
    if (leftPuck.isDown) {
      xAddPos = coordinates.x-(leftThumbContainer._currentMeasure.width*.5);
      yAddPos = adt._canvas.height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5);
      leftPuck.floatLeft = xAddPos;
      leftPuck.floatTop = yAddPos*-1;
      leftPuck.left = leftPuck.floatLeft;
      leftPuck.top = leftPuck.floatTop;
    }
  });

 // adt.addControl(leftThumbContainer);
 // leftThumbContainer.addControl(leftInnerThumbContainer);
 // leftThumbContainer.addControl(leftPuck);
//  leftPuck.isVisible = true;

 //boutton  droit
  const rightThumbContainer = makeThumbArea("rightThumb", 2, "red", null);
    rightThumbContainer.height = "160px";
    rightThumbContainer.width = "160px";
    rightThumbContainer.isPointerBlocker = true;
    rightThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rightThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    rightThumbContainer.alpha = 0.4;
  const rightInnerThumbContainer = makeThumbArea("rightInnterThumb", 4, "red", null);
    rightInnerThumbContainer.height = "80px";
    rightInnerThumbContainer.width = "80px";
    rightInnerThumbContainer.isPointerBlocker = true;
    rightInnerThumbContainer.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    rightInnerThumbContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  const rightPuck = makeThumbArea("rightPuck",0, "red", "red");
    rightPuck.height = "60px";
    rightPuck.width = "60px";
    rightPuck.isPointerBlocker = true;
    rightPuck.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    rightPuck.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
  adt.addControl(rightThumbContainer);
  rightThumbContainer.addControl(rightInnerThumbContainer);
  rightThumbContainer.addControl(rightPuck);
  rightPuck.isVisible = false;

  // mecanique du boutton droit
  rightThumbContainer.onPointerDownObservable.add(function(coordinates) {
    rightPuck.isVisible = true;
    rightPuck.floatLeft = adt._canvas.width - coordinates.x-(rightThumbContainer._currentMeasure.width*.5);
    rightPuck.left = rightPuck.floatLeft*-1;
    rightPuck.floatTop = adt._canvas.height - coordinates.y-(rightThumbContainer._currentMeasure.height*.5);
    rightPuck.top = rightPuck.floatTop*-1;
    rightPuck.isDown = true;
    rightThumbContainer.alpha = 0.9;
  // console.log("left"+rightPuck.floatLeft, "top"+rightPuck.floatTop )
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
      xAddRot = adt._canvas.width - coordinates.x-(rightThumbContainer._currentMeasure.width*.5);
      yAddRot = adt._canvas.height - coordinates.y-(rightThumbContainer._currentMeasure.height*.5);
      rightPuck.floatLeft = xAddRot*-1;
      rightPuck.floatTop = yAddRot*-1;
      rightPuck.left = rightPuck.floatLeft;
      rightPuck.top = rightPuck.floatTop;
    // console.log("MoveX"+xAddRot, "MoveY"+yAddRot )
    }
  })
  // adt.addControl(rightThumbContainer);
  // rightThumbContainer.addControl(rightInnerThumbContainer);
  // rightThumbContainer.addControl(rightPuck);
  // rightPuck.isVisible = false;

  let inputMap ={};
    // scene.actionManager = new ActionManager(scene);
    // scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {								
    //     inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    // }));
    // scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {								
    //     inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    // }));



    // Ground
    // ===========================================================
    const subdivisions = 50;
    const width = 150;
    const height = 150;


    const options = {width: width, height: height, subdivisions: subdivisions, minHeight: 0 ,  maxHeight: 6};
    const ground = MeshBuilder.CreateGroundFromHeightMap("ground", "https://pbs.twimg.com/media/CQgYtX4UEAAaRBG?format=png", options, scene);

    const groundMaterial = new StandardMaterial("ground", scene);
   // groundMaterial.emissiveColor = new Color3(0.58, 0.07, 0.07, 0.7);
    groundMaterial.emissiveColor = new Color3(0.99, 0.81, 0);
   // groundMaterial.specularColor = new Color3(1, 0.87, 0.26, 0.7);
   groundMaterial.specularColor = new Color3(0.92, 0.96, 0.46);
   
   groundMaterial.diffuseTexture = new Texture("https://i2.wp.com/3dtextures.me/wp-content/uploads/2020/05/Material_1532.jpg?w=600&ssl=1", scene);
    // groundMaterial.diffuseTexture.uScale = 1;
    // groundMaterial.diffuseTexture.vScale = 1;
   // groundMaterial.specularColor = new Color3(1, 1, 1);
    ground.material = groundMaterial;
    //groundMaterial.freeze();
    //groundMaterial.wireframe = true;
    
    const  shadowGenerator = new ShadowGenerator(1024, light1);
    ground.receiveShadows = true;
		

    var localMeshDirection = new Vector3(0, -1, 0);
    var localMeshOrigin = new Vector3(0, 0, .4);
    var length = 10;

   
///////////////////// fin joystick
//   SceneLoader.ImportMesh("", "https://raw.githubusercontent.com/julien210/thion/julien210-assets/", "13.babylon", scene, function (newMeshes, particleSystems, skeletons) {
 SceneLoader.ImportMesh("", "https://cdn.jsdelivr.net/gh/julien210/thion@86cd091bbf1906b29bd38e200e99c9b17ba5003c/", "13.babylon", scene, function (newMeshes, particleSystems, skeletons) {
    const  dude = newMeshes[0];
      dude.position.z = -10;
      //  dude.backFaceCulling = false;
      //  dude.rotation.y = (2 * Math.PI) ;
      dude.scaling = new Vector3(.2, .2, .2);       // pour  un element d un seul mesh ou  avec parent ?
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

    const idleAnim = scene.beginWeightedAnimation(skeleton, idleRange.from, idleRange.to, 1.0, true, 1);
    const runJumpAnim = scene.beginWeightedAnimation(skeleton, runJumpRange.from, runJumpRange.to, 0, false, 1);
    const walkAnim = scene.beginWeightedAnimation(skeleton, walkRange.from, walkRange.to, 0, true);
    const pickAnim = scene.beginWeightedAnimation(skeleton, fruitRange.from, fruitRange.to, 0, true, 1);

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
              
      camera.setTarget(newMeshes[0].position);
     // console.log(dude.position.y)
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
      let  position = 0 ;   //  identique a   2*Math.PI

      if (xAddRot>0) {
        if (deg>0) {                                
        newMeshes[0].rotation.y = ( position + (Math.PI + deg));
        newMeshes[0].position.z += (yAddRot/200)*actualSpeed;
        newMeshes[0].position.x +=  (xAddRot/200)*actualSpeed;                        
        }   
        keydown = true;
        walking = true;          
      } 
      
      if (xAddRot < 0) {
        if (deg < 0) {
          newMeshes[0].rotation.y = ( position + (Math.PI + deg));   //  permet  d affiner  un  peu  le  chaamp  marche en avant  surtout  si vitesse 2
          newMeshes[0].position.z += (yAddRot/200)*actualSpeed;
          newMeshes[0].position.x +=  (xAddRot/200)*actualSpeed;
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
          pickAnim.weight = 0;

      }
    /// fibn de keypressed 
  })          
        
//////////////////////////////////////////////////////////////////// LOGIQUE DE JEU //////////////////////////////////////
 
scene.collisionsEnabled = true;
scene.gravity = new Vector3(0, -0.9, 0);



//////////////////////////////////////////////////////////////////// TERRAIN //////////////////////////////////////

    const ground1 =  GroundBuilder.CreateGround("ground", {width: 150, height: 150}, scene);
    ground1.material =  groundMaterial;

//////////////////////////////////////////////////////////////////// INTERSECH ////////////////////////////////////////
    for (var i = 0; i < scene.meshes.length; i++) {
      if (dude !== scene.meshes[i]) {
          dude.intersectsMesh(scene.meshes[i], false);    
      }
    }
    


    function vecToLocal(vector, mesh){
      var m = mesh.getWorldMatrix();
      var v = Vector3.TransformCoordinates(vector, m);
    return v;		 
    }
    castRay = ()=>{       
    let origin = dude.position;

    let forward = new Vector3(0,0,-1);		
    forward = vecToLocal(forward, box);

    let direction = forward.subtract(origin);
    direction = Vector3.Normalize(direction);

    const length = 1;

    const ray = new Ray(origin, direction, length);

    const rayHelper = new RayHelper(ray);		
   // rayHelper.show(scene);		
    }
     castRay()
    

   // const meshBox = GetTriangles(box);
   // const meshBoxBounds = box.getBoundingInfo().boundingBox;
   // console.log(meshBoxBounds)
    
 
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
  // if (box !== undefined) {
  //   var deltaTimeInMillis = scene.getEngine().getDeltaTime();
  //   const rpm = 10;
  //   box.rotation.y += ((rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000));
  // }
    if (castRay !== undefined){
      castRay()
      if(scene.meshes[2].intersectsMesh(box, true)){
        console.log("touch")
      }

    }
}


export default () => {
  babylonLink = useRef(null);

  return (
    <>
      <BabylonScene antialias onSceneReady={onSceneReady} onRender={onRender} id='render-canvas' />
    </>
  )
}
