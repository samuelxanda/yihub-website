/**
 * LinkedIn-backed community moments for the landing page.
 * Real rooms and gatherings — not a project gallery.
 */

import { COMMUNITY_PHOTOS, galleryImageById } from './gallery';

export { COMMUNITY_PHOTOS };

export interface Moment {
  id: string;
  label: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  href?: string;
}

export const WHATSAPP_JOIN =
  'https://chat.whatsapp.com/DgU4FYHIqltLjGThwEIFZp';

const gameJam = galleryImageById('game-jam-hero');

export const FOUNDER_STORY = {
  label: 'Founder story',
  title: 'Why Youth Innovators Hub exists',
  body: 'In high school, I studied software development — exposed to programming languages and concepts, but rarely given the time to actually practice what we learned. I had ideas I wanted to build, but not yet the skills to turn them into real, shipped projects. So I started Youth Innovators Hub: a space where young people can build real things, learn from each other, and grow together — without waiting for permission or perfect conditions.',
  image: '/images/founder-story.jpg',
  imageAlt: 'YIHUB founder presenting at a tech talk with a microphone',
  founderName: 'Niyomugabo Samuel',
  founderRole: 'Founder',
};

export const MOMENTS: Moment[] = [
  {
    id: 'game-jam',
    label: 'Recent',
    title: 'Game Jam — the room was electric',
    body: 'University and high school students from across Rwanda filled the space with curiosity and drive. Over 200 young people showed up to make games in days, not months — and the energy was undeniable.',
    image: gameJam.src,
    imageAlt: gameJam.alt,
    href: '/hackathons',
  },
];

export const PROGRAMS = [
  {
    title: 'Hackathons',
    slug: 'hackathons',
    desc: 'Sprints where you ship under pressure — caffeine optional, learning required.',
  },
  {
    title: 'Workshops',
    slug: 'workshops',
    desc: 'Hands-on skills for modern builders. No slide decks that put you to sleep.',
  },
  {
    title: 'CodeLift',
    slug: 'codelift',
    desc: 'Outreach that brings coding and tech skills into secondary schools across Rwanda.',
  },
  {
    title: 'Showcase',
    slug: 'showcase',
    desc: 'Put your work in front of peers and mentors who actually care.',
  },
  {
    title: 'Meetups',
    slug: 'meetups',
    desc: 'Hang with people who get your nerdy jokes — and push your next build.',
  },
  {
    title: 'Tech talks',
    slug: 'tech-talks',
    desc: 'Real people, real stories from builders further down the path.',
  },
];

export const CREED = [
  'Build first.',
  'Ask loudly.',
  'Fail fast.',
  'Grow together.',
];
