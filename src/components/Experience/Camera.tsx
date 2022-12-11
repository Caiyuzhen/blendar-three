import React from 'react'
import Experience from './Experience'
import * as THREE from 'three'
import Sizes from './utils/Size'
import {PerspectiveCamera, Scene, OrthographicCamera} from '../../Types/ThreeTypes'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'



export default class Camera {
	public experience: Experience
	public sizes: Sizes //比例
	public canvas ? : HTMLCanvasElement //画布
	public scene: Scene //场景
	public perspectiveCamera!: PerspectiveCamera //远景相机
	public orthographicCamera!: OrthographicCamera //近景相机
	public frustumSize! : number //正交相机的视锥体大小
	public controls!: OrbitControls //相机轨道控制器


	// 🔥在构造函数中初始化实例属性
	constructor() {  
		this.experience = new Experience()
		this.sizes = this.experience.sizes //因为在 Experience 里边已经实例化了 sizes, 所以这里直接拿过来用就行了
		this.canvas = this.experience.canvas
		this.scene = this.experience.scene
		// console.log(this.sizes, this.scene, this.canvas);
		this.createPerspectiveCamera() //调用原型方法, 创建远焦相机
		this.createOrthographicCamera() //创建正交相机
		this.setOrbitControls() //创建相机轨道控制器
	}

	// 创建远景相机的方法
	createPerspectiveCamera() {
		this.perspectiveCamera = new THREE.PerspectiveCamera(
			35, 
			this.
			sizes.aspect, 
			0.1, 
			1000
		) //0.1, 100 为摄像机距离的远近
		this.scene.add(this.perspectiveCamera) //把相机添加到场景中
		this.perspectiveCamera.position.x = 4
        this.perspectiveCamera.position.y = 4;
        this.perspectiveCamera.position.z = 4;
	}

	// 创建近景相机的方法
	createOrthographicCamera() {
		this.frustumSize = 5 //正交相机的视锥体大小
		this.orthographicCamera = new THREE.OrthographicCamera(
			(-this.sizes.aspect * this.frustumSize) / 2,
			(this.sizes.aspect * this.frustumSize) / 2,
			this.sizes.frustumSize / 2,
			- this.sizes.frustumSize / 2,
			-50,
			50
		)
		this.scene.add(this.orthographicCamera) //把相机添加到场景中
		// this.perspectiveCamera.position.set(12, 8, 10) //设置远焦相机的位置(🔥相机视角)

		// 创建网格辅助器（地面网格）
		const size = 10
		const divisions = 10
		const gridHelper = new THREE.GridHelper(size, divisions)
		this.scene.add(gridHelper)
		const axesHelper = new THREE.AxesHelper(10)
		this.scene.add(axesHelper)
	}

	// 创建相机轨道控制器
	setOrbitControls() {
		this.controls = new OrbitControls(this.perspectiveCamera, this.canvas)
		this.controls.enableDamping = true //打开阻尼效果
		this.controls.enableZoom = true //打开缩放
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
		this.controls.update()
	}
}