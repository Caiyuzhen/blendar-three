import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import Sizes from '../utils/Size'
import Camera from '../Camera'
import {Scene, WebGLRenderer} from '../../../Types/ThreeTypes'
import Room from './Room'



export default class World {
	public experience: Experience
	public sizes: Sizes //比例
	public canvas ?: HTMLCanvasElement //画布
	public scene: Scene //场景
	public camera: Camera //相机
	public renderer!: WebGLRenderer //渲染器 // THREE.WebGLRenderer 
	public room: Room //房间


	// 🔥在构造函数中初始化实例属性
	constructor() {  
		this.experience = new Experience()
		this.sizes = this.experience.sizes //因为在 Experience 里边已经实例化了 sizes, 所以这里直接拿过来用就行了
		this.canvas = this.experience.canvas
		this.scene = this.experience.scene
		this.camera	= this.experience.camera
		this.room = new Room()
	}


	resize() {

	}

	update() {

	}
}