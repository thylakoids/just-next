'use client'

interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ id, title, completed, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onToggle(id.toString(), completed)}
          className={`w-5 h-5 rounded border ${
            completed
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-500'
          } flex items-center justify-center transition-colors`}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed ? (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : null}
        </button>
        <span className={`${completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
          {title}
        </span>
      </div>
      <button
        type="button"
        onClick={() => onDelete(id.toString())}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
} 