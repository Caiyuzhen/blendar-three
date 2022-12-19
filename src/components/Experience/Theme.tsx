import {EventEmitter} from 'events' //events 库

export default class Theme extends EventEmitter{

	public toggleButton: HTMLLabelElement //切换按钮
	public toggleCircle: HTMLInputElement //切换按钮的圆圈
	static theme: string //默认主题色(定义为静态属性而非下面的实例属性, 这样比较唯一, 所有的实例都共享唯一的一个静态属性)


	constructor(toggleButton : HTMLLabelElement, toggleCircle : HTMLInputElement) {
		super()
		Theme.theme = 'light'
		this.toggleButton = toggleButton
		this.toggleCircle = toggleCircle
		this.getBody() 
		this.setEventListeners()
	}

	
	// 获取并打印 body 标签
	getBody() {
		const body = document.querySelector('body')
		console.log(body);
	}



	// 组件加载完成时会自动执行这个函数
	setEventListeners() {
		const self = this; //因为没有使用箭头函数, 所以这里需要先保存 this 的指向
		this.toggleButton.addEventListener('click', function(e: Event) {  //箭头函数会在定义时绑定 this，因此这个箭头函数中的 this 关键字会指向定义时的 this 值
			console.log('执行一次');
			console.log('——————');
			// this.toggleCircle.classList.toggle('slides') //切换到这个类

			Theme.theme = (Theme.theme === 'light' ? 'dark' : 'light') //👈👈this.theme 的三元运算符！一点击就会取反, 更改灯光颜色
			document.body.classList.toggle('dark-theme')  //把文字、图形也切换成深色模式
			self.emit('switch', Theme.theme) //⚡️把事件以及事件参数传递出去（给到 World 组件）！


			// console.log(this.toggleButton, this.toggleCircle);
			// console.log(e.currentTarget);
			// this.toggleCircle.style.width = '60px' // 修改父组件的 toggle-circle 宽度
			// console.log(this.theme);
		})
	}
}






