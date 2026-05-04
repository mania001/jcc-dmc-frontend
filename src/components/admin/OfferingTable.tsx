import type { Offering, ListResponse } from '@/types'
import { formatDate } from '@/utils'

const STATUS_LABEL: Record<string, string> = {
  PENDING: '대기',
  PROCESSING: '처리중',
  COMPLETED: '완료',
  FAILED: '실패',
}

const HEADERS = ['날짜', '이름', '주민번호', '메일', '십일조', '감사', '건축', '선교', '구제', '합계', '상태']

interface Props {
  data: ListResponse | null
  loading: boolean
}

export default function OfferingTable({ data, loading }: Props) {
  return (
    <div className="table-group full-width">
      <table>
        <thead>
          <tr>
            {HEADERS.map((h) => (
              <th key={h}>
                <span>{h}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={11} className="leading-15 text-[#999]">
                불러오는 중...
              </td>
            </tr>
          ) : !data || data.results.length === 0 ? (
            <tr>
              <td colSpan={11} className="leading-15 text-[#999]">
                no data
              </td>
            </tr>
          ) : (
            data.results.map((row: Offering) => (
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
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
