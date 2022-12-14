import React, {useRef, useEffect, createContext, useContext} from 'react'
import './MainView.css'
import Experience from './Experience/Experience'
import './MainView.css'
import { ViewContext } from '../components/utils/useViewContext'
import ASScroll from "@ashthornton/asscroll";



export const MainView = () => {

	const canvasRef = useRef<HTMLCanvasElement>(null) // ref 获取 experience-canvas 元素, 传入 Experience
	const firstMoveRef = useRef<HTMLDivElement>(null) // ref 获取 GSAP 要判断的 HTML 元素, 传入 Experience
	const secondMoveRef = useRef<HTMLDivElement>(null) // ref 获取 GSAP 要判断的 HTML 元素, 传入 Experience
	const thirdMoveRef = useRef<HTMLDivElement>(null) // ref 获取 GSAP 要判断的 HTML 元素, 传入 Experience
	const toggleButton = useRef<HTMLLabelElement>(null)
	const toggleCircle = useRef<HTMLInputElement>(null)
	const page = useRef<HTMLDivElement>(null)
	const intro_Text  = useRef<HTMLDivElement>(null)
	const intro_Maintitle = useRef<HTMLHeadingElement>(null)
	const intro_MainDes = useRef<HTMLParagraphElement>(null)
	const intro_SecondSubHead = useRef<HTMLParagraphElement>(null)
	const intro_SecondSubTitle = useRef<HTMLParagraphElement>(null)

	  HTMLDivElement

	// 根据 class new 一个 Experience 实例
	useEffect(() => {
		const sections: NodeListOf<Element> = document.querySelectorAll('.section')	//页面加载完后, 获取三个 DOM 元素

		if (!canvasRef.current) {
			return
		}
		const experience = new Experience( //传参
			canvasRef.current!,  //.current! 表示忽略它的可能的 null 或 undefined 值
			firstMoveRef.current!, 
			secondMoveRef.current!, 
			thirdMoveRef.current!, 
			toggleButton.current!, 
			toggleCircle.current!,
			page.current!,
			sections,
			intro_Text.current!, //往下都是做文字一个个入场动画用的(用于把文字切割！！), 最终传入 Preloader
			intro_Maintitle.current!,
			intro_MainDes.current!,
			intro_SecondSubHead.current!,
			intro_SecondSubTitle.current!,
		) //new 一个 experience 实例, 传入两个 html 元素
		return () => {
			// clearEffect
		};
	}, []);




	return (
		<>
			{/* 底部三维图形 */}
			{/* <div className="dark-theme"> */}
				<div className="experience">
					<canvas className="experience-canvas" ref={canvasRef}></canvas>
				</div>

				{/* ⭕️ loading 加载...动画 */}
				<div className="preloader">
					<div className="preloader-wrapper">
						<div className="loading">
							<div className="circle"></div>
							<div className="circle"></div>
							<div className="circle"></div>
						</div>
					</div>
				</div>


				{/* 📃 页面 */}
				<div className="page" ref={page}>
					{/* 🔘深色模式 & 浅色模式按钮 */}
					<div className="toggle-bar">
						<div className="sun-wrapper"> 
						{/* ⛰️ fill="currentColor" 才能自定义填充 svg 的颜色！ */}
						<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="currentColor" d="M12 15q1.25 0 2.125-.875T15 12q0-1.25-.875-2.125T12 9q-1.25 0-2.125.875T9 12q0 1.25.875 2.125T12 15Zm0 2q-2.075 0-3.537-1.463Q7 14.075 7 12t1.463-3.538Q9.925 7 12 7t3.538 1.462Q17 9.925 17 12q0 2.075-1.462 3.537Q14.075 17 12 17ZM2 13q-.425 0-.712-.288Q1 12.425 1 12t.288-.713Q1.575 11 2 11h2q.425 0 .713.287Q5 11.575 5 12t-.287.712Q4.425 13 4 13Zm18 0q-.425 0-.712-.288Q19 12.425 19 12t.288-.713Q19.575 11 20 11h2q.425 0 .712.287.288.288.288.713t-.288.712Q22.425 13 22 13Zm-8-8q-.425 0-.712-.288Q11 4.425 11 4V2q0-.425.288-.713Q11.575 1 12 1t.713.287Q13 1.575 13 2v2q0 .425-.287.712Q12.425 5 12 5Zm0 18q-.425 0-.712-.288Q11 22.425 11 22v-2q0-.425.288-.712Q11.575 19 12 19t.713.288Q13 19.575 13 20v2q0 .425-.287.712Q12.425 23 12 23ZM5.65 7.05 4.575 6q-.3-.275-.288-.7.013-.425.288-.725.3-.3.725-.3t.7.3L7.05 5.65q.275.3.275.7 0 .4-.275.7-.275.3-.687.287-.413-.012-.713-.287ZM18 19.425l-1.05-1.075q-.275-.3-.275-.712 0-.413.275-.688.275-.3.688-.287.412.012.712.287L19.425 18q.3.275.288.7-.013.425-.288.725-.3.3-.725.3t-.7-.3ZM16.95 7.05q-.3-.275-.287-.688.012-.412.287-.712L18 4.575q.275-.3.7-.288.425.013.725.288.3.3.3.725t-.3.7L18.35 7.05q-.3.275-.7.275-.4 0-.7-.275ZM4.575 19.425q-.3-.3-.3-.725t.3-.7l1.075-1.05q.3-.275.713-.275.412 0 .687.275.3.275.288.688-.013.412-.288.712L6 19.425q-.275.3-.7.287-.425-.012-.725-.287ZM12 12Z"/></svg>
						</div>
						<div className="toggle-button">
							{/* <div className="toggle-circle"></div> */}
							{/* label 的 for 能够把自己跟某个元素绑定在一起,  <label> 标签的 for 属性应当与相关元素的 id 属性相同 */}
							<input id="toggle-circle" type="checkbox" ref={toggleCircle}></input>
							{/* 🔥🔥🔥 ref={toggleButton} 要绑定在 label 标签身上！！不然会执行两次！！！ */}
							<label htmlFor="toggle-circle" ref={toggleButton}></label>
						</div>
						<div className="moon-wrapper">
							{/* ⛰️ fill="currentColor" 才能自定义填充 svg 的颜色！ */}
							<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="currentColor" d="M12 21q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q.35 0 .688.025.337.025.662.075-1.025.725-1.637 1.887Q11.1 6.15 11.1 7.5q0 2.25 1.575 3.825Q14.25 12.9 16.5 12.9q1.375 0 2.525-.613 1.15-.612 1.875-1.637.05.325.075.662Q21 11.65 21 12q0 3.75-2.625 6.375T12 21Zm0-2q2.2 0 3.95-1.212 1.75-1.213 2.55-3.163-.5.125-1 .2-.5.075-1 .075-3.075 0-5.238-2.162Q9.1 10.575 9.1 7.5q0-.5.075-1t.2-1q-1.95.8-3.162 2.55Q5 9.8 5 12q0 2.9 2.05 4.95Q9.1 19 12 19Zm-.25-6.75Z"/></svg>
						</div>
					</div>

					{/* 卡片 */}
					<div className="page-wrapper">
						{/* 首屏 */}
						<section className="hero">
							<div className="hero-wrapper">
								{/* loading 动画的加载文字 */}
								<div className="intro-text" ref={intro_Text}>Welcome to my portfolio!</div>

								{/* 向下的小箭头 */}
								<div className="arrow-svg-wrapper">
									{/* ⛰️ fill="currentColor" 才能自定义填充 svg 的颜色！ */}
									<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path fill="currentColor" d="m12 15.375-6-6 1.4-1.4 4.6 4.6 4.6-4.6 1.4 1.4Z"/></svg>
								</div>

								{/* 左边标题 */}
								<div className="hero-main">
									<h1 className="hero-main-title" ref={intro_Maintitle}>Abigail Bloom</h1>
									<p className="hero-main-description" ref={intro_MainDes}>Digital Media Student | 3D Artist</p>
								</div>
								{/* 右边标题 */}
								<div className="hero-second">
									<p className="hero-second-subheading first-sub" ref={intro_SecondSubHead}>Zeno's</p>
									<p className="hero-second-subheading second-sub" ref={intro_SecondSubTitle}>Portfolio</p>
								</div>
							</div>
						</section>


						{/* 🔥🔥为了把底部的内容称高用, 此外也作为 GSAP 动画库的 trigger, 当滚动到此处时就显示动画！ */}
						<div className="first-move section-margin" ref={firstMoveRef}></div>


						{/* 第一部分 —————————————————————————————————————— */}
						<section className="first-section section left">

							{/* 滚动条 */}
							<div className="progress-wrapper progress-bar-wrapper-left">
								<div className="progress-bar"></div>
							</div>

							<div className="section-intro-wrapper pink-border">
								<h1 className="section-title">
									{/* 标题 */}
									<span className="section-title-text">About Me</span>
									{/* 装饰物 */}
									<div className="section-title-decoration styleOne pink-border"></div>
									<div className="section-title-decoration styleTwo pink-border"></div>
									<div className="section-title-decoration styleThree pink-background  pink-border"></div>
								</h1>
								<span className="section-number">01</span>
							</div>

							{/* 详细内容 */}
							<div className="section-detail-wrapper">
								<h3 className="section-heading">lorem ipsum</h3>
								<p className="section-text">Hi there 👋! I'm a third-year digital media student from UK currently studying in Germany. My dream is to work for Disney or Pixar one day.</p>
								<h3 className="section-heading">Hello!</h3>
								<p className="section-text">I love creating art and playing with my cats! I also like drinking bubble tea and going for hikes! Totally hippie lol ✌️. Welcome to my portfolio!</p>
								<h3 className="section-heading">Hey!</h3>
								<p className="section-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic expedita qui quae officiis, magni velit iste repellat consequuntur temporibus. Quasi atque officia iste beatae rerum, harum itaque accusamus. At, natus?</p>
							</div>
						</section>


						{/* 🔥🔥为了把底部的内容称高用, 此外也作为 GSAP 动画库的 trigger, 当滚动到此处时就显示动画！ */}
						<div className="second-move section-margin" ref={secondMoveRef}></div>


						{/* 第二部分 —————————————————————————————————————— */}
						<section className="second-section section right">

							{/* 滚动条 */}
							<div className="progress-wrapper progress-bar-wrapper-right">
								<div className="progress-bar blue-background"></div>
							</div>

							<div className="section-intro-wrapper blue-text blue-border">
								<h1 className="section-title  blue-text  blue-border">
									{/* 标题 */}
									<span className="section-title-text">My Work</span>
									{/* 装饰物 */}
									<div className="section-title-decoration styleOne  blue-border"></div>
									<div className="section-title-decoration styleTwo  blue-border"></div>
									<div className="section-title-decoration styleThree  blue-background  blue-border"></div>
								</h1>
								<span className="section-number  blue-text">02</span>
							</div>

							{/* 详细内容 */}
							<div className="section-detail-wrapper">
								<h3 className="section-heading">lorem ipsum</h3>
								<p className="section-text">Hi there 👋! I'm a third-year digital media student from UK currently studying in Germany. My dream is to work for Disney or Pixar one day.</p>
								<h3 className="section-heading">Hello!</h3>
								<p className="section-text">I love creating art and playing with my cats! I also like drinking bubble tea and going for hikes! Totally hippie lol ✌️. Welcome to my portfolio!</p>
								<h3 className="section-heading">Hey!</h3>
								<p className="section-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic expedita qui quae officiis, magni velit iste repellat consequuntur temporibus. Quasi atque officia iste beatae rerum, harum itaque accusamus. At, natus?</p>
							</div>
						</section>


						{/* 🔥🔥为了把底部的内容称高用, 此外也作为 GSAP 动画库的 trigger, 当滚动到此处时就显示动画！ */}
						<div className="third-move section-margin" ref={thirdMoveRef}></div>


						{/* 第三部分 —————————————————————————————————————— */}
						<section className="third-section section left">

							{/* 滚动条 */}
							<div className="progress-wrapper progress-bar-wrapper-left">
								<div className="progress-bar green-background"></div>
							</div>

							<div className="section-intro-wrapper green-text green-border">
								<h1 className="section-title green-text  green-border">
									{/* 标题 */}
									<span className="section-title-text">Contact Me</span>
									{/* 装饰物 */}
									<div className="section-title-decoration styleOne green-border"></div>
									<div className="section-title-decoration styleTwo green-border"></div>
									<div className="section-title-decoration styleThree green-background  green-border"></div>
								</h1>
								<span className="section-number green-text">03</span>
							</div>

							{/* 详细内容 */}
							<div className="section-detail-wrapper">
								<h3 className="section-heading">Address</h3>
								<p className="section-text">I'm now live in ShenZhen</p>
								<h3 className="section-heading">Hello!</h3>
								<p className="section-text">I love creating art and playing with my cats! I also like drinking bubble tea and going for hikes! Totally hippie lol ✌️. Welcome to my portfolio!</p>
								<h3 className="section-heading">Hey!</h3>
								<p className="section-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic expedita qui quae officiis, magni velit iste repellat consequuntur temporibus. Quasi atque officia iste beatae rerum, harum itaque accusamus. At, natus?</p>
							</div>
						</section>


					</div>
				</div>
			{/* </div> */}
		</>
	)
}

export default MainView
