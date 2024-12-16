# Storyboard Hero

AI-powered storyboards to easily stitch together scenes for videos, built by [rob phillips](https://robphillips.me).

## Prerequisites

Before you begin, you'll need:

- Node.js 18+ installed
- Bun (recommended) or npm/yarn
- A [Replicate](https://replicate.com) account for image generation
- A [Cloudflare R2](https://r2.cloudflarestorage.com) account for storage
- A [RunwayML](https://runwayml.com) account for video generation

## Environment Setup

Clone this repo and create a `.env.local` file in the root directory with the following variables:

```bash
# Image Generation
REPLICATE_API_KEY=r8_your_key_here

# Cloudflare R2
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name
CLOUDFLARE_R2_ENDPOINT_URL=https://your-storage.r2.cloudflarestorage.com
CLOUDFLARE_R2_PUBLIC_URL=https://your-public-url.com (e.g. https://localhost.foho.ai)

# Runway
RUNWAYML_API_SECRET=key_your_secret_here
```

## Getting Started

1. Install dependencies:

```bash
bun install
```

2. Run the development server:

```bash
bun dev
```

The app will be available at [http://localhost:3005](http://localhost:3005)

## Key Features

- Create storyboards using an intuitive flow-based interface, to more easily control the flow of scenes
- Generate images from text descriptions using [Flux Pro Ultra](https://replicate.com/black-forest-labs/flux-1.1-pro-ultra)
- Convert images to videos with [Runway Gen-3 Alpha](https://runwayml.com/research/introducing-gen-3-alpha)
- Stores the storyboard state in local storage for now
- Store images and videos in Cloudflare R2 for low-cost storage
- [Eventually] Composite multiple videos into a single storyboard sequence

## Tech Stack

- Next.js 14
- React Flow (@xyflow/react)
- TypeScript
- Tailwind CSS
- Shadcn UI
- Replicate AI
- RunwayML
- Cloudflare R2

## Development

- Use `bun run format` to format code with Prettier
- Use `bun run lint` to run ESLint

## Project Structure

```
storyboard-hero/
├── app/              # Next.js app router pages
├── app/api/          # API routes for image and video generation
├── components/       # React & Shadcn UI components
├── hooks/            # React hooks
├── lib/              # Utility functions and services
└── public/           # Static assets

```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Flow Documentation](https://reactflow.dev)
- [Replicate API Docs](https://replicate.com/docs)
- [RunwayML API Docs](https://docs.runwayml.com)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2)
