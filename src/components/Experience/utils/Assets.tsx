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
		path: "/models/Finale.glb",
	},
	{
		name: "screen",
		type: "videoTexture",
		path: "/texture/kda.mp",
	}
]

export default Assets

