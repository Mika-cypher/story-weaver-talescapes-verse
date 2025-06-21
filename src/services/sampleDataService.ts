
import { storyService } from './storyService';
import { v4 as uuidv4 } from 'uuid';

export interface SampleStory {
  title: string;
  description: string;
  coverImage: string;
  scenes: Array<{
    title: string;
    content: string;
    image?: string;
    choices: Array<{
      text: string;
      nextSceneId: string;
    }>;
    isEnding?: boolean;
  }>;
}

const sampleStories: SampleStory[] = [
  {
    title: "The Enchanted Forest",
    description: "A mystical journey through an ancient forest where every choice reveals new magic.",
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000",
    scenes: [
      {
        title: "The Forest Entrance",
        content: "You stand at the edge of an ancient forest. The trees whisper secrets in the wind, and a mysterious path winds deeper into the shadows. Sunlight filters through the canopy, creating dancing patterns on the forest floor.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800",
        choices: [
          { text: "Follow the main path", nextSceneId: "main-path" },
          { text: "Venture into the thick undergrowth", nextSceneId: "undergrowth" }
        ]
      },
      {
        title: "The Main Path",
        content: "The well-worn path leads you to a clearing where a crystal-clear stream flows. You notice strange, glowing flowers along the water's edge.",
        choices: [
          { text: "Touch the glowing flowers", nextSceneId: "magic-flowers" },
          { text: "Cross the stream", nextSceneId: "across-stream" }
        ]
      },
      {
        title: "Into the Undergrowth",
        content: "Pushing through the dense vegetation, you discover a hidden grove with an ancient stone circle. Runes glow faintly on the weathered stones.",
        choices: [
          { text: "Step into the circle", nextSceneId: "stone-circle" },
          { text: "Examine the runes closely", nextSceneId: "rune-study" }
        ]
      },
      {
        title: "The Magic Flowers",
        content: "As you touch the flowers, they pulse with warm light. You feel a surge of ancient magic flowing through you, and suddenly you can understand the language of the forest.",
        isEnding: true
      },
      {
        title: "Across the Stream",
        content: "On the other side of the stream, you find a treehouse built into a massive oak. A wise old owl perches nearby, watching you with knowing eyes.",
        isEnding: true
      },
      {
        title: "The Stone Circle",
        content: "Stepping into the circle, you're transported to a realm between worlds where time flows differently. You've discovered a gateway to infinite adventures.",
        isEnding: true
      },
      {
        title: "Rune Study",
        content: "The runes tell the story of the forest's guardians. As you read them, you gain the wisdom of ages and become the forest's newest protector.",
        isEnding: true
      }
    ]
  },
  {
    title: "The Space Station Mystery",
    description: "Aboard a distant space station, something has gone terribly wrong. Can you solve the mystery before it's too late?",
    coverImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=1000",
    scenes: [
      {
        title: "Emergency Alert",
        content: "Red lights flash as you wake from cryosleep. The station's AI announces: 'Critical system failure detected. All crew report to stations immediately.' But the corridors are eerily empty.",
        image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=800",
        choices: [
          { text: "Head to the command center", nextSceneId: "command-center" },
          { text: "Check the crew quarters", nextSceneId: "crew-quarters" }
        ]
      },
      {
        title: "Command Center",
        content: "The command center is in chaos. Screens flicker with error messages, and you notice the life support systems are failing. You have limited time to act.",
        choices: [
          { text: "Attempt to restart life support", nextSceneId: "life-support" },
          { text: "Access the station logs", nextSceneId: "station-logs" }
        ]
      },
      {
        title: "Crew Quarters",
        content: "The crew quarters are abandoned, but you find signs of a struggle. Personal belongings are scattered, and there's a message scrawled on the wall: 'They're not what they seem.'",
        choices: [
          { text: "Investigate the message", nextSceneId: "investigate-message" },
          { text: "Search for survivors", nextSceneId: "search-survivors" }
        ]
      },
      {
        title: "Life Support Restored",
        content: "You successfully restart the life support systems, saving the station. As the air clears, you discover the crew was hiding in the emergency bunkers, protected from a solar storm.",
        isEnding: true
      },
      {
        title: "The Truth Revealed",
        content: "The station logs reveal the crew discovered an alien artifact that influenced their behavior. By understanding this, you're able to neutralize the threat and restore normalcy.",
        isEnding: true
      },
      {
        title: "Hidden Survivors",
        content: "You find the crew hiding in a shielded section of the station. Together, you work to repair the damage and uncover the truth behind the mysterious events.",
        isEnding: true
      }
    ]
  }
];

export const sampleDataService = {
  async seedSampleStories(): Promise<void> {
    try {
      console.log('Starting to seed sample stories...');
      
      for (const sampleStory of sampleStories) {
        // Create story structure
        const storyId = uuidv4();
        const sceneIds = new Map<string, string>();
        
        // Generate scene IDs
        sampleStory.scenes.forEach((_, index) => {
          const sceneKey = index === 0 ? 'start' : 
                          sampleStory.scenes[index].title.toLowerCase().replace(/\s+/g, '-');
          sceneIds.set(sceneKey, uuidv4());
        });
        
        // Build scenes with proper IDs
        const scenes = sampleStory.scenes.map((scene, index) => {
          const sceneKey = index === 0 ? 'start' : scene.title.toLowerCase().replace(/\s+/g, '-');
          const sceneId = sceneIds.get(sceneKey)!;
          
          return {
            id: sceneId,
            title: scene.title,
            content: scene.content,
            image: scene.image,
            audio: null,
            choices: scene.isEnding ? [] : scene.choices.map(choice => ({
              id: uuidv4(),
              text: choice.text,
              nextSceneId: sceneIds.get(choice.nextSceneId) || sceneId
            })),
            isEnding: scene.isEnding || false
          };
        });
        
        const story = {
          id: storyId,
          title: sampleStory.title,
          description: sampleStory.description,
          coverImage: sampleStory.coverImage,
          author: 'Sample Stories',
          status: 'published' as const,
          startSceneId: scenes[0].id,
          scenes,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        await storyService.createStory(story);
        console.log(`Created sample story: ${story.title}`);
      }
      
      console.log('Sample stories seeded successfully!');
    } catch (error) {
      console.error('Error seeding sample stories:', error);
    }
  },

  async checkIfSampleDataExists(): Promise<boolean> {
    try {
      const stories = await storyService.getStories();
      return stories.some(story => story.author === 'Sample Stories');
    } catch (error) {
      console.error('Error checking sample data:', error);
      return false;
    }
  }
};
