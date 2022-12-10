import React from 'react'
import {EventEmitter} from 'events' //🎃第一步: 引入 events 库, 在 class 中去继承 EventEmitter 的方法！
import Experience from '../Experience'


// 加载并存储 Assets 资源
export default class Resources extends EventEmitter{

	constructor() {
		super()
		this.experience = new Experience()
		this.renderer = this.experience.renderer
	}


}