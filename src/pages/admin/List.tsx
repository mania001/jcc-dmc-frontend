import { useState, useEffect, useCallback } from 'react'
import { listOfferings } from '@/services/offeringService'
import type { Offering, ListResponse, ListQuery } from '@/types'
import { formatAmount, formatDate } from '@/utils'

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기',
  COMPLETED: '완료',
  FAILED: '실패',
  CANCELED: '취소',
}

const STATUS_COLOR: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELED: 'bg-gray-100 text-gray-600',
}

const PAGE_SIZE = 25

function getCurrentYear() {
  const now = new Date()
  return now.getMonth() > 5 ? String(now.getFullYear()) : String(now.getFullYear() - 1)
}

export default function List() {
  const [data, setData] = useState<ListResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [year, setYear] = useState(getCurrentYear())
  const [search, setSearch] = useState({ name: '', ssn: '', email: '' })
  const [applied, setApplied] = useState({ name: '', ssn: '', email: '' })

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
    fetchList({ year, page, size: PAGE_SIZE, ...applied })
  }, [year, page, applied, fetchList])

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

  const years = Array.from({ length: 5 }, (_, i) => String(new Date().getFullYear() - i))

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">헌금 내역</h2>
      </div>

      {/* 검색 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">연도</label>
            <select
              value={year}
              onChange={(e) => { setYear(e.target.value); setPage(1) }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map((y) => <option key={y} value={y}>{y}년</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">성명</label>
            <input
              type="text"
              value={search.name}
              onChange={(e) => setSearch(s => ({ ...s, name: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="성명 검색"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">주민번호 앞자리</label>
            <input
              type="text"
              value={search.ssn}
              onChange={(e) => setSearch(s => ({ ...s, ssn: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="주민번호 앞자리"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">이메일</label>
            <input
              type="text"
              value={search.email}
              onChange={(e) => setSearch(s => ({ ...s, email: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이메일 검색"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            검색
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 요약 */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat label="전체 건수" value={`${data.pageInfo.totalResults.toLocaleString()}건`} />
          <Stat label="전체 합계" value={formatAmount(data.paymentInfo.totalPay)} />
          <Stat label="현재 페이지 건수" value={`${data.results.length}건`} />
          <Stat label="현재 페이지 합계" value={formatAmount(data.paymentInfo.currentPagePay)} />
        </div>
      )}

      {/* 테이블 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['No', '날짜', '성명', '주민앞자리', '이메일', '십일조', '감사', '건축', '선교', '구제', '합계', '결제수단', '상태'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-4 py-10 text-center text-gray-400 text-sm">불러오는 중...</td>
                </tr>
              ) : data?.results.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-10 text-center text-gray-400 text-sm">검색 결과가 없습니다.</td>
                </tr>
              ) : data?.results.map((row: Offering, idx) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatDate(row.created_at)}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono">{row.jumin1}</td>
                  <td className="px-4 py-3 text-gray-600">{row.email ?? '-'}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.tithe ? row.tithe.toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.thanks ? row.thanks.toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.building ? row.building.toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.mission ? row.mission.toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{row.relief ? row.relief.toLocaleString() : '-'}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{row.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-600">{row.pay_type === 'card' ? '카드' : '휴대폰'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLOR[row.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {STATUS_LABEL[row.status] ?? row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {data && data.pageInfo.totalPage > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {data.pageInfo.totalResults.toLocaleString()}건 중 {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.pageInfo.totalResults)}
            </p>
            <Pagination current={page} total={data.pageInfo.totalPage} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-4 py-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-base font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  const range = 2
  const pages: (number | '...')[] = []

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - range && i <= current + range)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center gap-1">
      <PageBtn disabled={current === 1} onClick={() => onChange(current - 1)}>‹</PageBtn>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
        ) : (
          <PageBtn key={p} active={p === current} onClick={() => onChange(p as number)}>{p}</PageBtn>
        )
      )}
      <PageBtn disabled={current === total} onClick={() => onChange(current + 1)}>›</PageBtn>
    </div>
  )
}

function PageBtn({ children, active, disabled, onClick }: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 text-sm rounded-lg transition-colors ${
        active
          ? 'bg-blue-600 text-white font-medium'
          : disabled
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}
