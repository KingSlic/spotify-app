
// 1) Define what props this component accepts
interface SectionTitleProps {
  title: string;
  active?: boolean; // optional prop (?)
  href?: string;  // optional prop (?)
}

// 2) Define the component, using that props type
export default function SectionTitle({ title, active = false, href }: SectionTitleProps) {
  return (
    // 3) Render the title as a styled <h2>
    <div className="flex items-center justify-between mb-4">
      <h2 className={`
            text-2xl font-bold mb-4 tracking-tight transsition-colors duration-200
            ${active ? "text-[#1DB954]" : 'text-white group-hover:text-[#1DB954]'}`}
      >
        {title}
      </h2>

      {href && (
        <a
          href={href}
          className="
            text-sm font-medium text-zinc-400
            opacity-0 group-hover:opacity-100
            transition-all duration-200
            hover:underline
            "
        >
          Show All
        </a>
      )}
    </div>
  );
}
