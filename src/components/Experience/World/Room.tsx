import React from 'react'
import * as THREE from 'three'
import Experience from '../Experience'
import {Scene} from '../../../Types/ThreeTypes'
import Resources from '../utils/Resources'
import { Mesh, Object3D } from 'three'
import Time from '../utils/Time'
import GSAP from 'gsap'


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
	public lerp: { current: number , target: number, ease: number } //📹相机最终要运动到的点: 一个缓动曲线对象的类型，用于计算 current 和 target 的值, 从而改变 position
	public rotation!: number //计算鼠标移动的距离, 从而改变房屋的旋转角度


	// 🔥在构造函数中初始化实例属性
	constructor() {  
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.time = this.experience.time
		this.room = this.resources.items.room //⚡️通过 resources 获取到 room 的 3D 物体
		this.actualRoom = this.room.scene //真正想要展示在 ROOM 内的 3D 物体  // console.log(this.actualRoom); //真正想要展示在 ROOM 内的 3D 物体
		// 👋一: 定义控制房屋旋转的参数
		this.lerp = {
			current: 0, //指定当前值
			target:0, //指定目标值
			ease: 0.15, //缓动值
		} 

		this.rotation = 0

		this.setModel()//把 3D 物体添加到场景中
		this.setAnimation() //设置（🐟鱼游泳）的动画
		this.onMouseMove() //鼠标移动事件, 控制房屋的旋转

		// 添加一些基础立方体（测试）
		// const geometry = new THREE.BoxGeometry(1, 1, 1)
		// const material = new THREE.MeshBasicMaterial({color: '#3370FF'})
		// const cube = new THREE.Mesh(geometry, material)
		// this.scene.add(cube) //将立方体添加到场景中
	}


	// 👋二: 定义鼠标移动事件, 计算控制房屋的旋转的比率
	onMouseMove() {
		window.addEventListener('mousemove', (e)=>{
			// console.log(e); //利用 ClientX 和 ClientY 来获取鼠标距离浏览器左上角的距离
			this.rotation = (e.clientX - window.innerWidth / 2 ) / (window.innerWidth / 2)//🔥比率 = 计算鼠标离浏览器中心点 X 轴的距离 / 整个浏览器的宽度的一半！
			// -730 <- 0 -> 730, 相当于先计算出来鼠标离浏览器中心点 X 轴的距离, 然后再除以整个浏览器的宽度的 1/2 , 最后得到一个比率, 距离中心点多远
			console.log(this.rotation);

			this.lerp.target = this.rotation * 0.2//👀📹把摄像机的目标旋转位置设置为鼠标移动的距离 * 一定的数值表示减少旋转的幅度
		})
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
		this.actualRoom.scale.set(0.15, 0.15, 0.15) //缩放房间内的物体
		this.actualRoom.rotation.y = Math.PI / 8 //旋转房间内的物体
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
		//⭕️ 手动触发房子的运动 ————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
		this.lerp.current = GSAP.utils.interpolate( //🔥GSAP 的这个算法会让 current 过渡到 target 变缓和, 计算方式封装到 GSAP 的库中了！
			this.lerp.current, //当前值
			this.lerp.target, //目标值，随着滚轮的运动而 += 或 -=
			this.lerp.ease,  //缓动值
		) 

		// 👋二: 应用比率, 让房子动起来
		this.actualRoom.rotation.y = this.lerp.current


		// 🐟二: 根据刷新率更新并调用动画, 让动画动起来(Experience 内调用更新、World 内部调用更新、 Room 内部调用更新)
		this.mixer.update(this.time.delta * 0.0009) //乘以一定的倍数让动画变慢
	}
}