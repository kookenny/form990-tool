import './TBAAllocation.css'

const TBA_LINE_OPTIONS = [
  { value: '', label: '— Select Part IX line —' },
  { value: '5',   label: 'Line 5 – Officer / director compensation' },
  { value: '6',   label: 'Line 6 – Disqualified persons compensation' },
  { value: '7',   label: 'Line 7 – Other salaries and wages' },
  { value: '8',   label: 'Line 8 – Pension plan contributions' },
  { value: '9',   label: 'Line 9 – Other employee benefits' },
  { value: '10',  label: 'Line 10 – Payroll taxes' },
  { value: '11a', label: 'Line 11a – Fees: Management' },
  { value: '11b', label: 'Line 11b – Fees: Legal' },
  { value: '11c', label: 'Line 11c – Fees: Accounting' },
  { value: '11d', label: 'Line 11d – Fees: Lobbying' },
  { value: '11f', label: 'Line 11f – Fees: Investment management' },
  { value: '11g', label: 'Line 11g – Fees: Other' },
  { value: '12',  label: 'Line 12 – Advertising and promotion' },
  { value: '13',  label: 'Line 13 – Office expenses' },
  { value: '14',  label: 'Line 14 – Information technology' },
  { value: '15',  label: 'Line 15 – Royalties' },
  { value: '16',  label: 'Line 16 – Occupancy' },
  { value: '17',  label: 'Line 17 – Travel' },
  { value: '18',  label: 'Line 18 – Payments T&E for public officials' },
  { value: '19',  label: 'Line 19 – Conferences, conventions, meetings' },
  { value: '20',  label: 'Line 20 – Interest' },
  { value: '21',  label: 'Line 21 – Payments to affiliates' },
  { value: '22',  label: 'Line 22 – Depreciation, depletion, amortization' },
  { value: '23',  label: 'Line 23 – Insurance' },
  { value: '24',  label: 'Line 24 – Other expenses' },
  { value: '24f', label: 'Line 24f – All other expenses' },
]

function formatNumber(n) {
  return Math.round(n).toLocaleString('en-US')
}

export default function TBAAllocation({ accounts, allocationMethods, onAccountUpdate }) {
  const tbaAccounts = accounts.filter(a => a.taxGroup === 'TBA')
  const resolvedCount = tbaAccounts.filter(a => a.tbaLine && a.tbaMethodId).length

  if (tbaAccounts.length === 0) {
    return (
      <div className="tba-wrapper">
        <div className="tba-header">
          <h1 className="tba-title">TBA Allocation</h1>
          <p className="tba-subtitle">
            Apply allocation methods to accounts mapped as "990 To be allocated".
          </p>
        </div>
        <div className="tba-empty">
          <div className="tba-empty-icon">✓</div>
          <p className="tba-empty-title">No accounts pending allocation</p>
          <p className="tba-empty-sub">
            Accounts mapped to "990 To be allocated" in the Tax Group Assignment tab will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="tba-wrapper">
      <div className="tba-header">
        <div>
          <h1 className="tba-title">TBA Allocation</h1>
          <p className="tba-subtitle">
            Assign a Part IX line and an allocation method to each account.
            The balance will be split across columns B, C, and D and flow into Form 990 – Part IX.
          </p>
        </div>
        <span className="tba-progress-badge">
          {resolvedCount} / {tbaAccounts.length} resolved
        </span>
      </div>

      {allocationMethods.length === 0 && (
        <div className="tba-alert">
          ⚠ No allocation methods defined yet. Go to the <strong>Allocation Methods</strong> tab to create one before assigning here.
        </div>
      )}

      <div className="tba-table-container">
        <table className="tba-table">
          <thead>
            <tr>
              <th className="col-acct-num">Account number</th>
              <th className="col-acct-name">Account name</th>
              <th className="col-amount">12/31/2023</th>
              <th className="col-line-pick">Part IX line</th>
              <th className="col-method-pick">Allocation method</th>
              <th className="col-preview">Split preview</th>
            </tr>
          </thead>
          <tbody>
            {tbaAccounts.map(acc => {
              const method = allocationMethods.find(m => m.id === acc.tbaMethodId)
              const isResolved = !!(acc.tbaLine && acc.tbaMethodId && method)

              return (
                <tr key={acc.id} className={isResolved ? 'row-resolved' : 'row-pending'}>
                  <td className="col-acct-num">{acc.accountNumber}</td>
                  <td className="col-acct-name">{acc.accountName}</td>
                  <td className="col-amount">{formatNumber(acc.cy)}</td>

                  {/* Part IX line */}
                  <td className="col-line-pick">
                    <select
                      className={`tba-pick-select ${acc.tbaLine ? 'has-value' : ''}`}
                      value={acc.tbaLine || ''}
                      onChange={e => onAccountUpdate(acc.id, { tbaLine: e.target.value })}
                    >
                      {TBA_LINE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Allocation method */}
                  <td className="col-method-pick">
                    <select
                      className={`tba-pick-select ${acc.tbaMethodId ? 'has-value' : ''}`}
                      value={acc.tbaMethodId || ''}
                      onChange={e => onAccountUpdate(acc.id, {
                        tbaMethodId: e.target.value ? Number(e.target.value) : ''
                      })}
                      disabled={allocationMethods.length === 0}
                    >
                      <option value="">— Select method —</option>
                      {allocationMethods.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </td>

                  {/* Split preview */}
                  <td className="col-preview">
                    {isResolved ? (
                      <div className="split-preview">
                        <span className="sp-item sp-b">
                          <span className="sp-col">B</span>
                          {method.pctB.toFixed(2)}% = {formatNumber(acc.cy * method.pctB / 100)}
                        </span>
                        <span className="sp-item sp-c">
                          <span className="sp-col">C</span>
                          {method.pctC.toFixed(2)}% = {formatNumber(acc.cy * method.pctC / 100)}
                        </span>
                        <span className="sp-item sp-d">
                          <span className="sp-col">D</span>
                          {method.pctD.toFixed(2)}% = {formatNumber(acc.cy * method.pctD / 100)}
                        </span>
                      </div>
                    ) : (
                      <span className="sp-pending">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
