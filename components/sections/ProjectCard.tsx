"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { motion } from 'framer-motion';

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link 
      href={`/projects/${project.slug}`}
      className="block h-full"
    >
      <motion.article 
        className="rounded-lg border border-border overflow-hidden bg-background h-full shadow-sm transition-shadow duration-300 hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Replace the placeholder by setting the thumbnail path in lib/data.ts. */}
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project.title}
            width={800}
            height={450}
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="flex h-48 w-full items-center justify-center border-b border-dashed border-border bg-secondary/30 px-6 text-center text-sm text-muted-foreground">
            <span>Thumbnail placeholder<br />Replace the path in lib/data.ts</span>
          </div>
        )}
        <div className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-lg font-semibold">{project.title}</h3>
            {project.status && (
              <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                {project.status}
              </span>
            )}
          </div>
          <p className="text-foreground/70 text-sm mb-4 h-16 line-clamp-3 overflow-hidden">
            {project.shortDescription}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tags?.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <span className="text-primary underline">
                View Details
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}