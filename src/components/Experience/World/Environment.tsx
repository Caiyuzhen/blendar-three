import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import {Scene} from '../../../Types/ThreeTypes'
import Resources from '../utils/Resources'



export default class Environment {
	public experience: Experience
	public scene: Scene
	public resources: Resources
	public sunLight!: THREE.DirectionalLight

	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.setSunLight()
	}

	setSunLight() {
		this.sunLight = new THREE.DirectionalLight('#fffdf9', 3) //光照的颜色跟强度
		this.sunLight.castShadow = true //光照投射阴影
		this.sunLight.shadow.camera.far = 20 //光照投射阴影的范围
		this.sunLight.shadow.mapSize.set(1024, 1024) //光照投射阴影的分辨率 (1k)
		this.sunLight.shadow.normalBias = 0.05 //光照投射阴影的偏移
		this.sunLight.position.set(1.5, 8, 3) //光照的位置 
		this.scene.add(this.sunLight) //🌞将光照添加到场景中
	}

	resize() {

	}

	update() {

	}
}