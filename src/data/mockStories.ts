
import { Story } from "@/components/stories/StoryCard";

// Mock data for stories
export const allStories: Story[] = [
  {
    id: 1,
    title: "The Crystal Cavern",
    excerpt: "Explore the depths of a magical cave where crystals hold ancient memories.",
    coverImage: "https://images.unsplash.com/photo-1633621477511-b1b3fb9a2280?q=80&w=2748&auto=format&fit=crop",
    category: "Fantasy",
    hasAudio: true,
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Demo audio URL
    likes: 243,
  },
  {
    id: 2,
    title: "Whispers of the Night",
    excerpt: "A detective story set in a world where dreams and reality blend together.",
    coverImage: "https://images.unsplash.com/photo-1520034475321-cbe63696469a?q=80&w=3000&auto=format&fit=crop",
    category: "Mystery",
    hasAudio: true,
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // Demo audio URL
    likes: 178,
  },
  {
    id: 3,
    title: "Journey to Andromeda",
    excerpt: "Follow the first human expedition to the Andromeda galaxy.",
    coverImage: "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?q=80&w=3540&auto=format&fit=crop",
    category: "Sci-Fi",
    hasAudio: false,
    likes: 312,
  },
  {
    id: 4,
    title: "The Last Oracle",
    excerpt: "In a world where magic is dying, the last oracle embarks on a perilous journey.",
    coverImage: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=3540&auto=format&fit=crop",
    category: "Fantasy",
    hasAudio: true,
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", // Demo audio URL
    likes: 187,
  },
  {
    id: 5,
    title: "Echoes of Yesterday",
    excerpt: "A historical tale spanning generations of a family caught in the tides of war.",
    coverImage: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=3474&auto=format&fit=crop",
    category: "Historical",
    hasAudio: false,
    likes: 156,
  },
  {
    id: 6,
    title: "Midnight in the Garden",
    excerpt: "A suspenseful tale of intrigue and betrayal in a small town.",
    coverImage: "https://images.unsplash.com/photo-1502675135487-e971002a6adb?q=80&w=3538&auto=format&fit=crop",
    category: "Mystery",
    hasAudio: true,
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", // Demo audio URL
    likes: 201,
  },
];

export const categories = ["All", "Fantasy", "Mystery", "Sci-Fi", "Historical", "Adventure"];
