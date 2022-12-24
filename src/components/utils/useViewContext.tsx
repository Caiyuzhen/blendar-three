// 🌟🌟工具函数, 用于在平行组件中传递数据, 类比鼠标 hover 放大效果, 相当于自己造一个父组件去嵌套别人！
import { createContext, useState } from 'react'
import sectionContext from '../MainView'


type IViewDataType = {
	finalData: Element | undefined,
	changeDataHandler: (finalData: Element | undefined) => void
}


type IChildrenProps = {
	children: React.ReactNode
}




// 创建上下文
export const ViewContext = createContext<IViewDataType>({
	finalData: undefined,
	changeDataHandler: () => {}
})




// 上下文提供方
export function UseViewContextProvider( {children} : IChildrenProps) {
	const [data, setData] = useState<Element | undefined>()


	const changeDataHandler = (finalData: Element | undefined) => {
		setData(finalData)
	}


	const value = {
		finalData: data,
		changeDataHandler: changeDataHandler
	}

	return (
		<ViewContext.Provider value={value}>
			{children}
		</ViewContext.Provider>
	)
}