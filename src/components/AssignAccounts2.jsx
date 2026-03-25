import { useState, useRef } from 'react'
import './AssignAccounts2.css'

const TAX_GROUPS = [
  { value: 'TBA',    label: '990 Part IX to be allocated' },
  { value: '901',    label: '901 \u2014 Grants in US-Governments-990' },
  { value: '902',    label: '902 \u2014 Grants in US-Individuals-990' },
  { value: '903',    label: '903 \u2014 Grants outside US-990' },
  { value: '904',    label: '904 \u2014 Benefits paid to/for members-990' },
  { value: '905B',   label: '905B \u2014 Comp.of officers-ProgServ-990' },
  { value: '905C',   label: '905C \u2014 Comp.of officers-Mngmnt-990' },
  { value: '905D',   label: '905D \u2014 Comp.of officers-Fndrsng-990' },
  { value: '906B',   label: '906B \u2014 Comp.disqual.pers-ProgServ-990' },
  { value: '906C',   label: '906C \u2014 Comp.disqual.pers-Mngmnt-990' },
  { value: '906D',   label: '906D \u2014 Comp.disqual.pers-Fndrsng-990' },
  { value: '907B',   label: '907B \u2014 Oth.salaries&wages-ProgServ-990' },
  { value: '907C',   label: '907C \u2014 Oth.salaries&wages-Mngmnt-990' },
  { value: '907D',   label: '907D \u2014 Oth.salaries&wages-Fndrsng-990' },
  { value: '908B',   label: '908B \u2014 Pension plan contr-ProgServ-990' },
  { value: '908C',   label: '908C \u2014 Pension plan contr-Mngmnt-990' },
  { value: '908D',   label: '908D \u2014 Pension plan contr-Fndrsng-990' },
  { value: '909B',   label: '909B \u2014 Oth emp benefits-ProgServ-990' },
  { value: '909C',   label: '909C \u2014 Oth emp benefits-Mngmnt-990' },
  { value: '909D',   label: '909D \u2014 Oth emp benefits-Fndrsng-990' },
  { value: '910B',   label: '910B \u2014 Payroll taxes-ProgServ-990' },
  { value: '910C',   label: '910C \u2014 Payroll taxes-Mngmnt-990' },
  { value: '910D',   label: '910D \u2014 Payroll taxes-Fndrsng-990' },
  { value: '911AB',  label: '911AB \u2014 Management fees-ProgServ-990' },
  { value: '911AC',  label: '911AC \u2014 Management fees-Mngmnt-990' },
  { value: '911AD',  label: '911AD \u2014 Management fees-Fndrsng-990' },
  { value: '911BB',  label: '911BB \u2014 Legal fees-ProgServ-990' },
  { value: '911BC',  label: '911BC \u2014 Legal fees-Mngmnt-990' },
  { value: '911BD',  label: '911BD \u2014 Legal fees-Fndrsng-990' },
  { value: '911CB',  label: '911CB \u2014 Accounting fees-ProgServ-990' },
  { value: '911CC',  label: '911CC \u2014 Accounting fees-Mngmnt-990' },
  { value: '911CD',  label: '911CD \u2014 Accounting fees-Fndrsng-990' },
  { value: '911DB',  label: '911DB \u2014 Lobbying fees-ProgServ-990' },
  { value: '911DC',  label: '911DC \u2014 Lobbying fees-Mngmnt-990' },
  { value: '911DD',  label: '911DD \u2014 Lobbying fees-Fndrsng-990' },
  { value: '911ED',  label: '911ED \u2014 Professional fundraising fees-990' },
  { value: '911FB',  label: '911FB \u2014 Invest. mgmt fees-ProgServ-990' },
  { value: '911FC',  label: '911FC \u2014 Invest. mgmt fees-Mngmnt-990' },
  { value: '911FD',  label: '911FD \u2014 Invest. mgmt fees-Fndrsng-990' },
  { value: '911GB',  label: '911GB \u2014 Other fees-ProgServ-990' },
  { value: '911GC',  label: '911GC \u2014 Other fees-Mngmnt-990' },
  { value: '911GD',  label: '911GD \u2014 Other fees-Fndrsng-990' },
  { value: '912B',   label: '912B \u2014 Advertising-ProgServ-990' },
  { value: '912C',   label: '912C \u2014 Advertising-Mngmnt-990' },
  { value: '912D',   label: '912D \u2014 Advertising-Fndrsng-990' },
  { value: '913B',   label: '913B \u2014 Office expenses-ProgServ-990' },
  { value: '913C',   label: '913C \u2014 Office expenses-Mngmnt-990' },
  { value: '913D',   label: '913D \u2014 Office expenses-Fndrsng-990' },
  { value: '914B',   label: '914B \u2014 Information tech.-ProgServ-990' },
  { value: '914C',   label: '914C \u2014 Information tech.-Mngmnt-990' },
  { value: '914D',   label: '914D \u2014 Information tech.-Fndrsng-990' },
  { value: '915B',   label: '915B \u2014 Royalties-ProgServ-990' },
  { value: '915C',   label: '915C \u2014 Royalties-Mngmnt-990' },
  { value: '915D',   label: '915D \u2014 Royalties-Fndrsng-990' },
  { value: '916B',   label: '916B \u2014 Occupancy-ProgServ-990' },
  { value: '916C',   label: '916C \u2014 Occupancy-Mngmnt-990' },
  { value: '916D',   label: '916D \u2014 Occupancy-Fndrsng-990' },
  { value: '917B',   label: '917B \u2014 Travel-ProgServ-990' },
  { value: '917C',   label: '917C \u2014 Travel-Mngmnt-990' },
  { value: '917D',   label: '917D \u2014 Travel-Fndrsng-990' },
  { value: '918B',   label: '918B \u2014 Payments T&E exps.-ProgServ-990' },
  { value: '918C',   label: '918C \u2014 Payments T&E exps.-Mngmnt-990' },
  { value: '918D',   label: '918D \u2014 Payments T&E exps.-Fndrsng-990' },
  { value: '919B',   label: '919B \u2014 Conferences & mtgs-ProgServ-990' },
  { value: '919C',   label: '919C \u2014 Conferences & mtgs-Mngmnt-990' },
  { value: '919D',   label: '919D \u2014 Conferences & mtgs-Fndrsng-990' },
  { value: '920B',   label: '920B \u2014 Interest expenses-ProgServ-990' },
  { value: '920C',   label: '920C \u2014 Interest expenses-Mngmnt-990' },
  { value: '920D',   label: '920D \u2014 Interest expenses-Fndrsng-990' },
  { value: '921B',   label: '921B \u2014 Pymts to affiliates-ProgServ-990' },
  { value: '921C',   label: '921C \u2014 Pymts to affiliates-Mngmnt-990' },
  { value: '921D',   label: '921D \u2014 Pymts to affiliates-Fndrsng-990' },
  { value: '922B',   label: '922B \u2014 Depreciation(ovrd)-ProgServ-990' },
  { value: '922B.A', label: '922B.A \u2014 Depletion-ProgServ-990' },
  { value: '922C',   label: '922C \u2014 Depreciation(ovrd)-Mngmnt-990' },
  { value: '922C.A', label: '922C.A \u2014 Depletion-Mngmnt-990' },
  { value: '922D',   label: '922D \u2014 Depreciation(ovrd)-Fndrsng-990' },
  { value: '922D.A', label: '922D.A \u2014 Depletion-Fndrsng-990' },
  { value: '923B',   label: '923B \u2014 Insurance-ProgServ-990' },
  { value: '923C',   label: '923C \u2014 Insurance-Mngmnt-990' },
  { value: '923D',   label: '923D \u2014 Insurance-Fndrsng-990' },
  { value: '924B',   label: '924B \u2014 Other expenses-ProgServ-990' },
  { value: '924C',   label: '924C \u2014 Other expenses-Mngmnt-990' },
  { value: '924D',   label: '924D \u2014 Other expenses-Fndrsng-990' },
  { value: '924FB',  label: '924FB \u2014 All other expenses-ProgServ-990' },
  { value: '924FC',  label: '924FC \u2014 All other expenses-Mngmnt-990' },
  { value: '924FD',  label: '924FD \u2014 All other expenses-Fndrsng-990' },
]

const CY_LABEL = '12/31/2023'
const PY_LABEL = '12/31/2022'

function fmt(n) {
  return Math.round(n).toLocaleString('en-US')
}

function getDesc(label) {
  const idx = label.indexOf(' \u2014 ')
  return idx >= 0 ? label.slice(idx + 3) : label
}

export default function AssignAccounts2({ accounts, onTaxGroupChange }) {
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [selectedChipIds, setSelectedChipIds] = useState(new Set())
  const [hoveredGroup, setHoveredGroup] = useState(null)
  const [dragAccountId, setDragAccountId] = useState(null)
  const [dragOverGroup, setDragOverGroup] = useState(null)
  const [dragOverLeft, setDragOverLeft] = useState(false)
  const [leftSearch, setLeftSearch] = useState('')
  const [rightSearch, setRightSearch] = useState('')
  const lastIdxRef = useRef(null)
  const lastChipIdxRef = useRef(null)

  const unassigned = accounts.filter(a => !a.taxGroup)
  const assignedCount = accounts.filter(a => a.taxGroup).length

  const lq = leftSearch.trim().toLowerCase()
  const filteredUnassigned = lq
    ? unassigned.filter(a =>
        a.accountNumber.toLowerCase().includes(lq) ||
        a.accountName.toLowerCase().includes(lq)
      )
    : unassigned

  const rq = rightSearch.trim().toLowerCase()
  const filteredGroups = rq
    ? TAX_GROUPS.filter(g =>
        g.value.toLowerCase().includes(rq) ||
        g.label.toLowerCase().includes(rq) ||
        accounts.some(a => a.taxGroup === g.value && (
          a.accountNumber.toLowerCase().includes(rq) ||
          a.accountName.toLowerCase().includes(rq)
        ))
      )
    : TAX_GROUPS

  const allAssignedFlat = filteredGroups.flatMap(g =>
    accounts.filter(a => a.taxGroup === g.value)
  )

  // ── Selection ──────────────────────────────────────────────────────────────

  const handleCardClick = (acc, idx, e) => {
    e.preventDefault()
    if (e.shiftKey && lastIdxRef.current !== null) {
      const lo = Math.min(lastIdxRef.current, idx)
      const hi = Math.max(lastIdxRef.current, idx)
      setSelectedIds(prev => {
        const next = new Set(prev)
        filteredUnassigned.slice(lo, hi + 1).forEach(a => next.add(a.id))
        return next
      })
    } else if (e.ctrlKey || e.metaKey) {
      setSelectedIds(prev => {
        const next = new Set(prev)
        next.has(acc.id) ? next.delete(acc.id) : next.add(acc.id)
        return next
      })
      lastIdxRef.current = idx
    } else {
      setSelectedIds(new Set([acc.id]))
      lastIdxRef.current = idx
    }
  }

  // ── Assign / Unassign ──────────────────────────────────────────────────────

  const assignToGroup = (groupValue) => {
    ;[...selectedIds].forEach(id => onTaxGroupChange(id, groupValue))
    setSelectedIds(new Set())
  }

  const unassignAccount = (id) => {
    onTaxGroupChange(id, '')
    setSelectedChipIds(prev => { const n = new Set(prev); n.delete(id); return n })
  }

  const unassignSelected = () => {
    ;[...selectedChipIds].forEach(id => onTaxGroupChange(id, ''))
    setSelectedChipIds(new Set())
  }

  const handleChipClick = (acc, flatIdx, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.shiftKey && lastChipIdxRef.current !== null) {
      const lo = Math.min(lastChipIdxRef.current, flatIdx)
      const hi = Math.max(lastChipIdxRef.current, flatIdx)
      setSelectedChipIds(prev => {
        const next = new Set(prev)
        allAssignedFlat.slice(lo, hi + 1).forEach(a => next.add(a.id))
        return next
      })
    } else if (e.ctrlKey || e.metaKey) {
      setSelectedChipIds(prev => {
        const next = new Set(prev)
        next.has(acc.id) ? next.delete(acc.id) : next.add(acc.id)
        return next
      })
      lastChipIdxRef.current = flatIdx
    } else {
      setSelectedChipIds(new Set([acc.id]))
      lastChipIdxRef.current = flatIdx
    }  }

  // ── Drag from left pane ────────────────────────────────────────────────────

  const handleDragFromLeft = (acc) => {
    setDragAccountId(acc.id)
    // If the dragged card isn't already in the selection, select just it
    if (!selectedIds.has(acc.id)) {
      setSelectedIds(new Set([acc.id]))
      lastIdxRef.current = unassigned.findIndex(a => a.id === acc.id)
    }
  }

  // ── Drag from right pane chip ──────────────────────────────────────────────

  const handleDragFromRight = (e, accId) => {
    e.stopPropagation()
    setDragAccountId(accId)
    if (!selectedChipIds.has(accId)) setSelectedChipIds(new Set([accId]))
    setSelectedIds(new Set())
  }

  // ── Drop handlers ──────────────────────────────────────────────────────────

  const handleDropOnGroup = (groupValue) => {
    if (dragAccountId === null) return
    const acc = accounts.find(a => a.id === dragAccountId)
    if (!acc) return

    if (!acc.taxGroup) {
      // Dragged from left pane – assign all currently selected accounts
      ;[...selectedIds].forEach(id => onTaxGroupChange(id, groupValue))
      setSelectedIds(new Set())
    } else {
      // Dragged from right pane chip – reassign all selected chips
      const toMove = selectedChipIds.has(dragAccountId) && selectedChipIds.size > 0
        ? [...selectedChipIds]
        : [dragAccountId]
      toMove.forEach(id => onTaxGroupChange(id, groupValue))
      setSelectedChipIds(new Set())
    }
    setDragAccountId(null)
    setDragOverGroup(null)
  }

  const handleDropOnLeft = () => {
    if (dragAccountId !== null) {
      const acc = accounts.find(a => a.id === dragAccountId)
      if (acc && acc.taxGroup) {
        const toUnassign = selectedChipIds.has(dragAccountId) && selectedChipIds.size > 0
          ? [...selectedChipIds]
          : [dragAccountId]
        toUnassign.forEach(id => onTaxGroupChange(id, ''))
        setSelectedChipIds(new Set())
      }
    }
    setDragAccountId(null)
    setDragOverLeft(false)
  }

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="aa2-wrapper">
      <div className="aa2-header">
        <div>
          <h1 className="aa2-title">
            Assign Accounts
            <span className="aa2-v-badge">Taxflow 2.0</span>
          </h1>
          <p className="aa2-subtitle">
            Select accounts on the left and click <strong>Assign</strong> on the target tax group, or drag and drop.
            Use <kbd>Ctrl</kbd>+click or <kbd>Shift</kbd>+click to multi-select in either pane.
          </p>
        </div>
        <span className="aa2-progress">
          {assignedCount} / {accounts.length} assigned
        </span>
      </div>

      <div className="aa2-split">

        {/* ── LEFT PANE ── */}
        <div
          className={`aa2-left-pane${dragOverLeft ? ' drop-ready' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOverLeft(true) }}
          onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverLeft(false) }}
          onDrop={handleDropOnLeft}
        >
          <div className="aa2-pane-head">
            <span className="aa2-pane-label">Unassigned</span>
            <span className="aa2-count-pill">{unassigned.length}</span>
            {selectedIds.size > 0 && (
              <span className="aa2-sel-pill">{selectedIds.size} selected</span>
            )}
          </div>
          <div className="aa2-search-bar">
            <input
              className="aa2-search-input"
              type="text"
              placeholder="Search"
              value={leftSearch}
              onChange={e => setLeftSearch(e.target.value)}
            />
            {leftSearch && <button className="aa2-search-clear" onClick={() => setLeftSearch('')}>&times;</button>}
          </div>

          {unassigned.length === 0 ? (
            <div className="aa2-all-done">\u2713 All accounts assigned</div>
          ) : filteredUnassigned.length === 0 ? (
            <div className="aa2-no-results">No matches for "{leftSearch}"</div>
          ) : (
            <ul className="aa2-card-list">
              {filteredUnassigned.map((acc, idx) => (
                <li
                  key={acc.id}
                  className={`aa2-card${selectedIds.has(acc.id) ? ' sel' : ''}`}
                  onClick={e => handleCardClick(acc, idx, e)}
                  draggable
                  onDragStart={() => handleDragFromLeft(acc)}
                  onDragEnd={() => setDragAccountId(null)}
                >
                  <span className="card-num">{acc.accountNumber}</span>
                  <span className="card-name">{acc.accountName}</span>
                  <span className="card-bal">{fmt(acc.cy)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── RIGHT PANE ── */}
        <div className="aa2-right-pane">
          <div className="aa2-pane-head aa2-right-head">
            <span className="aa2-pane-label">Tax Groups</span>
            {selectedChipIds.size > 0 && (
              <>
                <span className="aa2-sel-pill">{selectedChipIds.size} selected</span>
                <button className="aa2-unassign-sel-btn" onClick={unassignSelected}>
                  Unassign ({selectedChipIds.size})
                </button>
              </>
            )}
            <span className="aa2-col-head">{CY_LABEL}</span>
            <span className="aa2-col-head">{PY_LABEL}</span>
            <span className="aa2-col-head-action" />
          </div>
          <div className="aa2-search-bar">
            <input
              className="aa2-search-input"
              type="text"
              placeholder="Search"
              value={rightSearch}
              onChange={e => setRightSearch(e.target.value)}
            />
            {rightSearch && <button className="aa2-search-clear" onClick={() => setRightSearch('')}>&times;</button>}
          </div>

          <div className="aa2-group-scroll">
            {filteredGroups.map(group => {
              const assigned = accounts.filter(a => a.taxGroup === group.value)
              const cyTotal = assigned.reduce((s, a) => s + a.cy, 0)
              const pyTotal = assigned.reduce((s, a) => s + a.py, 0)
              const isOver = dragOverGroup === group.value
              const isHov  = hoveredGroup === group.value
              const canAssign = selectedIds.size > 0 && isHov

              return (
                <div
                  key={group.value}
                  className={`aa2-group${assigned.length ? ' populated' : ''}${isOver ? ' drag-on' : ''}`}
                  onMouseEnter={() => setHoveredGroup(group.value)}
                  onMouseLeave={() => setHoveredGroup(null)}
                  onDragOver={e => { e.preventDefault(); setDragOverGroup(group.value) }}
                  onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOverGroup(null) }}
                  onDrop={() => handleDropOnGroup(group.value)}
                >
                  <div className="aa2-group-inner">
                    <span className="g-code">{group.value}</span>
                    <span className="g-desc">{getDesc(group.label)}</span>
                    <span className="g-cy">{cyTotal ? fmt(cyTotal) : '\u2014'}</span>
                    <span className="g-py">{pyTotal ? fmt(pyTotal) : '\u2014'}</span>
                    <span className="g-action">
                      {canAssign && (
                        <button
                          className="aa2-assign-btn"
                          onClick={() => assignToGroup(group.value)}
                        >
                          Assign{selectedIds.size > 1 ? ` (${selectedIds.size})` : ''}
                        </button>
                      )}
                    </span>
                  </div>

                  {assigned.length > 0 && (
                    <div className="aa2-chips">
                      {assigned.map(acc => {
                        const flatIdx = allAssignedFlat.findIndex(a => a.id === acc.id)
                        return (
                          <div
                            key={acc.id}
                            className={`aa2-chip${selectedChipIds.has(acc.id) ? ' sel' : ''}`}
                            draggable
                            onClick={e => handleChipClick(acc, flatIdx, e)}
                            onDragStart={e => handleDragFromRight(e, acc.id)}
                            onDragEnd={() => setDragAccountId(null)}
                          >
                            <span className="chip-num">{acc.accountNumber}</span>
                            <span className="chip-name">{acc.accountName}</span>
                            <span className="chip-bal">{fmt(acc.cy)}</span>
                            <button
                              className="chip-remove"
                              onClick={e => { e.stopPropagation(); unassignAccount(acc.id) }}
                              title="Remove assignment"
                            >&times;</button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
