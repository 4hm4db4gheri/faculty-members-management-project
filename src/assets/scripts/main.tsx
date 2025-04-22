import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/reset.scss' // Import reset.scss globally
import DashboardComponent from './DashboardComponent'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/main.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DashboardComponent />
  </StrictMode>,
)
