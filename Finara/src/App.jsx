import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/theme.css'
import Landing from './pages/Landing'
import BankLogin from './pages/BankLogin'
import Dashboard from './pages/Dashboard'
import BankAdmin from './pages/BankAdmin'
import AddCustomer from './pages/AddCustomer'
import CustomerProfile from './pages/CustomerProfile'
import CustomersList from './pages/CustomersList'
import CreateLoan from './pages/CreateLoan'
import LoansList from './pages/LoansList'
import CustomerPortal from './pages/CustomerPortal'
import InvestorDashboard from './pages/InvestorDashboard'
import ComplianceReports from './pages/ComplianceReports'

function App(){
  return (
    <Router>
      <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',background:'#000'}}>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />
          
          {/* Bank Admin Flow - Login has NavBar, Dashboard has SideNav */}
          <Route path="/login" element={<BankLogin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bank" element={<BankAdmin />} />
          
          {/* Customer Management - All have SideNav */}
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/customer/add" element={<AddCustomer />} />
          <Route path="/customer/:id" element={<CustomerProfile />} />
          
          {/* Loan Management - All have SideNav */}
          <Route path="/loans" element={<LoansList />} />
          <Route path="/loan/create/:customerId" element={<CreateLoan />} />
          
          {/* Compliance/Reports - Has SideNav */}
          <Route path="/reports" element={<ComplianceReports />} />
          <Route path="/compliance" element={<ComplianceReports />} />
          
          {/* Customer Portal - Has NavBar + Login inside */}
          <Route path="/customer-portal" element={<CustomerPortal />} />
          
          {/* Investor Dashboard - Has NavBar + Login inside */}
          <Route path="/investor" element={<InvestorDashboard />} />
          
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
