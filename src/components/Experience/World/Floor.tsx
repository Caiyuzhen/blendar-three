import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import {Scene} from '../../../Types/ThreeTypes'


// 地板元素，用于显示地面投影(🔥也是在 World 里边进行实例化！)
export default class Floor {
	public experience: Experience
	public scene: Scene
	private geometry!: THREE.PlaneGeometry
	private material!: THREE.MeshStandardMaterial //MeshStandardMaterial 才有阴影！！
	private plane!: THREE.Mesh
	public circleFirst!: THREE.Mesh
	public circleSecond!: THREE.Mesh
	public circleThird!: THREE.Mesh


	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.setFloor()
		this.setCircles()
	}



	// 创建一个平面地板
	setFloor() {
		this.geometry = new THREE.PlaneGeometry(100, 100)
		this.material = new THREE.MeshStandardMaterial({
			color: '#ded6d6',
			side: THREE.BackSide, //🔥打开这个才能翻转物体(或者是把 Math.PI / 2 设置为负数）！把材质设置在另一侧或双侧 DoubleSide \ BackSide \ FrontSide
		})
		this.plane = new THREE.Mesh(this.geometry, this.material)
		this.scene.add(this.plane)  //添加进场景内
		this.plane.rotation.x = Math.PI / 2  //把物体旋转 90 度, 变成水平而不是垂直
		this.plane.position.y = -0.22 //把地板往下位移
		
		this.plane.receiveShadow = true //让物体接收阴影的渲染

		// console.log(this.plane); //地板元素
	}



	// 创建圆盘 (房间底部的圆形色块，随着滚动而缩放) （🔥也是在 World 里边进行实例化！）
	setCircles() {
		const geometry = new THREE.CircleGeometry(60, 100) //创建一个圆形
		const material = new THREE.MeshStandardMaterial({color: 0xe5a1aa,})  //🔥MeshStandardMaterial 才能接收到投影！
		const material2 = new THREE.MeshStandardMaterial({color: 0x8395cd,})  //🔥MeshStandardMaterial 才能接收到投影！
		const material3 = new THREE.MeshStandardMaterial({color: 0x7ad0ac})  //🔥MeshStandardMaterial 才能接收到投影！
		this.circleFirst = new THREE.Mesh(geometry, material)
		this.circleSecond = new THREE.Mesh(geometry, material2)
		this.circleThird = new THREE.Mesh(geometry, material3)

		this.circleFirst.position.y = -0.2 //圆盘位置不能在 plane 之下！不然会被遮挡看不到！
		this.circleSecond.position.y = -0.19
		this.circleSecond.position.x = 1.5 // 修正一下第二个圆盘准备放大的初始位置
		this.circleThird.position.y = -0.18

		this.circleFirst.scale.set(0, 0, 0)
		this.circleSecond.scale.set(0, 0, 0)
		this.circleThird.scale.set(0, 0, 0)

		this.circleFirst.rotation.x = this.circleSecond.rotation.x = this.circleThird.rotation.x = -Math.PI / 2 //把物体旋转 90 度, 变成水平而不是垂直
		this.circleFirst.receiveShadow = this.circleSecond.receiveShadow = this.circleThird.receiveShadow = true //接收投影
		this.scene.add(this.circleFirst)
		this.scene.add(this.circleSecond)
		this.scene.add(this.circleThird)
	}


	resize() {

	}


	update() {

	}
}