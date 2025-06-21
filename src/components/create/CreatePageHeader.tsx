
interface CreatePageHeaderProps {}

export const CreatePageHeader = ({}: CreatePageHeaderProps) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Write Your Story</h1>
      <p className="text-muted-foreground">
        Share your creativity with readers around the world. Every great story starts with a single word.
      </p>
    </div>
  );
};
