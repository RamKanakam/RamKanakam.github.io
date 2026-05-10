import type { Category, SortDirection } from '../types'
import { categoryOptions } from '../data/works'

type FilterTrayProps = {
  activeCategory: Category
  sortDirection: SortDirection
  onCategoryChange: (cat: Category) => void
  onSortToggle: () => void
}

export function FilterTray({ activeCategory, sortDirection, onCategoryChange, onSortToggle }: FilterTrayProps) {
  return (
    <div className="filter-tray" aria-label="Filter and sort works">
      {categoryOptions.map((option) => (
        <button
          aria-pressed={activeCategory === option.value}
          className={`filter-button ${activeCategory === option.value ? 'active' : ''}`}
          key={option.value}
          onClick={() => onCategoryChange(option.value)}
          type="button"
        >
          <span aria-hidden="true" className="filter-button__icon">{option.icon}</span>
          <span>{option.label}</span>
        </button>
      ))}
      <button
        className="filter-button filter-button--sort"
        onClick={onSortToggle}
        type="button"
      >
        <span aria-hidden="true" className="filter-button__icon">
          {sortDirection === 'newest' ? '↓' : '↑'}
        </span>
        <span>{sortDirection === 'newest' ? 'Newest' : 'Oldest'}</span>
      </button>
    </div>
  )
}
