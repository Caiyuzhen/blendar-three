import React from 'react'
import {EventEmitter} from 'events' //🎃第一步: 引入 events 库, 在 class 中去继承 EventEmitter 的方法！
import Experience from '../Experience'
import {IAsset} from './Assets'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import * as THREE from 'three'


/*	在创建 World 之前需要加载各种 3D 文件以及纹理贴图:
		用 Loader 检查每一项 Assets 资源 在此组件内统一进行加载, 比如纹理组件, 模型组件, 音频组件等等 
*/
export default class Resources extends EventEmitter {

	constructor(assets: IAsset[]) {
		super()
		this.experience = new Experience()
		this.renderer = this.experience.renderer
		this.assets = assets
		// console.log(this.assets);

		
		this.items = {}//用来搜集所有加载过后的资源
		this.queue = this.assets.length //资源队列的数量
		this.loaded = 0 //🔥加载资源的数量, 看所有资源是否都加载完毕

		this.setLoaders()
		this.startLoading()
	}

	setLoaders() {
		this.loaders = {}
		this.loaders.gltfLoader = new GLTFLoader() //实例化从 draco 中加载 gltf 模型的 loader
		this.loaders.dracoLoader = new DRACOLoader() //实例化 draco loader
		this.loaders.dracoLoader.setDecoderPath('/src/components/public/draco/') //设置 draco 的解码路径 (⚡️因为在 blendar 中导出的 gltf 模型是压缩过的, 所以需要 draco 来解码)
		this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader) //设置 gltf loader 的 draco loader
	}

	startLoading() {
		// ⚡️遍历并加载所有的资源
		for(const asset of this.assets) { //assets 依次会改变为第 1 个数组、第 2 个数组...
			if(asset.type === 'glbModel'){
				this.loaders.gltfLoader.load(asset.path, (file: any)=>{ //加载对应 path 下的文件
					this.singleAssetLoaded(asset, file) //⚡️把资源和文件传入 singleAssetLoaded 方法中
				});
			}else if (asset.type === 'videoTexture') {
				this.video = {} //video html 元素
				this.videoTexture = {} //three.js 中的 videoTexture 配置

				this.video[asset.name] = document.createElement('video') //创建 video 元素
				this.video[asset.name].src = asset.path
				this.video[asset.name].muted = true
				this.video[asset.name].playsInline = true
				this.video[asset.name].autoplay = true
				this.video[asset.name].loop = true
				this.video[asset.name].play()

				this.videoTexture[asset.name] = new THREE.VideoTexture( //指定视屏纹理的配置
					this.video[asset.name]
				)
				this.videoTexture[asset.name].flipY = true //将视频纹理纵向翻转
				this.videoTexture[asset.name].minFilter = THREE.NearestFilter //设置纹理过滤方式
				this.videoTexture[asset.name].magFilter = THREE.NearestFilter //设置纹理过滤方式
			
				this.videoTexture[asset.name].generateMinimap = true //设置纹理过滤方式
				this.videoTexture[asset.name].encoding = THREE.sRGBEncoding //设置纹理编码方式

				this.singleAssetLoaded(asset, this.videoTexture[asset.name]) //⚡️把资源和文件传入 singleAssetLoaded 方法中
			}
		}
	}


	singleAssetLoaded(asset: IAsset, file: any) {
		this.items[asset.name] = file //通过键值对的方式获取对应的 path 文件, 收集到 items 内
		this.loaded ++  //🔥加载器的数量

		// console.log('🚗资源加载中');

		if(this.loaded === this.queue) { //如果加载器的数量等于资源队列的数量, 则说明所有资源都加载完毕
			//🔥资源都加载好后，在 World 类里边触发 ready 事件, world 内的触发会开启 resources 这里边的加载
			console.log('😄World 触发了 ready 事件，资源加载完毕', file);
			this.emit("ready")
		}
	}
}

