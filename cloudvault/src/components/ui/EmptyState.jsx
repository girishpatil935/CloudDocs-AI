export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-surface-800 border border-slate-200 dark:border-surface-200/10 flex items-center justify-center mb-5 text-slate-400 dark:text-slate-500 shadow-inner">
          {typeof Icon === 'string' ? <span className="text-3xl">{Icon}</span> : <Icon size={28} />}
        </div>
      )}
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1.5">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">{description}</p>}
      {action}
    </div>
  )
}
