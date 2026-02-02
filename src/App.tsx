import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import {
  HomePage,
  PlayPage,
  LearnPage,
  DrillPage,
} from './pages'

function App() {
  return (
    <BrowserRouter basename="/count">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="play" element={<PlayPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="drill" element={<DrillPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
