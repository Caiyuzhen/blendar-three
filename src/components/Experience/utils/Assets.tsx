// 定义资源的类型
export interface IAsset {
	name: string;
	type: string;
	path: string;
  }


// 导出具体的资源路径
export const Assets:IAsset[] = [
	{
		name: "room",
		type: "glbModel",
		path: "/src/components/public/models/Finale.glb",
	},
	{
		name: "screen",
		type: "videoTexture",
		path: "/src/components/public/textures/kda.mp4",
	}
]

export default Assets

