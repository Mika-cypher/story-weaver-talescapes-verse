
// Background and ambient sound options for story reading experience

export const backgroundOptions = [
  { id: "forest", name: "Forest", url: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843" },
  { id: "night", name: "Starry Night", url: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb" },
  { id: "mountain", name: "Mountain Fog", url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05" },
  { id: "river", name: "River", url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb" },
  { id: "sunset", name: "Sunset", url: "https://images.unsplash.com/photo-1500673922987-e212871fec22" },
];

export const ambientSoundOptions = [
  { id: "forest", name: "Forest Sounds", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: "rain", name: "Rainfall", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: "waves", name: "Ocean Waves", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: "fire", name: "Crackling Fire", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
];

// Helper functions for getting URLs and names
export const getBackgroundUrl = (backgroundId: string | null): string => {
  if (!backgroundId) return '';
  const background = backgroundOptions.find(bg => bg.id === backgroundId);
  return background ? background.url : '';
};

export const getAmbientSoundUrl = (soundId: string | null): string => {
  if (!soundId) return '';
  const sound = ambientSoundOptions.find(s => s.id === soundId);
  return sound ? sound.url : '';
};

export const getBackgroundName = (backgroundId: string | null): string => {
  if (!backgroundId) return 'None';
  const background = backgroundOptions.find(bg => bg.id === backgroundId);
  return background ? background.name : 'Unknown';
};

export const getAmbientSoundName = (soundId: string | null): string => {
  if (!soundId) return 'None';
  const sound = ambientSoundOptions.find(s => s.id === soundId);
  return sound ? sound.name : 'Unknown';
};
