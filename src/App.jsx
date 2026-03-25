import { useState } from 'react'
import TaxGroupAssignment from './components/TaxGroupAssignment'
import AssignAccounts2 from './components/AssignAccounts2'
import AllocationMethods from './components/AllocationMethods'
import TBAAllocation from './components/TBAAllocation'
import Form990PartIX from './components/Form990PartIX'
import './App.css'

const INITIAL_ACCOUNTS = [
  { id: 1, accountNumber: '5100', accountName: 'Director salary',            cy: 180000, py: 170000, taxGroup: '', tbaLine: '', tbaMethodId: '' },
  { id: 2, accountNumber: '5200', accountName: 'Program staff salaries',     cy: 750000, py: 700000, taxGroup: '', tbaLine: '', tbaMethodId: '' },
  { id: 3, accountNumber: '5300', accountName: 'Development staff salaries', cy: 220000, py: 200000, taxGroup: '', tbaLine: '', tbaMethodId: '' },
  { id: 4, accountNumber: '6100', accountName: 'Office rent',                cy: 120000, py: 120000, taxGroup: '', tbaLine: '', tbaMethodId: '' },
  { id: 5, accountNumber: '7200', accountName: 'Audit fees',                 cy:  35000, py:  35000, taxGroup: '', tbaLine: '', tbaMethodId: '' },
  { id: 6, accountNumber: '7400', accountName: 'Special event expenses',     cy:  90000, py: 100000, taxGroup: '', tbaLine: '', tbaMethodId: '' },
]

export default function App() {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS)
  const [allocationMethods, setAllocationMethods] = useState([])
  const [activeTab, setActiveTab] = useState('assignment')

  const handleTaxGroupChange = (id, value) => {
    setAccounts(prev => prev.map(acc =>
      acc.id === id
        ? { ...acc, taxGroup: value, tbaLine: '', tbaMethodId: '' }
        : acc
    ))
  }

  const handleAccountUpdate = (id, updates) => {
    setAccounts(prev => prev.map(acc => acc.id === id ? { ...acc, ...updates } : acc))
  }

  return (
    <div>
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === 'assignment' ? 'active' : ''}`}
          onClick={() => setActiveTab('assignment')}
        >
          Tax Group Assignment
        </button>
        <button
          className={`tab-btn ${activeTab === 'assign2' ? 'active' : ''}`}
          onClick={() => setActiveTab('assign2')}
        >
          Assign Accounts
          <span className="tab-badge-v2">2.0</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'allocations' ? 'active' : ''}`}
          onClick={() => setActiveTab('allocations')}
        >
          Allocation Methods
          {allocationMethods.length > 0 && (
            <span className="tab-badge">{allocationMethods.length}</span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === 'tba' ? 'active' : ''}`}
          onClick={() => setActiveTab('tba')}
        >
          TBA Allocation
          {accounts.filter(a => a.taxGroup === 'TBA').length > 0 && (
            <span className="tab-badge tab-badge-amber">
              {accounts.filter(a => a.taxGroup === 'TBA').length}
            </span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === 'form990' ? 'active' : ''}`}
          onClick={() => setActiveTab('form990')}
        >
          Form 990 – Part IX
        </button>
      </nav>

      <div className="tab-content">
        {activeTab === 'assignment' && (
          <TaxGroupAssignment
            accounts={accounts}
            onTaxGroupChange={handleTaxGroupChange}
          />
        )}
        {activeTab === 'assign2' && (
          <AssignAccounts2
            accounts={accounts}
            onTaxGroupChange={handleTaxGroupChange}
          />
        )}
        {activeTab === 'allocations' && (
          <AllocationMethods
            methods={allocationMethods}
            onChange={setAllocationMethods}
          />
        )}
        {activeTab === 'tba' && (
          <TBAAllocation
            accounts={accounts}
            allocationMethods={allocationMethods}
            onAccountUpdate={handleAccountUpdate}
          />
        )}
        {activeTab === 'form990' && (
          <Form990PartIX
            accounts={accounts}
            allocationMethods={allocationMethods}
          />
        )}
      </div>
    </div>
  )
}
