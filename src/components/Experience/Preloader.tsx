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


	// loading 加载动画
	firstIntro() {
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
				x: -1,
				ease: "power1.out", //🌟参考 https://greensock.com/docs/v3/Eases
				duration: 1,
			})
		} else if(this.device === 'mobile') { 
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
			})
		}
	}


	// 最终执行动画
	playIntro() {
		this.firstIntro()
	}
}