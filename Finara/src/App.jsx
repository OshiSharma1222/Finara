import React, { useState } from 'react'
import './styles/theme.css'
import NavBar from './components/NavBar'
import Landing from './pages/Landing'
import BankAdmin from './pages/BankAdmin'
import CustomerPortal from './pages/CustomerPortal'
import InvestorDashboard from './pages/InvestorDashboard'
import ComplianceReports from './pages/ComplianceReports'

function App(){
  const [route, setRoute] = useState('landing')

  const renderRoute = () => {
    switch(route){
      case 'bank': return <BankAdmin />
      case 'customer': return <CustomerPortal />
      case 'investor': return <InvestorDashboard />
      case 'compliance': return <ComplianceReports />
      default: return <Landing onExplore={(r)=>setRoute(r)} />
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column'}}>
      <NavBar onNavigate={(r)=>setRoute(r)} current={route} />
      <div style={{flex:1}}>
        {renderRoute()}
      </div>
    </div>
  )
}

export default App
