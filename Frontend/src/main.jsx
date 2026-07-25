import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'remixicon/fonts/remixicon.css'
import './index.scss'
import './features/auth/auth.form.scss'
import './styles/button.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
