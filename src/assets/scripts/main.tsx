import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/reset.scss'
import DashboardComponent from './DashboardComponent'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DashboardComponent />
  </StrictMode>,
)
