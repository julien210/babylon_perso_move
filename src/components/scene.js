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

import { Animation } from '@babylonjs/core/Animations/animation'
import { Easing } from '@babylonjs/core/Animations/easing'
import {Curve3 } from '@babylonjs/core'
import {TransformNode } from '@babylonjs/core'
/////////////////////////////////////////////// FIN DES IMPORTS ////////////////////////////////////



const onSceneReady = async (scene) => {
const canvas = scene.getEngine().getRenderingCanvas();
scene.autoClear = false; // Color buffer
scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously

var  camera = new FreeCamera("FreeCamera", new Vector3(0, 400, 0), scene);
camera.attachControl(canvas, true);


var  camera1 = new FreeCamera("FreeCamera", new Vector3(50, 200, 0), scene);
camera1.setTarget(Vector3.Zero());




//var light = new HemisphericLight("hemiLight", new Vector3(-20, -20, 0), scene);
//light.diffuse = new Color3(1, 1, 1);
//light.intensity = 0.5
var light1 = new DirectionalLight("DirectionalLight", new Vector3(5, -20, 0), scene);
light1.intensity = 0.5;
    
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
let path = (new Curve3.CreateCatmullRomSpline([camera.position.clone(), camera.position.clone().add(new Vector3(-10, 10, 10)), camera.position.clone().add(new Vector3(0, -10, 10))], step, false)).getPoints()

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

scene.onBeforeCameraRenderObservable.add(()=>{
    camera.setTarget(target.position)
   // camera1.setTarget(target1.position)
})


function myFunction() {
setTimeout(function(){ camera.dispose(); }, 6000);
}
myFunction()

setTimeout(()=>camera1.attachControl(canvas, true), 6500)

 // Ground
    // ===========================================================
const subdivisions = 200;
const width = 200;
const height = 200;
const options = {width: width, height: height, subdivisions: subdivisions, minHeight: 0 ,  maxHeight: 8};
const ground = MeshBuilder.CreateGroundFromHeightMap("ground", "https://raw.githubusercontent.com/julien210/thion/julien210-assets/fredpaq.jpg", options, scene);
ground.rotation.y  = -Math.PI/3 
ground.position.y  = -50 
const groundMaterial = new StandardMaterial("ground", scene);
groundMaterial.emissiveColor = new Color3.FromHexString("#FFFFCC")
groundMaterial.diffuseTexture = new Texture("https://raw.githubusercontent.com/julien210/thion/julien210-assets/fredpaq.jpg", scene);
groundMaterial.freeze();
ground.material = groundMaterial;
ground.receiveShadows = true;

const  shadowGenerator = new ShadowGenerator(1024, light1);

const spriteManagerTrees = new SpriteManager("treesManager", "	https://playground.babylonjs.com/textures/palm.png", 100, {width:512, height: 1024}, scene);
for (let i = 0; i < 200; i++) {
  const tree = new Sprite("tree", spriteManagerTrees)
  tree.position.x = Math.random() * (60);
  tree.position.z = 20 + Math.random() * -60 ;
  tree.position.y = 4
}


}
export default   () => {
 // babylonLink = useRef(null);

  return (
    <>
       <BabylonScene antialias onSceneReady={onSceneReady} id='render-canvas' />
    
    </>
  )
}