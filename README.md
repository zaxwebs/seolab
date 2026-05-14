# seolab

seolab is a lightweight lab notebook for SEO experiments. It is built for teams that want to turn SEO work into a repeatable experimentation system instead of scattering hypotheses, implementation notes, review dates, and learnings across tasks, sheets, and chat.

## What It Tracks

- Websites and properties where experiments happen
- SEO experiments with hypothesis, status, type, metrics, and dates
- Target and control URLs
- Baseline notes, implementation notes, result summaries, learnings, and next actions
- Chronological experiment logs with metric snapshots and source URLs
- Review queues for experiments that are due or overdue

## Stack

- SvelteKit
- TypeScript
- Tailwind CSS
- shadcn-svelte style UI components
- PocketBase

## Project Structure

```txt
seolab/
  sk/   SvelteKit frontend
  pb/   PocketBase binary, migrations, demo seed script
```

## Setup

Install frontend dependencies:

```sh
cd sk
npm install
```

Create an environment file:

```sh
cp .env.example .env
```

Start PocketBase:

```sh
cd ../pb
./pocketbase.exe serve
```

Apply migrations if needed:

```sh
./pocketbase.exe migrate
```

Start the SvelteKit app:

```sh
cd ../sk
npm run dev
```

By default, the app expects PocketBase at `http://127.0.0.1:8090`.

## Demo Data

From the `pb` directory, run:

```sh
node seed-demo.js
```

This seeds sample websites, experiments, and logs.

## Core Workflow

1. Add a website.
2. Create an experiment with a clear hypothesis.
3. Define target and optional control URLs.
4. Choose the primary metric and review date.
5. Add logs as implementation notes, observations, metric updates, issues, or decisions.
6. Review the experiment and record outcome, confidence, learnings, and next action.

## Useful Commands

Frontend:

```sh
cd sk
npm run dev
npm run check
npm run build
```

PocketBase:

```sh
cd pb
./pocketbase.exe serve
./pocketbase.exe migrate
```
