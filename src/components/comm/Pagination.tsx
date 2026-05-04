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

  const btnClass = (active?: boolean, disabled?: boolean) =>
    [
      'py-1 px-2.5 mx-0.5 border rounded-sm text-[13px] font-[inherit]',
      active ? 'border-[#4caf50] bg-[#4caf50] text-white' : 'border-[#ccc] bg-white',
      disabled ? 'text-[#ccc] cursor-not-allowed' : !active ? 'text-[#333] cursor-pointer' : '',
    ]
      .filter(Boolean)
      .join(' ')

  return (
    <div className="flex justify-center mt-2.5 flex-wrap gap-0.5">
      <button className={btnClass(false, page === 1)} disabled={page === 1} onClick={() => onChange(page - 1)}>
        ‹
      </button>
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="py-1 px-1.5 text-[13px] text-[#999]">
            …
          </span>
        ) : (
          <button key={p} className={btnClass(p === page)} onClick={() => onChange(p as number)}>
            {p}
          </button>
        )
      )}
      <button
        className={btnClass(false, page === totalPage)}
        disabled={page === totalPage}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </div>
  )
}
