import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/reset.scss'
import DashboardComponent from './DashboardComponent'
import { RTLProvider } from './RTLProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RTLProvider>
      <DashboardComponent />
    </RTLProvider>
  </StrictMode>,
)
