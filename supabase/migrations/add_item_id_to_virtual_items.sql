-- Add item_id field to virtual_items table
-- This allows developers to reference items by a simple string ID scoped to their game

ALTER TABLE virtual_items 
ADD COLUMN item_id TEXT;

-- Add unique constraint for game_id + item_id combination
ALTER TABLE virtual_items 
ADD CONSTRAINT virtual_items_game_id_item_id_unique 
UNIQUE (game_id, item_id);

-- Add index for faster lookups
CREATE INDEX idx_virtual_items_game_id_item_id 
ON virtual_items (game_id, item_id);

-- Add comment explaining the field
COMMENT ON COLUMN virtual_items.item_id IS 'Developer-friendly string identifier for the virtual item, unique within a game. Used by SDK for easier item referencing.';