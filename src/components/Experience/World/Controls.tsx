import React from 'react'
import * as THREE from 'three' 
import Time from '../utils/Time'
import Resources from '../utils/Resources'
import { CatmullRomCurve3, Scene } from '../../../Types/ThreeTypes'
import Experience from '../Experience'
import { Vector3 } from 'three'
import Camera from '../Camera'
import GSAP from 'gsap'



// ⚡️⚡️ 封装其他所有组件的能力, 返回单独的一个实例 （封装 api 的逻辑）
export default class Controls {
	public experience!: Experience //⚡️记得先后顺序！Experience 放在 Resources 前边！！
	public scene: Scene
	public time!: Time
	public camera!: Camera
	public resources!: Resources
	public curve!: CatmullRomCurve3
	public dummyCurve!: Vector3 //曲线上的坐标点
	public progress!: number
	public lerp: { current: number, target: number, ease: number } //📹相机最终要运动到的点: 一个缓动曲线对象的类型，用于计算 current 和 target 的值, 从而改变 position
	public position!: Vector3 //📹初始化时相机在曲线上的坐标点
	public back: boolean //判断滚轮方向
	public lookAtPosition!: Vector3 //👀初始化要看向的点
	public currentLookAt: number //👀最终看向的点


	constructor() {
		this.experience = new Experience() //🔥🔥 new 的核心实例要放在最前面！下面的属性才能拿到！！ scene 要通过 experience 拿到 scene！不能单独 new 实例！不然会有多个 scene！
		this.scene = this.experience.scene
		this.time = this.experience.time
		this.camera = this.experience.camera
		this.resources = this.experience.resources
		this.progress = 0 //相机的轨道
		this.dummyCurve = new THREE.Vector3(0, 0, 0) //曲线上的点
		this.back = false //判断滚轮方向

		// 🍉一: 创建缓动函数的参数（🔥利用 GSAP 库让 current 过渡到 target！）
		this.lerp = {
			current: 0, //指定当前值
			target: 0, //指定目标值
			ease: 0.15,
		} 

		// 🍉二: 定义曲线上的点(相机最终架设的点）, 以及我们最终要看向的点
		this.position = new THREE.Vector3(0, 0, 0) //📹相机要沿着曲线上的点进行运动
		this.lookAtPosition = new THREE.Vector3(0, 0, 0) //👀我们相机头最终要运动到的点
		this.currentLookAt = this.lerp.current + 0.00001

		this.setPath()
		this.onWheel()// ⚡️当鼠标滚轮滚动时, 改变摄像机的视角（也就是改变 curve 的曲线）, 改变 progress
	}



	// 🍉三: 用滚轮控制让相机跟随 curve 曲线而运动
	onWheel() {
		window.addEventListener('wheel', (e)=>{
			// console.log(e);
			if(e.deltaY > 0) {
				this.lerp.target += 0.01
				this.back = false //判断滚动方向，根据滚动方向 += 0.01
				// 限制阈值的方法一
				// if(this.lerp.target > 1) {
				// 	// this.lerp.target = 1
				// }
			} else {
				this.lerp.target -= 0.01 
				this.back = true //判断滚动方向，根据滚动方向 -= 0.01
				// 限制阈值的方法一
				// if(this.lerp.target < 0) {
				// 	this.lerp.target = 1
				// }
			}
			console.log(this.lerp.target);
			// if(e.deltaY > 0) { //当鼠标滚轮往下滚动时, 让 progress 增加, 直到 this.progress % 1
			// 	this.progress += 0.01 //每次运动一丢丢
			// } else {
			// 	this.progress -= 0.01 
			// 	if(this.progress < 0) { //当 progress < 0 的时候, 重新赋值为 1, 让相机继续往前运动(0~1)
			// 		this.progress = 1
			// 	}
			// }
		})
	}


	// 创建一条运动曲线
	setPath() {
		this.curve = new THREE.CatmullRomCurve3([
			new THREE.Vector3(-10, 0, 10),
			new THREE.Vector3(-5, 5, 5),
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(5, -5, 5),
			new THREE.Vector3(10, 0, 10),
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


	update() {
		// 🍉四: 把上面定义的参数设置为缓动函数的值 (需要安装依赖库: npm i gsap --save-dev)
		this.lerp.current = GSAP.utils.interpolate( //🔥GSAP 的这个算法会让 current 过渡到 target 变缓和, 计算方式封装到 GSAP 的库中了！
			this.lerp.current, //当前值
			this.lerp.target, //目标值，随着滚轮的运动而 += 或 -=
			this.lerp.ease, 
		) 


		// 🍉五: Option（根据滚动的方向, 自动的进行相机位置的移动）
		if(this.back) {
			this.lerp.target -= 0.001 
		} else {
			this.lerp.target += 0.001
		}

		// 🍉六: 限制坐标的运动范围为 0～1
		this.lerp.target = GSAP.utils.clamp(0, 1, this.lerp.target)
		this.lerp.current = GSAP.utils.clamp(0, 1, this.lerp.current)



		// 🍉七: 赋值给具体的坐标(🔥把 current 赋值给 position)
		this.curve.getPointAt(this.lerp.current, this.position)  //📹相机要去到的位置: getPointAt(a,b), a 是具体的值, b 是给谁赋值, 因为 a 会一直 += 或 -=, 所以 b 会一直在曲线上运动
		this.curve.getPointAt(this.currentLookAt, this.lookAtPosition)//👀我们相机头要看向的位置:（在相机的前方, 所以微笑的加一点）


		// 🍉八: 最终把相机的位置设置为曲线上的点
		this.camera.orthographicCamera.position.copy(this.position)//📹把相机架设到轨道(position)上
		this.camera.orthographicCamera.lookAt(this.lookAtPosition)//👀我们相机头最终要看向的位置




		// 测试获取曲线上的坐标点, 然后再赋值给相机的位置, getPointAt(a,b), a 是具体的值, b 是给谁赋值, 因为 a 会一直 += 或 -=, 所以 b 会一直在曲线上运动
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


	resize() { //Size 更新后, 调用 camera 和 renderer 的 resize 方法

	}
}

