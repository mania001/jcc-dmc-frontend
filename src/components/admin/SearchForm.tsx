export type SearchState = { name: string; ssn: string; email: string }

interface Props {
  search: SearchState
  onSearchChange: React.Dispatch<React.SetStateAction<SearchState>>
  onSearch: () => void
  onReset: () => void
}

const inputClass = 'py-1.5 px-2 border border-[#ccc] rounded text-sm'
const labelClass = 'block text-[0.8em] text-[#444] mb-0.75 font-medium'

export default function SearchForm({ search, onSearchChange, onSearch, onReset }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <div>
        <label className={labelClass}>성명</label>
        <input
          type="text"
          value={search.name}
          onChange={(e) => onSearchChange((s) => ({ ...s, name: e.target.value }))}
          onKeyDown={handleKeyDown}
          placeholder="성명 검색"
          className={`${inputClass} w-35`}
        />
      </div>
      <div>
        <label className={labelClass}>주민번호 앞자리</label>
        <input
          type="text"
          value={search.ssn}
          onChange={(e) => onSearchChange((s) => ({ ...s, ssn: e.target.value }))}
          onKeyDown={handleKeyDown}
          placeholder="앞자리"
          className={`${inputClass} w-32.5`}
        />
      </div>
      <div>
        <label className={labelClass}>이메일</label>
        <input
          type="text"
          value={search.email}
          onChange={(e) => onSearchChange((s) => ({ ...s, email: e.target.value }))}
          onKeyDown={handleKeyDown}
          placeholder="이메일 검색"
          className={`${inputClass} w-40`}
        />
      </div>
      <button className="btn py-1.75 px-4" onClick={onSearch}>
        검색
      </button>
      <button
        onClick={onReset}
        className="py-1.75 px-4 border border-[#ccc] rounded bg-white cursor-pointer text-sm font-[inherit]"
      >
        초기화
      </button>
    </div>
  )
}
