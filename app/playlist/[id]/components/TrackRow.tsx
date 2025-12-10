

const isActive = active;
export default function TrackRow({
  track,
  index,
  active = false,
  onPlay,
}: {
  track: Track;
  index: number;
  active?: boolean;
  onPlay?: (track: Track) => void;

}) {

  
  return (
    <span className={`flex items-center justify-center w-4
      ${isActive ? 'text-[#1DB954]' : ''}`}>
      {hover ? (
        <Play className="w-4 h-4 text-white" />
      ) : isActive ? (
        "🔊"
      ) : (
        index + 1
      )}
    </span>
  )
}
