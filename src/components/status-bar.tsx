export function StatusBar() {
  return (
    <div className="flex justify-between items-center px-5 py-2 text-sm">
      <span>9:41</span>
      <div className="flex items-center gap-1">
        <div className="w-4 h-4">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 20.5a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17Z"
            />
          </svg>
        </div>
        <div className="w-4 h-4">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M16.5 4c3 0 5.5 2.5 5.5 5.5v5c0 3-2.5 5.5-5.5 5.5h-9C4.5 20 2 17.5 2 14.5v-5C2 6.5 4.5 4 7.5 4h9Z"
            />
          </svg>
        </div>
        <div className="w-4 h-4">
          <svg viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M2 19.5v-15C2 3.7 2.7 3 3.5 3h17C21.3 3 22 3.7 22 4.5v15c0 .8-.7 1.5-1.5 1.5h-17C2.7 21 2 20.3 2 19.5Z"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

