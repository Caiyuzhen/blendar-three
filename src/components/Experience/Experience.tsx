import React from 'react'
import * as THREE from 'three' 
import Camera from './Camera'
import Renderer from './Renderer'
import Sizes from './utils/Size'
import Time from './utils/Time'
import {Scene} from '../../Types/ThreeTypes'
import Resources from './utils/Resources'
import Assets from './utils/Assets'
import Room from './World/Room'
import Theme from './Theme'
import World from './World/World'



// ⚡️⚡️ 封装其他所有组件的能力, 返回单独的一个实例 （封装 api 的逻辑）
export default class Experience {
	public static instance: Experience //单实例的模式, 把各种 class 的实例都放在 Experience 这里, 其他组件通过 Experience.instance 来获取实例
	public canvas ? : HTMLCanvasElement //类里边的实例属性
	public firstEle !: HTMLDivElement
	public secondEle !: HTMLDivElement
	public thirdEle !: HTMLDivElement
	public scene!: Scene   //THREE.Scene //类里边的实例属性
	public time!: Time //类里边的实例属性
	public sizes!: Sizes //类里边的实例属性
	public camera!: Camera //类里边的实例属性
	public renderer!: Renderer //类里边的实例属性
	public resources!: Resources //类里边的实例属性
	private toggleButton!: HTMLLabelElement
	private toggleCircle!: HTMLInputElement
	public theme!: Theme 
	public world!: World //定义一个世界(所有模型都在 World 里边的 Home 进行实例化！)
	// public room!: Room



	constructor(canvas ? : HTMLCanvasElement, firstEle ? : HTMLDivElement, secondEle ? : HTMLDivElement, thirdEle ? : HTMLDivElement, toggleButton ? : HTMLLabelElement, toggleCircle ? : HTMLInputElement) { //三个参数都由上一层的函数组件传入, toggleButton 、toggleCircle 需要传给 Theme 组件
		// console.log('Hey, 成功新建类型');

		// 返回实例
		if(Experience.instance) {
			return Experience.instance
		}
		Experience.instance = this //如果没有实例, 就把当前实例赋值给 Experience.instance

		// super(canvas) //继承的类需要 super 一下
		this.canvas = canvas //把传进来的 canvas 赋值给类里边的 canvas 属性
		this.firstEle = firstEle as HTMLDivElement //用于判断 GSAP 加载动画的位置
		this.secondEle = secondEle as HTMLDivElement //用于判断 GSAP 加载动画的位置
		this.thirdEle = thirdEle as HTMLDivElement //
		this.scene = new THREE.Scene() //实例化一个场景, 赋值给 scene 属性
		this.time = new Time() //实例化一个时间, 赋值给 time 属性
		this.sizes = new Sizes() //实例化一个画布的尺寸, 赋值给 sizes 属性
		this.camera = new Camera()
		this.renderer = new Renderer() //实例化一个渲染器, 赋值给 renderer 属性
		this.resources = new Resources(Assets) //🔥实例化一个资源管理器, 赋值给 resources 属性
		this.toggleButton = toggleButton as HTMLLabelElement
		this.toggleCircle = toggleCircle as HTMLInputElement
		this.theme = new Theme( //把两个 toggle 元素传给它
			this.toggleButton,
			this.toggleCircle,
		)

		this.world = new World() //🌍实例化一个世界, 赋值给 world 属性（🔥🔥world 一定义放最后面！不然获取不到 resources!）
		// this.room = new Room() //实例化一个房间, 里边的 actualRoom 是最终需要展示出来的元素(可以通过上面的 World 调用)
		// console.log(this.resources);
		// console.log(this.firstEle);


		
		/* events.EventEmitter, 事件, 根据 Time 内的事件来更新，然后调用所有子类的 update() 方法 */
		//🎃第四步: 调用触发器, 触发 Experience 内的更新方法
		this.time.on("Update", ()=>{ //时间更新，触发 Update 事件
			this.update()
		})

		this.sizes.on("resize", ()=>{ //屏幕拉伸，触发 resize 事件
			this.resize()
		})
		// // from https://threejs.org/docs/#manual/zh/introduction/Creating-a-scene
	}

	////🎃第三步: 定义更新个函数, 统一调用所有子类内的 update() 方法！
	update() {
		this.camera.update()
		this.world.update()//让动画动起来(Experience 内调用更新、World 内部调用更新、 Room 内部调用更新)
		this.renderer.update()
	}

	resize() { //Size 更新后, 调用 camera 和 renderer 的 resize 方法
		this.camera.resize()
		this.renderer.resize()
	}
}

