export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-200/10 flex items-center justify-center mb-4 text-3xl">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>}
      {action}
    </div>
  )
}
