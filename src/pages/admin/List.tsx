import { useState, useEffect, useCallback } from 'react'
import { listOfferings } from '@/services/offeringService'
import type { ListResponse, ListQuery } from '@/types'
import { formatAmount } from '@/utils'
import SearchForm, { type SearchState } from '@/components/admin/SearchForm'
import OfferingTable from '@/components/admin/OfferingTable'
import Pagination from '@/components/comm/Pagination'

const PAGE_SIZE = 25
const pageSizeOptions = [10, 25, 50, 100]
const selectClass = 'py-1 px-1.5 border border-[#ccc] rounded text-[13px] font-[inherit]'

const today = new Date()
const thisYear = today.getFullYear()
const yearOptions = Array.from({ length: thisYear - 2000 }, (_, i) => String(thisYear - i))

function getCurrentYear() {
  const now = new Date()
  return now.getMonth() > 5 ? String(now.getFullYear()) : String(now.getFullYear() - 1)
}

const emptySearch: SearchState = { name: '', ssn: '', email: '' }

export default function List() {
  const [data, setData] = useState<ListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [year, setYear] = useState(getCurrentYear())
  const [search, setSearch] = useState<SearchState>(emptySearch)
  const [applied, setApplied] = useState<SearchState>(emptySearch)

  const isPage = !(applied.name || applied.ssn || applied.email)

  const fetchList = useCallback(async (query: ListQuery) => {
    setLoading(true)
    try {
      const result = await listOfferings(query)
      setData(result)
    } catch {
      alert('목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchList({ year, page, size: pageSize, ...applied, isPage })
  }, [year, page, pageSize, applied, isPage, fetchList])

  const handleSearch = () => {
    setPage(1)
    setApplied({ ...search })
  }

  const handleReset = () => {
    setSearch(emptySearch)
    setApplied(emptySearch)
    setPage(1)
  }

  const totalResults = data?.pageInfo.totalResults ?? 0
  const totalPay = data?.paymentInfo.totalPay ?? 0
  const currentPagePay = data?.paymentInfo.currentPagePay ?? 0

  return (
    <div className="flex flex-col gap-4">
      <SearchForm search={search} onSearchChange={setSearch} onSearch={handleSearch} onReset={handleReset} />

      {/* 정보 영역 */}
      <div className="flex justify-between items-center min-h-8.75 font-medium text-[#333] text-sm flex-wrap gap-2">
        <div>
          {totalResults > 0 && `전체 : ${totalResults.toLocaleString()}건`}
          {isPage && data && ` - ${page} page / ${data.pageInfo.totalPage} pages`}
        </div>
        <div className="flex items-center gap-3">
          <span>
            {year}년 전체 : {formatAmount(totalPay)}
          </span>
          {isPage && <span>/ 현재 페이지 : {formatAmount(currentPagePay)}</span>}
          {isPage && (
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
                setPage(1)
              }}
              className={selectClass}
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}개
                </option>
              ))}
            </select>
          )}
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value)
              setPage(1)
            }}
            className={selectClass}
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
        </div>
      </div>

      <OfferingTable data={data} loading={loading} />

      {isPage && data && data.pageInfo.totalPage > 1 && (
        <Pagination page={page} total={totalResults} postsPerPage={pageSize} onChange={setPage} />
      )}
    </div>
  )
}
