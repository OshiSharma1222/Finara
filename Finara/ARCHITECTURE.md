# Finara Platform Architecture

## 📁 Project Structure

```
Finara/
├── src/
│   ├── components/
│   │   ├── Card.jsx           # Reusable card component
│   │   ├── Footer.jsx          # Footer with team credit
│   │   ├── GlassPanel.jsx      # Glassmorphism panel
│   │   ├── GridScan.tsx        # 3D WebGL background
│   │   ├── NavBar.jsx          # Top navigation bar
│   │   └── SideNav.jsx         # Sidebar navigation
│   │
│   ├── pages/
│   │   ├── Landing.jsx         # Public landing page
│   │   ├── BankLogin.jsx       # Bank admin login
│   │   ├── Dashboard.jsx       # Bank admin dashboard
│   │   ├── BankAdmin.jsx       # Bank console
│   │   ├── CustomersList.jsx   # List all customers
│   │   ├── AddCustomer.jsx     # Add new customer
│   │   ├── CustomerProfile.jsx # Customer details
│   │   ├── LoansList.jsx       # List all loans
│   │   ├── CreateLoan.jsx      # Create new loan
│   │   ├── ComplianceReports.jsx # KYC & compliance
│   │   ├── CustomerPortal.jsx  # Customer self-service
│   │   └── InvestorDashboard.jsx # Investor portal
│   │
│   ├── styles/
│   │   └── theme.css           # Global styles
│   │
│   ├── App.jsx                 # Main routing
│   └── main.jsx                # Entry point
```

## 🎯 User Flows

### 1. **Public User Flow**
```
Landing Page (/)
    ↓
Choose Portal Type:
    ├── Bank Admin → /login
    ├── Customer → /customer-portal
    └── Investor → /investor
```

### 2. **Bank Admin Flow**
```
Bank Login (/login)
    ↓ (NavBar present)
Successfully Login
    ↓
Dashboard (/dashboard) - SideNav appears
    ├── View Stats
    ├── Quick Actions
    └── Navigate to:
        ├── Customers (/customers)
        │   ├── Add Customer (/customer/add)
        │   └── View Profile (/customer/:id)
        │       └── Create Loan (/loan/create/:customerId)
        ├── Loans (/loans)
        ├── Bank Console (/bank)
        └── Reports (/reports)
```

### 3. **Customer Flow**
```
Customer Portal (/customer-portal)
    ↓ (NavBar present)
Login Page
    ↓ (Account Number + Password)
Customer Dashboard (Tabs):
    ├── Overview (Stats + Quick Actions)
    ├── Assets (View all assets + List for sale)
    │   └── See Interested Buyers & Matches
    ├── KYC Details (Personal info)
    ├── Loans (Active loans + EMI payments)
    └── Marketplace (Coming soon)
```

### 4. **Investor Flow**
```
Investor Portal (/investor)
    ↓ (NavBar present)
Login Page
    ↓ (Email + Password)
Investor Dashboard (Tabs):
    ├── Portfolio (Stats + Charts)
    ├── Marketplace (Buy tokenized assets)
    ├── Orders (Active buy/sell orders)
    └── Analytics (Coming soon)
```

## 🧭 Navigation Components

### **NavBar** (Top Navigation)
- **Used on:** Landing, Bank Login, Customer Portal, Investor Portal
- **Links:**
  - Home → `/`
  - Bank Admin → `/login`
  - Customer → `/customer-portal`
  - Investor → `/investor`
- **Features:**
  - Fixed position at top
  - Glassmorphism design
  - Scroll-shrink animation
  - Active link highlighting

### **SideNav** (Sidebar Navigation)
- **Used on:** Dashboard, Customers, Loans, Bank Console, Reports
- **Menu Items:**
  - 📊 Dashboard → `/dashboard`
  - 👥 Customers → `/customers`
  - 💰 Loans → `/loans`
  - 🏦 Bank Console → `/bank`
  - 📁 Reports → `/reports`
- **Quick Actions:**
  - Add Customer → `/customer/add`
  - Logout → `/login`

## 🎨 Design System

### **Colors**
- Primary Background: `#000000` (Pure Black)
- Accent Green: `#c7ff3a`
- Secondary Green: `#9be12b`
- Tertiary Green: `#82ca9d`
- Muted Text: `rgba(255,255,255,0.6)`

### **Components**
- **GlassPanel**: Glassmorphism with `backdrop-filter: blur(20px)`
- **Card**: Smaller content cards
- **Buttons**: 
  - Primary: Green gradient
  - Secondary: Transparent with border
- **Forms**: Enhanced inputs with focus states

## 🔐 Authentication

### **Demo Credentials**

#### Bank Admin (`/login`)
- Email: Any email
- Password: Any password
- Redirects to: `/dashboard`

#### Customer Portal (`/customer-portal`)
- Account Number: Any number
- Password: `demo123`
- Access: Full customer dashboard

#### Investor Portal (`/investor`)
- Email: Any email
- Password: `demo123`
- Access: Full investor dashboard

## 📊 Page Details

### **Pages with NavBar Only**
1. `Landing.jsx` - Marketing page with scroll animations
2. `BankLogin.jsx` - Bank admin authentication
3. `CustomerPortal.jsx` - Customer login + dashboard (integrated)
4. `InvestorDashboard.jsx` - Investor login + dashboard (integrated)

### **Pages with SideNav Only**
1. `Dashboard.jsx` - Bank admin dashboard
2. `BankAdmin.jsx` - Bank console with analytics
3. `CustomersList.jsx` - Customer management table
4. `AddCustomer.jsx` - Customer onboarding form
5. `CustomerProfile.jsx` - Individual customer details
6. `LoansList.jsx` - Loan management table
7. `CreateLoan.jsx` - Loan creation form
8. `ComplianceReports.jsx` - KYC and compliance dashboard

## 🔗 Route Organization

### Public Routes
- `/` - Landing page

### Bank Admin Routes
- `/login` - Bank login (NavBar)
- `/dashboard` - Main dashboard (SideNav)
- `/bank` - Bank console (SideNav)

### Customer Management Routes (All have SideNav)
- `/customers` - List all customers
- `/customer/add` - Add new customer
- `/customer/:id` - Customer profile

### Loan Management Routes (All have SideNav)
- `/loans` - List all loans
- `/loan/create/:customerId` - Create loan for customer

### Compliance Routes (SideNav)
- `/reports` - Compliance dashboard
- `/compliance` - Alias for reports

### Self-Service Portals (NavBar only)
- `/customer-portal` - Customer self-service
- `/investor` - Investor dashboard

## 🚀 Key Features

### Bank Admin
- Customer onboarding with KYC
- Asset tokenization
- Loan creation and management
- Compliance monitoring
- Portfolio analytics

### Customer Portal
- View all assets
- List assets for sale
- See buyer matches
- View KYC details
- Manage active loans
- Pay EMIs

### Investor Dashboard
- Portfolio overview
- Buy tokenized assets
- Manage orders
- Track performance
- Market analytics

## 📱 Responsive Design
- All pages optimized for desktop
- Glassmorphism effects throughout
- Smooth animations and transitions
- Fixed navigation with scroll effects

## 🎯 Next Steps
- Backend integration
- Real authentication
- Smart contract connections
- Payment gateway integration
- Real-time data updates
- Mobile responsive improvements
