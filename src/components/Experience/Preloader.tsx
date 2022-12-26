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
import convert from './utils/covertTextToSpan' //拆分出一个个文字的方法



// 加载动画, 以及文字渐入效果, 以及小方块变成大房间、大房间内的物体依次放大的效果, 记得也要去 experience 内加载一下
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
	public touchStart!: (e: TouchEvent) => void
	public touchMove!: (e: TouchEvent) => void
	public roomChildren: any
	public initalY!: number
	public moveFlag: Boolean = false
	public scaleFlag: Boolean = false

	


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
		this.intro_Text = this.experience.intro_Text	
		this.intro_Maintitle = this.experience.intro_Maintitle
		this.intro_MainDes = this.experience.intro_MainDes
		this.intro_SecondSubHead = this.experience.intro_SecondSubHead
		this.intro_SecondSubTitle = this.experience.intro_SecondSubTitle

		this.sizes.on('switchDevice', (device: string) => { //🔥等 Size 内发出 emit 信号, 可以获得 device 的值
			this.device = device
		})

		this.world.on("worldReady", () => { //当 world 内发出加载完的信号时, 才执行里边的这两个函数
			this.setAssets()
			this.playIntro()
		})
	}




	// ⚡️用变量来承接元素并进行处理, 方便下边的动画使用
	setAssets() {
		convert(this.intro_Text)// 拆分出一个个文字
		convert(this.intro_Maintitle) // 拆分出一个个文字
		convert(this.intro_MainDes) // 拆分出一个个文字
		convert(this.intro_SecondSubHead) // 拆分出一个个文字
		convert(this.intro_SecondSubTitle) // 拆分出一个个文字
		this.room = this.experience.world.room.actualRoom
		this.roomChildren = this.experience.world.room.roomChildren
		// console.log(this.roomChildren); //所有子元素, 如果不用一个变量去统一接收的话, 就需要像 control 里边一样, 每次去判断 this.room.children.forEach...if( child.name === '...') {}
	}



	// 🐲 第一个 loading 加载动画 _ 位移小方块
	firstIntro() {
		// 🚀🚀🚀 用异步的方式来触发这个动画, 不然一开始就会触发下一个动画了
		return new Promise((resolve) => {
			this.timeline = new GSAP.core.Timeline()

			// 公共方法，不区分设备
			this.timeline.set('.animatedis', {y:0, yPercent:100})//解决文字的响应式问题
			this.timeline
			.to('.preloader', {
				opacity: 0,
				delay: 0.5,
				onComplete: ()=> {
					document.querySelector('.preloader')!.classList.add('hidden')// 。。。 动画加载完后添加个类把它隐藏掉
				}
			})
			.to(this.roomChildren.rectLight, { //🐟💡鱼缸的灯光, 等到 Control 加载时再被加上宽高（会有开灯的效果！）
				width: 0,
				height: 0,
			})

			// 根据不同的设备来展示不同的动画
			if(this.device === 'desktop') {
				this.timeline
				.to(this.roomChildren.cube.position, {
					y: 0.1,
				}).to(this.roomChildren.cube.scale, { //把所有子元素统一缩放
					x: 1.4,
					y: 1.4,
					z: 1.4,
					ease: "back.out(2.5)",  //小盒子放大又缓动缩小的效果
					duration: 1,
				}).to(this.room.position, {
					x: -1, //向左移动
					ease: "power1.out", //🌟参考 https://greensock.com/docs/v3/Eases
					duration: 1,
					// onComplete: resolve,
				})
			} else if (this.device === 'mobile') { 
				this.timeline.to(this.roomChildren.cube.position, {
					y: 0.1,
				}).to(this.roomChildren.cube.scale, { //把所有子元素统一缩放
					x: 1.4,
					y: 1.4,
					z: 1.4,
					ease: "back.out(2.5)",  //小盒缓动缩小的效果
					duration: 1,
				}).to(this.room.position, {
					z: -1, //向上移动
					ease: "power1.out", //🌟参考 https://greensock.com/docs/v3/Eases
					duration: 1,
					// onComplete: resolve,
				})
			}
			// 🧩🧩 单个文字的入场动画(注意，要先在上边的 setAssets 进行文字的拆分！)
			this.timeline.to('.intro-text .animatedis', { //获得元素， 会匹配具有类名 'intro_Maintitle' 的【🌞父元素】下的所有具有类名 'animatedis' 的【🌛子元素】
				yPercent: 0, //从哪个位置移入
				stagger: 0.05, //每个文字之间的时间间隔
				ease: "back.out(1.7)", 
				// onComplete: resolve, //🤲🤲 配合异步函数, 当动画执行完毕后, 执行 resolve
			})
			.to('.arrow-svg-wrapper', { //🔥🔥向下的小箭头，直接匹配类名就行了！！！很方便
				opacity: 1,
			}, 'same')
			.to('.toggle-bar', {
				opacity: 1,
				onComplete: resolve, //🤲🤲 配合异步函数, 当动画执行完毕后, 执行 resolve
			}, 'same')
		})
	}



	// 🐲 第二个 loading 加载动画 _ 房间的物体依次变大
	secondIntro() {
		// 🚀🚀🚀 用异步的方式来触发这个动画, 不然一开始就会被滚动的事件给触发了
		return new Promise((resolve) => {
			this.secondTimeline = new GSAP.core.Timeline()

			// 移动端跟桌面端相同，不区分
			this.secondTimeline
			.to('.intro-text .animatedis', { //🧩🧩 第一个动画的文字再移出去！！ 会匹配具有类名 'intro_Maintitle' 的【🌞父元素】下的所有具有类名 'animatedis' 的【🌛子元素】
				yPercent: 100, //从哪个位置移入
				stagger: 0.05, //每个文字之间的时间间隔
				ease: "back.in(2)", 
			}, 'fadeout')
			.to('.arrow-svg-wrapper', { //🔥🔥向下的小箭头，直接匹配类名就行了！！！很方便
				opacity: 0,
			}, 'fadeout')
			.to(this.room.position, {
				x: 0,
				y: 0,
				z: 0, 
				ease: "power1.out", //🌟参考 https://greensock.com/docs/v3/Eases
				duration: 0.5,
			},'same')
			.to(this.roomChildren.cube.rotation, {
				y: 2*Math.PI + Math.PI / 4, //旋转
			},'same')
			.to(this.roomChildren.cube.scale, {
				x: 10,
				y: 10,
				z: 10,
			},'same')
			.to(this.camera.orthographicCamera.position, { //👀相机往下移, 让立方体拉高的过程可以被看到
				y: 4,
			},'same')
			.to(this.roomChildren.cube.position, {
				x: 0.638,
				y: 8.56,
				z: 1.32,		
			},'same')
			.set(this.roomChildren.body.scale, { //等 cube 方块旋转放大完成后, 再把 body 显示出来
				x: 1,
				y: 1,
				z: 1,
			})
			.to(this.roomChildren.cube.scale, { //把 cube 方块缩小归 0
				y: 0,
				x: 0,
				z: 0,
			}, "introText")
			.to('.hero-main-title .animatedis', { // 🧩🧩会匹配具有类名 'intro_Maintitle' 的【🌞父元素】下的所有具有类名 'animatedis' 的【🌛子元素】
				yPercent: 0, //从哪个位置移入(👀注意方向！！！)
				stagger: 0.07, //每个文字之间的时间间隔
				ease: "back.out(1.8)", 
			}, "introText")
			.to('.hero-main-description .animatedis', { // 🧩🧩会匹配具有类名 'intro_Maintitle' 的【🌞父元素】下的所有具有类名 'animatedis' 的【🌛子元素】
				yPercent: 0, //从哪个位置移入(👀注意方向！！！)
				stagger: 0.07, //每个文字之间的时间间隔
				ease: "back.out(1.8)", 
			}, "introText")
			.to('.hero-second-subheading .animatedis', { // 🧩🧩会匹配具有类名 'intro_Maintitle' 的【🌞父元素】下的所有具有类名 'animatedis' 的【🌛子元素】
				yPercent: 0, //从哪个位置移入(👀注意方向！！！)
				stagger: 0.07, //每个文字之间的时间间隔
				ease: "back.out(1.8)", 
			}, "introText")
			.to('.hero-second-subheading .animatedis', { // 🧩🧩会匹配具有类名 'intro_Maintitle' 的【🌞父元素】下的所有具有类名 'animatedis' 的【🌛子元素】
				yPercent: 0, //从哪个位置移入(👀注意方向！！！)
				stagger: 0.07, //每个文字之间的时间间隔
				ease: "back.out(1.8)", 
			}, "introText")
			.to(this.roomChildren.aquarium.scale, { // aquarium 水族箱放大
				x: 1,
				y: 1,
				z: 1,
				ease: "back.out(2.2)",
				duration: 0.4,
			},  ">-0.5") //插入到前一个动画结束的时间之后的 0.5 秒的位置
			.to(this.roomChildren.clock.scale, { 
				x: 1,
				y: 1,
				z: 1,
				ease: "back.out(2.2)",
				duration: 0.4,
			}, ">-0.4")
			.to(this.roomChildren.shelves.scale, { 
				x: 1,
				y: 1,
				z: 1,
				ease: "back.out(2.2)",
				duration: 0.4,
			}, ">-0.3")
			.to(this.roomChildren.floor_items.scale, { 
				x: 1,
				y: 1,
				z: 1,
				ease: "back.out(2.2)",
				duration: 0.4,
			}, ">-0.2")
			.to(this.roomChildren.mini_floor.scale, { 
				x: 1,
				y: 1,
				z: 1,
				ease: "back.out(2.2)",
				duration: 0.4,
			}, ">-0.1")
			.to(this.roomChildren.desks.scale, { 
				x: 1,
				y: 1,
				z: 1,
					ease: "back.out(2.2)",
				duration: 0.4,
			}, ">-0.1")
			.to(this.roomChildren.table_stuff.scale, { 
				x: 1,
				y: 1,
				z: 1,
					ease: "back.out(2.2)",
				duration: 0.4,
			}, ">-0.1")
			.to(this.roomChildren.computer.scale, { 
				x: 1,
				y: 1,
				z: 1,
					ease: "back.out(2.2)",
				duration: 0.4,
			})
			.to(this.roomChildren.chair.scale, { 
				x: 1,
				y: 1,
				z: 1,
					ease: "back.out(2.2)",
				duration: 0.5,
			}, 'chair') //同时播放
			.to(this.roomChildren.chair.rotation, { 
				y: 4 * Math.PI + Math.PI / 4,
				ease: "power2.out",
				duration: 1,
				// onComplete: resolve,
			}, 'chair') //同时播放
			.to('.arrow-svg-wrapper', { //🔥🔥向下的小箭头，最后再出现
				opacity: 1,
				onComplete: resolve,//🤲🤲 配合异步函数, 当动画执行完毕后, 执行 resolve
			})
		})
	}



	//判断鼠标滚动的方向, 然后开始播放动画, WheelEvent 对象才有 deltaY 属性
	onScroll(e: WheelEvent) {
		if(e.deltaY > 0) { //鼠标向下滚动
			console.log('向下滚动了')
			// console.log(this.room.position)  // x = -1
			// window.removeEventListener('wheel', this.scrollOnceEvent) //只播放一次，所以要移除监听事件
			this.removeEventListener () //只播放一次，所以要移除监听事件
			this.playSecondIntro()  //🚗滚轮移动 > 0 时, 播放第二段动画
		}
	}


	// 👇判断手指移动的方向, 按住向下滑动
	onTouch(e: TouchEvent) {
		this.initalY = e.touches[0].clientY //记录按下的点
	}


	onTouchMove(e: TouchEvent) { 
		let currentY = e.touches[0].clientY //记录移动的点
		let difference = this.initalY - currentY //判断是向上还是向下
		if (difference > 0) { //旧点 - 新点 > 0, 手指向上滑动
			this.removeEventListener ()
			this.playSecondIntro() //👆手指向上滑动时, 播放第二段动画
			// console.log('向上滑动')
		}
		this.initalY// 重置初始值
	}

	removeEventListener () {
		window.removeEventListener('wheel', this.scrollOnceEvent)  
		window.removeEventListener('touchstart', this.touchStart)  
		window.removeEventListener('touchmove', this.touchMove)  
	}


	
	// 最终执行动画 _ 位移小方块的动画 (🚀🚀🚀异步, 等 this.firstIntro() 动画播放完毕后再执行下面的代码, 才回去监听鼠标滚动事件)
	async playIntro() {
		await this.firstIntro() //异步函数执行完, 才会执行下面的代码
		this.moveFlag = true// 调用更新位置的方法
		this.scaleFlag = true// 调用更新缩放的方法

		// 监听鼠标滚动事件, 向下滚动时则播放一则动画
		this.scrollOnceEvent = this.onScroll.bind(this) //🔥🔥 把 e 绑定给 onScroll 函数
		this.touchStart = this.onTouch.bind(this)//👋移动端手势点击事件
		this.touchMove= this.onTouchMove.bind(this)//👋移动端手势点击事件

		window.addEventListener('wheel', this.scrollOnceEvent)  
		window.addEventListener('touchstart', this.touchStart)  
		window.addEventListener('touchmove', this.touchMove)  
	}



	// 最终执行动画 _ 房间变大的动画
	async playSecondIntro() {
		await this.secondIntro() 
		this.moveFlag = false// 调用更新位置的方法
		this.scaleFlag = true// 调用更新缩放的方法

		// 等第 2 个加载动画播放完后才允许滚动：🎃🎃上面的事件全部完成后, 让 【🔥 Controls 控制器】生效, 这样就可以滚动页面了
		this.emit('enableControls')
	}


	// 响应式的控制方块♦️ 显示在左侧还是上方
	move() {
        if (this.device === "desktop") {
            this.room.position.set(-1, 0, 0);
        } else {
            this.room.position.set(0, 0, -1);
        }
    }


	// 响应式控制房间大小的方法
	scale() {
		if(this.device === "desktop") {
			this.room.scale.set(0.11, 0.11, 0.11)
		} else {
			this.room.scale.set(0.07, 0.07, 0.07)
		}
	}


	// 更新方块的位置（响应式）, 最后统一在 Experience 内进行更新！
	update() {
		if(this.moveFlag) {
			this.move()
		}
	}
}