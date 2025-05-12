import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/reset.scss'
import DashboardComponent from './DashboardComponent'
import { RTLProvider } from './RTLProvider'
import UserInfo from './Panels/UserInfo'
import RoleManagementPanel from './Panels/RoleManagementPanel'
import HistoryPanel from './Panels/HistoryPanel'
import MainDashboardPanel from './Panels/MainDashboardPanel'
import ImprovementChartPanel from './Panels/ImprovementChartPanel'
import { TabPanel } from '@headlessui/react'
import ProgressChart from './Panels/ProgressChart'
import NotificationManagementPanel from './Panels/notificationManagementPanel'
import NotificationsPanel from './Panels/NotificationsPanel'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RTLProvider>
    
      <DashboardComponent/>
    </RTLProvider>
  </StrictMode>,
)
