import React from 'react'
import * as THREE from 'three' 
import Time from '../utils/Time'
import Resources from '../utils/Resources'
import { CatmullRomCurve3, Scene } from '../../../Types/ThreeTypes'
import Experience from '../Experience'
import { Vector3 } from 'three'
import Camera from '../Camera'



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


	constructor() {
		this.experience = new Experience() //🔥🔥 new 的核心实例要放在最前面！下面的属性才能拿到！！ scene 要通过 experience 拿到 scene！不能单独 new 实例！不然会有多个 scene！
		this.scene = this.experience.scene
		this.time = this.experience.time
		this.camera = this.experience.camera
		this.resources = this.experience.resources
		this.progress = 0 //相机的轨道
		this.dummyCurve = new THREE.Vector3(0, 0, 0) //曲线上的点
		this.setPath()
		this.onWheel()// ⚡️当鼠标滚轮滚动时, 改变摄像机的视角（也就是改变 curve 的曲线）, 改变 progress
	}


	// ⚡️让相机跟随 curve 运动的曲线的方法
	onWheel() {
		window.addEventListener('wheel', (e)=>{
			console.log(e);
			if(e.deltaY > 0) {
				this.progress += 0.1
			} else {
				this.progress -= 0.1
			}
		})
	}


	// 创建一条运动曲线的方法
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
		// 测试获取曲线上的坐标点, 用于相机跟随
		this.curve.getPointAt(this.progress % 1, this.dummyCurve) //% 1 表示取余数, 当 progress = 1 的时候没有余数, 然而下面还会 +=, 所以范围是 0-1 
		// console.log(this.dummyCurve)

		// ♾️无限循环让相机轨道不断的往前运动
		// this.progress += 0.01 

		// 负数的写法
		// this.progress -= 0.01
		// if(this.progress < 0) {
		// 	this.progress = 1
		// }

		this.camera.orthographicCamera.position.copy(this.dummyCurve)//📹把相机架设到轨道上
	}

	resize() { //Size 更新后, 调用 camera 和 renderer 的 resize 方法

	}
}

