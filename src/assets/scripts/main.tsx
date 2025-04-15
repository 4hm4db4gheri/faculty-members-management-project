import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/reset.scss' // Import reset.scss globally
import '../styles/Background.scss'
import BackGround from './Background'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BackGround />
  </StrictMode>,
)
