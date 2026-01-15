interface SectionTitlesProps {
    sections: {
        title: string;
        href: string;
    }[];
}
export default function SectionTitles({ sections }: SectionTitlesProps) {
    return (
        <div className="space-y-4">
            {sections.map((section) => (
                <div className="flex justify-between">
                    <h2 className="text-2xl font-bold tracking-tight transition-colors duration-200">
                        {section.title}
                    </h2>
                    {section.href && <a
                        href={section.href}
                        className="text-sm font-medium text-zinc-400 hover:text-white cursor-pointer inline-block transition-colors duration-200 hover:underline"
                    >
                        Show All
                    </a>}
                </div>
            ))}
        </div>
    );
}
