import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import Sizes from '../utils/Size'
import Camera from '../Camera'
import {Scene, WebGLRenderer} from '../../../Types/ThreeTypes'
import Resources from '../utils/Resources'
import Theme from '../Theme'
import Room from './Room'
import {EventEmitter} from 'events' 
import Environment from './Environment' //灯光环境
import Controls from './Controls'
import Floor from './Floor' //🏓导入新物体第一步



// 等 Resource 加载完后, 实例化所有物体
export default class World extends EventEmitter{ //下面要用 emit 发出事件信号的话, 就要继承 EventEmitter
	public experience: Experience
	public sizes: Sizes //比例
	public canvas ?: HTMLCanvasElement //画布
	public scene: Scene //场景
	public camera: Camera //相机
	public renderer!: WebGLRenderer //渲染器 // THREE.WebGLRenderer 
	public resources: Resources //资源
	public theme: Theme //主题
	public environment!: Environment //灯光环境
	public room!: Room //房间
	public floor!: Floor //🏓导入新物体第二步
	public controls!: Controls


	// 🔥在 World 的构造函数中初始化实例属性
	constructor() {  
		super()
		this.experience = new Experience()
		this.sizes = this.experience.sizes //因为在 Experience 里边已经实例化了 sizes, 所以这里直接拿过来用就行了
		this.scene = this.experience.scene
		this.canvas = this.experience.canvas
		this.camera	= this.experience.camera
		this.resources = this.experience.resources
		this.theme = this.experience.theme
		// console.log('资源:', this.experience.resources) 

		/*⚡️⚡️利用 event 库， 等资源都加载好后，👇统一在 World 类里边触发 ready 事件, 让 resources 内的事件开始执行
			创建一个房间 （🔥🔥world 一定义放最后面！不然获取不到 resources!）
		*/
		this.resources.on("ready", ()=>{
			this.environment = new Environment() //创建一个灯光环境
			this.floor = new Floor() ////🏓导入新物体第三步（地板要在 Room 之前创建）
			this.room = new Room() //创建一个房间 
			this.controls = new Controls() //曲线, 控制相机的运动方向
			// console.log(this.scene);
			this.emit("worldReady") // ⚡️⚡️接收到 ready 事件后，再去发送一个 worldReady 事件，通知 Preloader
		})

		 //⚡️⚡️利用 event 库接收 Theme 组件内的 switch 事件以及事件参数！
		this.theme.on('switch', (theme: string) => {
			this.switchTheme(theme)
		})
	}






	// 🌞切换主题色的方法, 本质上是再去调用 Environment 组件内的 switchTheme 方法
	switchTheme(theme: string) {
		if(this.environment) {
			this.environment.switchTheme(theme) //因为需要直接改 environment 的属性
		}
	}


	resize() {

	}

	update() {
		/* 🐟三: 在上边🔥资源都加载好后, 需要不断地更新整个 World ！
			让动画动起来(Experience 内调用更新、World 内部调用更新、 Room 内部调用更新) */
		if(this.room) {
			this.room.update()
		}

		if(this.controls) {
			this.controls.update()
		}
	}
}