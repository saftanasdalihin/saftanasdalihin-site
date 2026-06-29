# Safta Nasdalihin | Smart Contract Developer

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

---

Welcome to my personal portfolio website! This site showcases my expertise in architecting and auditing **secure Smart Contracts**, designing robust **blockchain protocols**, and building high-performance **Decentralized Applications (DApps)**.

Built with modern web standards, this portfolio demonstrates my commitment to performance, security, and exceptional user experience.

## ✨ Highlights

- **Smart Contract Expertise:** Specialization in secure, efficient, and transparent blockchain applications across multiple networks.
- **Protocol Auditing:** Focus on designing trustless systems and auditing code for vulnerabilities and optimization.
- **High Performance:** Optimized for speed with Server-Side Rendering (SSR), image optimization, and Lighthouse/Core Web Vitals.
- **Smooth Animations:** Leverages `Framer Motion` for elegant, purposeful animations that enhance user engagement.
- **Dark Mode Support:** Full Light/Dark mode implementation using `next-themes` for semantic contrast.
- **Secure Contact Form:** Powered by `Resend API` with frontend validation using `react-hook-form` and `Zod`.
- **SEO Ready:** Proper metadata and structured data using Next.js App Router Server Components.

## 🚀 Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Full-stack rendering, routing, and optimization. |
| **Language** | TypeScript | Type-safe, scalable, and maintainable codebase. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS for rapid, responsive design. |
| **Animation** | Framer Motion | Physics-based, declarative UI animations. |
| **Form Management** | React Hook Form + Zod | Efficient form state management and schema validation. |
| **Email Service** | Resend API | Reliable transaction email delivery for contact forms. |
| **Icons** | React Icons | Consistent, accessible icon library. |
| **Deployment** | Vercel | Seamless CI/CD and performance optimization. |

## 📋 Features

- **Hero Section:** Compelling introduction with animated call-to-action.
- **About Section:** Professional bio, skills grid, and experience highlights.
- **Projects Showcase:** Filterable project grid with live previews and GitHub links.
- **Project Detail Pages:** In-depth case studies with architecture, challenges, solutions, and screenshots.
- **Contact Form:** Fully validated contact form with error handling and success feedback.
- **Responsive Design:** Mobile-first approach ensuring excellent UX across all devices.
- **Accessibility:** WCAG compliant markup and semantic HTML.

## ⚙️ Local Setup

### Prerequisites

- **Node.js** v18+ and **npm** (or pnpm/yarn)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/saftanasdalihin/saftanasdalihin-site.git
cd my-portfolio

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Create environment file
touch .env.local
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# .env.local
RESEND_API_KEY="re_YOUR_SECRET_RESEND_API_KEY"
```

Get your Resend API Key at [resend.com](https://resend.com).

### Running Locally

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

## 📦 Project Structure

```
my-portfolio/
├── app/                      # Next.js App Router
│   ├── (pages)/             # Route groups
│   ├── api/                 # API routes (contact form)
│   ├── globals.css          # Global styles with Tailwind
│   └── layout.tsx           # Root layout
├── components/              # Reusable React components
│   └── sections/            # Page sections (Hero, About, Projects, etc.)
├── lib/                     # Utilities and helpers
│   ├── data.ts             # Project data and helpers
│   └── types.ts            # TypeScript type definitions
├── public/                  # Static assets
│   └── images/             # Project thumbnails and gallery
├── tailwind.config.ts       # Tailwind configuration
├── postcss.config.mjs       # PostCSS configuration
└── README.md               # This file
```

## 🎨 Customization

### Colors & Theme

Edit `app/globals.css` to customize CSS variables:

```css
:root {
  --primary: 0 0% 9%;
  --secondary: 0 0% 96.1%;
  /* ...other variables... */
}
```

### Projects Data

Edit `lib/data.ts` to add your projects and update project details in `lib/types.ts`.

### Content

Update text content directly in component files under `components/sections/`.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your repository to GitHub.
2. Visit [vercel.com](https://vercel.com) and import your repository.
3. Add environment variables in Vercel dashboard.
4. Deploy with one click!

### Deploy to Other Platforms

The portfolio can be deployed to any Node.js-compatible platform (Netlify, AWS Amplify, etc.).

Build command:
```bash
npm run build
```

## 📞 Contact

For inquiries or collaborations:
- **Email:** saftanasdalihin@gmail.com
- **GitHub:** [@saftanasdalihin](https://github.com/saftanasdalihin)
- **Instagram:** [@safta_nas](https://instagram.com/saftanasdalihin)
- **LinkedIn:** [Safta Nasdalihin](https://linkedin.com/in/saftanasdalihin)

## 📄 License

This project is open source under the MIT License. See [LICENSE](LICENSE) for details.

---

**Built by Safta Nasdalihin | West Java, Indonesia**
