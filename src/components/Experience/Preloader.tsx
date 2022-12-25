// 刚进入页面时的加载效果跟文字渐入效果
import { EventEmitter } from 'events'
import Experience from './Experience'
import Time from './utils/Time'
import Room from './World/Room'
import GSAP from 'gsap'
import Resources from './utils/Resources'
import { Scene } from '../../Types/ThreeTypes'
import Camera from './Camera'
import Sizes from './utils/Size'
import World from './World/World'



// 加载动画, 以及文字渐入效果, 记得也要去 experience 内加载一下
export default class Preloader extends EventEmitter {
	public experience: Experience
	public time!: Time
	public camera!: Camera
	public resources: Resources
	readonly sizes: Sizes
	public world: World
	public room!: Scene //因为 Room 内的物体是挂载到 scene 上的 -> this.actualRoom = this.room.scene 
	public timeline!: gsap.core.Timeline
	public secondTimeline!: gsap.core.Timeline
	public scrollOnceEvent!: (e: WheelEvent) => void //是一个函数, 用来绑定 e 的指向


	constructor() {
		super()
		this.experience = new Experience() //🔥🔥 new 的核心实例要放在最前面！下面的属性才能拿到！！ scene 要通过 experience 拿到 scene！不能单独 new 实例！不然会有多个 scene！
		this.scene = this.experience.scene
		this.time = this.experience.time
		this.camera = this.experience.camera
		this.resources = this.experience.resources
		this.sizes = this.experience.sizes
		this.world = this.experience.world
		this.device = this.sizes.device

		this.sizes.on('switchDevice', (device: string) => { //🔥等 Size 内发出 emit 信号, 可以获得 device 的值
			this.device = device
		})

		this.world.on("worldReady", () => { //当 world 内发出加载完的信号时, 才执行里边的这两个函数
			this.setAssets()
			this.playIntro()
		})
	}




	// 承接两个变量
	setAssets() {
		this.room = this.experience.world.room.actualRoom
		this.roomChildren = this.experience.world.room.roomChildren
		// console.log(this.roomChildren); //所有子元素, 如果不用一个变量去统一接收的话, 就需要像 control 里边一样, 每次去判断 this.room.children.forEach...if( child.name === '...') {}
	}



	// loading 加载动画 _ 位移小方块
	firstIntro() {
		// 🚀🚀🚀 用异步的方式来触发这个动画, 不然一开始就会被滚动条的事件给触发了
		return new Promise((resolve) => {
			this.timeline = new GSAP.core.Timeline()

			// 根据不同的设备来展示不同的动画
			if(this.device === 'desktop') {
				this.timeline.to(this.roomChildren.cube.scale, { //把所有子元素统一缩放
					x: 1.4,
					y: 1.4,
					z: 1.4,
					ease: "back.out(2.5)",  //小盒子放大又缓动缩小的效果
					duration: 1,
				}).to(this.room.position, {
					x: -1, //向左移动
					ease: "power1.out", //🌟参考 https://greensock.com/docs/v3/Eases
					duration: 1,
					onComplete: resolve,
				})
			} else if (this.device === 'mobile') { 
				this.timeline.to(this.roomChildren.cube.scale, { //把所有子元素统一缩放
					x: 1.4,
					y: 1.4,
					z: 1.4,
					ease: "back.out(2.5)",  //小盒子放大又缓动缩小的效果
					duration: 1,
				}).to(this.room.position, {
					z: -1, //向上移动
					ease: "power1.out", //🌟参考 https://greensock.com/docs/v3/Eases
					duration: 1,
					onComplete: resolve,
				})
			}
		})
	}



	// loading 加载动画 _ 房间变大
	secondIntro() {
		this.secondTimeline = new GSAP.core.Timeline()

		// 根据不同的设备来展示不同的动画
		if(this.device === 'desktop') {
			this.secondTimeline.to(this.room.position, {
				x: 0,
				y: 0,
				z: 0, 
				ease: "power1.out", //🌟参考 https://greensock.com/docs/v3/Eases
				duration: 1,
			})
		} else if(this.device === 'mobile') { 
			this.secondTimeline.to(this.room.position, {
				x: 0,
				y: 0,
				z: 0, 
				ease: "power1.out", //🌟参考 https://greensock.com/docs/v3/Eases
				duration: 1,
			})
		}
	}



	//判断鼠标滚动的方向, 然后开始播放动画, WheelEvent 对象才有 deltaY 属性
	onScroll(e: WheelEvent) {
		if(e.deltaY > 0) { //鼠标向下滚动
			console.log('向下滚动了')
			// console.log(this.room.position)  // x = -1
			window.removeEventListener('wheel', this.scrollOnceEvent) //值播放一次，所以要移除监听事件
			this.playSecondIntro()
		}
	}



	// 最终执行动画 _ 位移小方块的动画 (🚀🚀🚀异步, 等动画播放完毕后再执行下面的代码, 才回去监听鼠标滚动事件)
	async playIntro() {
		await this.firstIntro()

		// 监听鼠标滚动事件, 向下滚动时则播放一则动画
		this.scrollOnceEvent = this.onScroll.bind(this) //🔥🔥 把 e 绑定给 onScroll 函数
		window.addEventListener('wheel', this.scrollOnceEvent)  
	}



	// 最终执行动画 _ 房间变大的动画
	playSecondIntro() {
		this.secondIntro() 
	}
}