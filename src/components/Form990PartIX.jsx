import './Form990PartIX.css'

// Maps every tax group code → { line key, column }
const TAX_GROUP_MAPPING = {
  '901':    { line: '1',   col: 'B' },
  '902':    { line: '2',   col: 'B' },
  '903':    { line: '3',   col: 'B' },
  '904':    { line: '4',   col: 'B' },
  '905B':   { line: '5',   col: 'B' },
  '905C':   { line: '5',   col: 'C' },
  '905D':   { line: '5',   col: 'D' },
  '906B':   { line: '6',   col: 'B' },
  '906C':   { line: '6',   col: 'C' },
  '906D':   { line: '6',   col: 'D' },
  '907B':   { line: '7',   col: 'B' },
  '907C':   { line: '7',   col: 'C' },
  '907D':   { line: '7',   col: 'D' },
  '908B':   { line: '8',   col: 'B' },
  '908C':   { line: '8',   col: 'C' },
  '908D':   { line: '8',   col: 'D' },
  '909B':   { line: '9',   col: 'B' },
  '909C':   { line: '9',   col: 'C' },
  '909D':   { line: '9',   col: 'D' },
  '910B':   { line: '10',  col: 'B' },
  '910C':   { line: '10',  col: 'C' },
  '910D':   { line: '10',  col: 'D' },
  '911AB':  { line: '11a', col: 'B' },
  '911AC':  { line: '11a', col: 'C' },
  '911AD':  { line: '11a', col: 'D' },
  '911BB':  { line: '11b', col: 'B' },
  '911BC':  { line: '11b', col: 'C' },
  '911BD':  { line: '11b', col: 'D' },
  '911CB':  { line: '11c', col: 'B' },
  '911CC':  { line: '11c', col: 'C' },
  '911CD':  { line: '11c', col: 'D' },
  '911DB':  { line: '11d', col: 'B' },
  '911DC':  { line: '11d', col: 'C' },
  '911DD':  { line: '11d', col: 'D' },
  '911ED':  { line: '11e', col: 'D' },  // only col D on the form
  '911FB':  { line: '11f', col: 'B' },
  '911FC':  { line: '11f', col: 'C' },
  '911FD':  { line: '11f', col: 'D' },
  '911GB':  { line: '11g', col: 'B' },
  '911GC':  { line: '11g', col: 'C' },
  '911GD':  { line: '11g', col: 'D' },
  '912B':   { line: '12',  col: 'B' },
  '912C':   { line: '12',  col: 'C' },
  '912D':   { line: '12',  col: 'D' },
  '913B':   { line: '13',  col: 'B' },
  '913C':   { line: '13',  col: 'C' },
  '913D':   { line: '13',  col: 'D' },
  '914B':   { line: '14',  col: 'B' },
  '914C':   { line: '14',  col: 'C' },
  '914D':   { line: '14',  col: 'D' },
  '915B':   { line: '15',  col: 'B' },
  '915C':   { line: '15',  col: 'C' },
  '915D':   { line: '15',  col: 'D' },
  '916B':   { line: '16',  col: 'B' },
  '916C':   { line: '16',  col: 'C' },
  '916D':   { line: '16',  col: 'D' },
  '917B':   { line: '17',  col: 'B' },
  '917C':   { line: '17',  col: 'C' },
  '917D':   { line: '17',  col: 'D' },
  '918B':   { line: '18',  col: 'B' },
  '918C':   { line: '18',  col: 'C' },
  '918D':   { line: '18',  col: 'D' },
  '919B':   { line: '19',  col: 'B' },
  '919C':   { line: '19',  col: 'C' },
  '919D':   { line: '19',  col: 'D' },
  '920B':   { line: '20',  col: 'B' },
  '920C':   { line: '20',  col: 'C' },
  '920D':   { line: '20',  col: 'D' },
  '921B':   { line: '21',  col: 'B' },
  '921C':   { line: '21',  col: 'C' },
  '921D':   { line: '21',  col: 'D' },
  '922B':   { line: '22',  col: 'B' },
  '922B.A': { line: '22',  col: 'B' },  // Depletion – same line as Depreciation
  '922C':   { line: '22',  col: 'C' },
  '922C.A': { line: '22',  col: 'C' },
  '922D':   { line: '22',  col: 'D' },
  '922D.A': { line: '22',  col: 'D' },
  '923B':   { line: '23',  col: 'B' },
  '923C':   { line: '23',  col: 'C' },
  '923D':   { line: '23',  col: 'D' },
  '924B':   { line: '24',  col: 'B' },
  '924C':   { line: '24',  col: 'C' },
  '924D':   { line: '24',  col: 'D' },
  '924FB':  { line: '24f', col: 'B' },
  '924FC':  { line: '24f', col: 'C' },
  '924FD':  { line: '24f', col: 'D' },
}

// Part IX line definitions
// cGreyed / dGreyed: columns C and D are greyed out on the actual Form 990
// bGreyed / cGreyed for 11e: only col D is enterable
// isHeader: display-only section label row with no values
// isTotal: Line 25 – sum of all other lines
const PART_IX_LINES = [
  { key: '1',   num: '1',   label: 'Grants and other assistance to domestic organizations and domestic governments', cGreyed: true, dGreyed: true },
  { key: '2',   num: '2',   label: 'Grants and other assistance to domestic individuals', cGreyed: true, dGreyed: true },
  { key: '3',   num: '3',   label: 'Grants and other assistance to foreign organizations, foreign governments, and foreign individuals', cGreyed: true, dGreyed: true },
  { key: '4',   num: '4',   label: 'Benefits paid to or for members', cGreyed: true, dGreyed: true },
  { key: '5',   num: '5',   label: 'Compensation of current officers, directors, trustees, and key employees' },
  { key: '6',   num: '6',   label: 'Compensation not included above, to disqualified persons' },
  { key: '7',   num: '7',   label: 'Other salaries and wages' },
  { key: '8',   num: '8',   label: 'Pension plan accruals and contributions' },
  { key: '9',   num: '9',   label: 'Other employee benefits' },
  { key: '10',  num: '10',  label: 'Payroll taxes' },
  { key: '_11', num: '11',  label: 'Fees for services (nonemployees):', isHeader: true },
  { key: '11a', num: '11a', label: 'Management', indent: true },
  { key: '11b', num: '11b', label: 'Legal', indent: true },
  { key: '11c', num: '11c', label: 'Accounting', indent: true },
  { key: '11d', num: '11d', label: 'Lobbying', indent: true },
  { key: '11e', num: '11e', label: 'Professional fundraising services', indent: true, bGreyed: true, cGreyed: true },
  { key: '11f', num: '11f', label: 'Investment management fees', indent: true },
  { key: '11g', num: '11g', label: 'Other', indent: true },
  { key: '12',  num: '12',  label: 'Advertising and promotion' },
  { key: '13',  num: '13',  label: 'Office expenses' },
  { key: '14',  num: '14',  label: 'Information technology' },
  { key: '15',  num: '15',  label: 'Royalties' },
  { key: '16',  num: '16',  label: 'Occupancy' },
  { key: '17',  num: '17',  label: 'Travel' },
  { key: '18',  num: '18',  label: 'Payments of travel or entertainment expenses for any federal, state, or local public officials' },
  { key: '19',  num: '19',  label: 'Conferences, conventions, and meetings' },
  { key: '20',  num: '20',  label: 'Interest' },
  { key: '21',  num: '21',  label: 'Payments to affiliates' },
  { key: '22',  num: '22',  label: 'Depreciation, depletion, and amortization' },
  { key: '23',  num: '23',  label: 'Insurance' },
  { key: '_24', num: '24',  label: 'Other expenses:', isHeader: true },
  { key: '24',  num: '24',  label: 'Other expenses', indent: true },
  { key: '24f', num: '24f', label: 'All other expenses', indent: true },
  { key: '25',  num: '25',  label: 'Total functional expenses. Add lines 1 through 24e', isTotal: true },
]

function computeTotals(accounts, allocationMethods) {
  const totals = {}

  accounts.forEach(acc => {
    if (!acc.taxGroup) return

    // TBA account with line + method set
    if (acc.taxGroup === 'TBA') {
      if (!acc.tbaLine || !acc.tbaMethodId) return
      const method = allocationMethods.find(m => m.id === acc.tbaMethodId)
      if (!method) return
      if (!totals[acc.tbaLine]) totals[acc.tbaLine] = { B: 0, C: 0, D: 0 }
      totals[acc.tbaLine].B += acc.cy * method.pctB / 100
      totals[acc.tbaLine].C += acc.cy * method.pctC / 100
      totals[acc.tbaLine].D += acc.cy * method.pctD / 100
      return
    }

    // Directly mapped account
    const mapping = TAX_GROUP_MAPPING[acc.taxGroup]
    if (!mapping) return
    const { line, col } = mapping
    if (!totals[line]) totals[line] = { B: 0, C: 0, D: 0 }
    totals[line][col] += acc.cy
  })

  return totals
}

function fmt(n) {
  if (n === 0) return '—'
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function fmtTotal(n) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function Form990PartIX({ accounts, allocationMethods }) {
  const totals = computeTotals(accounts, allocationMethods)

  // Compute grand totals for Line 25 (all data lines, excluding header/total rows)
  const dataLines = PART_IX_LINES.filter(l => !l.isHeader && !l.isTotal)
  const grandB = dataLines.reduce((s, l) => s + (totals[l.key]?.B || 0), 0)
  const grandC = dataLines.reduce((s, l) => s + (totals[l.key]?.C || 0), 0)
  const grandD = dataLines.reduce((s, l) => s + (totals[l.key]?.D || 0), 0)
  const grandA = grandB + grandC + grandD

  // Unallocated = TBA without both line + method, or completely unassigned
  const unallocated = accounts.filter(a =>
    !a.taxGroup || (a.taxGroup === 'TBA' && (!a.tbaLine || !a.tbaMethodId))
  )
  const unallocatedTotal = unallocated.reduce((s, a) => s + a.cy, 0)

  return (
    <div className="f990-wrapper">
      <div className="f990-header">
        <div>
          <div className="f990-form-label">Form 990</div>
          <h1 className="f990-title">Part IX – Statement of Functional Expenses</h1>
          <p className="f990-subtitle">
            Section 501(c)(3) and 501(c)(4) organizations must complete all columns.
            All other organizations must complete column (A).
          </p>
        </div>
        {unallocatedTotal > 0 && (
          <div className="f990-warning">
            ⚠ {unallocated.length} account{unallocated.length !== 1 ? 's' : ''} (
            {unallocatedTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })})
            {' '}not yet mapped to a tax group
          </div>
        )}
      </div>

      <div className="f990-table-container">
        <table className="f990-table">
          <thead>
            <tr className="f990-col-header">
              <th className="col-line"></th>
              <th className="col-desc"></th>
              <th className="col-amount">
                <div className="col-label">(A)</div>
                <div className="col-sublabel">Total expenses</div>
              </th>
              <th className="col-amount">
                <div className="col-label">(B)</div>
                <div className="col-sublabel">Program service expenses</div>
              </th>
              <th className="col-amount">
                <div className="col-label">(C)</div>
                <div className="col-sublabel">Management and general expenses</div>
              </th>
              <th className="col-amount">
                <div className="col-label">(D)</div>
                <div className="col-sublabel">Fundraising expenses</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {PART_IX_LINES.map(line => {
              if (line.isHeader) {
                return (
                  <tr key={line.key} className="f990-section-header">
                    <td className="col-line">{line.num}.</td>
                    <td className="col-desc" colSpan={5}>{line.label}</td>
                  </tr>
                )
              }

              if (line.isTotal) {
                return (
                  <tr key={line.key} className="f990-total-row">
                    <td className="col-line">{line.num}</td>
                    <td className="col-desc">{line.label}</td>
                    <td className="col-amount">{fmtTotal(grandA)}</td>
                    <td className="col-amount">{fmtTotal(grandB)}</td>
                    <td className="col-amount">{fmtTotal(grandC)}</td>
                    <td className="col-amount">{fmtTotal(grandD)}</td>
                  </tr>
                )
              }

              const b = totals[line.key]?.B || 0
              const c = totals[line.key]?.C || 0
              const d = totals[line.key]?.D || 0
              const a = b + c + d

              const hasValue = a > 0

              return (
                <tr key={line.key} className={`f990-data-row ${hasValue ? 'has-value' : ''}`}>
                  <td className="col-line">{line.num}.</td>
                  <td className={`col-desc ${line.indent ? 'indented' : ''}`}>{line.label}</td>
                  <td className="col-amount">{fmt(a)}</td>
                  <td className={`col-amount ${line.bGreyed ? 'greyed' : ''}`}>
                    {line.bGreyed ? '' : fmt(b)}
                  </td>
                  <td className={`col-amount ${line.cGreyed ? 'greyed' : ''}`}>
                    {line.cGreyed ? '' : fmt(c)}
                  </td>
                  <td className={`col-amount ${line.dGreyed ? 'greyed' : ''}`}>
                    {line.dGreyed ? '' : fmt(d)}
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
