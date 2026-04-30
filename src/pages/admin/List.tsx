import { useState, useEffect, useCallback } from 'react'
import { listOfferings } from '@/services/offeringService'
import type { Offering, ListResponse, ListQuery } from '@/types'
import { formatAmount, formatDate } from '@/utils'

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기',
  PROCESSING: '처리중',
  COMPLETED: '완료',
  FAILED: '실패',
}

const PAGE_SIZE = 25

function getCurrentYear() {
  const now = new Date()
  return now.getMonth() > 5 ? String(now.getFullYear()) : String(now.getFullYear() - 1)
}

const today = new Date()
const thisYear = today.getFullYear()
const yearOptions: string[] = []
for (let i = thisYear; i > 2000; i--) yearOptions.push(String(i))

const pageSizeOptions = [10, 25, 50, 100]

export default function List() {
  const [data, setData] = useState<ListResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [year, setYear] = useState(getCurrentYear())
  const [search, setSearch] = useState({ name: '', ssn: '', email: '' })
  const [applied, setApplied] = useState({ name: '', ssn: '', email: '' })

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
    const empty = { name: '', ssn: '', email: '' }
    setSearch(empty)
    setApplied(empty)
    setPage(1)
  }

  const totalResults = data?.pageInfo.totalResults ?? 0
  const totalPay = data?.paymentInfo.totalPay ?? 0
  const currentPagePay = data?.paymentInfo.currentPagePay ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* 검색 영역 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8em', color: '#444', marginBottom: '3px', fontWeight: 500 }}>성명</label>
          <input
            type="text"
            value={search.name}
            onChange={(e) => setSearch(s => ({ ...s, name: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="성명 검색"
            style={{ padding: '6px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', width: '140px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8em', color: '#444', marginBottom: '3px', fontWeight: 500 }}>주민번호 앞자리</label>
          <input
            type="text"
            value={search.ssn}
            onChange={(e) => setSearch(s => ({ ...s, ssn: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="앞자리"
            style={{ padding: '6px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', width: '130px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8em', color: '#444', marginBottom: '3px', fontWeight: 500 }}>이메일</label>
          <input
            type="text"
            value={search.email}
            onChange={(e) => setSearch(s => ({ ...s, email: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="이메일 검색"
            style={{ padding: '6px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px', width: '160px' }}
          />
        </div>
        <button className="btn" onClick={handleSearch} style={{ padding: '7px 16px' }}>검색</button>
        <button
          onClick={handleReset}
          style={{ padding: '7px 16px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}
        >
          초기화
        </button>
      </div>

      {/* 정보 영역 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '35px', fontWeight: 500, color: '#333', fontSize: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          {totalResults > 0 && `전체 : ${totalResults.toLocaleString()}건`}
          {isPage && data && ` - ${page} page / ${data.pageInfo.totalPage} pages`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>{year}년 전체 : {formatAmount(totalPay)}</span>
          {isPage && <span>/ 현재 페이지 : {formatAmount(currentPagePay)}</span>}
          {isPage && (
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}
              style={{ padding: '4px 6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', fontFamily: 'inherit' }}
            >
              {pageSizeOptions.map(s => <option key={s} value={s}>{s}개</option>)}
            </select>
          )}
          <select
            value={year}
            onChange={(e) => { setYear(e.target.value); setPage(1) }}
            style={{ padding: '4px 6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', fontFamily: 'inherit' }}
          >
            {yearOptions.map(y => <option key={y} value={y}>{y}년</option>)}
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="table-group full-width">
        <table>
          <thead>
            <tr>
              {['날짜', '이름', '주민번호', '메일', '십일조', '감사', '건축', '선교', '구제', '합계', '상태'].map(h => (
                <th key={h}><span>{h}</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={11} style={{ lineHeight: '60px', color: '#999' }}>불러오는 중...</td></tr>
            ) : !data || data.results.length === 0 ? (
              <tr><td colSpan={11} style={{ lineHeight: '60px', color: '#999' }}>no data</td></tr>
            ) : data.results.map((row: Offering) => (
              <tr key={row.id}>
                <td>{formatDate(row.created_at)}</td>
                <td>{row.name}</td>
                <td>{row.jumin1}-******</td>
                <td>{row.email ?? ''}</td>
                <td className="right">{row.tithe ? row.tithe.toLocaleString() : ''}</td>
                <td className="right">{row.thanks ? row.thanks.toLocaleString() : ''}</td>
                <td className="right">{row.building ? row.building.toLocaleString() : ''}</td>
                <td className="right">{row.mission ? row.mission.toLocaleString() : ''}</td>
                <td className="right">{row.relief ? row.relief.toLocaleString() : ''}</td>
                <td className="right result">{row.amount.toLocaleString()}</td>
                <td>{STATUS_LABEL[row.status] ?? row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {isPage && data && data.pageInfo.totalPage > 1 && (
        <Pagination
          page={page}
          total={totalResults}
          postsPerPage={pageSize}
          onChange={setPage}
        />
      )}
    </div>
  )
}

function Pagination({ page, total, postsPerPage, onChange }: {
  page: number
  total: number
  postsPerPage: number
  onChange: (p: number) => void
}) {
  const totalPage = Math.ceil(total / postsPerPage)
  const range = 2
  const pages: (number | '...')[] = []

  for (let i = 1; i <= totalPage; i++) {
    if (i === 1 || i === totalPage || (i >= page - range && i <= page + range)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  const btnStyle = (active?: boolean, disabled?: boolean): React.CSSProperties => ({
    padding: '4px 10px',
    margin: '0 2px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    background: active ? '#4caf50' : '#fff',
    color: active ? '#fff' : disabled ? '#ccc' : '#333',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    fontSize: '13px',
  })

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '2px' }}>
      <button style={btnStyle(false, page === 1)} disabled={page === 1} onClick={() => onChange(page - 1)}>‹</button>
      {pages.map((p, i) =>
        p === '...'
          ? <span key={`e${i}`} style={{ padding: '4px 6px', fontSize: '13px', color: '#999' }}>…</span>
          : <button key={p} style={btnStyle(p === page)} onClick={() => onChange(p as number)}>{p}</button>
      )}
      <button style={btnStyle(false, page === totalPage)} disabled={page === totalPage} onClick={() => onChange(page + 1)}>›</button>
    </div>
  )
}
