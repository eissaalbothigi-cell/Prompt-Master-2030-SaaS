interface TitleBarProps {
  title: string;
  description?: string;
}

export function TitleBar({ title, description }: TitleBarProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}
