import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import {Scene} from '../../../Types/ThreeTypes'
import Resources from '../utils/Resources'
import GSAP from 'gsap'
import GUI from 'lil-gui'
import { Color } from 'three'


// interface Obj {
// 	colorObj: {
// 	  r: number,
// 	  g: number,
// 	  b: number,
// 	},
// 	intensity: number,
// }


// 环境光照
export default class Environment {
	public experience: Experience
	public scene: Scene
	public resources: Resources
	public sunLight!: THREE.DirectionalLight
	private guiDOM: any
	private gui: GUI
	private obj: any //继承 Three 的 Color 的话会有类型问题
	public ambientLight!: THREE.AmbientLight
	


	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources

		// 🌍 gui 库
		this.gui = new GUI() //里边可以传入另一个参数, 调整显示位置{ container:document.getElementById('#XXX') }
		this.obj = {
			colorObj: {r: 0,g: 0,b: 0}, //sunLight 跟 ambientLight 的都会用到的颜色
			intensity: 3, //强度
		}

		this.setGUI()
		this.setSunLight()
	}


	// 🌍 gui 库, 把定义的 obj 颜色映射拷贝给【太阳光】跟【环境光】
	setGUI() {
		this.gui.addColor(this.obj, 'colorObj').onChange(() => {
			this.sunLight.color.copy(this.obj.colorObj)
			this.ambientLight.color.copy(this.obj.colorObj)
			// console.log(this.obj.colorObj)
			// console.log(
			// 	"color 的值:",
			// 	this.color, '\n', //换行的方法
			// 	"colorObj 的值:",
			// 	this.obj.colorObj
			// )
		})

		this.gui.add(this.obj, 'intensity', 0, 10).onChange(() => { //设置强度（0～10）
			this.sunLight.intensity = this.obj.intensity
			this.ambientLight.intensity = this.obj.intensity
		}) 
	}


	setSunLight() {
		//方向光 - 该光源可以投射阴影
		this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
        this.sunLight.castShadow = true; //开启阴影
        this.sunLight.shadow.camera.far = 20; 
        this.sunLight.shadow.mapSize.set(2048, 2048); //影响阴影的质量
        this.sunLight.shadow.normalBias = 0.05; //影响阴影的模糊程度
		this.sunLight.position.set(1.5, 8, 3) //光照的位置 
		this.scene.add(this.sunLight) //🌞将光照添加到场景中

		
		//环境光 - 不可以投射阴影
		this.ambientLight = new THREE.AmbientLight('#fffdf9', 0.8) //环境光照的颜色跟强度
		this.scene.add(this.ambientLight) //🌞将环境光照添加到场景中 

				
		// 相机的方向 helper
		// const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(helper);


		// 聚光灯 - 该光源可以投射阴影
		// const spotLight = new THREE.SpotLight(0xFFFFFF);
		// spotLight.position.set(-60, 40, -65); // 聚光灯在左上角
		
		// spotLight.castShadow = true; // 此属性设置为 true 聚光灯将投射阴影。
		// // 设置阴影效果, near和far千万不能设置反了，否则阴影出不来
		// spotLight.shadow.camera.near = 40;
		// spotLight.shadow.camera.far = 130;
		// this.scene.add(spotLight);
	}


	// ⚡️在上 World 组件内去调用 Environment 组件的 switchTheme 方法
	switchTheme(theme: string) {
		if(theme === 'dark') {
			// 改变太阳光的颜色, GSAP.to能直接平滑过渡过去
			GSAP.to(this.sunLight.color, {
				r: 0.182,
				g: 0.242,
				b: 0.686,
			})
			GSAP.to(this.sunLight, {
				intensity: 0.78
			})
			// 改变环境光的颜色
			GSAP.to(this.ambientLight.color, { //强度
				r: 0.182,
				g: 0.242,
				b: 0.686,
			})
			GSAP.to(this.ambientLight, { //强度
				intensity: 0.78
			})
		} else {
			// 改变太阳光的颜色, GSAP.to能直接平滑过渡过去
			GSAP.to(this.sunLight.color, {
				r: 255 / 255,
				g: 255 / 255,
				b: 255 / 255,
			})
			GSAP.to(this.sunLight, { //强度
				intensity: 3
			})
			// 改变环境光的颜色
			GSAP.to(this.ambientLight.color, {
				r: 255 / 255,
				g: 255 / 255,
				b: 255 / 255,
			})
			GSAP.to(this.sunLight, { //强度
				intensity: 3
			})
		}
	}


	resize() {

	}

	update() {

	}
}