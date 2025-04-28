import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/reset.scss'
import DashboardComponent from './DashboardComponent'
<<<<<<< HEAD
import '../styles/Panels/MainDashboardPanel.scss';
import 'bootstrap/dist/css/bootstrap.css'
=======
import { RTLProvider } from './RTLProvider'
>>>>>>> 611a7450cdae26bdf2c06c31988b31cca1063ed0

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RTLProvider>
      <DashboardComponent />
    </RTLProvider>
  </StrictMode>,
)
