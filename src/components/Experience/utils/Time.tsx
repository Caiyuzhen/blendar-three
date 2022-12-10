import React from 'react'
import {EventEmitter} from 'events' //events 库

export default class Time extends EventEmitter{
	// public start: number
	// public current: number
	// public elapsed: number
	// public delta: number

	constructor() {
		super()
		this.start = Date.now()
		this.current = this.start  //当前时间
		this.elapsed = 0  //经过的时间
		this.delta = 16 //每帧的时间 60fps
		this.update()
	}

	update() {
		const currentTime = Date.now() //获取当前时间
		this.delta = currentTime - this.current //计算时间差
		this.current = currentTime //更新当前时间
		this.elapsed = this.current - this.start //计算经过的时间

		// debugger;
		// console.log('屏幕刷新时间差:', this.delta);
		this.emit("Update")//⚡️ EventEmitter 类, 用于触发事件,当屏幕刷新后去触发 Experience 内所有函数的更新, npm install events --save-dev
		window.requestAnimationFrame(()=>{this.update()}) //根据屏幕刷新率自动调用方法
	}
}