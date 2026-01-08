export default function Loading() {
  return (
    <div className="p-6 animate-pulse space-y-4">
      <div className="h-6 w-48 bg-zinc-800 rounded" />
      <div className="flex gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-48 h-64 bg-zinc-800 rounded-md"
          />
        ))}
      </div>
    </div>
  );
}
