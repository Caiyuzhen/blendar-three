/* 把 Div 元素拆解出多个 Span, 方便做动画

	作用是将一个 HTML 元素的文本内容分割成单个字符，然后将每个字符用 <span class='animatedis'></span> 包装起来，
	最后将所有的包装后的字符连接起来，并将结果赋值给 HTML 元素的 innerHTML 属性：
		1.使用 innerText 属性获取 HTML 元素的文本内容。
		2.使用 split 方法将文本内容分割成一个字符数组。
		3.使用 `使用 map 方法遍历字符数组，将每个字符映射成一个 <span class='animatedis'></span> 的字符串。
		4.使用 join 方法将所有的字符串连接起来。
		5.使用 innerHTML 属性将结果赋值给 HTML 元素。
*/

export default function (ele: HTMLDivElement) {
	ele.style.overflow = 'hidden'
	ele.innerHTML = ele.innerText.split("").map((char: string) => {
		if(char === " ") { //如果该字符为空格，则使用 &nbsp; 来代替空格字符。
			return `<span>&nbsp;</span>`
		}
		return `<span class='animatedis'>${char}</span>`
	}).join("")

	return ele
}