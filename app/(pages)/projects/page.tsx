// app/projects/page.tsx
"use client";

import { ProjectCard } from '@/components/sections/ProjectCard';
import { PROJECTS_DATA } from '@/lib/data';
import { motion, type Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

export default function ProjectsPage() {
  return (
    <section className="py-8">
      <motion.h1 
        className="mb-10 text-center text-5xl font-extrabold text-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Projects
      </motion.h1>      
      <motion.p 
        className="mb-12 text-center text-lg text-foreground/70 max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.42, 0, 0.58, 1] }} 
      >
        Explore my smart contract and Web3 work, including experiments and projects that are still in development.
      </motion.p>
      <motion.div 
        className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {PROJECTS_DATA.map((project) => (
          <motion.div key={project.slug} variants={itemVariants}>
            <ProjectCard project={project} /> 
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}