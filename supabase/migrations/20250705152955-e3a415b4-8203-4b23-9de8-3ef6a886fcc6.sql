-- Clean up all duplicate sample stories and related data
-- First delete choices related to sample stories
DELETE FROM choices WHERE scene_id IN (
  SELECT s.id FROM scenes s 
  JOIN stories st ON s.story_id = st.id 
  WHERE st.title IN ('The Enchanted Forest', 'The Space Station Mystery')
);

-- Delete scenes from sample stories
DELETE FROM scenes WHERE story_id IN (
  SELECT id FROM stories 
  WHERE title IN ('The Enchanted Forest', 'The Space Station Mystery')
);

-- Delete the sample stories themselves
DELETE FROM stories 
WHERE title IN ('The Enchanted Forest', 'The Space Station Mystery');

-- Keep only the one draft story with title 'fd' if it exists
-- Clean up any other test/sample data but preserve real user content