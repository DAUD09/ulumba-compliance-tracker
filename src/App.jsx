import { useMemo, useState } from 'react'
import rawData from './data/complianceData.json'
import { computeLiveStatus } from './utils/dateUtils'
import SummaryCards from './components/SummaryCards'
import SearchFilters from './components/SearchFilters'
import ComplianceTable from './components/ComplianceTable'
import './App.css'

const enrichedData = rawData.map((row) => ({
  ...row,
  liveStatus: computeLiveStatus(row.expiryDate),
}))

const ASSET_TYPE_OPTIONS = [...new Set(enrichedData.map((r) => r.assetType))].sort()
const DOCUMENT_TYPE_OPTIONS = [...new Set(enrichedData.map((r) => r.documentType))].sort()

export default function App() {
  const [search, setSearch] = useState('')
  const [assetType, setAssetType] = useState('ALL')
  const [documentType, setDocumentType] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortOrder, setSortOrder] = useState('expiry-asc')

  const counts = useMemo(() => {
    return {
      total: enrichedData.length,
      valid: enrichedData.filter((r) => r.liveStatus === 'VALID').length,
      expiringSoon: enrichedData.filter((r) => r.liveStatus === 'EXPIRING_SOON').length,
      expired: enrichedData.filter((r) => r.liveStatus === 'EXPIRED').length,
    }
  }, [])

  const filteredRows = useMemo(() => {
    let rows = enrichedData

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      rows = rows.filter((r) => r.regNo.toLowerCase().includes(q))
    }

    if (assetType !== 'ALL') {
      rows = rows.filter((r) => r.assetType === assetType)
    }

    if (documentType !== 'ALL') {
      rows = rows.filter((r) => r.documentType === documentType)
    }

    if (statusFilter !== 'ALL') {
      rows = rows.filter((r) => r.liveStatus === statusFilter)
    }

    rows = [...rows].sort((a, b) => {
      if (sortOrder === 'expiry-asc') return new Date(a.expiryDate) - new Date(b.expiryDate)
      if (sortOrder === 'expiry-desc') return new Date(b.expiryDate) - new Date(a.expiryDate)
      if (sortOrder === 'reg-asc') return a.regNo.localeCompare(b.regNo)
      return 0
    })

    return rows
  }, [search, assetType, documentType, statusFilter, sortOrder])

  function handleClearFilters() {
    setSearch('')
    setAssetType('ALL')
    setDocumentType('ALL')
    setStatusFilter('ALL')
    setSortOrder('expiry-asc')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 32 32">
                <rect width="32" height="32" rx="6" fill="#E8B84B" />
                <path d="M6 22 L12 10 L16 18 L20 8 L26 22" stroke="#0B1F3A" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div>
              <div className="brand-name">Ulumba Logistics</div>
              <div className="brand-sub">Compliance Tracker</div>
            </div>
          </div>
          <div className="header-note">Prototype · fleet &amp; permit document register</div>
        </div>
        <div className="lane-divider" aria-hidden="true" />
      </header>

      <main className="app-main">
        <SummaryCards
          counts={counts}
          activeStatus={statusFilter === 'ALL' ? 'ALL' : statusFilter}
          onSelect={(key) => setStatusFilter(key === 'ALL' ? 'ALL' : key)}
        />

        <SearchFilters
          search={search}
          onSearchChange={setSearch}
          assetType={assetType}
          onAssetTypeChange={setAssetType}
          documentType={documentType}
          onDocumentTypeChange={setDocumentType}
          assetTypeOptions={ASSET_TYPE_OPTIONS}
          documentTypeOptions={DOCUMENT_TYPE_OPTIONS}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onClear={handleClearFilters}
          resultCount={filteredRows.length}
        />

        <ComplianceTable rows={filteredRows} />
      </main>

      <footer className="app-footer">
        DISCLAIMER: Data snapshot loaded at build time from the compliance register. This is a working
        prototype — no data leaves your browser, and nothing is written back to a live system yet.
      </footer>
    </div>
  )
}
