// lib/schemas.ts
import { z } from 'zod';

// Validation schema for Contact Form
export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.email({ message: "Invalid email." }),
  subject: z.string().min(1, { message: "Subject cannot be empty." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export type ContactFormInputs = z.infer<typeof contactFormSchema>;