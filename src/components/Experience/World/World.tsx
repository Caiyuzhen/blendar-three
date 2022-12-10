import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import Sizes from '../utils/Size'
import Camera from '../Camera'
import {Scene, WebGLRenderer} from '../../../Types/ThreeTypes'
import Resources from '../utils/Resources'
import Room from './Room'
import {EventEmitter} from 'events' 
import Environment from './Environment' //灯光环境


export default class World {
	public experience: Experience
	public sizes: Sizes //比例
	public canvas ?: HTMLCanvasElement //画布
	public scene: Scene //场景
	public camera: Camera //相机
	public renderer!: WebGLRenderer //渲染器 // THREE.WebGLRenderer 
	public resources: Resources //资源
	public environment!: Environment //灯光环境
	public room!: Room //房间


	// 🔥在构造函数中初始化实例属性
	constructor() {  
		this.experience = new Experience()
		this.sizes = this.experience.sizes //因为在 Experience 里边已经实例化了 sizes, 所以这里直接拿过来用就行了
		this.canvas = this.experience.canvas
		this.scene = this.experience.scene
		this.camera	= this.experience.camera
		this.resources = this.experience.resources

		//🔥资源都加载好后，在 World 类里边触发 ready 事件, 创建一个房间 （🔥🔥world 一定义放最后面！不然获取不到 resources!）
		// console.log('资源:', this.experience.resources);
		this.resources.on("ready", ()=>{
			this.environment = new Environment() //创建一个灯光环境
			this.room = new Room() //创建一个房间
		})
	}


	resize() {

	}

	update() {

	}
}