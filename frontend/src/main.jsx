import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./module/css/bootstrap.css"
import "./module/css/style.css"
import "./module/js/bootstrap.js"
import "./module/js/popper.js"



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
