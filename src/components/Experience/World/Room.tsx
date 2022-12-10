import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import {Scene} from '../../../Types/ThreeTypes'



export default class Room {
	public experience: Experience
	public scene: Scene


	// 🔥在构造函数中初始化实例属性
	constructor() {  
		this.experience = new Experience()
		this.scene = this.experience.scene

		// 添加一些基础
		const geometry = new THREE.BoxGeometry(1, 1, 1)
		const material = new THREE.MeshBasicMaterial({color: '#3370FF'})
		const cube = new THREE.Mesh(geometry, material)
		this.scene.add(cube) //将立方体添加到场景中
	}


	resize() {

	}

	update() {

	}
}