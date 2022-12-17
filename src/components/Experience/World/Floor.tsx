import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import {Scene} from '../../../Types/ThreeTypes'


// 地板元素，用于显示地面投影
export default class Floor {
	public experience: Experience
	public scene: Scene
	private geometry!: THREE.PlaneGeometry
	private material!: THREE.MeshStandardMaterial //MeshStandardMaterial 才有阴影！！
	private plane!: THREE.Mesh


	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.setFloor()
	}

	// 创建一个平面地板
	setFloor() {
		this.geometry = new THREE.PlaneGeometry(100, 100)
		this.material = new THREE.MeshStandardMaterial({
			color: '#ded6d6',
			side: THREE.BackSide, //把材质设置在另一侧或双侧 DoubleSide \ BackSide \ FrontSide
		})
		this.plane = new THREE.Mesh(this.geometry, this.material)
		this.scene.add(this.plane)  //添加进场景内
		this.plane.rotation.x = Math.PI / 2  //把物体旋转 90 度
		this.plane.position.y = -0.1 //把地板往下位移
		
		this.plane.receiveShadow = true //让物体接收阴影的渲染

		console.log(this.plane);
	}


	resize() {

	}


	update() {

	}
}