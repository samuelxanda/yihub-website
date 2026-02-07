/**
 * Shared TypeScript interfaces for the Events → Projects feature.
 * These mirror the shapes returned by our Netlify Functions.
 */

export interface EventSummary {
  id: string;
  name: string;
  slug: string;
  startDate: string;
  endDate: string | null;
  location: string | null;
  status: 'Upcoming' | 'Live' | 'Past';
  submissionOpen: boolean;
  description: string | null;
  coverImageUrl: string | null;
}

export interface ProjectSummary {
  id: string;
  title: string;
  slug: string;
  category: string[];
  shortDescription: string;
  projectUrl: string | null;
  thumbnailUrl: string | null;
  school: string | null;
  submittedAt: string | null;
}

export interface ProjectDetail extends ProjectSummary {
  fullDescription: string | null;
  githubUrl: string | null;
  event: { id: string; name: string; slug: string } | null;
}

export interface SchoolSummary {
  name: string;
  slug: string;
}
