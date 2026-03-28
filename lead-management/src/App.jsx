import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import Quotations from './pages/Quotations';
import AIAssistant from './pages/AIAssistant';
import FollowUps from './pages/FollowUps';
import CRM from './pages/CRM';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route path="/follow-ups" element={<FollowUps />} />
          <Route path="/crm" element={<CRM />} />
        </Route>
      </Routes>
    </Router>
  );
}
