interface Props {
  page: number
  total: number
  postsPerPage: number
  onChange: (page: number) => void
}

export default function Pagination({ page, total, postsPerPage, onChange }: Props) {
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

  const base = 'w-[30px] h-[30px] border border-[#e2e2e2] flex justify-center items-center text-base font-[inherit] -ml-px'
  const normal = 'text-[#424242] cursor-pointer bg-white hover:bg-[#f5f5f5]'
  const active = 'bg-[#424242] text-white cursor-default'
  const disabled = 'text-[#ccc] cursor-not-allowed bg-white'

  const cls = (isActive?: boolean, isDisabled?: boolean) =>
    `${base} ${isActive ? active : isDisabled ? disabled : normal}`

  return (
    <div className="flex justify-center mt-4">
      {/* 처음 */}
      <button
        className={`${cls(false, page === 1)} ml-0 rounded-l-[5px]`}
        disabled={page === 1}
        onClick={() => onChange(1)}
      >
        «
      </button>
      {/* 이전 */}
      <button className={cls(false, page === 1)} disabled={page === 1} onClick={() => onChange(page - 1)}>
        ‹
      </button>
      {/* 페이지 번호 */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className={`${base} text-[#999] cursor-default bg-white`}>
            …
          </span>
        ) : (
          <button key={p} className={cls(p === page)} onClick={() => onChange(p as number)}>
            {p}
          </button>
        )
      )}
      {/* 다음 */}
      <button
        className={cls(false, page === totalPage)}
        disabled={page === totalPage}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
      {/* 맨끝 */}
      <button
        className={`${cls(false, page === totalPage)} rounded-r-[5px]`}
        disabled={page === totalPage}
        onClick={() => onChange(totalPage)}
      >
        »
      </button>
    </div>
  )
}
