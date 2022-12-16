import React, {useRef, useEffect} from 'react'
import './MainView.css'
import Experience from './Experience/Experience'
import './MainView.css'

export const MainView = () => {

	// ref 获取 experience-canvas 元素
	const canvasRef = useRef<HTMLCanvasElement>(null)

	// 根据 class new 一个实例
	useEffect(() => {
		if (!canvasRef.current) {
			return
		}
		const experience = new Experience(canvasRef.current!) //实际的 new 一个实例
		// content
		return () => {
			// clearEffect
		};
	}, []);



	return (
		<>
			<div className="experience">
				<canvas className="experience-canvas" ref={canvasRef}></canvas>
			</div>

			<div className="page">
				<div className="page-wrapper">

					{/* 首屏 */}
					<section className="hero">
						<div className="hero-wrapper">
							{/* 左边标题 */}
							<div className="hero-main">
								<h1 className="hero-main-title">Abigail Bloom</h1>
								<p className="hero-main-description">Digital Media Student | 3D Artist</p>
							</div>
							{/* 右边标题 */}
							<div className="hero-second">
								<p className="hero-second-subheading">Abigail Bloom</p>
								<p className="hero-second-subheading">Portfolio</p>
							</div>
						</div>
					</section>


					{/* 🔥🔥为了把底部的内容称高用 */}
					<div className="section-margin"></div>


					{/* 第一部分 */}
					<section className="first-section section left">
						<div className="section-intro-wrapper">
							<h1 className="section-title">
								{/* 标题 */}
								<span className="section-title-text">About Me</span>
								{/* 装饰物 */}
								<div className="section-title-decoration styleOne"></div>
								<div className="section-title-decoration styleTwo"></div>
								<div className="section-title-decoration styleThree"></div>
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


					{/* 第二部分 */}
					<section className="second-section section right">
						<div className="section-intro-wrapper">
							<h1 className="section-title">
								{/* 标题 */}
								<span className="section-title-text">My Work</span>
								{/* 装饰物 */}
								<div className="section-title-decoration styleOne"></div>
								<div className="section-title-decoration styleTwo"></div>
								<div className="section-title-decoration styleThree"></div>
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


				</div>
			</div>
		</>
	)
}

export default MainView
