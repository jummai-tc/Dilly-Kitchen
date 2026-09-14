/**
 * Gallery data.
 *
 * Every photograph here was supplied by the business — no stock imagery.
 *
 * BACKEND SEAM: `videos` is intentionally empty because no video files were
 * supplied. When a backend is connected, both arrays should come from a
 * `gallery_items` table (see `services/galleryService.ts`). The video filter and
 * player are already built and will light up as soon as items appear.
 */
import type { GalleryItem } from '@/types'
import { dishImages } from './menu'

export const galleryPhotos: GalleryItem[] = [
  {
    id: 'jollof-rice-chicken',
    type: 'photo',
    title: 'Jollof Rice with Chicken',
    caption: 'Smoky party jollof, grilled chicken and a wedge of lime.',
    image: dishImages.jollofChicken,
  },
  {
    id: 'beef-suya',
    type: 'photo',
    title: 'Beef Suya',
    caption: 'Thin-sliced beef, deeply rubbed with our suya spice blend.',
    image: dishImages.beefSuya,
  },
  {
    id: 'okra-soup',
    type: 'photo',
    title: 'Okra Soup with Assorted Meat',
    caption: 'A perfect draw, loaded with assorted meat.',
    image: dishImages.okraSoup,
  },
  {
    id: 'isi-ewu',
    type: 'photo',
    title: 'Isi-Ewu',
    caption: 'Goat head in a peppered palm-oil sauce, finished with utazi.',
    image: dishImages.isiEwu,
  },
  {
    id: 'efo-riro',
    type: 'photo',
    title: 'Efo Riro',
    caption: 'Yoruba-style spinach stew, rich with pepper and spice.',
    image: dishImages.efoRiro,
  },
  {
    id: 'grilled-croaker-fish',
    type: 'photo',
    title: 'Grilled Croaker Fish',
    caption: 'Whole croaker off the grill with sweet fried plantain.',
    image: dishImages.grilledCroaker,
  },
  {
    id: 'grilled-fish-prawns',
    type: 'photo',
    title: 'Grilled Fish with Prawns',
    caption: 'Peppers, onions and prawns over whole grilled fish, with plantain alongside.',
    image: dishImages.grilledFishPrawns,
  },
  {
    id: 'tilapia-pepper-soup',
    type: 'photo',
    title: 'Tilapia Pepper Soup',
    caption: 'A zesty, herb-rich broth built for cold London evenings.',
    image: dishImages.tilapiaPepperSoup,
  },
  {
    id: 'fried-rice',
    type: 'photo',
    title: 'Fried Rice with Protein & Plantain',
    caption: 'Aromatic Nigerian fried rice, plated with plantain.',
    image: dishImages.friedRice,
  },
  {
    id: 'white-rice-stew',
    type: 'photo',
    title: 'White Rice, Stew & Plantain',
    caption: 'Steamed rice and peppered tomato stew — a house classic.',
    image: dishImages.whiteRiceStew,
  },
  {
    id: 'spaghetti-jollof',
    type: 'photo',
    title: 'Spaghetti Jollof',
    caption: 'Spaghetti cooked down in a bold jollof sauce.',
    image: dishImages.spaghettiJollof,
  },
  {
    id: 'fried-plantain',
    type: 'photo',
    title: 'Fried Plantain',
    caption: 'Sweet, caramelised and never on the plate for long.',
    image: dishImages.friedPlantain,
  },
  {
    id: 'fried-yam',
    type: 'photo',
    title: 'Fried Yam',
    caption: 'Crisp outside, fluffy inside, served with peppered sauce.',
    image: dishImages.friedYam,
  },
  {
    id: 'meat-pie',
    type: 'photo',
    title: 'Nigerian Meat Pie',
    caption: 'Golden pastry, seasoned beef filling, baked fresh.',
    image: dishImages.meatPie,
  },
  {
    id: 'puff-puff',
    type: 'photo',
    title: 'Puff Puff',
    caption: 'Soft, sweet and best eaten warm.',
    image: dishImages.puffPuff,
  },
  {
    id: 'chef-plating',
    type: 'photo',
    title: 'In the Kitchen',
    caption: 'Final touches on grilled fish and plantain before service.',
    image: {
      base: '/images/story/chef-plating',
      widths: [500, 760, 1100],
      aspectRatio: 1114 / 1411,
      alt: "Chef's hands garnishing a plate of grilled peppered fish with fried plantain in the Dilly Kitchen kitchen",
    },
  },
  {
    id: 'restaurant-interior',
    type: 'photo',
    title: 'Our Dining Room',
    caption: 'The Dilly Kitchen dining room in Feltham.',
    image: {
      base: '/images/hero/restaurant-interior',
      widths: [640, 960, 1440],
      aspectRatio: 1448 / 1086,
      alt: 'The Dilly Kitchen dining room in Feltham with black leather chairs, gold-trimmed tables and DK logo wall art',
    },
  },
  {
    id: 'birthday-package',
    type: 'photo',
    title: 'Birthday Celebration Package',
    caption: 'A birthday package prepared for a Dilly Kitchen client.',
    image: {
      base: '/images/catering/birthday-package',
      widths: [480, 720],
      aspectRatio: 720 / 1280,
      alt: 'Birthday celebration hamper with black and gold balloons, chocolates, grapes and sparkling wine prepared by Dilly Kitchen',
    },
  },
]

/**
 * No video files were supplied by the business yet.
 * Add entries in this shape and the Videos filter populates automatically:
 *
 *   {
 *     id: 'kitchen-tour',
 *     type: 'video',
 *     title: 'Kitchen Tour',
 *     caption: 'A look behind the pass.',
 *     videoSrc: '/videos/kitchen-tour.mp4',
 *     image: { base: '/images/video-posters/kitchen-tour', widths: [480, 800], aspectRatio: 16 / 9, alt: '...' },
 *   }
 */
export const galleryVideos: GalleryItem[] = []

export const galleryItems: GalleryItem[] = [...galleryPhotos, ...galleryVideos]
