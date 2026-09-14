/**
 * Our Story content — adapted from the "OUR STORY" document supplied by the
 * business. The original wording is preserved wherever possible and grouped
 * into the sections requested for the page.
 */

export interface StorySection {
  id: string
  eyebrow: string
  heading: string
  paragraphs: string[]
}

export const storySections: StorySection[] = [
  {
    id: 'our-beginning',
    eyebrow: 'Chapter One',
    heading: 'Our Beginning',
    paragraphs: [
      'Before Dilly Kitchen had a name, a menu, or a dining table, there was a little girl with a tiny play pot, a wooden spoon, and a big dream.',
      'While other children played, she created imaginary feasts for her family. Her tiny kitchen had no expensive equipment or secret recipes, yet every pretend meal carried one special ingredient: love.',
      'What began as childhood play soon grew into a lifelong passion. The little pot became a real cooking pot. The imaginary meals became rich Nigerian dishes, filled with bold spices, treasured traditions, and flavours inspired by home.',
    ],
  },
  {
    id: 'our-heritage',
    eyebrow: 'Chapter Two',
    heading: 'Our African Heritage',
    paragraphs: [
      'Every dish we serve carries a place of origin. Egusi and ogbono from the East. Efo riro from the West. Suya from the North, rubbed with the peanut-and-pepper blend that follows the smoke down every Nigerian street.',
      'We cook them the way they were taught to us — palm oil bloomed properly, stock built from the bone, pepper ground fresh rather than shaken from a jar. Nothing is simplified to travel better.',
      'Today, Dilly Kitchen brings fresh Nigerian and Pan-African cuisine to your table. Every serving celebrates family, culture, community, and the joy of sharing good food.',
    ],
  },
  {
    id: 'our-philosophy',
    eyebrow: 'Chapter Three',
    heading: 'Our Cooking Philosophy',
    paragraphs: [
      'At Dilly Kitchen, food means more than satisfying hunger. Food brings people together, preserves memories, and carries culture from one generation to another.',
      'We prepare every meal with fresh ingredients, traditional recipes, careful attention, and genuine hospitality. Our dishes honour the richness of African cuisine while offering a warm and memorable dining experience.',
      'Years of learning, dedication, and experience followed that first play pot. Every recipe improved, but the heart behind each meal stayed the same. From the first sound of onions sizzling to the final garnish on the plate, every moment tells a story.',
    ],
  },
  {
    id: 'the-woman-behind',
    eyebrow: 'Chapter Four',
    heading: 'The Woman Behind Dilly Kitchen',
    paragraphs: [
      'The little girl grew up, but her dream never left the kitchen. She still tastes every pot before it leaves the pass, still grinds her own pepper, and still cooks as though the people eating are family — because most days, they are.',
      'What she built in Feltham is a room where a Nigerian guest recognises the flavour instantly, and a first-time guest understands it immediately. That is the whole ambition.',
    ],
  },
  {
    id: 'made-with-love',
    eyebrow: 'Chapter Five',
    heading: 'Food Made with Love',
    paragraphs: [
      'From our kitchen to your table, we serve every plate with love, pride, and a taste of home.',
      'Welcome to Dilly Kitchen, where a childhood dream became a beautiful feast, and every plate invites you into the next chapter.',
    ],
  },
]

export const storyValues = [
  {
    id: 'fresh',
    title: 'Fresh Ingredients',
    description: 'Sourced regularly and prepped the same day, never held over.',
  },
  {
    id: 'traditional',
    title: 'Traditional Recipes',
    description: 'Cooked the way they were taught, with no shortcuts taken.',
  },
  {
    id: 'hospitality',
    title: 'Genuine Hospitality',
    description: 'Every guest is welcomed the way family would be.',
  },
]

export const chef = {
  name: 'The Chef & Founder',
  role: 'Founder — Dilly Kitchen',
  /** The business has not supplied the chef's name for publication yet. */
  quote:
    'The little pot became a real cooking pot. The imaginary meals became rich Nigerian dishes — but the one ingredient never changed.',
  bio: [
    'She began cooking as a child with a play pot and a wooden spoon, serving imaginary feasts to her family. Years of learning, dedication and experience turned that game into a craft.',
    'Today she leads the Dilly Kitchen pass in Feltham, cooking Nigerian and Pan-African food for dining rooms, takeaway counters and celebrations across London.',
  ],
  image: {
    base: '/images/story/chef-portrait',
    widths: [480, 700, 1000],
    aspectRatio: 1023 / 1412,
    alt: 'The founder of Dilly Kitchen in black chef whites and chef hat, standing beside the counter in front of West African artwork',
  },
}
