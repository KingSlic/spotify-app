
interface SectionTitleProps {
  title: string;
  active?: boolean;
  href?: string;
  alignRightText?: boolean;
}

// 2) Define the component, using that props type
export default function SectionTitle({ title, active = false, href, alignRightText }: SectionTitleProps) {
  return (
    // 3) Render the title as a styled <h2>
    <div className="flex items-center justify-between w-full mb-4">
      <h2 className={`
            text-2xl font-bold tracking-tight transition-colors duration-200
            ${active ? "text-[#1DB954]" : 'text-white hover:text-[#1DB954]'}`}
      >
        {title}
      </h2>

      {href && alignRightText && (
        <a
          href={href}
          className="
            text-sm font-medium text-zinc-400
            hover:text-white cursor-pointer
            inline-block
            transition-colors duration-200
            hover:underline
            "
        >
          Show All
        </a>
      )}
    </div>
  );
}
