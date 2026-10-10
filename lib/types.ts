// lib/types.ts
export type Project = {
  slug: string;
  title: string;
  shortDescription: string;
  thumbnail: string; // path to /public/images/projects/...
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  status?: string;
};

// Detailed page type
export type DetailedProject = Project & {
  fullDescription: string;
  role: string;
  challenge: string;
  solution: string;
  keyFeatures: string[];
  galleryImages: string[];
};