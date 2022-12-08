import React from 'react'

export default class Sizes{
	width: number
	height: number
	aspect: number
	pixeRatio: number

	constructor() {
		this.width = window.innerWidth 
		this.height = window.innerHeight
		this.aspect = this.width / this.height //画布的长宽比
		this.pixeRatio = Math.min(window.devicePixelRatio, 2) //根据设备像素比来设置画布的像素比, 保证画布清晰度

		window.addEventListener('resize', ()=>{ //窗口改变时, 重新计算画布的长宽比
			this.width = window.innerWidth 
			this.height = window.innerHeight
			this.aspect = this.width / this.height //画布的长宽比
			this.pixeRatio = Math.min(window.devicePixelRatio, 2) //根据设备像素比来设置画布的像素比, 保证画布清晰度
		})
	}
}