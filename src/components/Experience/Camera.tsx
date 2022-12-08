import React from 'react'
import Experience from './Experience'
import * as THREE from 'three'
import Sizes from './utils/Size'
import {PerspectiveCamera, Scene, OrthographicCamera} from '../../Types/ThreeTypes'




export default class Camera {
	public experience: Experience
	public sizes: Sizes
	public canvas ?: HTMLCanvasElement
	public scene: Scene
	// public perspectiveCamera: PerspectiveCamera


	constructor() {  // 在构造函数中初始化实例属性
		this.experience = new Experience()
		this.sizes = this.experience.sizes //因为在 Experience 里边已经实例化了 sizes, 所以这里直接拿过来用就行了
		this.canvas = this.experience.canvas
		this.scene = this.experience.scene
		console.log(this.sizes, this.scene, this.canvas);
		// this.perspectiveCamera = this.createPerspectiveCamera() //创建透视相机
		// this.createOrthographicCamera() //创建相机
	}

	// createPerspectiveCamera() {
	// 	this.createPerspectiveCamera = new THREE.PerspectiveCamera(
	// 		35, 
	// 		this.
	// 		sizes.aspect, 
	// 		0.1, 
	// 		1000
	// 		) //0.1, 100 为摄像机距离的远近
	// }
}