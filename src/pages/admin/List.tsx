import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { listOfferings } from '@/services/offeringService'
import type { ListResponse, ListQuery } from '@/types'
import { formatAmount } from '@/utils'
import SearchForm, { type SearchState } from '@/components/admin/SearchForm'
import OfferingTable from '@/components/admin/OfferingTable'
import Pagination from '@/components/comm/Pagination'

const PAGE_SIZE = 100
const pageSizeOptions = [10, 25, 50, 100]
const selectClass = 'py-1 px-1.5 border border-[#ccc] rounded text-[13px] font-[inherit]'

function getDefaultYear() {
  const now = new Date()
  return now.getMonth() > 5 ? String(now.getFullYear()) : String(now.getFullYear() - 1)
}

export default function List() {
  const [searchParams, setSearchParams] = useSearchParams()
  const year = searchParams.get('year') ?? getDefaultYear()
  const page = Number(searchParams.get('page') ?? 1)
  const pageSize = Number(searchParams.get('size') ?? PAGE_SIZE)
  const applied: SearchState = {
    name: searchParams.get('name') ?? '',
    ssn: searchParams.get('ssn') ?? '',
    email: searchParams.get('email') ?? '',
  }

  const [data, setData] = useState<ListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState<SearchState>(applied)

  const isPage = !(applied.name || applied.ssn || applied.email)

  const setPageSize = (size: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('size', String(size))
      next.set('page', '1')
      return next
    })
  }

  const fetchList = useCallback(async (query: ListQuery) => {
    setLoading(true)
    try {
      const result = await listOfferings(query)
      setData(result)
    } catch {
      toast.error('목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [])

  // 연도 변경 시 검색 조건·페이지 초기화
  const prevYearRef = useRef(year)
  useEffect(() => {
    if (prevYearRef.current !== year) {
      prevYearRef.current = year
      setSearch({ name: '', ssn: '', email: '' })
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('page', '1')
        next.delete('name')
        next.delete('ssn')
        next.delete('email')
        return next
      })
    }
  }, [year, setSearchParams])

  useEffect(() => {
    fetchList({ year, page, size: pageSize, ...applied, isPage })
  // applied는 searchParams 파생 원시값이므로 개별 필드로 의존성 관리
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, page, pageSize, applied.name, applied.ssn, applied.email, isPage, fetchList])

  const handleSearch = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', '1')
      if (search.name) next.set('name', search.name); else next.delete('name')
      if (search.ssn) next.set('ssn', search.ssn); else next.delete('ssn')
      if (search.email) next.set('email', search.email); else next.delete('email')
      return next
    })
  }

  const handlePageChange = (p: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(p))
      return next
    })
  }

  const totalResults = data?.pageInfo.totalResults ?? 0
  const totalPay = data?.paymentInfo.totalPay ?? 0
  const currentPagePay = data?.paymentInfo.currentPagePay ?? 0

  return (
    <div className="flex flex-col gap-4">
      <SearchForm search={search} onSearchChange={setSearch} onSearch={handleSearch} />

      <div className="flex flex-col gap-1">
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
                onChange={(e) => setPageSize(Number(e.target.value))}
                className={selectClass}
              >
                {pageSizeOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}개
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <OfferingTable data={data} loading={loading} />

        {isPage && data && data.pageInfo.totalPage > 1 && (
          <Pagination page={page} total={totalResults} postsPerPage={pageSize} onChange={handlePageChange} />
        )}
      </div>
    </div>
  )
}
