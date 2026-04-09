import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Quotations from './pages/Quotations';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Branding from './pages/Branding';
import Settings from './pages/Settings';
import Login from './pages/Login';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* App shell */}
        <Route element={<MainLayout />}>
          <Route path="/"                    element={<Dashboard />}   />
          <Route path="/leads"               element={<Leads />}       />
          <Route path="/quotations"          element={<Quotations />}  />
          <Route path="/clients"             element={<Clients />}     />
          <Route path="/products"            element={<Products />}    />
          <Route path="/products/categories" element={<Categories />}  />
          <Route path="/users"               element={<Users />}       />
          <Route path="/branding"            element={<Branding />}    />
          <Route path="/settings"            element={<Settings />}    />
        </Route>
      </Routes>
    </Router>
  );
}
