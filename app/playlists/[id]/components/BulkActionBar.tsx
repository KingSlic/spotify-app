"use client";

interface BulkActionBarProps {
  selectedCount: number;
  canAdd: boolean;
  canRemove: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onClear: () => void;
}

export default function BulkActionBar({
  selectedCount,
  canAdd,
  canRemove,
  onAdd,
  onRemove,
  onClear,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className="
        sticky top-0 z-20
        flex items-center justify-between
        px-4 py-3
        bg-zinc-900/95 backdrop-blur
        border-b border-zinc-800
      "
    >
      <span className="text-sm text-white">
        {selectedCount} selected
      </span>

      <div className="flex items-center gap-4">
        <button
          disabled={!canAdd}
          onClick={onAdd}
          className={`
            text-sm
            ${canAdd
              ? "text-white hover:underline"
              : "text-zinc-600 cursor-not-allowed"}
          `}
        >
          Add
        </button>

        <button
          disabled={!canRemove}
          onClick={onRemove}
          className={`
            text-sm
            ${canRemove
              ? "text-white hover:underline"
              : "text-zinc-600 cursor-not-allowed"}
          `}
        >
          Remove
        </button>

        <button
          onClick={onClear}
          className="text-sm text-zinc-400 hover:text-white"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
