/**
 * Single registry for all community/event photography on the site.
 */

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 'game-jam-hero',
    src: 'https://res.cloudinary.com/djxxw3ppc/image/upload/v1769309314/IMG_6025_t1itto.jpg',
    alt: 'Youth Innovators Hub Game Jam — students building together',
    caption: 'Game Jam — the room was electric',
  },
  {
    id: 'collab-event',
    src: 'https://res.cloudinary.com/djxxw3ppc/image/upload/v1769312817/_NIY3042_hikvkv.jpg',
    alt: 'YIHUB members collaborating at a tech event in Rwanda',
    caption: 'Builders collaborating at a community event',
  },
  {
    id: 'workshop-build',
    src: 'https://res.cloudinary.com/djxxw3ppc/image/upload/v1769313717/IMG_5954_ntc9ku.jpg',
    alt: 'Students building projects at a Youth Innovators Hub workshop',
    caption: 'Hands-on workshop — Rwamagana outreach',
  },
  {
    id: 'present-projects',
    src: 'https://res.cloudinary.com/djxxw3ppc/image/upload/v1769313728/_NIY3030_2_mdqxob.jpg',
    alt: 'Youth innovators presenting tech projects in Kigali',
    caption: 'Presenting projects to peers',
  },
  {
    id: 'hackathon-code',
    src: 'https://res.cloudinary.com/djxxw3ppc/image/upload/v1769313997/_NIY3037_urxedm.jpg',
    alt: 'YIHUB hackathon participants coding together',
    caption: 'Hackathon — heads down, shipping together',
  },
];

export const HERO_IMAGE = GALLERY_IMAGES[0];

/** Collage/mosaic photos — excludes hero (already full-bleed above the fold) */
export const COMMUNITY_PHOTOS = GALLERY_IMAGES.filter((img) => img.id !== HERO_IMAGE.id).map(
  ({ src, alt }) => ({ src, alt }),
);

export function galleryImageById(id: string): GalleryImage {
  const image = GALLERY_IMAGES.find((img) => img.id === id);
  if (!image) throw new Error(`Unknown gallery image: ${id}`);
  return image;
}
