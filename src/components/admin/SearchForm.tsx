export type SearchState = { name: string; ssn: string; email: string }

interface Props {
  search: SearchState
  onSearchChange: React.Dispatch<React.SetStateAction<SearchState>>
  onSearch: () => void
}

export default function SearchForm({ search, onSearchChange, onSearch }: Props) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="border-2 border-[#eee] relative px-3.75 pt-3.75 pb-2.5">
      <div className="absolute -top-2.5 left-0 bg-white text-[#999] px-2.5 text-xs">Search Box</div>
      <div className="flex gap-2 items-end">
        <div className="form-group flex-1">
          <label>이름</label>
          <input
            type="text"
            value={search.name}
            onChange={(e) => onSearchChange((s) => ({ ...s, name: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder="이름을 입력해주세요."
          />
        </div>
        <div className="form-group flex-1">
          <label>주민번호</label>
          <input
            type="text"
            value={search.ssn}
            onChange={(e) => onSearchChange((s) => ({ ...s, ssn: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder="주민번호를 '-' 제외하고 입력해주세요."
          />
        </div>
        <div className="form-group flex-1">
          <label>이메일</label>
          <input
            type="text"
            value={search.email}
            onChange={(e) => onSearchChange((s) => ({ ...s, email: e.target.value }))}
            onKeyDown={handleKeyDown}
            placeholder="이메일을 입력해주세요."
          />
        </div>
        <div className="form-group">
          <label className="invisible select-none">_</label>
          <button className="btn w-full" onClick={onSearch}>
            검색하기
          </button>
        </div>
      </div>
    </div>
  )
}
