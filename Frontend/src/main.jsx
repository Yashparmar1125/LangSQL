import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import App from './App'
import './index.css'

// Configure React Router future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter {...router}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
