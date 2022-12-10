import React from 'react'
import {EventEmitter} from 'events' //🎃第一步: 引入 events 库, 在 class 中去继承 EventEmitter 的方法！

export default class Sizes extends EventEmitter{
	// width: number
	// height: number
	// aspect: number
	// pixeRatio: number
	// frustumSize!: number

	constructor() {
		super()
		this.width = window.innerWidth 
		this.height = window.innerHeight
		this.aspect = this.width / this.height //画布的长宽比
		this.pixeRatio = Math.min(window.devicePixelRatio, 2) //根据设备像素比来设置画布的像素比, 保证画布清晰度
		// console.log(
		// 	'获得宽高、比率数据',
		// 	this.width, this.height, this.aspect, this.pixeRatio
		// );

		window.addEventListener('resize', ()=>{ //窗口改变时, 重新计算画布的长宽比
			this.width = window.innerWidth 
			this.height = window.innerHeight
			this.aspect = this.width / this.height //画布的长宽比
			this.pixeRatio = Math.min(window.devicePixelRatio, 2) //根据设备像素比来设置画布的像素比, 保证画布清晰度
			this.emit("resize") //🎃第二步: 定义触发事件
			console.log('重新计算窗口宽度:', this.width, this.height);
		})
	}


}