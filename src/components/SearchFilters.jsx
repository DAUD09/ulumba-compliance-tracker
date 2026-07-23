export default function SearchFilters({
  search,
  onSearchChange,
  assetType,
  onAssetTypeChange,
  documentType,
  onDocumentTypeChange,
  assetTypeOptions,
  documentTypeOptions,
  sortOrder,
  onSortOrderChange,
  onClear,
  resultCount,
}) {
  return (
    <div className="filters-bar">
      <div className="search-field">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Search by registration number…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search by registration number"
        />
        {search && (
          <button className="search-clear" type="button" onClick={() => onSearchChange('')} aria-label="Clear search">
            ×
          </button>
        )}
      </div>

      <select value={assetType} onChange={(e) => onAssetTypeChange(e.target.value)} aria-label="Filter by asset type">
        <option value="ALL">All asset types</option>
        {assetTypeOptions.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select value={documentType} onChange={(e) => onDocumentTypeChange(e.target.value)} aria-label="Filter by document type">
        <option value="ALL">All document types</option>
        {documentTypeOptions.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <select value={sortOrder} onChange={(e) => onSortOrderChange(e.target.value)} aria-label="Sort order">
        <option value="expiry-asc">Expiry: soonest first</option>
        <option value="expiry-desc">Expiry: latest first</option>
        <option value="reg-asc">Reg No: A–Z</option>
      </select>

      <button className="clear-filters" type="button" onClick={onClear}>
        Clear filters
      </button>

      <span className="result-count">{resultCount} result{resultCount === 1 ? '' : 's'}</span>
    </div>
  )
}
