import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Content from './pages/Content';
import Analytics from './pages/Analytics';
import Export from './pages/Export';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<Content />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="export" element={<Export />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
