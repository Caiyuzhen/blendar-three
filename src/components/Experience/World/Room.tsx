import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import {Scene} from '../../../Types/ThreeTypes'
import Resources from '../utils/Resources'



export default class Room {
	public experience: Experience
	public scene: Scene
	public resources: Resources
	public room: Room
	public actualRoom: Scene //真正想要展示在 ROOM 内的场景


	// 🔥在构造函数中初始化实例属性
	constructor() {  
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.room = this.resources.items.room
		this.actualRoom = this.room.scene //真正想要展示在 ROOM 内的 3D 物体
		console.log(this.actualRoom); //真正想要展示在 ROOM 内的 3D 物体

		this.setModel()//把 3D 物体添加到场景中

		// 添加一些基础立方体（测试）
		// const geometry = new THREE.BoxGeometry(1, 1, 1)
		// const material = new THREE.MeshBasicMaterial({color: '#3370FF'})
		// const cube = new THREE.Mesh(geometry, material)
		// this.scene.add(cube) //将立方体添加到场景中
	}


	//把 3D 物体添加到场景中的方法
	setModel(){
		this.scene.add(this.actualRoom)
	}


	resize() {

	}

	update() {

	}
}