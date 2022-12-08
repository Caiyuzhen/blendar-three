import React, {useRef} from 'react'
import './MainView.css'
import Experience from './Experience/Experience'


export const MainView = () => {

	// ref 获取 experience-canvas 元素
	const canvasRef = useRef<HTMLCanvasElement>(null)

	// 根据 class new 一个实例
	const experience = new Experience(canvasRef.current!)


	return (
		<>
			<div className="experience">
				<canvas className="experience-canvas" ref={canvasRef}></canvas>
			</div>
		</>
	)
}

export default MainView
