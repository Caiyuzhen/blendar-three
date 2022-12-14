import React, {useRef, useEffect} from 'react'
import './MainView.css'
import Experience from './Experience/Experience'


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
					<section className="hero">
						<div className="hero-wrapper">
							{/* 第一部分 */}
							<div className="hero-main">
								<h1 className="hero-main-title">Abigail Bloom</h1>
								<p className="hero-main-description">Digital Media Student | 3D Artist</p>
							</div>
							{/* 第二部份 */}
							<div className="hero-second">
								<h1 className="hero-second-subheading">Abigail Bloom</h1>
								<p className="hero-second-subheading">Portfolio</p>
							</div>
						</div>
					</section>
				</div>
			</div>
		</>
	)
}

export default MainView
