import { useState } from 'react'
import './AllocationMethods.css'

function generateId() {
  return Date.now() + Math.random()
}

const METHOD_TYPES = [
  { value: 'direct_pct', label: 'Direct %' },
  { value: 'sq_feet',    label: '# of Square Feet' },
  { value: 'employees',  label: '# of Employees' },
]

const BUCKET_LABELS = [
  { key: 'B', colorClass: 'col-b', label: 'Program services' },
  { key: 'C', colorClass: 'col-c', label: 'Management & general' },
  { key: 'D', colorClass: 'col-d', label: 'Fundraising' },
]

function emptyForm() {
  return { name: '', type: 'direct_pct', valB: '', valC: '', valD: '' }
}

// Compute pct from raw values for a given type
function computePcts(type, valB, valC, valD) {
  const b = parseFloat(valB) || 0
  const c = parseFloat(valC) || 0
  const d = parseFloat(valD) || 0
  if (type === 'direct_pct') {
    return { pctB: b, pctC: c, pctD: d }
  }
  const total = b + c + d
  if (total === 0) return { pctB: 0, pctC: 0, pctD: 0 }
  return {
    pctB: (b / total) * 100,
    pctC: (c / total) * 100,
    pctD: (d / total) * 100,
  }
}

function typeLabel(type) {
  return METHOD_TYPES.find(t => t.value === type)?.label ?? type
}

function unitLabel(type) {
  if (type === 'sq_feet')   return 'sq ft'
  if (type === 'employees') return 'employees'
  return '%'
}

export default function AllocationMethods({ methods, onChange }) {
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [errors, setErrors] = useState({})

  const openNew = () => {
    setForm(emptyForm())
    setErrors({})
    setEditing('new')
  }

  const openEdit = (m) => {
    setForm({
      name: m.name,
      type: m.type,
      valB: String(m.valB),
      valC: String(m.valC),
      valD: String(m.valD),
    })
    setErrors({})
    setEditing(m.id)
  }

  const cancel = () => { setEditing(null); setErrors({}) }

  const handleTypeChange = (newType) => {
    // Reset values when switching types to avoid confusion
    setForm(f => ({ ...f, type: newType, valB: '', valC: '', valD: '' }))
    setErrors({})
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'

    const b = parseFloat(form.valB)
    const c = parseFloat(form.valC)
    const d = parseFloat(form.valD)

    if (form.type === 'direct_pct') {
      if (isNaN(b) || b < 0) errs.valB = 'Required'
      if (isNaN(c) || c < 0) errs.valC = 'Required'
      if (isNaN(d) || d < 0) errs.valD = 'Required'
      if (!errs.valB && !errs.valC && !errs.valD) {
        const total = b + c + d
        if (Math.abs(total - 100) > 0.001)
          errs.total = `Percentages must sum to 100% (currently ${total.toFixed(2)}%)`
      }
    } else {
      if (isNaN(b) || b < 0 || !Number.isInteger(b)) errs.valB = 'Whole number required'
      if (isNaN(c) || c < 0 || !Number.isInteger(c)) errs.valC = 'Whole number required'
      if (isNaN(d) || d < 0 || !Number.isInteger(d)) errs.valD = 'Whole number required'
      if (!errs.valB && !errs.valC && !errs.valD && (b + c + d) === 0)
        errs.total = 'At least one value must be greater than 0'
    }
    return errs
  }

  const handleSave = () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const { pctB, pctC, pctD } = computePcts(form.type, form.valB, form.valC, form.valD)
    const entry = {
      name: form.name.trim(),
      type: form.type,
      valB: parseFloat(form.valB) || 0,
      valC: parseFloat(form.valC) || 0,
      valD: parseFloat(form.valD) || 0,
      pctB,
      pctC,
      pctD,
    }

    if (editing === 'new') {
      onChange([...methods, { id: generateId(), ...entry }])
    } else {
      onChange(methods.map(m => m.id === editing ? { ...m, ...entry } : m))
    }
    setEditing(null)
  }

  const handleDelete = (id) => onChange(methods.filter(m => m.id !== id))

  // Live preview of computed percentages while filling in the form
  const preview = computePcts(form.type, form.valB, form.valC, form.valD)
  const rawTotal = (parseFloat(form.valB) || 0) + (parseFloat(form.valC) || 0) + (parseFloat(form.valD) || 0)
  const directTotal = rawTotal
  const isDirectValid = form.type === 'direct_pct' && Math.abs(directTotal - 100) < 0.001
  const isCountValid  = form.type !== 'direct_pct' && rawTotal > 0

  return (
    <div className="am-wrapper">
      <div className="am-header">
        <div>
          <h1 className="am-title">Allocation Methods</h1>
          <p className="am-subtitle">
            Define how account balances are split across Form 990 Part IX columns B, C, and D.
            Apply these to accounts mapped as "990 Part IX to be allocated".
          </p>
        </div>
        {editing === null && (
          <button className="am-btn-primary" onClick={openNew}>+ New Method</button>
        )}
      </div>

      {editing !== null && (
        <div className="am-form-card">
          <h2 className="am-form-title">
            {editing === 'new' ? 'New Allocation Method' : 'Edit Allocation Method'}
          </h2>

          <div className="am-form-body">

            {/* Row 1: Name + Type */}
            <div className="am-top-row">
              <div className="am-field am-field-name">
                <label>Method name</label>
                <input
                  className={errors.name ? 'error' : ''}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Office 65/20/15"
                />
                {errors.name && <span className="am-error">{errors.name}</span>}
              </div>

              <div className="am-field am-field-type">
                <label>Method type</label>
                <select
                  className="am-type-select"
                  value={form.type}
                  onChange={e => handleTypeChange(e.target.value)}
                >
                  {METHOD_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2: Bucket inputs */}
            <div className="am-pct-row">
              {BUCKET_LABELS.map(({ key, colorClass, label }) => {
                const valKey = `val${key}`
                const pctVal = preview[`pct${key}`]
                return (
                  <div className="am-field" key={key}>
                    <label>
                      <strong>({key})</strong>
                      {label}
                      {form.type === 'direct_pct' ? ' %' : ` (${unitLabel(form.type)})`}
                    </label>
                    <input
                      type="number"
                      min="0"
                      step={form.type === 'direct_pct' ? '0.01' : '1'}
                      className={errors[valKey] ? 'error' : ''}
                      value={form[valKey]}
                      onChange={e => setForm(f => ({ ...f, [valKey]: e.target.value }))}
                      placeholder="0"
                    />
                    {form.type !== 'direct_pct' && form[valKey] !== '' && !errors[valKey] && rawTotal > 0 && (
                      <span className="am-derived-pct">= {pctVal.toFixed(2)}%</span>
                    )}
                    {errors[valKey] && <span className="am-error">{errors[valKey]}</span>}
                  </div>
                )
              })}

              <div className="am-field am-field-total">
                <label>{form.type === 'direct_pct' ? 'Total' : `Total ${unitLabel(form.type)}`}</label>
                <div className={`am-total-display ${
                  isDirectValid || isCountValid ? 'valid'
                  : rawTotal > 0 ? 'invalid'
                  : ''
                }`}>
                  {form.type === 'direct_pct'
                    ? `${directTotal.toFixed(2)}%`
                    : rawTotal.toLocaleString()
                  }
                </div>
                {form.type !== 'direct_pct' && rawTotal > 0 && (
                  <div className="am-pct-summary">
                    <span className="sp-b-sm">{preview.pctB.toFixed(1)}%</span>
                    {' / '}
                    <span className="sp-c-sm">{preview.pctC.toFixed(1)}%</span>
                    {' / '}
                    <span className="sp-d-sm">{preview.pctD.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>

            {errors.total && <div className="am-error am-error-total">{errors.total}</div>}
          </div>

          <div className="am-form-actions">
            <button className="am-btn-secondary" onClick={cancel}>Cancel</button>
            <button className="am-btn-primary" onClick={handleSave}>Save method</button>
          </div>
        </div>
      )}

      {methods.length === 0 && editing === null ? (
        <div className="am-empty">
          <p>No allocation methods defined yet.</p>
          <p>Create a method to split account balances across Program services, Management & general, and Fundraising columns.</p>
          <button className="am-btn-primary" onClick={openNew}>+ New Method</button>
        </div>
      ) : (
        <div className="am-table-container">
          <table className="am-table">
            <thead>
              <tr>
                <th>Method name</th>
                <th>Method type</th>
                <th><strong>(B)</strong> Program services</th>
                <th><strong>(C)</strong> Management & general</th>
                <th><strong>(D)</strong> Fundraising</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {methods.map(m => (
                <tr key={m.id} className={editing === m.id ? 'row-editing' : ''}>
                  <td className="cell-name">{m.name}</td>
                  <td className="cell-type">
                    <span className="type-badge">{typeLabel(m.type)}</span>
                  </td>
                  <td className="cell-pct">
                    {m.type !== 'direct_pct' && <span className="cell-raw">{m.valB.toLocaleString()} {unitLabel(m.type)} &rarr; </span>}
                    {m.pctB.toFixed(2)}%
                  </td>
                  <td className="cell-pct">
                    {m.type !== 'direct_pct' && <span className="cell-raw">{m.valC.toLocaleString()} {unitLabel(m.type)} &rarr; </span>}
                    {m.pctC.toFixed(2)}%
                  </td>
                  <td className="cell-pct">
                    {m.type !== 'direct_pct' && <span className="cell-raw">{m.valD.toLocaleString()} {unitLabel(m.type)} &rarr; </span>}
                    {m.pctD.toFixed(2)}%
                  </td>
                  <td className="cell-actions">
                    <button className="am-btn-icon" onClick={() => openEdit(m)}>Edit</button>
                    <button className="am-btn-icon danger" onClick={() => handleDelete(m.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

