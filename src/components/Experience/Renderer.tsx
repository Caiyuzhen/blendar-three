import React from 'react'
import Experience from './Experience'
import * as THREE from 'three'
import Sizes from './utils/Size'
import Camera from './Camera'
import {PerspectiveCamera, Scene, OrthographicCamera, WebGLRenderer} from '../../Types/ThreeTypes'



//渲染器
export default class Renderer {
	public experience: Experience
	public sizes: Sizes //比例
	public canvas ?: HTMLCanvasElement //画布
	public scene: Scene //场景
	public camera: Camera //相机
	public renderer!: WebGLRenderer //渲染器 // THREE.WebGLRenderer 


	// 🔥在构造函数中初始化实例属性
	constructor() {  
		this.experience = new Experience()
		this.sizes = this.experience.sizes //因为在 Experience 里边已经实例化了 sizes, 所以这里直接拿过来用就行了
		this.canvas = this.experience.canvas
		this.scene = this.experience.scene
		this.camera	= this.experience.camera
		this.setRenderer()  //调用原型方法, 创建渲染器

		// console.log(this.canvas, this.camera, this.camera.perspectiveCamera);
	}


	// 创建 WebGL 渲染器的方法
	setRenderer() {
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,  // 将 canvas 元素传给渲染器的 canvas 参数, 这样渲染器就会在这个 canvas 元素上进行渲染
			antialias: true,  // 启用抗锯齿
		})

		// 渲染器的基础设置
		this.renderer.physicallyCorrectLights = true // 启用物理光照
		this.renderer.outputEncoding = THREE.sRGBEncoding // 启用 sRGB 编码
		this.renderer.toneMapping = THREE.CineonToneMapping // 启用 Cineon 色调映射
		this.renderer.toneMappingExposure = 1.75 // 设置色调映射曝光度
		this.renderer.shadowMap.enabled = true // 启用阴影贴图
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap // 设置阴影贴图类型
		this.renderer.setSize(this.sizes.width, this.sizes.height) // 设置渲染器的尺寸
		this.renderer.setPixelRatio(this.sizes.pixeRatio) // 设置像素比
		// console.log(this.sizes.width, this.sizes.height);
	}


	// 🔥在调整屏幕大小的时候, 更新渲染器的尺寸和像素比
	resize() {
		// console.log('更新')
		this.renderer.setSize(this.sizes.width, this.sizes.height) // 设置渲染器的尺寸
		this.renderer.setPixelRatio(this.sizes.pixeRatio) // 设置像素比
	}

	// 更新相机的位置（轨道）
	update() {
		// 显示出单个屏幕 Screen
		// this.renderer.setViewport( //设置渲染器的视口
		// 	0, 
		// 	0, 
		// 	this.sizes.width, 
		// 	this.sizes.height
		// )
		// this.renderer.render(this.scene, this.camera.perspectiveCamera) //将场景和相机传给渲染器。渲染器会根据相机的视角渲染场景，并将渲染结果显示在屏幕上


		// 显示出两个屏幕的
		this.renderer.setViewport(0 ,0, this.sizes.width, this.sizes.height)
		this.renderer.render(this.scene, this.camera.orthographicCamera) //👀显示中心大场景，将场景和相机传给渲染器。渲染器会根据相机的视角渲染场景，并将渲染结果显示在屏幕上
		// this.renderer.render(this.scene, this.camera.perspectiveCamera) //👀显示中心大场景，将场景和相机传给渲染器。渲染器会根据相机的视角渲染场景，并将渲染结果显示在屏幕上

		this.renderer.setScissorTest(true) 
		
		this.renderer.setViewport( //设置渲染器的视口
			this.sizes.width - this.sizes.width / 3,
            this.sizes.height - this.sizes.height / 3,
            this.sizes.width / 3,
            this.sizes.height / 3
		)
		


		this.renderer.setScissor( //设置渲染器的视口
			this.sizes.width - this.sizes.width / 3, 
			this.sizes.height - this.sizes.height / 3, 
			this.sizes.width / 3, 
			this.sizes.height / 3
		)

		this.renderer.render(this.scene, this.camera.perspectiveCamera) //👀显示右上角小场景，将场景和相机传给渲染器。渲染器会根据相机的视角渲染场景，并将渲染结果显示在屏幕上
		// this.renderer.render(this.scene, this.camera.orthographicCamera) //👀显示右上角小场景，将场景和相机传给渲染器。渲染器会根据相机的视角渲染场景，并将渲染结果显示在屏幕上
		this.renderer.setScissorTest(false) 
		
	}
}