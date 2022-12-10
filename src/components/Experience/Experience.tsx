import React from 'react'
import * as THREE from 'three' 
import Camera from './Camera'
import Renderer from './Renderer'
import Sizes from './utils/Size'
import Time from './utils/Time'
import {Scene} from '../../Types/ThreeTypes'
import World from './World/World'
import Resources from './utils/Resources'
import Assets from './utils/Assets'


// ⚡️⚡️ 封装其他所有组件的能力, 返回单独的一个实例 （封装 api 的逻辑）
export default class Experience {
	public static instance: any //🔥单实例的模式, 把各种 class 的实例都放在 Experience 这里, 其他组件通过 Experience.instance 来获取实例
	public canvas ? : HTMLCanvasElement //类里边的实例属性
	public scene!: Scene   //THREE.Scene //类里边的实例属性
	public time!: Time //类里边的实例属性
	public sizes!: Sizes //类里边的实例属性
	public camera!: Camera //类里边的实例属性
	public renderer!: Renderer //类里边的实例属性
	public resources!: Resources //类里边的实例属性
	public world!: World //定义一个世界

	
	constructor(canvas? :HTMLCanvasElement) {
		// console.log('Hey, 成功新建类型');

		if(Experience.instance) {
			return Experience.instance
		}
		Experience.instance = this //如果没有实例, 就把当前实例赋值给 Experience.instance

		// super(canvas) //继承的类需要 super 一下
		this.canvas = canvas //把传进来的 canvas 赋值给类里边的 canvas 属性
		this.scene = new THREE.Scene() //实例化一个场景, 赋值给 scene 属性
		this.time = new Time() //实例化一个时间, 赋值给 time 属性
		this.sizes = new Sizes() //实例化一个画布的尺寸, 赋值给 sizes 属性
		this.camera = new Camera()
		this.renderer = new Renderer() //实例化一个渲染器, 赋值给 renderer 属性
		this.world = new World() //🌍实例化一个世界, 赋值给 world 属性（world 一定义放最后面！）
		this.resources = new Resources(Assets) //🔥实例化一个资源管理器, 赋值给 resources 属性
		// console.log(Assets);

		/* events.EventEmitter, 事件, 根据 Time 内的事件来更新，然后调用所有子类的 update() 方法 */
		//🎃第四步: 调用触发器, 触发 Experience 内的更新方法
		this.time.on("Update", ()=>{
			this.update()
		})

		this.time.on("resize", ()=>{
			this.resize()
		})
		// // from https://threejs.org/docs/#manual/zh/introduction/Creating-a-scene
	}

	////🎃第三步: 定义更新个函数, 统一调用所有子类内的 update() 方法！
	update() {
		this.camera.update()
		this.renderer.update()
	}

	resize() { //Size 更新后, 调用 camera 和 renderer 的 resize 方法
		this.camera.resize()
		this.renderer.resize()
	}
}

