import React from 'react'
import Experience from './Experience'
import * as THREE from 'three'
import Sizes from './utils/Size'
import {PerspectiveCamera, Scene, OrthographicCamera} from '../../Types/ThreeTypes'




export default class Camera {
	public experience: Experience
	public sizes: Sizes //比例
	public canvas ?: HTMLCanvasElement //画布
	public scene: Scene //场景
	public perspectiveCamera!: PerspectiveCamera //相机
	public orthographicCamera!: OrthographicCamera //相机
	public frustumSize! : number //正交相机的视锥体大小


	// 🔥在构造函数中初始化实例属性
	constructor() {  
		this.experience = new Experience()
		this.sizes = this.experience.sizes //因为在 Experience 里边已经实例化了 sizes, 所以这里直接拿过来用就行了
		this.canvas = this.experience.canvas
		this.scene = this.experience.scene
		console.log(this.sizes, this.scene, this.canvas);
		this.createPerspectiveCamera() //调用原型方法, 创建远焦相机
		this.createOrthographicCamera() //创建正交相机
	}

	// 创建远焦相机的方法
	createPerspectiveCamera() {
		this.perspectiveCamera = new THREE.PerspectiveCamera(
			35, 
			this.
			sizes.aspect, 
			0.1, 
			1000
		) //0.1, 100 为摄像机距离的远近
		this.scene.add(this.perspectiveCamera) //把相机添加到场景中
	}

	// 创建正交相机的方法
	createOrthographicCamera() {
		this.frustumSize = 5 //正交相机的视锥体大小
		this.orthographicCamera = new THREE.OrthographicCamera(
			(-this.sizes.aspect * this.frustumSize) / 2,
			(this.sizes.aspect * this.frustumSize) / 2,
			this.sizes.frustumSize / 2,
			- this.sizes.frustumSize / 2,
			-100,
			100
		)
		this.scene.add(this.orthographicCamera) //把相机添加到场景中
	}

	// 在调整屏幕大小的时候，也需要更新相机的属性跟投影矩阵
	resize() {
		this.perspectiveCamera.aspect = this.sizes.aspect
		this.perspectiveCamera.updateProjectionMatrix()//更新投影矩阵

		this.orthographicCamera.left = (-this.sizes.aspect * this.frustumSize) / 2,
		this.orthographicCamera.right = (this.sizes.aspect * this.frustumSize) / 2,
		this.orthographicCamera.top = this.sizes.frustumSize / 2,
		this.orthographicCamera.bottom = - this.sizes.frustumSize / 2,
		this.perspectiveCamera.updateProjectionMatrix()//更新投影矩阵
	}

	// 更新相机的位置（轨道）
	update() {

	}
}