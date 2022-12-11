import React from 'react'
import * as THREE from 'three' 
import Time from '../utils/Time'
import Resources from '../utils/Resources'
import { CatmullRomCurve3, Scene } from '../../../Types/ThreeTypes'
import Experience from '../Experience'



// ⚡️⚡️ 封装其他所有组件的能力, 返回单独的一个实例 （封装 api 的逻辑）
export default class Controls {
	public experience!: Experience //⚡️记得先后顺序！Experience 放在 Resources 前边！！
	public scene: Scene
	public time!: Time
	public resources!: Resources
	public curve!: CatmullRomCurve3


	constructor() {
		this.experience = new Experience() //🔥🔥 new 的核心实例要放在最前面！下面的属性才能拿到！！ scene 要通过 experience 拿到 scene！不能单独 new 实例！不然会有多个 scene！
		this.scene = this.experience.scene
		this.time = this.experience.time
		this.resources = this.experience.resources
		this.setPath()
	}

	// ⚡️让相机跟随 line 运动的曲线
	setPath() {
		this.curve = new THREE.CatmullRomCurve3([
			new THREE.Vector3(-10, 0, 10),
			new THREE.Vector3(-5, 5, 5),
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(5, -5, 5),
			new THREE.Vector3(10, 0, 10),
		])

		const points = this.curve.getPoints(50)
		const geometry = new THREE.BufferGeometry().setFromPoints( points )
		const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
		const curveObject = new THREE.Line( geometry, material )

		// ⚡️⚡️记得最后要把这条曲线添加到场景中！然后导入到 World 中实例化一下！！
		this.scene.add( curveObject )
		// console.log(this.scene.children[0]);
	}

	update() {

	}

	resize() { //Size 更新后, 调用 camera 和 renderer 的 resize 方法

	}
}

