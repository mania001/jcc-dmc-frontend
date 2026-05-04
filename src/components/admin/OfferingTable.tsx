import type { Offering, ListResponse } from '@/types'
import { formatDate } from '@/utils'

const HEADERS = ['날짜', '이름', '주민번호', '메일', '십일조', '감사', '건축', '선교', '구제', '합계']

interface Props {
  data: ListResponse | null
  loading: boolean
}

const fmt = (n: number) => Number(n).toLocaleString('ko-KR')

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
              <td colSpan={10} className="leading-15 text-[#999]">
                불러오는 중...
              </td>
            </tr>
          ) : !data || data.results.length === 0 ? (
            <tr>
              <td colSpan={10} className="leading-15 text-[#999]">
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
                <td className="right">{row.tithe ? fmt(row.tithe) : ''}</td>
                <td className="right">{row.thanks ? fmt(row.thanks) : ''}</td>
                <td className="right">{row.building ? fmt(row.building) : ''}</td>
                <td className="right">{row.mission ? fmt(row.mission) : ''}</td>
                <td className="right">{row.relief ? fmt(row.relief) : ''}</td>
                <td className="right result">{fmt(row.amount)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
