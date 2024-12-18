'use client'

interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export default function TodoItem({ id, title, completed, onToggle, onDelete }: TodoItemProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(title);
  };

  return (
    <li className="flex gap-1 items-center group min-w-50">
      <input
        id={id.toString()}
        type="checkbox"
        className="cursor-pointer peer"
        defaultChecked={completed}
        onChange={(e) => onToggle(id.toString(), completed)}
      />
      <label
        htmlFor={id.toString()}
        className="cursor-pointer text-gray-900 peer-checked:line-through
        peer-checked:text-slate-300 flex-grow"
      >
        {title}
      </label>
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-500 transition-all"
        aria-label="Copy todo text"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
      </button>
      <button
        onClick={() => onDelete(id.toString())}
        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
        aria-label="Delete todo"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  );
}
