// const playslistsArray = [
//     {
//         type: "PlayList",
//         title: "Recently Played",
//         songs: [
//           {
//             thumbnail: "https://placehold.co/600x400"
//           }
//         ]
//     },
// ];
type Playlist = {
    sectionTitle: string;
    playlists: {
        image: string;
    }[];
};
const PlayListCard = ({ image }: { image: string }) => {
    return (
        <div className="rounded-md hover:cursor-pointer">
            <img src={image} alt="Playlist" className="w-full h-full object-cover rounded-md" />
        </div>
    );
};

const PlayListsSection = ({ section }: { section: Playlist }) => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">{section.sectionTitle}</h1>
            <div className="flex flex-row gap-10">
                {section.playlists.map((playlist) => (
                    <PlayListCard key={playlist.image} image={playlist.image} />
                ))}
            </div>
        </div>
    );
};

const recentlyPlayedSection = {
    sectionTitle: "Recently Played",
    playlists: [
        {
            image: "https://picsum.photos/600?random=1",
        },
        {
            image: "https://picsum.photos/600?random=2",
        },
        {
            image: "https://picsum.photos/600?random=3",
        },
        {
            image: "https://picsum.photos/600?random=4",
        },
        {
            image: "https://picsum.photos/600?random=5",
        },
        {
            image: "https://picsum.photos/600?random=6",
        },
        {
            image: "https://picsum.photos/600?random=7",
        },
    ],
};
export default function Test() {
    return (
        <div className="flex flex-col gap-24">
            <PlayListsSection section={recentlyPlayedSection} />
        </div>
    );
}
