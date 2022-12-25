import React from 'react'
import {EventEmitter} from 'events' //🎃第一步: 引入 events 库, 在 class 中去继承 EventEmitter 的方法！

export default class Sizes extends EventEmitter{
	public width: number
	public height: number
	public aspect: number
	public pixeRatio: number
	public frustumSize!: number
	public device: string

	constructor() {
		super()
		this.width = window.innerWidth 
		this.height = window.innerHeight
		this.aspect = this.width / this.height //画布的长宽比
		this.pixeRatio = Math.min(window.devicePixelRatio, 2) //根据设备像素比来设置画布的像素比, 保证画布清晰度
		this.frustumSize = 5 //👀正交相机的视锥体大小(要写在这里, 因为会随着 resize 而改变)

		if(this.width < 968){// 根据窗口大小设置两个变量给到 Proloader 去判断展示怎样的动画
			this.device = 'mobile'
		} else {
			this.device = 'desktop'
		}


		window.addEventListener('resize', ()=>{ //窗口改变时, 重新计算画布的长宽比
			this.width = window.innerWidth 
			this.height = window.innerHeight
			this.aspect = this.width / this.height //画布的长宽比
			this.pixeRatio = Math.min(window.devicePixelRatio, 2) //根据设备像素比来设置画布的像素比, 保证画布清晰度
			this.emit("resize") //🎃第二步: 定义触发事件


			// console.log('重新计算窗口宽度:', this.width, this.height);


			// 根据窗口大小设置两个变量给到 Proloader 去判断在什么设备上展示怎样的动画
			if(this.width < 968 && this.device !== 'mobile'){ //⚡️⚡️加多个条件，不然会一直发送 emit 事件！
				this.device = 'mobile'
				this.emit('switchDevice', this.device) //🔥🔥🔥传入 this.device 这个参数！给到 Preloader
				console.log(this.device);
			} else if(this.width >= 968 && this.device !== 'desktop') { //⚡️⚡️加多个条件，不然会一直发送 emit 事件！
				this.device = 'desktop'
				this.emit('switchDevice', this.device) //🔥🔥🔥传入 this.device 这个参数！给到 Preloader
				console.log(this.device);
			}
		})

		// console.log(
		// 	'获得宽高、比率数据',
		// 	this.width, this.height, this.aspect, this.pixeRatio
		// );
	}


}