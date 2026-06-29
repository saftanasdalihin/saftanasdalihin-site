// app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactFormSchema } from '@/lib/schemas'; // Import schemas validation

// Resend Initialization (will reading from .env.local)
const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resend = resendApiKey ? new Resend(resendApiKey) : null;

// Email Target for receiving contact form messages
const EMAIL_TARGET = 'saftanasdalihin@gmail.com'; 
// Verified Resend Sender Email
const EMAIL_SENDER = 'onboarding@resend.dev'; 

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Validating form data using Zod schema
    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      // If validation fails, return 400 with error details
      return NextResponse.json(
        { 
          message: 'Invalid form data.', 
          errors: validationResult.error.format() 
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validationResult.data;

    if (!resend) {
      console.warn('RESEND_API_KEY is not configured. Skipping email delivery.');
      return NextResponse.json({ message: 'Message received. Email delivery is currently unavailable.' });
    }

    // 2. Sending email using Resend
    const { data, error } = await resend.emails.send({
      from: `Portfolio Contact <${EMAIL_SENDER}>`,
      to: [EMAIL_TARGET], // Send to email target
      replyTo: email, // Set reply-to to user's email
      subject: `[PORTFOLIO] ${subject} - from ${name}`,
      html: `
        <h2>New message from Portfolio</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    if (error) {
      // Log Resend-specific error
      console.error('RESEND ERROR:', error);
      return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent successfully! Thank you, I will reply soon.' });
  } catch (error) {
    // General error handling
    console.error('API Error:', error);
    return NextResponse.json({ message: 'An error occurred on the server.' }, { status: 500 });
  }
}