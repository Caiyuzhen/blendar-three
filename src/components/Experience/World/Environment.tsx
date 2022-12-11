import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import {Scene} from '../../../Types/ThreeTypes'
import Resources from '../utils/Resources'


// 环境光照
export default class Environment {
	public experience: Experience
	public scene: Scene
	public resources: Resources
	public sunLight!: THREE.DirectionalLight
	public ambientLight!: THREE.AmbientLight

	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.setSunLight()
	}

	setSunLight() {
		//方向光
		 this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 20;
        this.sunLight.shadow.mapSize.set(2048, 2048);
        this.sunLight.shadow.normalBias = 0.05;
		this.sunLight.position.set(1.5, 8, 3) //光照的位置 
		this.scene.add(this.sunLight) //🌞将光照添加到场景中
		// const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(helper);


		// 该光源可以投射阴影
		// var spotLight = new THREE.SpotLight(0xFFFFFF);
		// // 聚光灯在左上角
		// spotLight.position.set(-60, 40, -65);
		// // 此属性设置为 true 聚光灯将投射阴影。
		// spotLight.castShadow = true;
		// // 设置阴影效果
		// // near和far千万不能设置反了，否则阴影出不来
		// spotLight.shadow.camera.near = 40;
		// spotLight.shadow.camera.far = 130;


		//环境光
		this.ambientLight = new THREE.AmbientLight('#fffdf9', 0.8) //环境光照的颜色跟强度
		this.scene.add(this.ambientLight) //🌞将环境光照添加到场景中 


	}

	resize() {

	}

	update() {

	}
}