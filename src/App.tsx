import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Layout } from './components/layout/Layout'
import {
  HomePage,
  LoginPage,
  PlayPage,
  LearnPage,
  DrillPage,
  ProgressPage,
} from './pages'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="play" element={<PlayPage />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="drill" element={<DrillPage />} />
            <Route path="progress" element={<ProgressPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
