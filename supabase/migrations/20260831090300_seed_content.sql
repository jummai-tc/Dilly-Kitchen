-- ============================================================================
-- Seed content — GENERATED FILE, do not edit by hand.
--
-- Regenerate with `npm run seed:generate` after changing anything in src/data.
-- Re-running is safe: content rows are upserted, enquiries are never touched.
-- ============================================================================

insert into public.menu_categories (id, name, blurb, note, sort_order) values
  ('starters', 'Starters', 'First impressions — warm broths and small plates made for sharing.', null, 0),
  ('rice-dishes', 'Rice Dishes', 'Our signature mains, smoky and full of flavour.', 'Served with sweet fried plantain.', 1),
  ('traditional-soups', 'Traditional Soups', 'Bowl comfort — slow-built soups from across Nigeria.', 'Served with semovita, pounded yam or eba. Protein options: assorted meat, beef, fish or chicken.', 2),
  ('swallows', 'Swallows', 'The perfect partner for every bowl of soup.', 'Choose your swallow when you order a traditional soup.', 3),
  ('grills-and-suya', 'Grills & Suya', 'Char-grilled, spice-rubbed and finished over open heat.', null, 4),
  ('meat-and-fish', 'Meat & Fish', 'Delicacies prepared the traditional way.', null, 5),
  ('sides', 'Sides', 'Perfect companions for any main.', null, 6),
  ('drinks', 'Drinks', 'Soft drinks, beers and wine to finish the table.', null, 7),
  ('desserts', 'Desserts', 'Sweet endings, the Nigerian way.', null, 8)
on conflict (id) do update set
  name = excluded.name,
  blurb = excluded.blurb,
  note = excluded.note,
  sort_order = excluded.sort_order
;

insert into public.menu_items (id, category_id, name, description, price, price_note, image_path, image_widths, image_aspect_ratio, image_alt, dietary, spice_level, options, is_featured, sort_order) values
  ('assorted-pepper-soup', 'starters', 'Assorted Pepper Soup', 'A warm, aromatic broth infused with traditional spices and loaded with assorted meats. Light, spicy and deeply comforting.', 15, null, null, '{}'::integer[], null, null, '{}'::text[], 3, '{}'::text[], false, 0),
  ('catfish-pepper-soup', 'starters', 'Catfish Pepper Soup', 'Fresh catfish simmered in a fragrant herbal pepper soup base. Bold, spicy and full of natural flavour.', 20, null, null, '{}'::integer[], null, null, array['contains-fish']::text[], 3, '{}'::text[], false, 1),
  ('tilapia-pepper-soup', 'starters', 'Tilapia Pepper Soup', 'Whole tilapia slow-cooked in a spicy, zesty broth enriched with local herbs.', 20, null, '/images/dishes/tilapia-pepper-soup', array[480, 800, 1400]::integer[], 0.9696969696969697, 'Bowl of tilapia pepper soup in a spicy, herb-rich broth', array['contains-fish']::text[], 3, '{}'::text[], true, 2),
  ('ugba', 'starters', 'Ugba', 'African oil bean salad prepared with sliced oil beans, palm oil, spices and stockfish, with a gentle hint of heat.', 20, null, null, '{}'::integer[], null, null, array['contains-fish']::text[], 1, '{}'::text[], false, 3),
  ('garnished-prawns', 'starters', 'Garnished Prawns', 'Succulent prawns tossed in an aromatic blend of peppers, herbs and spices.', 15, null, null, '{}'::integer[], null, null, array['contains-shellfish']::text[], 2, '{}'::text[], false, 4),
  ('garnished-snails', 'starters', 'Garnished Snails (3)', 'Premium African snails cooked until tender, then sautéed with peppers, onions and rich spices.', 25, null, null, '{}'::integer[], null, null, '{}'::text[], 2, '{}'::text[], false, 5),
  ('jollof-fried-rice-chicken', 'rice-dishes', 'Jollof or Fried Rice with Chicken', 'Smoky party jollof or aromatic Nigerian fried rice, served with tender seasoned chicken and sweet fried plantain.', 15, null, '/images/dishes/jollof-rice-chicken', array[480, 800, 1400]::integer[], 1.1235955056179776, 'Plate of smoky Nigerian jollof rice served with grilled chicken', array['signature']::text[], 2, array['Jollof rice', 'Fried rice']::text[], true, 6),
  ('jollof-fried-rice-beef', 'rice-dishes', 'Jollof or Fried Rice with Beef', 'Smoky jollof or aromatic fried rice served with tender, well-seasoned beef.', 18, null, '/images/dishes/fried-rice', array[480, 800, 1400]::integer[], 0.9501187648456056, 'Nigerian fried rice served with grilled protein and fried plantain', '{}'::text[], 2, array['Jollof rice', 'Fried rice']::text[], false, 7),
  ('jollof-fried-rice-assorted', 'rice-dishes', 'Jollof or Fried Rice with Assorted Meat', 'Flavour-packed rice served with a generous selection of assorted meats.', 18, null, null, '{}'::integer[], null, null, '{}'::text[], 2, array['Jollof rice', 'Fried rice']::text[], false, 8),
  ('jollof-fried-rice-cut-fish', 'rice-dishes', 'Jollof or Fried Rice with Cut Fish', 'Your choice of rice served with seasoned cut fish and sweet fried plantain.', 18, null, null, '{}'::integer[], null, null, array['contains-fish']::text[], 2, array['Jollof rice', 'Fried rice']::text[], false, 9),
  ('jollof-fried-rice-whole-fish', 'rice-dishes', 'Jollof or Fried Rice with Whole Fish', 'Your choice of rice served with a whole seasoned fish and sweet fried plantain.', 25, null, null, '{}'::integer[], null, null, array['contains-fish']::text[], 2, array['Jollof rice', 'Fried rice']::text[], false, 10),
  ('white-rice-stew-beef', 'rice-dishes', 'White Rice & Tomato Stew with Beef', 'Steamed white rice, rich peppered tomato stew and tender beef.', 20, null, '/images/dishes/white-rice-stew', array[480, 800, 1400]::integer[], 1.0781671159029649, 'Steamed white rice with peppered tomato stew and fried plantain', '{}'::text[], 2, '{}'::text[], false, 11),
  ('white-rice-stew-assorted', 'rice-dishes', 'White Rice & Tomato Stew with Assorted Meat', 'Steamed white rice and peppered tomato stew served with assorted meats.', 18, null, null, '{}'::integer[], null, null, '{}'::text[], 2, '{}'::text[], false, 12),
  ('white-rice-stew-fish', 'rice-dishes', 'White Rice & Tomato Stew with Fish', 'Steamed white rice and rich peppered tomato stew served with seasoned fish.', 20, null, null, '{}'::integer[], null, null, array['contains-fish']::text[], 2, '{}'::text[], false, 13),
  ('white-rice-stew-chicken', 'rice-dishes', 'White Rice & Tomato Stew with Chicken', 'Steamed white rice and rich peppered tomato stew served with tender chicken.', 15, null, null, '{}'::integer[], null, null, '{}'::text[], 2, '{}'::text[], false, 14),
  ('spaghetti-jollof', 'rice-dishes', 'Spaghetti Jollof with Any Protein', 'Spaghetti cooked in a bold, tomato-rich jollof sauce with your choice of protein.', 18, null, '/images/dishes/spaghetti-jollof', array[480, 800, 1380]::integer[], 0.7624309392265194, 'Plate of spaghetti jollof in a bold tomato and pepper sauce, served with peppered chicken', '{}'::text[], 2, array['Beef', 'Chicken', 'Fish', 'Assorted meat']::text[], false, 15),
  ('special-fried-rice', 'rice-dishes', 'Special Fried Rice with Any Protein', 'Our house fried rice, packed with vegetables and spices, served with your choice of protein.', 18, null, null, '{}'::integer[], null, null, '{}'::text[], 1, array['Beef', 'Chicken', 'Fish', 'Assorted meat']::text[], false, 16),
  ('yam-porridge', 'rice-dishes', 'Yam Porridge with Any Protein', 'Soft yam cubes simmered in a creamy, tomato-rich sauce with your choice of protein.', 18, null, null, '{}'::integer[], null, null, '{}'::text[], 2, array['Beef', 'Chicken', 'Fish', 'Assorted meat']::text[], false, 17),
  ('egusi-soup', 'traditional-soups', 'Egusi Soup', 'Classic melon-seed soup cooked with leafy greens, rich spices and your chosen protein.', 20, null, null, '{}'::integer[], null, null, array['signature']::text[], 2, array['Assorted meat', 'Beef', 'Fish', 'Chicken']::text[], false, 18),
  ('ogbono-soup', 'traditional-soups', 'Ogbono Soup', 'Silky draw soup made from wild mango seeds, richly seasoned with traditional spices.', 20, null, null, '{}'::integer[], null, null, '{}'::text[], 2, array['Assorted meat', 'Beef', 'Fish', 'Chicken']::text[], false, 19),
  ('efo-riro', 'traditional-soups', 'Efo Riro', 'Vibrant Yoruba-style spinach stew simmered with peppers and aromatic spices.', 20, null, '/images/dishes/efo-riro', array[480, 800]::integer[], 1, 'Bowl of efo riro, a vibrant Yoruba spinach stew simmered with peppers and assorted meat', '{}'::text[], 2, array['Assorted meat', 'Beef', 'Fish', 'Chicken']::text[], true, 20),
  ('okra-special', 'traditional-soups', 'Okra Special', 'Richly textured okra enhanced with assorted proteins, seafood and vegetables for a fuller meal.', 20, null, '/images/dishes/okra-soup', array[480, 800, 1000]::integer[], 1.0970873786407767, 'Plate of okra soup with assorted meat and tripe, served with a smooth white swallow', array['contains-shellfish']::text[], 2, '{}'::text[], false, 21),
  ('okra-soup', 'traditional-soups', 'Okra Soup', 'Freshly sliced okra cooked to a perfect draw and lightly seasoned with herbs and spices.', 18, null, null, '{}'::integer[], null, null, '{}'::text[], 1, array['Assorted meat', 'Beef', 'Fish', 'Chicken']::text[], false, 22),
  ('vegetable-soup', 'traditional-soups', 'Vegetable Soup', 'Leafy vegetable blend cooked with peppers, stock and your chosen protein.', 18, null, null, '{}'::integer[], null, null, '{}'::text[], 2, array['Assorted meat', 'Beef', 'Fish', 'Chicken']::text[], false, 23),
  ('bitterleaf-soup', 'traditional-soups', 'Bitterleaf Soup', 'Bold, earthy soup made with washed bitterleaf, cocoyam paste and traditional seasonings.', 22, null, null, '{}'::integer[], null, null, '{}'::text[], 2, array['Assorted meat', 'Beef', 'Fish', 'Chicken']::text[], false, 24),
  ('oha-soup', 'traditional-soups', 'Oha Soup', 'Comforting Eastern Nigerian soup featuring tender oha leaves, cocoyam and hearty spices.', 22, null, null, '{}'::integer[], null, null, '{}'::text[], 2, array['Assorted meat', 'Beef', 'Fish', 'Chicken']::text[], false, 25),
  ('nsala-soup', 'traditional-soups', 'Nsala Soup', 'Light, peppery broth made without palm oil, traditionally prepared with fish or chicken and thickened with yam.', 22, null, null, '{}'::integer[], null, null, '{}'::text[], 3, array['Fish', 'Chicken']::text[], false, 26),
  ('fishermans-soup', 'traditional-soups', 'Fisherman''s Soup', 'Luxury seafood soup packed with prawns, fish, crab and shellfish. Rich, spicy and comforting.', 27, null, null, '{}'::integer[], null, null, array['contains-shellfish', 'contains-fish', 'chef-special']::text[], 3, '{}'::text[], false, 27),
  ('pounded-yam', 'swallows', 'Pounded Yam', 'Smooth, stretchy pounded yam — the classic partner for a rich traditional soup.', null, 'Included with any traditional soup', null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 28),
  ('semovita', 'swallows', 'Semovita', 'Soft, light semovita, moulded fresh and served warm alongside your soup.', null, 'Included with any traditional soup', null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 29),
  ('eba', 'swallows', 'Eba', 'Traditional garri swallow with a gentle bite, made to order for your soup.', null, 'Included with any traditional soup', null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 30),
  ('beef-suya', 'grills-and-suya', 'Beef Suya', 'Thin slices of grilled beef generously rubbed with traditional suya spice. Smoky, spicy and tender.', 15, null, '/images/dishes/beef-suya', array[480, 800, 1400]::integer[], 0.9291521486643438, 'Skewers of grilled beef suya dusted with rich, spicy suya seasoning', array['contains-peanuts', 'signature']::text[], 3, '{}'::text[], true, 31),
  ('chicken-suya', 'grills-and-suya', 'Chicken Suya', 'Char-grilled chicken strips coated in rich suya seasoning, with a juicy street-food finish.', 12, null, null, '{}'::integer[], null, null, array['contains-peanuts']::text[], 3, '{}'::text[], false, 32),
  ('grilled-croaker-fish', 'grills-and-suya', 'Grilled Croaker Fish', 'Whole croaker marinated in peppers and spices, then grilled over open heat and served with fried plantain.', 25, null, '/images/dishes/grilled-croaker-fish', array[480, 800, 1400]::integer[], 1.0854816824966078, 'Whole grilled croaker fish in peppered marinade with fried plantain', array['contains-fish', 'chef-special']::text[], 2, '{}'::text[], true, 33),
  ('grilled-tilapia', 'grills-and-suya', 'Grilled Tilapia', 'Whole tilapia seasoned with our house spice blend and grilled until smoky and tender.', 20, null, null, '{}'::integer[], null, null, array['contains-fish']::text[], 2, '{}'::text[], false, 34),
  ('nkwobi', 'meat-and-fish', 'Nkwobi', 'Tender cow foot coated in a rich, spicy palm-oil sauce seasoned with utazi leaves.', 15, null, null, '{}'::integer[], null, null, array['signature']::text[], 3, '{}'::text[], false, 35),
  ('isi-ewu', 'meat-and-fish', 'Isi Ewu', 'Tender goat head cooked in a traditional peppered palm-oil sauce with authentic spices.', 25, null, '/images/dishes/isi-ewu', array[480, 800, 1400]::integer[], 0.7714561234329798, 'Isi-Ewu — tender goat head in a rich peppered palm-oil sauce, topped with sliced onions and utazi', array['chef-special']::text[], 3, '{}'::text[], true, 36),
  ('peppered-beef', 'meat-and-fish', 'Peppered Beef', 'Juicy beef cuts stir-fried with peppers, onions and bold spices. Colourful, flavourful and ideal for sharing.', 15, null, null, '{}'::integer[], null, null, '{}'::text[], 3, '{}'::text[], false, 37),
  ('fried-plantain', 'sides', 'Fried Plantain', 'Sweet ripe plantain fried until the edges caramelise. Everybody orders a second bowl.', 5, null, '/images/dishes/fried-plantain', array[480, 800, 1400]::integer[], 1.0568031704095113, 'Golden slices of sweet fried plantain served in a bowl', array['vegan']::text[], 0, '{}'::text[], false, 38),
  ('fried-yam', 'sides', 'Fried Yam', 'Crisp golden yam wedges, fluffy inside, served with peppered sauce.', 6, null, '/images/dishes/fried-yam', array[480, 800, 1400]::integer[], 1.0973936899862826, 'Crisp golden fried yam wedges served with peppered sauce', array['vegan']::text[], 1, '{}'::text[], false, 39),
  ('moi-moi', 'sides', 'Moi Moi', 'Steamed bean pudding, softly spiced and gently savoury.', 5, null, null, '{}'::integer[], null, null, '{}'::text[], 1, '{}'::text[], false, 40),
  ('gizzard-dodo', 'sides', 'Gizzard Dodo', 'Peppered gizzards tossed with sweet fried plantain — a Nigerian party favourite.', 10, null, null, '{}'::integer[], null, null, '{}'::text[], 2, '{}'::text[], false, 41),
  ('salad-coleslaw', 'sides', 'Bowl of Salad or Coleslaw', 'A fresh, cooling side to balance the heat of the kitchen.', 5, null, null, '{}'::integer[], null, null, array['vegetarian']::text[], 0, array['Salad', 'Coleslaw']::text[], false, 42),
  ('meat-pie', 'sides', 'Meat Pie', 'Golden Nigerian pastry filled with seasoned minced beef, potato and carrot. Baked fresh.', null, 'Price on request', '/images/dishes/meat-pie', array[480, 800]::integer[], 0.7511737089201878, 'Freshly baked Nigerian meat pies with a golden pastry crust', '{}'::text[], 1, '{}'::text[], false, 43),
  ('puff-puff', 'desserts', 'Puff Puff', 'Warm, pillowy deep-fried dough balls, lightly sweetened. Sold by the portion.', 6, null, '/images/dishes/puff-puff', array[480, 800, 1400]::integer[], 0.9019165727170236, 'Golden Nigerian puff puff — soft, sweet, deep-fried dough balls', array['vegetarian', 'signature']::text[], 0, '{}'::text[], true, 44),
  ('ice-cream-medley', 'desserts', 'Ice Cream Medley', 'A cool, simple finish to a plate of bold Nigerian spice.', 5, null, null, '{}'::integer[], null, null, array['vegetarian']::text[], 0, '{}'::text[], false, 45),
  ('coke', 'drinks', 'Coke', 'Chilled 330ml can.', 3, null, null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 46),
  ('diet-coke', 'drinks', 'Diet Coke', 'Chilled 330ml can.', 3, null, null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 47),
  ('fanta', 'drinks', 'Fanta', 'Chilled 330ml can.', 3, null, null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 48),
  ('sprite', 'drinks', 'Sprite', 'Chilled 330ml can.', 3, null, null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 49),
  ('nigerian-fanta', 'drinks', 'Nigerian Fanta', 'The real thing, imported — sweeter and brighter than the UK recipe.', 3, null, null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 50),
  ('malt', 'drinks', 'Malt', 'Rich, non-alcoholic malt drink.', 3, null, null, '{}'::integer[], null, null, array['vegetarian']::text[], 0, '{}'::text[], false, 51),
  ('lemonade', 'drinks', 'Lemonade', 'Chilled and refreshing.', 3, null, null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 52),
  ('tonic-water', 'drinks', 'Tonic Water', 'Chilled tonic water.', 3, null, null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 53),
  ('j2o', 'drinks', 'J2O', 'Fruit blend soft drink.', 3, null, null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 54),
  ('red-bull', 'drinks', 'Red Bull', 'Chilled energy drink.', 3.5, null, null, '{}'::integer[], null, null, array['vegetarian']::text[], 0, '{}'::text[], false, 55),
  ('small-water', 'drinks', 'Small Water', 'Still bottled water.', 1, null, null, '{}'::integer[], null, null, array['vegan']::text[], 0, '{}'::text[], false, 56),
  ('star', 'drinks', 'Star', 'Nigerian lager. Over 18s only.', 7, null, null, '{}'::integer[], null, null, '{}'::text[], 0, '{}'::text[], false, 57),
  ('gulder', 'drinks', 'Gulder', 'Nigerian lager. Over 18s only.', 7, null, null, '{}'::integer[], null, null, '{}'::text[], 0, '{}'::text[], false, 58),
  ('trophy', 'drinks', 'Trophy', 'Nigerian lager. Over 18s only.', 7, null, null, '{}'::integer[], null, null, '{}'::text[], 0, '{}'::text[], false, 59),
  ('heineken', 'drinks', 'Heineken', 'Premium lager. Over 18s only.', 7, null, null, '{}'::integer[], null, null, '{}'::text[], 0, '{}'::text[], false, 60),
  ('stella-artois', 'drinks', 'Stella Artois', 'Premium lager. Over 18s only.', 7, null, null, '{}'::integer[], null, null, '{}'::text[], 0, '{}'::text[], false, 61),
  ('small-guinness', 'drinks', 'Small Guinness', 'Foreign extra stout. Over 18s only.', 4, null, null, '{}'::integer[], null, null, '{}'::text[], 0, '{}'::text[], false, 62),
  ('big-guinness', 'drinks', 'Big Guinness', 'Foreign extra stout. Over 18s only.', 8, null, null, '{}'::integer[], null, null, '{}'::text[], 0, '{}'::text[], false, 63),
  ('red-wine', 'drinks', 'Bottle of Red Wine', 'House red. Over 18s only.', 20, null, null, '{}'::integer[], null, null, array['vegetarian']::text[], 0, '{}'::text[], false, 64),
  ('white-wine', 'drinks', 'Bottle of White Wine', 'House white. Over 18s only.', 20, null, null, '{}'::integer[], null, null, array['vegetarian']::text[], 0, '{}'::text[], false, 65)
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  price_note = excluded.price_note,
  image_path = excluded.image_path,
  image_widths = excluded.image_widths,
  image_aspect_ratio = excluded.image_aspect_ratio,
  image_alt = excluded.image_alt,
  dietary = excluded.dietary,
  spice_level = excluded.spice_level,
  options = excluded.options,
  is_featured = excluded.is_featured,
  sort_order = excluded.sort_order
;

insert into public.gallery_items (id, type, title, caption, image_path, image_widths, aspect_ratio, alt, video_path, sort_order) values
  ('jollof-rice-chicken', 'photo', 'Jollof Rice with Chicken', 'Smoky party jollof, grilled chicken and a wedge of lime.', '/images/dishes/jollof-rice-chicken', array[480, 800, 1400]::integer[], 1.1235955056179776, 'Plate of smoky Nigerian jollof rice served with grilled chicken', null, 0),
  ('beef-suya', 'photo', 'Beef Suya', 'Thin-sliced beef, deeply rubbed with our suya spice blend.', '/images/dishes/beef-suya', array[480, 800, 1400]::integer[], 0.9291521486643438, 'Skewers of grilled beef suya dusted with rich, spicy suya seasoning', null, 1),
  ('okra-soup', 'photo', 'Okra Soup with Assorted Meat', 'A perfect draw, loaded with assorted meat.', '/images/dishes/okra-soup', array[480, 800, 1000]::integer[], 1.0970873786407767, 'Plate of okra soup with assorted meat and tripe, served with a smooth white swallow', null, 2),
  ('isi-ewu', 'photo', 'Isi-Ewu', 'Goat head in a peppered palm-oil sauce, finished with utazi.', '/images/dishes/isi-ewu', array[480, 800, 1400]::integer[], 0.7714561234329798, 'Isi-Ewu — tender goat head in a rich peppered palm-oil sauce, topped with sliced onions and utazi', null, 3),
  ('efo-riro', 'photo', 'Efo Riro', 'Yoruba-style spinach stew, rich with pepper and spice.', '/images/dishes/efo-riro', array[480, 800]::integer[], 1, 'Bowl of efo riro, a vibrant Yoruba spinach stew simmered with peppers and assorted meat', null, 4),
  ('grilled-croaker-fish', 'photo', 'Grilled Croaker Fish', 'Whole croaker off the grill with sweet fried plantain.', '/images/dishes/grilled-croaker-fish', array[480, 800, 1400]::integer[], 1.0854816824966078, 'Whole grilled croaker fish in peppered marinade with fried plantain', null, 5),
  ('grilled-fish-prawns', 'photo', 'Grilled Fish with Prawns', 'Peppers, onions and prawns over whole grilled fish, with plantain alongside.', '/images/dishes/grilled-fish-prawns', array[480, 800, 1080]::integer[], 0.7504690431519699, 'Whole grilled fish smothered in peppers and onions, crowned with prawns and served with fried plantain', null, 6),
  ('tilapia-pepper-soup', 'photo', 'Tilapia Pepper Soup', 'A zesty, herb-rich broth built for cold London evenings.', '/images/dishes/tilapia-pepper-soup', array[480, 800, 1400]::integer[], 0.9696969696969697, 'Bowl of tilapia pepper soup in a spicy, herb-rich broth', null, 7),
  ('fried-rice', 'photo', 'Fried Rice with Protein & Plantain', 'Aromatic Nigerian fried rice, plated with plantain.', '/images/dishes/fried-rice', array[480, 800, 1400]::integer[], 0.9501187648456056, 'Nigerian fried rice served with grilled protein and fried plantain', null, 8),
  ('white-rice-stew', 'photo', 'White Rice, Stew & Plantain', 'Steamed rice and peppered tomato stew — a house classic.', '/images/dishes/white-rice-stew', array[480, 800, 1400]::integer[], 1.0781671159029649, 'Steamed white rice with peppered tomato stew and fried plantain', null, 9),
  ('spaghetti-jollof', 'photo', 'Spaghetti Jollof', 'Spaghetti cooked down in a bold jollof sauce.', '/images/dishes/spaghetti-jollof', array[480, 800, 1380]::integer[], 0.7624309392265194, 'Plate of spaghetti jollof in a bold tomato and pepper sauce, served with peppered chicken', null, 10),
  ('fried-plantain', 'photo', 'Fried Plantain', 'Sweet, caramelised and never on the plate for long.', '/images/dishes/fried-plantain', array[480, 800, 1400]::integer[], 1.0568031704095113, 'Golden slices of sweet fried plantain served in a bowl', null, 11),
  ('fried-yam', 'photo', 'Fried Yam', 'Crisp outside, fluffy inside, served with peppered sauce.', '/images/dishes/fried-yam', array[480, 800, 1400]::integer[], 1.0973936899862826, 'Crisp golden fried yam wedges served with peppered sauce', null, 12),
  ('meat-pie', 'photo', 'Nigerian Meat Pie', 'Golden pastry, seasoned beef filling, baked fresh.', '/images/dishes/meat-pie', array[480, 800]::integer[], 0.7511737089201878, 'Freshly baked Nigerian meat pies with a golden pastry crust', null, 13),
  ('puff-puff', 'photo', 'Puff Puff', 'Soft, sweet and best eaten warm.', '/images/dishes/puff-puff', array[480, 800, 1400]::integer[], 0.9019165727170236, 'Golden Nigerian puff puff — soft, sweet, deep-fried dough balls', null, 14),
  ('chef-plating', 'photo', 'In the Kitchen', 'Final touches on grilled fish and plantain before service.', '/images/story/chef-plating', array[500, 760, 1100]::integer[], 0.7895109851169383, 'Chef''s hands garnishing a plate of grilled peppered fish with fried plantain in the Dilly Kitchen kitchen', null, 15),
  ('restaurant-interior', 'photo', 'Our Dining Room', 'The Dilly Kitchen dining room in Feltham.', '/images/hero/restaurant-interior', array[640, 960, 1440]::integer[], 1.3333333333333333, 'The Dilly Kitchen dining room in Feltham with black leather chairs, gold-trimmed tables and DK logo wall art', null, 16),
  ('birthday-package', 'photo', 'Birthday Celebration Package', 'A birthday package prepared for a Dilly Kitchen client.', '/images/catering/birthday-package', array[480, 720]::integer[], 0.5625, 'Birthday celebration hamper with black and gold balloons, chocolates, grapes and sparkling wine prepared by Dilly Kitchen', null, 17)
on conflict (id) do update set
  type = excluded.type,
  title = excluded.title,
  caption = excluded.caption,
  image_path = excluded.image_path,
  image_widths = excluded.image_widths,
  aspect_ratio = excluded.aspect_ratio,
  alt = excluded.alt,
  video_path = excluded.video_path,
  sort_order = excluded.sort_order
;

insert into public.testimonials (id, quote, author, context, rating, is_placeholder, sort_order) values
  ('sample-1', 'The jollof rice tasted exactly like home. Portions were generous and the plantain was perfectly caramelised.', 'Sample review', 'Dine in, Feltham', 5, true, 0),
  ('sample-2', 'We booked Dilly Kitchen for a 60th birthday and the egusi and suya disappeared before the speeches finished.', 'Sample review', 'Birthday catering, West London', 5, true, 1),
  ('sample-3', 'Ordered the pepper soup on a cold evening and it did exactly what it was supposed to do. Proper spice, proper flavour.', 'Sample review', 'Takeaway order', 5, true, 2)
on conflict (id) do update set
  quote = excluded.quote,
  author = excluded.author,
  context = excluded.context,
  rating = excluded.rating,
  is_placeholder = excluded.is_placeholder,
  sort_order = excluded.sort_order
;

insert into public.story_sections (id, eyebrow, heading, paragraphs, sort_order) values
  ('our-beginning', 'Chapter One', 'Our Beginning', array['Before Dilly Kitchen had a name, a menu, or a dining table, there was a little girl with a tiny play pot, a wooden spoon, and a big dream.', 'While other children played, she created imaginary feasts for her family. Her tiny kitchen had no expensive equipment or secret recipes, yet every pretend meal carried one special ingredient: love.', 'What began as childhood play soon grew into a lifelong passion. The little pot became a real cooking pot. The imaginary meals became rich Nigerian dishes, filled with bold spices, treasured traditions, and flavours inspired by home.']::text[], 0),
  ('our-heritage', 'Chapter Two', 'Our African Heritage', array['Every dish we serve carries a place of origin. Egusi and ogbono from the East. Efo riro from the West. Suya from the North, rubbed with the peanut-and-pepper blend that follows the smoke down every Nigerian street.', 'We cook them the way they were taught to us — palm oil bloomed properly, stock built from the bone, pepper ground fresh rather than shaken from a jar. Nothing is simplified to travel better.', 'Today, Dilly Kitchen brings fresh Nigerian and Pan-African cuisine to your table. Every serving celebrates family, culture, community, and the joy of sharing good food.']::text[], 1),
  ('our-philosophy', 'Chapter Three', 'Our Cooking Philosophy', array['At Dilly Kitchen, food means more than satisfying hunger. Food brings people together, preserves memories, and carries culture from one generation to another.', 'We prepare every meal with fresh ingredients, traditional recipes, careful attention, and genuine hospitality. Our dishes honour the richness of African cuisine while offering a warm and memorable dining experience.', 'Years of learning, dedication, and experience followed that first play pot. Every recipe improved, but the heart behind each meal stayed the same. From the first sound of onions sizzling to the final garnish on the plate, every moment tells a story.']::text[], 2),
  ('the-woman-behind', 'Chapter Four', 'The Woman Behind Dilly Kitchen', array['The little girl grew up, but her dream never left the kitchen. She still tastes every pot before it leaves the pass, still grinds her own pepper, and still cooks as though the people eating are family — because most days, they are.', 'What she built in Feltham is a room where a Nigerian guest recognises the flavour instantly, and a first-time guest understands it immediately. That is the whole ambition.']::text[], 3),
  ('made-with-love', 'Chapter Five', 'Food Made with Love', array['From our kitchen to your table, we serve every plate with love, pride, and a taste of home.', 'Welcome to Dilly Kitchen, where a childhood dream became a beautiful feast, and every plate invites you into the next chapter.']::text[], 4)
on conflict (id) do update set
  eyebrow = excluded.eyebrow,
  heading = excluded.heading,
  paragraphs = excluded.paragraphs,
  sort_order = excluded.sort_order
;

insert into public.catering_options (id, title, description, icon, sort_order) values
  ('weddings', 'Weddings', 'Traditional and white weddings, from the small-chops table to full hot buffets for hundreds of guests.', 'rings', 0),
  ('birthdays', 'Birthdays', 'Milestone parties and family birthdays, with celebration packages and crowd-pleasing party jollof.', 'cake', 1),
  ('corporate-events', 'Corporate Events', 'Office launches, away days and client dinners delivered on time, plated or buffet-style.', 'briefcase', 2),
  ('family-gatherings', 'Family Gatherings', 'Naming ceremonies, christenings and Sunday get-togethers — the food you grew up on, made properly.', 'home', 3),
  ('private-parties', 'Private Parties', 'Intimate dinners and house parties, with a menu built around exactly what your guests love.', 'sparkle', 4),
  ('large-celebrations', 'Large Celebrations', 'Hall events and community celebrations at scale, with serving staff and equipment arranged on request.', 'users', 5)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  sort_order = excluded.sort_order
;

insert into public.site_links (key, label, href, is_placeholder, sort_order) values
  ('whatsapp', 'WhatsApp Us', 'https://wa.me/447535502212', false, 0),
  ('googleMapsDirections', 'Get Google Maps Directions', 'https://www.google.com/maps/dir/?api=1&destination=Dilly+Kitchen+100+High+Street+Feltham+TW13+4EX', false, 1),
  ('googleReviews', 'Read Our Google Reviews', '', true, 2),
  ('uberEats', 'Order on Uber Eats', 'https://www.ubereats.com/store-browse-uuid/fcd5e175-b3ae-4bff-bb7e-631f563d1035?diningMode=DELIVERY', false, 3),
  ('instagram', 'Instagram', '', true, 4),
  ('facebook', 'Facebook', '', true, 5),
  ('tiktok', 'TikTok', '', true, 6),
  ('bookTable', 'Book a table', 'https://wa.me/447535502212?text=Hello%20Dilly%20Kitchen!%20I%20would%20like%20to%20book%20a%20table.', false, 7),
  ('discoverMenu', 'Discover our menu', '/menu', false, 8)
on conflict (key) do nothing
;

insert into public.site_settings (key, value) values
  ('allergen_notice', '"Our dishes are prepared in a kitchen that handles peanuts, fish, shellfish, gluten and dairy. Please tell us about any allergies or dietary requirements when you order and our team will guide you."'::jsonb),
  ('whatsapp_number', '"447535502212"'::jsonb),
  ('whatsapp_messages', '{"general":"Hello Dilly Kitchen! I would like to know more about your menu.","order":"Hello Dilly Kitchen! I would like to place an order.","catering":"Hello Dilly Kitchen! I would like to enquire about catering for an event.","booking":"Hello Dilly Kitchen! I would like to book a table."}'::jsonb),
  ('opening_hours', '{"display":"3:00 PM – 12:00 AM","days":"Monday – Sunday","schema":["Mo-Su 15:00-24:00"]}'::jsonb)
on conflict (key) do nothing
;
