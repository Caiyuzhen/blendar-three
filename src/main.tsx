import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {UseViewContextProvider} from './components/utils/useViewContext'


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	// 包裹上下文组件
	<UseViewContextProvider>
    	<App />
	</UseViewContextProvider>
)
