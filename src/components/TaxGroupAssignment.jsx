import { useState } from 'react'
import './TaxGroupAssignment.css'


const FORM_990_PART_IX = [
  { value: '', label: '— Select tax group —' },
  { value: 'TBA', label: '990 Part IX to be allocated' },
  { value: '901',    label: '901 – Grants in US-Governments-990' },
  { value: '902',    label: '902 – Grants in US-Individuals-990' },
  { value: '903',    label: '903 – Grants outside US-990' },
  { value: '904',    label: '904 – Benefits paid to/for members-990' },
  { value: '905B',   label: '905B – Comp.of officers-ProgServ-990' },
  { value: '905C',   label: '905C – Comp.of officers-Mngmnt-990' },
  { value: '905D',   label: '905D – Comp.of officers-Fndrsng-990' },
  { value: '906B',   label: '906B – Comp.disqual.pers-ProgServ-990' },
  { value: '906C',   label: '906C – Comp.disqual.pers-Mngmnt-990' },
  { value: '906D',   label: '906D – Comp.disqual.pers-Fndrsng-990' },
  { value: '907B',   label: '907B – Oth.salaries&wages-ProgServ-990' },
  { value: '907C',   label: '907C – Oth.salaries&wages-Mngmnt-990' },
  { value: '907D',   label: '907D – Oth.salaries&wages-Fndrsng-990' },
  { value: '908B',   label: '908B – Pension plan contr-ProgServ-990' },
  { value: '908C',   label: '908C – Pension plan contr-Mngmnt-990' },
  { value: '908D',   label: '908D – Pension plan contr-Fndrsng-990' },
  { value: '909B',   label: '909B – Oth emp benefits-ProgServ-990' },
  { value: '909C',   label: '909C – Oth emp benefits-Mngmnt-990' },
  { value: '909D',   label: '909D – Oth emp benefits-Fndrsng-990' },
  { value: '910B',   label: '910B – Payroll taxes-ProgServ-990' },
  { value: '910C',   label: '910C – Payroll taxes-Mngmnt-990' },
  { value: '910D',   label: '910D – Payroll taxes-Fndrsng-990' },
  { value: '911AB',  label: '911AB – Management fees-ProgServ-990' },
  { value: '911AC',  label: '911AC – Management fees-Mngmnt-990' },
  { value: '911AD',  label: '911AD – Management fees-Fndrsng-990' },
  { value: '911BB',  label: '911BB – Legal fees-ProgServ-990' },
  { value: '911BC',  label: '911BC – Legal fees-Mngmnt-990' },
  { value: '911BD',  label: '911BD – Legal fees-Fndrsng-990' },
  { value: '911CB',  label: '911CB – Accounting fees-ProgServ-990' },
  { value: '911CC',  label: '911CC – Accounting fees-Mngmnt-990' },
  { value: '911CD',  label: '911CD – Accounting fees-Fndrsng-990' },
  { value: '911DB',  label: '911DB – Lobbying fees-ProgServ-990' },
  { value: '911DC',  label: '911DC – Lobbying fees-Mngmnt-990' },
  { value: '911DD',  label: '911DD – Lobbying fees-Fndrsng-990' },
  { value: '911ED',  label: '911ED – Professional fundraising fees-990' },
  { value: '911FB',  label: '911FB – Invest. mgmt fees-ProgServ-990' },
  { value: '911FC',  label: '911FC – Invest. mgmt fees-Mngmnt-990' },
  { value: '911FD',  label: '911FD – Invest. mgmt fees-Fndrsng-990' },
  { value: '911GB',  label: '911GB – Other fees-ProgServ-990' },
  { value: '911GC',  label: '911GC – Other fees-Mngmnt-990' },
  { value: '911GD',  label: '911GD – Other fees-Fndrsng-990' },
  { value: '912B',   label: '912B – Advertising-ProgServ-990' },
  { value: '912C',   label: '912C – Advertising-Mngmnt-990' },
  { value: '912D',   label: '912D – Advertising-Fndrsng-990' },
  { value: '913B',   label: '913B – Office expenses-ProgServ-990' },
  { value: '913C',   label: '913C – Office expenses-Mngmnt-990' },
  { value: '913D',   label: '913D – Office expenses-Fndrsng-990' },
  { value: '914B',   label: '914B – Information tech.-ProgServ-990' },
  { value: '914C',   label: '914C – Information tech.-Mngmnt-990' },
  { value: '914D',   label: '914D – Information tech.-Fndrsng-990' },
  { value: '915B',   label: '915B – Royalties-ProgServ-990' },
  { value: '915C',   label: '915C – Royalties-Mngmnt-990' },
  { value: '915D',   label: '915D – Royalties-Fndrsng-990' },
  { value: '916B',   label: '916B – Occupancy-ProgServ-990' },
  { value: '916C',   label: '916C – Occupancy-Mngmnt-990' },
  { value: '916D',   label: '916D – Occupancy-Fndrsng-990' },
  { value: '917B',   label: '917B – Travel-ProgServ-990' },
  { value: '917C',   label: '917C – Travel-Mngmnt-990' },
  { value: '917D',   label: '917D – Travel-Fndrsng-990' },
  { value: '918B',   label: '918B – Payments T&E exps.-ProgServ-990' },
  { value: '918C',   label: '918C – Payments T&E exps.-Mngmnt-990' },
  { value: '918D',   label: '918D – Payments T&E exps.-Fndrsng-990' },
  { value: '919B',   label: '919B – Conferences & mtgs-ProgServ-990' },
  { value: '919C',   label: '919C – Conferences & mtgs-Mngmnt-990' },
  { value: '919D',   label: '919D – Conferences & mtgs-Fndrsng-990' },
  { value: '920B',   label: '920B – Interest expenses-ProgServ-990' },
  { value: '920C',   label: '920C – Interest expenses-Mngmnt-990' },
  { value: '920D',   label: '920D – Interest expenses-Fndrsng-990' },
  { value: '921B',   label: '921B – Pymts to affiliates-ProgServ-990' },
  { value: '921C',   label: '921C – Pymts to affiliates-Mngmnt-990' },
  { value: '921D',   label: '921D – Pymts to affiliates-Fndrsng-990' },
  { value: '922B',   label: '922B – Depreciation(ovrd)-ProgServ-990' },
  { value: '922B.A', label: '922B.A – Depletion-ProgServ-990' },
  { value: '922C',   label: '922C – Depreciation(ovrd)-Mngmnt-990' },
  { value: '922C.A', label: '922C.A – Depletion-Mngmnt-990' },
  { value: '922D',   label: '922D – Depreciation(ovrd)-Fndrsng-990' },
  { value: '922D.A', label: '922D.A – Depletion-Fndrsng-990' },
  { value: '923B',   label: '923B – Insurance-ProgServ-990' },
  { value: '923C',   label: '923C – Insurance-Mngmnt-990' },
  { value: '923D',   label: '923D – Insurance-Fndrsng-990' },
  { value: '924B',   label: '924B – Other expenses-ProgServ-990' },
  { value: '924C',   label: '924C – Other expenses-Mngmnt-990' },
  { value: '924D',   label: '924D – Other expenses-Fndrsng-990' },
  { value: '924FB',  label: '924FB – All other expenses-ProgServ-990' },
  { value: '924FC',  label: '924FC – All other expenses-Mngmnt-990' },
  { value: '924FD',  label: '924FD – All other expenses-Fndrsng-990' },
]

const CY_LABEL = '12/31/2023'
const PY_LABEL = '12/31/2022'

function formatNumber(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function TaxGroupAssignment({ accounts, onTaxGroupChange }) {
  const [sortDir, setSortDir] = useState('asc')
  const [saved, setSaved] = useState(false)

  const handleSort = () => setSortDir(prev => prev === 'asc' ? 'desc' : 'asc')

  const handleTaxGroupChange = (id, value) => {
    setSaved(false)
    onTaxGroupChange(id, value)
  }

  const handleSave = () => setSaved(true)

  const displayAccounts = [...accounts].sort((a, b) =>
    sortDir === 'asc'
      ? a.accountNumber.localeCompare(b.accountNumber)
      : b.accountNumber.localeCompare(a.accountNumber)
  )

  const assignedCount = accounts.filter(a => a.taxGroup !== '').length
  const tbaCount = accounts.filter(a => a.taxGroup === 'TBA').length

  return (
    <div className="tga-wrapper">
      <div className="tga-header">
        <div>
          <h1 className="tga-title">Tax Group Assignment</h1>
          <p className="tga-subtitle">
            Form 990 – Part IX Statement of Functional Expenses
          </p>
        </div>
        <div className="tga-header-actions">
          <span className="tga-progress">
            {assignedCount} / {accounts.length} accounts assigned
            {tbaCount > 0 && (
              <span className="tga-progress-tba">{tbaCount} pending allocation</span>
            )}
          </span>
          <button className="tga-btn-save" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>

      {saved && (
        <div className="tga-toast">
          ✓ Tax group assignments saved successfully.
        </div>
      )}

      <div className="tga-table-container">
        <table className="tga-table">
          <thead>
            <tr>
              <th className="col-acct-num" onClick={handleSort}>
                Account number
                <span className={`sort-icon ${sortDir === 'asc' ? 'asc' : 'desc'}`}>
                  {sortDir === 'asc' ? '↑' : '↓'}
                </span>
              </th>
              <th className="col-acct-name">Account name</th>
              <th className="col-amount">{CY_LABEL}</th>
              <th className="col-amount">{PY_LABEL}</th>
              <th className="col-tax-group">Tax group</th>
            </tr>
          </thead>
          <tbody>
            {displayAccounts.map(acc => (
              <tr key={acc.id} className={
                acc.taxGroup === 'TBA' ? 'row-tba'
                  : acc.taxGroup ? 'row-assigned' : ''
              }>
                <td className="col-acct-num">{acc.accountNumber}</td>
                <td className="col-acct-name">{acc.accountName}</td>
                <td className="col-amount">{formatNumber(acc.cy)}</td>
                <td className="col-amount">{formatNumber(acc.py)}</td>
                <td className="col-tax-group">
                  <select
                    className={`tax-group-select ${
                      acc.taxGroup === 'TBA' ? 'is-tba' : acc.taxGroup ? 'has-value' : ''
                    }`}
                    value={acc.taxGroup}
                    onChange={e => handleTaxGroupChange(acc.id, e.target.value)}
                  >
                    {FORM_990_PART_IX.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
