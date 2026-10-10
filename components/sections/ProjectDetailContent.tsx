// components/sections/ProjectDetailContent.tsx
"use client";

import { motion, Variants } from 'framer-motion';
import { DetailedProject } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaLink, FaTools } from 'react-icons/fa';
import { ImageGallery } from './ImageGallery';

// Varian animation for the entire page
const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
        duration: 0.8, 
        ease: [0.42, 0, 0.58, 1],
        staggerChildren: 0.1 
    } 
  },
};

// Varian animation for each section/item
const sectionItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

type ProjectDetailContentProps = {
    project: DetailedProject; // Accepts project data as a prop
};

export const ProjectDetailContent = ({ project }: ProjectDetailContentProps) => {
    return (
        <motion.article 
            className="max-w-4xl mx-auto py-8"
            initial="hidden"
            animate="visible"
            variants={pageVariants}
        >
            
            {/* Header & Hero Image */}
            <motion.header variants={sectionItem} className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold md:text-5xl text-primary">{project.title}</h1>
                <p className="mt-2 text-xl text-foreground/70">{project.shortDescription}</p>
                {project.status && (
                    <span className="mt-4 inline-flex rounded-full border border-border bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                        {project.status}
                    </span>
                )}
            </motion.header>

            {/* Add a thumbnail path in lib/data.ts when project artwork is ready. */}
            <motion.div variants={sectionItem} className="relative mb-12 h-96 w-full overflow-hidden rounded-xl border border-border shadow-sm">
                {project.thumbnail ? (
                    <Image
                        src={project.thumbnail}
                        alt={`Thumbnail proyek ${project.title}`}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-secondary/30 px-6 text-center text-muted-foreground">
                        <span className="text-lg font-semibold">Thumbnail placeholder</span>
                        <span className="text-sm">Replace the thumbnail path in lib/data.ts</span>
                    </div>
                )}
            </motion.div>

            {/* Link dan Tags */}
            <motion.div variants={sectionItem} className="flex flex-wrap items-center justify-center gap-4 mb-10">
                {/* ... (Link component) ... */}
                {project.liveUrl && (
                    <Link target="_blank" href={project.liveUrl}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white font-semibold transition hover:bg-green-700">
                        <FaLink /> Live Demo
                    </Link>
                )}
                {project.githubUrl && (
                    <Link target="_blank" href={project.githubUrl}
                        className="flex items-center gap-2 rounded-lg border border-border bg-secondary 
                                   px-4 py-2 font-semibold text-secondary-foreground transition hover:bg-secondary/80">
                        <FaGithub /> GitHub Repo
                    </Link>
                )}
            </motion.div>

            {/* Case Study Details */} 
            <div className="space-y-12">
                
                {/* Full Description*/}
                <motion.section variants={sectionItem}>
                    <h2 className="text-3xl font-bold border-b pb-2 mb-4">Project Summary</h2>
                    <p className="text-lg text-foreground/80">{project.fullDescription}</p>
                </motion.section>

                {/* Role and challenges (2 Column Grid) */}
                <motion.div variants={sectionItem} className="grid gap-8 md:grid-cols-2">
                    <div className="rounded-lg border p-6 shadow-sm">
                        <h3 className="text-2xl font-bold mb-3 text-primary">My Role</h3>
                        <p className="text-foreground/80">{project.role}</p>
                    </div>
                    <div className="rounded-lg border p-6 shadow-sm">
                        <h3 className="text-2xl font-bold mb-3 text-red-500">Challenges</h3>
                        <p className="text-foreground/80">{project.challenge}</p>
                    </div>
                </motion.div>

                {/* Solution */}
                <motion.section variants={sectionItem} className="rounded-lg border p-6 bg-secondary/30">
                    <h2 className="text-3xl font-bold border-b pb-2 mb-4">Solution & Implementation</h2>
                    <p className="text-lg text-foreground/80">{project.solution}</p>
                </motion.section>

                {/* Main Features */}
                <motion.section variants={sectionItem}>
                    <h2 className="text-3xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
                        <FaTools /> Main Features
                    </h2>
                    <ul className="list-disc space-y-2 pl-6 text-lg text-foreground/80">
                        {project.keyFeatures.map((feature, index) => (
                          // Using motion.li for staggered effect
                          <motion.li variants={sectionItem} key={index}>{feature}</motion.li>
                        ))}
                    </ul>
                </motion.section>

                {/* Technlogy tags */}
                <motion.section variants={sectionItem}>
                    <h2 className="text-2xl font-bold mb-3">Technology</h2>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary border border-primary/30">
                                {tag}
                            </span>
                        ))}
                    </div>
                </motion.section>

                {/* Gallery Section */}
                {project.galleryImages && project.galleryImages.length > 0 && (
                  <motion.div variants={sectionItem}>
                    <ImageGallery images={project.galleryImages} title="Gallery" />
                  </motion.div>
                )}
            </div>
            
        </motion.article>
    );
};