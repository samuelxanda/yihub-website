
import React from 'react';
import { Rocket, Code, Users, Zap, Terminal, Heart, Star, Globe } from 'lucide-react';
import { Achievement, Activity, Event } from './types';

export const COLORS = {
  background: '#193441',
  accent: '#438CAF',
  text: '#FFFFFF',
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: '1', label: 'Events Hosted', value: '5+', icon: '🚀' },
  { id: '2', label: 'Students Involved', value: '120+', icon: '🔥' },
  { id: '3', label: 'Projects Built', value: '30+', icon: '🛠️' },
  { id: '4', label: 'Schools Reached', value: '8', icon: '🏫' },
];

export const ACTIVITIES: Activity[] = [
  {
    title: 'Hackathons',
    description: 'Build fast, learn faster',
    icon: '⚡',
  },
  {
    title: 'Workshops',
    description: 'Hands-on, no boring slides',
    icon: '🔧',
  },
  {
    title: 'Tech Talks',
    description: 'Real people, real stories',
    icon: '🎤',
  },
  {
    title: 'CodeLift Outreach',
    description: 'Inspiring the next builders',
    icon: '💪',
  },
  {
    title: 'Open Source',
    description: 'Build for the real world',
    icon: '🌐',
  },
];

export const UPCOMING_EVENTS: Event[] = [
  { title: 'Kigali Builders Meetup', date: 'Next Saturday, 2PM', type: 'Community' },
  { title: 'Project Demo Day', date: 'Aug 15th', type: 'Showcase' },
  { title: 'Build-a-Thon 2024', date: 'Coming Soon', type: 'Hackathon' },
];
