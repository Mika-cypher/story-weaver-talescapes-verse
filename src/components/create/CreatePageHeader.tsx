
interface CreatePageHeaderProps {}

export const CreatePageHeader = ({}: CreatePageHeaderProps) => {
  return (
    <div className="mb-8 text-center relative">
      <div className="absolute inset-0 african-pattern opacity-5 rounded-lg"></div>
      <div className="relative z-10 p-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2 bg-gradient-to-r from-heritage-ochre via-kente-gold to-heritage-terracotta bg-clip-text text-transparent">
          Weave Your Story
        </h1>
        <p className="text-muted-foreground mb-4">
          Share your tale with the world and join the rich tapestry of African storytelling traditions. 
          Every story carries the wisdom of our ancestors and the dreams of our future.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="inline-block bg-heritage-ochre/10 text-heritage-ochre rounded-full px-3 py-1 text-xs font-medium">
            Oral Tradition
          </span>
          <span className="inline-block bg-kente-gold/10 text-kente-gold rounded-full px-3 py-1 text-xs font-medium">
            Cultural Heritage
          </span>
          <span className="inline-block bg-heritage-terracotta/10 text-heritage-terracotta rounded-full px-3 py-1 text-xs font-medium">
            Modern Storytelling
          </span>
        </div>
      </div>
    </div>
  );
};
