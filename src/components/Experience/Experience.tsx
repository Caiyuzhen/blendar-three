import React from 'react'
import * as THREE from 'three' 
import Sizes from './utils/Size'
import Camera from './Camera'
import Renderer from './Renderer'
import {PerspectiveCamera, Scene, OrthographicCamera} from '../../Types/ThreeTypes'



// ⚡️⚡️ 封装其他所有组件的能力, 返回单独的一个实例 （封装 api 的逻辑）
export default class Experience {
	public static instance: any //🔥🔥单实例的模式, 把各种 class 的实例都放在 Experience 这里, 其他组件通过 Experience.instance 来获取实例
	public canvas ? : HTMLCanvasElement //类里边的实例属性
	public scene!: Scene   //THREE.Scene //类里边的实例属性
	public sizes!: Sizes //类里边的实例属性
	public camera!: Camera //类里边的实例属性
	public renderer!: Renderer //类里边的实例属性

	
	constructor(canvas? :HTMLCanvasElement) {
		console.log('Hey, 成功新建类型');

		if(Experience.instance) {
			return Experience.instance
		}
		Experience.instance = this //如果没有实例, 就把当前实例赋值给 Experience.instance

		// super(canvas) //继承的类需要 super 一下
		this.canvas = canvas //把传进来的 canvas 赋值给类里边的 canvas 属性
		this.scene = new THREE.Scene() //实例化一个场景, 赋值给 scene 属性
		this.sizes = new Sizes() //实例化一个画布的尺寸, 赋值给 sizes 属性
		this.camera = new Camera()
		this.renderer = new Renderer() //实例化一个渲染器, 赋值给 renderer 属性


		// // from https://threejs.org/docs/#manual/zh/introduction/Creating-a-scene
		
		// const camera = new THREE.PerspectiveCamera( 85, window.innerWidth / window.innerHeight, 0.1, 1000 );

		// const renderer = new THREE.WebGLRenderer();
		// renderer.setSize( window.innerWidth, window.innerHeight );
		// document.body.appendChild( renderer.domElement );

		// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// const material = new THREE.MeshBasicMaterial( { color: '#3370FF' } );
		// const cube = new THREE.Mesh( geometry, material );
		// scene.add( cube );

		// camera.position.z = 5;

		// function animate() {
		// 	requestAnimationFrame( animate );

		// 	cube.rotation.x += 0.01;
		// 	cube.rotation.y += 0.01;

		// 	renderer.render( scene, camera );
		// };

		// animate();
	}
}

