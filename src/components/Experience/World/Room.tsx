import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import {Scene} from '../../../Types/ThreeTypes'
import Resources from '../utils/Resources'
import { Mesh, Object3D } from 'three'
import Time from '../utils/Time'



export default class Room {
	public experience: Experience
	public scene: Scene
	public resources: Resources
	public time!: Time
	public room: Room
	public actualRoom: Scene //真正想要展示在 ROOM 内的场景
	private mixer!: THREE.AnimationMixer //🐟鱼游泳的动画混合器
	private swim!: THREE.AnimationAction //🐟鱼游泳的动画
	private animations: any


	// 🔥在构造函数中初始化实例属性
	constructor() {  
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.time = this.experience.time
		this.room = this.resources.items.room //⚡️通过 resources 获取到 room 的 3D 物体
		this.actualRoom = this.room.scene //真正想要展示在 ROOM 内的 3D 物体
		// console.log(this.actualRoom); //真正想要展示在 ROOM 内的 3D 物体

		this.setModel()//把 3D 物体添加到场景中
		this.setAnimation() //设置（🐟鱼游泳）的动画

		// 添加一些基础立方体（测试）
		// const geometry = new THREE.BoxGeometry(1, 1, 1)
		// const material = new THREE.MeshBasicMaterial({color: '#3370FF'})
		// const cube = new THREE.Mesh(geometry, material)
		// this.scene.add(cube) //将立方体添加到场景中
	}


	//⚡️把 3D 物体添加到场景中的方法
	setModel(){
		// ☁️给所有子元素设置投影
		if(this.actualRoom.children.length > 0){//检查一下是否有子元素
			this.actualRoom.children.forEach((child: any)=>{
				// console.log(child)
				child.castShadow = true
				child.receiveShadow = true

				// 判断 child 是不是 Group
				if(child.type === 'Group') { //🔥用于 children 是不是一个 Group
					child.children.forEach((groupChild: any)=>{
						groupChild.castShadow = true
						groupChild.receiveShadow = true
						// console.log('分组的元素', groupchild.castShadow);
					})
				}

				// Blendar 中的命名, 水族箱
				// console.log(child);
				if(child.name === "Aquarium") {
					child.material = new THREE.MeshPhysicalMaterial()
					// console.log(child.children); //⚡️在 three.js 中，只有网格模型（THREE.Mesh）才具有材质属性，而 THREE.Group 并不拥有材质属性
					child.children[0].material = new THREE.MeshPhysicalMaterial();
					child.children[0].material.roughness = 0;
					child.children[0].material.color.set('#33b3f2');
					child.children[0].material.ior = 3;
					child.children[0].material.transmission = 1;
					child.children[0].material.opacity = 1;
				}

				// 桌面上的电脑
				if(child.name === 'Computer') {
					child.children[1].material = new THREE.MeshBasicMaterial({
						map: this.resources.items.screen //📺📺把视频资源添加到材质中
					})
				}
			})
		}
		
		this.scene.add(this.actualRoom)
		this.actualRoom.scale.set(0.1, 0.1, 0.1) //缩放房间内的物体
		this.actualRoom.rotation.y = Math.PI / 4 //旋转房间内的物体
	}


	setAnimation() {
		// 🐟一: 定义动画混合器
		this.mixer = new THREE.AnimationMixer(this.actualRoom)
		// console.log(this.room.animations[0]); //有一则动画, 但是是属于整个 glb 文件的, 而不是属于某个物体的, 需要剪切出来
		this.swim = this.mixer.clipAction(this.room.animations[0])
		this.swim.play()
	}


	resize() {

	}

	update() {
		// 🐟二: 根据刷新率更新并调用动画, 让动画动起来(Experience 内调用更新、World 内部调用更新、 Room 内部调用更新)
		this.mixer.update(this.time.delta)
	}
}