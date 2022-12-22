import React from 'react'
import * as THREE from 'three' 
import Time from '../utils/Time'
import Resources from '../utils/Resources'
import { CatmullRomCurve3, Scene } from '../../../Types/ThreeTypes'
import Experience from '../Experience'
import { Vector3 } from 'three'
import Camera from '../Camera'
import Room from "./Room"
import GSAP from 'gsap'
import Sizes from '../utils/Size'
// import ScrollTrigger from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import Timeline from "gsap"




// ⚡️核心是用于控制页面的滚动动画以及相机的移动曲线
export default class Controls {
	public experience!: Experience //⚡️记得先后顺序！Experience 放在 Resources 前边！！
	public scene: Scene
	public time!: Time
	public camera!: Camera
	public resources!: Resources
	public curve!: CatmullRomCurve3
	public dummyCurve!: Vector3 //曲线上的坐标点
	public progress!: number
	public room: Scene //因为 Room 内的物体是挂载到 scene 上的 -> this.actualRoom = this.room.scene 
	readonly sizes: Sizes
	public firstEle: HTMLDivElement
	public secondEle: HTMLDivElement
	public thirdEle: HTMLDivElement
	public rectLight!: THREE.RectAreaLight //鱼缸灯关
	public firstMoveTimeline: gsap.core.Timeline
	public secondMoveTimeline: gsap.core.Timeline
	public threeMoveTimeline: gsap.core.Timeline
	public timeline!: gsap.core.Timeline
	// public lerp: { current: number , target: number, ease: number } //📹相机最终要运动到的点: 一个缓动曲线对象的类型，用于计算 current 和 target 的值, 从而改变 position
	// public position!: Vector3 //📹初始化时相机在曲线上的坐标点
	// public back!: boolean //判断滚轮方向
	// public lookAtPosition!: Vector3 //👀初始化要看向的点
	// public currentLookAt: number //👀最终看向的点

	// ⭕️3 个向量，用于计算相机的旋转角度
	// public directionalVector: Vector3  //a 边 
	// public staticVector: Vector3  //b 边
	// public crossVector: Vector3  //c 边 (最终算出来的角度方向)


	constructor() {
		this.experience = new Experience() //🔥🔥 new 的核心实例要放在最前面！下面的属性才能拿到！！ scene 要通过 experience 拿到 scene！不能单独 new 实例！不然会有多个 scene！
		this.scene = this.experience.scene
		this.time = this.experience.time
		this.camera = this.experience.camera
		this.resources = this.experience.resources
		this.room = this.experience.world.room.actualRoom //通过 world 内的 this.resources.on("ready", ()=>{...}) 触发 resource 加载资源的事件
		this.sizes = this.experience.sizes
		this.firstEle = this.experience.firstEle //HTML 元素, 用于判断 GSAP 加载动画的位置
		this.secondEle = this.experience.secondEle //HTML 元素, 用于判断 GSAP 加载动画的位置
		this.thirdEle = this.experience.thirdEle //HTML 元素, 用于判断 GSAP 加载动画的位置
		this.room.children.forEach( (child) => {
			if(child.type === 'RectAreaLight') { //Three 灯光类型
				this.rectLight = child as THREE.RectAreaLight//🔥在 Room 内新建的鱼缸灯关,  缩放时，需要把灯关元素单独缩放
				// console.log('鱼缸灯光', this.rectLight)
			}
		}) 
		GSAP.registerPlugin(ScrollTrigger) //注册 GSAP 上的一个插件
		this.firstMoveTimeline = new GSAP.core.Timeline() //创建一个 GSAP 的 timeline 实例
		this.secondMoveTimeline = new GSAP.core.Timeline() //创建一个 GSAP 的 timeline 实例
		this.threeMoveTimeline = new GSAP.core.Timeline() //创建一个 GSAP 的 timeline 实例
		this.timeline = new GSAP.core.Timeline() ////调用 GSAP 的 timeline 库, 进行实例化
		this.scrollTrigger() //🚗执行滚动的方法

		// this.progress = 0 //相机的轨道
		// this.dummyCurve = new THREE.Vector3(0, 0, 0) //曲线上的点
		// this.back = false //判断滚轮方向

		// 🍉一: 创建缓动函数的参数（🔥利用 GSAP 库让 current 过渡到 target！）
		// this.lerp = {
		// 	current: 0, //指定当前值
		// 	target:0.7, //指定目标值
		// 	ease: 0.15,
		// } 

		// 🍉二: 定义曲线上的点(相机最终架设的点）, 以及我们最终要看向的点
		// this.position = new THREE.Vector3(0, 0, 0) //📹相机要沿着曲线上的点进行运动
		// this.lookAtPosition = new THREE.Vector3(0, 0, 0) //👀我们相机头最终要运动到的点
		// // this.currentLookAt = (this.lerp.current as number) + 0.00001  //每次摄像机头偏移的位置


		// // ⭕️3 个向量，用于计算相机的旋转角度
		// this.directionalVector = new THREE.Vector3(0, 0, 0)  //a 边 
		// this.staticVector = new THREE.Vector3(0, 0, 0) //b 边
		// this.crossVector = new THREE.Vector3(0, 0, 0) //c 边 (最终算出来的角度方向)

		// this.setPath()// ⚡️先注释掉
		// this.onWheel()// ⚡️当鼠标滚轮滚动时, 改变摄像机的视角（也就是改变 curve 的曲线）, 改变 progress
	}


	// 🌟滚动页面显示内容的方法
	scrollTrigger() {
		// GSAP 库里边的响应式方法, 用箭头函数的 this 的指向更明确
		ScrollTrigger.matchMedia({

			// 💻 Desktop 桌面端 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
			"(min-width: 969px)": () => {

				// 第一组移动的元素 First Section ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
					// 🚗第一步: 给 XX 对象添加动画属性
					this.firstMoveTimeline = new GSAP.core.Timeline({
						scrollTrigger: {
							trigger: this.firstEle,//⚡️触发条件, 当这个元素出现后意味着动画结束(ts 内的用法)
							start: "top top",
							end: "bottom bottom",
							scrub: 0.6, //0.1 、 true ...
							invalidateOnRefresh: true, //⚡️开启后才能根据页面尺寸来计算位移的距离
							// markers: true,  //显示标记
						}
					})

					// 🚗第二步: 给 XX 对象添加滚动事件
					this.firstMoveTimeline.to(this.room.position, { //room
						x: () => {
							return this.sizes.width * 0.0014  //让位移根据页面尺寸来计算, 位移页面的 0.14% , ⚡️前提是上面开启了 invalidateOnRefresh 才能根据页面尺寸来计算位移的距离
						},
					})



				// 第二组移动的元素 Second Section ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
					// 🚗第一步: 给 XX 对象添加触发条件
					this.secondMoveTimeline = new GSAP.core.Timeline({
						scrollTrigger: {
							trigger: this.secondEle,//⚡️触发条件, 当这个元素出现后意味着动画结束(ts 内的用法)
							start: "top top",
							end: "bottom bottom",
							scrub: 0.6, //0.1 、 true ...
							invalidateOnRefresh: true, //⚡️开启后才能根据页面尺寸来计算位移的距离
							// markers: true,  //显示标记
						}
					})

					// 🚗第二步: 给 XX 对象添加动画属性
					this.secondMoveTimeline.to(this.room.position, { //room
						x: () => {
							return 1 //硬编码
						},
						z: () => {
							return this.sizes.height * 0.0032
						},
					}, 'same') //加上 'same' 后就会同时进行！

					this.secondMoveTimeline.to(this.room.scale, { //room
						x: 0.4, //从 0.1   ->   放大到 0.4, 可以看 Room 内是缩放到 0.1 的
						y: 0.4,
						z: 0.4,
					}, 'same') //加上 'same' 后就会同时进行, 不加就会等到上面的动画结束后才会执行

					this.secondMoveTimeline.to(this.rectLight, { //rectLight
						width: 1 * 3.2, //因为上面相对放大了 3 倍, 所以这里 X 3
						height: 0.5 * 3.2,
					}, 'same') 



				// 第三组移动的元素 Third Section ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
					// 🚗第一步: 给 XX 对象添加触发条件
					this.threeMoveTimeline = new GSAP.core.Timeline({
						scrollTrigger: {
							trigger: this.thirdEle,//⚡️触发条件, 当这个元素出现后意味着动画结束(ts 内的用法)
							start: "top top", 
							end: "bottom bottom",
							scrub: 0.6, //0.1 、 true ...
							invalidateOnRefresh: true, //⚡️开启后才能根据页面尺寸来计算位移的距离
							markers: true,  //显示标记
						}
					})

					// 🚗第二步: 给 XX 对象添加动画属性
					this.threeMoveTimeline.to(this.camera.orthographicCamera.position, { //camera, 可以去 Camera 类里边看它的当前位置
						y: -1.5, //硬编码
						x: -4.1, //硬编码
					}) 
			},



			// 📱 Mobile 移动端 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
			"(max-width: 968px)": () => {

				// 重置下 Room 的初始化比例，不然会比初始的 1.1 小
				this.room.scale.set(0.09, 0.09, 0.09)
				this.rectLight.width = 0.7
				this.rectLight.height = 0.4

				// 第一组移动的元素 First Section ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
					// 🚗第一步: 给 XX 对象添加动画属性
					this.firstMoveTimeline = new GSAP.core.Timeline({
						scrollTrigger: {
							trigger: this.firstEle,//⚡️触发条件, 当这个元素出现后意味着动画结束(ts 内的用法)
							start: "top top",
							end: "bottom bottom",
							scrub: 0.6, //0.1 、 true ...
							invalidateOnRefresh: true, //⚡️开启后才能根据页面尺寸来计算位移的距离
							// markers: true,  //显示标记
						}
					})

					// 🚗第二步: 给 XX 对象添加滚动事件
					this.firstMoveTimeline.to(this.room.position, { //room
						x: 0.1,
						y: 0.1,
						z: 0.1,
					})



				// 第二组移动的元素 Second Section ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
					// 🚗第一步: 给 XX 对象添加触发条件
					this.secondMoveTimeline = new GSAP.core.Timeline({
						scrollTrigger: {
							trigger: this.secondEle,//⚡️触发条件, 当这个元素出现后意味着动画结束(ts 内的用法)
							start: "top top",
							end: "bottom bottom",
							scrub: 0.6, //0.1 、 true ...
							invalidateOnRefresh: true, //⚡️开启后才能根据页面尺寸来计算位移的距离
							// markers: true,  //显示标记
						},
					})

					// 🚗第二步: 给 XX 对象添加动画属性
					this.secondMoveTimeline.to(this.room.scale, { //room
						x: 0.25,
						y: 0.25,
						z: 0.25,
					},'smae') 

					this.secondMoveTimeline.to(this.room.position, { //room
						x: 1.5,
					},'smae')
					
					this.secondMoveTimeline.to(this.rectLight, {
						width: 0.3 * 3.4,
						height: 0.3 * 3.4,
					},'smae')



				// 第三组移动的元素 Third Section ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
					// 🚗第一步: 给 XX 对象添加触发条件
					this.threeMoveTimeline = new GSAP.core.Timeline({
						scrollTrigger: {
							trigger: this.thirdEle,//⚡️触发条件, 当这个元素出现后意味着动画结束(ts 内的用法)
							start: "top top", 
							end: "bottom bottom",
							scrub: 0.6, //0.1 、 true ...
							invalidateOnRefresh: true, //⚡️开启后才能根据页面尺寸来计算位移的距离
							markers: true,  //显示标记
						}
					})

					// 🚗第二步: 给 XX 对象添加动画属性
					this.threeMoveTimeline.to(this.camera.orthographicCamera.position, { //camera, 可以去 Camera 类里边看它的当前位置
						y: -0.5, //硬编码
						z: 1.5, //硬编码
					}) 
			},



			// All devices
			"all": () => {

			},
		})


		// ⬇️先注释掉——————————————————————————————————————————————————
		// // console.log(this.room);
		// this.timeline.to(this.room.position, {
		// 	// x: 1.5, //向右位移 (写死的方式)
		// 	// x: this.sizes.width *0.0008, //让位移根据页面尺寸来计算, 位移页面的 0.08% 
		// 	// duration: 20, //位移 20 秒
			
		// 	x: () => {
		// 		return this.sizes.width * 0.00119 //响应式的方式（需要结合下面开启 invalidateOnRefresh）, 让位移根据页面尺寸来计算, 并且能够随着页面的拖动而更新
		// 	},

		// 	scrollTrigger: {
		// 		// trigger: ".firsr-mov",//⚡️触发条件, 当这个元素出现后意味着动画结束(普通 js 内的用法)
		// 		trigger: this.firstEle,//⚡️触发条件, 当这个元素出现后意味着动画结束(ts 内的用法)
		// 		markers: true,
		// 		start: "top top",
		// 		end: "bottom bottom",
		// 		scrub: 0.8, //0.1 、 true ...
		// 		invalidateOnRefresh: true, //⚡️开启后才能根据页面尺寸来计算位移的距离
		// 	}
		// })
		// // console.log(this.timeline);
		// ⬆️先注释掉——————————————————————————————————————————————————
	}




	// ⭕️创建一条运动曲线 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
	setPath() {
		this.curve = new THREE.CatmullRomCurve3([
			// 圆形曲线
			// new THREE.Vector3(-5, 0, 0),
			// new THREE.Vector3(0, 0, -5),
			// new THREE.Vector3(5, 0, 0),
			// new THREE.Vector3(0, 0, 5),

			// 更自由的曲线，结合摄像机视角来运动
			new THREE.Vector3(-5, 0, 0),
			new THREE.Vector3(0, 0, -5),
			new THREE.Vector3(5, 8, 0),
			new THREE.Vector3(0, 5, 5),
			new THREE.Vector3(2, 0, 5),
			new THREE.Vector3(0, 5, 5),
			new THREE.Vector3(-12, 6, 5),

			// 贯穿曲线
			// new THREE.Vector3(-10, 0, 10),
			// new THREE.Vector3(-5, 5, 5),
			// new THREE.Vector3(0, 0, 0),
			// new THREE.Vector3(5, -5, 5),
			// new THREE.Vector3(10, 0, 10),
		], true)


		// 创建一个曲线（轨道）
		const points = this.curve.getPoints(50)
		const geometry = new THREE.BufferGeometry().setFromPoints( points )
		const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
		const curveObject = new THREE.Line( geometry, material )

		// ⚡️⚡️记得最后要把这条曲线添加到场景中！然后导入到 World 中实例化一下！！
		this.scene.add( curveObject )
		// console.log(this.scene.children[0]);
	}



	// 🍉三: 用滚轮控制让相机跟随 curve 曲线而运动
	// onWheel() {
	// 	window.addEventListener('wheel', (e)=>{
	// 		// ⭕️深化版 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
	// 		// console.log(e);
	// 		if(e.deltaY > 0) {
	// 			this.lerp.target += 0.01
	// 			// this.back = false //判断滚动方向，根据滚动方向 += 0.01
	// 			// 限制阈值的方法一
	// 			// if(this.lerp.target > 1) {
	// 			// 	// this.lerp.target = 1
	// 			// }
	// 		} else { //相当于 e.deltaY < 0
	// 			this.lerp.target -= 0.01 
	// 			// this.back = true //判断滚动方向，根据滚动方向 -= 0.01
	// 			// 限制阈值的方法一
	// 			if(this.lerp.target <= 0) {
	// 				this.lerp.target = 0
	// 			}
	// 		}
	// 		console.log("target 值:", this.lerp.target);


	// 		// ⭕️基础版 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
	// 		// console.log(
	// 			// 	"one:",
	// 			// 	this.progress, this.dummyCurve, this.progress,'\n',
	// 			// 	"two:",
					
	// 			// 	this.lerp.current, this.lerp.target, this.lerp.ease,'\n',
	// 			// 	"three:",
	// 			// 	this.position,this.lookAtPosition, this.currentLookAt
	// 		// );

	// 		// if(e.deltaY > 0) { //当鼠标滚轮往下滚动时, 让 progress 增加, 直到 this.progress % 1
	// 		// 	this.progress += 0.01 //每次运动一丢丢
	// 		// } else {
	// 		// 	this.progress -= 0.01 
	// 		// 	if(this.progress < 0) { //当 progress < 0 的时候, 重新赋值为 1, 让相机继续往前运动(0~1)
	// 		// 		this.progress = 1
	// 		// 	}
	// 		// }
	// 	})
	// }




	resize() { //Size 更新后, 调用 camera 和 renderer 的 resize 方法

	}

	


	update() {

		//⭕️ 圆形线手动运动 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
		// this.lerp.current = GSAP.utils.interpolate( //🔥GSAP 的这个算法会让 current 过渡到 target 变缓和, 计算方式封装到 GSAP 的库中了！
		// 	this.lerp.current, //当前值
		// 	this.lerp.target, //目标值，随着滚轮的运动而 += 或 -=
		// 	this.lerp.ease,  //缓动值
		// ) 


		// this.curve.getPointAt(this.lerp.current % 1, this.position) // getPointAt(a,b), a 是具体的值, b 是给谁赋值
		// this.camera.orthographicCamera.position.copy(this.position)//📹把相机架设到轨道上,

		// this.directionalVector.subVectors( // (最终算出来的相机头的角度方向)
		// 	this.curve.getPointAt((this.lerp.current % 1) + 0.000001), 
		// 	this.position, 
		// )

		// this.directionalVector.normalize() //将向量的长度规范化为 1。

		// this.crossVector.crossVectors( //计算出最终交叉向量的方向
		// 	this.directionalVector,
		// 	this.staticVector
		// ) 

		// this.crossVector.multiplyScalar(100000)// 延长矢量线的长度
		// this.camera.orthographicCamera.lookAt(this.crossVector)
		// // this.camera.orthographicCamera.lookAt(0,0,0)



		//⭕️ 曲线手动运动 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
		// 🍉四: 把上面定义的参数设置为缓动函数的值 (需要安装依赖库: npm i gsap --save-dev)
		// this.lerp.current = GSAP.utils.interpolate( //🔥GSAP 的这个算法会让 current 过渡到 target 变缓和, 计算方式封装到 GSAP 的库中了！
		// 	this.lerp.current, //当前值
		// 	this.lerp.target, //目标值，随着滚轮的运动而 += 或 -=
		// 	this.lerp.ease, 
		// ) 


		// // 🍉五: Option（根据滚动的方向, 自动的进行相机位置的移动）
		// if(this.back) {
		// 	this.lerp.target -= 0.001 
		// } else {
		// 	this.lerp.target += 0.001
		// }

		// // 🍉六: 限制坐标的运动范围为 0～1
		// this.lerp.target = GSAP.utils.clamp(0, 1, this.lerp.target)
		// this.lerp.current = GSAP.utils.clamp(0, 1, this.lerp.current)



		// // 🍉七: 赋值给具体的坐标(🔥把 current 赋值给 position)
		// this.curve.getPointAt(this.lerp.current, this.position)  //📹相机要去到的位置: getPointAt(a,b), a 是具体的值, b 是给谁赋值, 因为 a 会一直 += 或 -=, 所以 b 会一直在曲线上运动
		// this.curve.getPointAt(this.currentLookAt, this.lookAtPosition)//👀我们相机头要看向的位置:（在相机的前方, 所以微小的加一点）


		// // 🍉八: 最终把相机的位置设置为曲线上的点
		// this.camera.orthographicCamera.position.copy(this.position)//📹把相机架设到轨道(position)上
		// this.camera.orthographicCamera.lookAt(this.lookAtPosition)//👀我们相机头最终要看向的位置

		

		//⭕️ 曲线自动运动 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
		// getPointAt(a,b), a 是具体的值, b 是给谁赋值, 因为 a 会一直 += 或 -=, 所以 b 会一直在曲线上运动
		// this.curve.getPointAt(this.progress % 1, this.dummyCurve) //% 1 表示取余数, 当 progress 为 0.1 时 mod 运算的结果为 0.1, 当 progress = 1 的时 mode 运算结果为 0 , 0-1 之间的数值
		// console.log(this.dummyCurve)


		// ♾️无限循环让相机轨道不断的往前运动(本质上要限制在 0～1 的范围内)
		// this.progress += 0.01 
		// console.log(this.progress);		

		// 负数的写法
		// this.progress -= 0.01
		// if(this.progress < 0) {
		//	 	this.progress = 1
		// }

		// this.camera.orthographicCamera.position.copy(this.dummyCurve)//📹把相机架设到轨道上
	}
}

