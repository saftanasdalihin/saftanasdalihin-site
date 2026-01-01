// app/contact/page.tsx
"use client";

import { ContactForm } from "@/components/sections/ContactForm";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: any = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.42, 0, 0.58, 1],
    },
  },
};

export default function ContactPage() {
  return (
    <motion.section 
        className="py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      <motion.h1 
        variants={itemVariants} 
        className="mb-10 text-center text-5xl font-extrabold text-primary"
      >
        Contact Me
      </motion.h1>
      <motion.p 
        variants={itemVariants}
        className="mb-12 text-center text-lg text-foreground/70 max-w-3xl mx-auto"
      >
        Ready to build the future of decentralized applications? 
        Whether you have career opportunities, a complex smart contract project, or just want to connect, please send me a message.
      </motion.p>
      <motion.div 
        variants={containerVariants}
        className="grid gap-10 lg:grid-cols-3"
      >
        
        {/* Contact info coloumn */}
        <div className="space-y-6 lg:col-span-1">
          <motion.div variants={itemVariants}>
            <ContactInfoItem icon={FaEnvelope} title="Email" value="saftanasdalihin@gmail.com" link="mailto:saftanasdalihin@gmail.com" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ContactInfoItem icon={FaMapMarkerAlt} title="Location" value="West Java, Indonesia" />
          </motion.div>
        </div>

        {/* Form coloumn */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <ContactForm />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

const ContactInfoItem = ({ icon: Icon, title, value, link }: { icon: any, title: string, value: string, link?: string }) => (
  <div className="flex items-start gap-4 rounded-xl border p-4 shadow-sm">
    <Icon size={24} className="text-primary mt-1 shrink-0" />
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-foreground/80 hover:text-primary transition-colors">
          {value}
        </a>
      ) : (
        <p className="text-foreground/80">{value}</p>
      )}
    </div>
  </div>
);