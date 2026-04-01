# FIELD DOOR Deployment Guide

Target stack for this repo:

- Database: Supabase Postgres
- Cache / locking: Upstash Redis
- Backend hosting: Render native Node web service
- Frontend hosting: Vercel

This guide avoids Docker for deployment because Render native Node is simpler for this project.

## What changed in the repo

- `render.yaml` now targets a native Node service with:
  - `rootDir: fielddoor-backend`
  - `buildCommand: npm install && npx prisma generate && npm run build`
  - `startCommand: npx prisma migrate deploy && node dist/src/server.js`
- `fielddoor-backend/.env.production.example` now matches Supabase + Upstash
- `vercel.json` still rewrites `/api/*` to your Render backend URL
- `.gitignore` now blocks `.env` files and build folders from being pushed

## Credentials you still need

You do not need Razorpay yet if you are only testing browsing and backend connectivity.

You still need these before full production use:

### Required now

- Supabase Postgres connection string
- Upstash Redis connection string
- Render backend URL
- Vercel frontend URL
- JWT secrets

### Required later for full features

- SMTP credentials
- Firebase Admin service account
- AWS S3 credentials
- Razorpay credentials and webhook secret

## 1. Supabase Postgres

### Create it

1. Go to Supabase
2. Create a new project
3. Wait for it to finish provisioning
4. Open `Project Settings` -> `Database`
5. Open the connection string section

### What you need from Supabase

Use the Postgres connection string for Prisma, typically the pooled connection string.

Paste into Render as:

```env
DATABASE_URL=postgresql://postgres.<project-ref>:<db-password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require
```

### If you do not know the password

- It is the database password you set when creating the Supabase project
- If you forgot it, reset the DB password from Supabase settings

## 2. Upstash Redis

### Create it

1. Go to Upstash
2. Create a Redis database
3. Choose region close to Render
4. Open the database details page

### What you need from Upstash

Use the Redis URL, not the REST URL.

Paste into Render as:

```env
REDIS_URL=rediss://default:<password>@<endpoint>:6379
```

If Upstash shows multiple connection styles, choose the Redis TCP URL.

## 3. Render backend

### Create the service

1. Push the repo to GitHub first
2. In Render, click `New` -> `Blueprint` or `Web Service`
3. Connect the GitHub repo
4. If using `render.yaml`, Render will read the service settings automatically

### If creating manually in Render

Use:

- Runtime: `Node`
- Root Directory: `fielddoor-backend`
- Build Command:

```bash
npm install && npx prisma generate && npm run build
```

- Start Command:

```bash
npx prisma migrate deploy && node dist/src/server.js
```

### Render environment variables to paste

Paste these in Render exactly, replacing placeholders:

```env
NODE_ENV=production
PORT=10000
APP_URL=https://your-backend.onrender.com
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com

DATABASE_URL=postgresql://postgres.<supabase-project-ref>:<supabase-db-password>@aws-0-<region>.pooler.supabase.com:5432/postgres?sslmode=require
REDIS_URL=rediss://default:<upstash-password>@<upstash-endpoint>:6379

ACCESS_TOKEN_SECRET=replace_with_a_long_random_string_1
REFRESH_TOKEN_SECRET=replace_with_a_long_random_string_2
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=fielddoor-media
CDN_URL=

SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=Field Door <noreply@yourdomain.com>

SLOT_LOCK_TTL_SECONDS=600
GST_RATE=0.18
CONVENIENCE_FEE=20
CANCELLATION_FULL_REFUND_HOURS=24
CANCELLATION_PARTIAL_REFUND_HOURS=12
CANCELLATION_PARTIAL_REFUND_PCT=0.5
```

### How to generate JWT secrets

Use PowerShell:

```powershell
[guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
```

Run it twice:
- one for `ACCESS_TOKEN_SECRET`
- one for `REFRESH_TOKEN_SECRET`

## 4. Prisma migration on Supabase

Render start command already runs:

```bash
npx prisma migrate deploy
```

That means:
- as soon as Render deploys with the correct `DATABASE_URL`
- Prisma will apply migrations to Supabase

### Seed data

After the first successful deploy:

1. Open the Render service shell
2. Run:

```bash
npm run db:seed
```

This loads the sample sports, admin, owner, and venue data.

## 5. Vercel frontend

### Create it

1. In Vercel click `Add New` -> `Project`
2. Import the same GitHub repo
3. Set root directory to repo root
4. Deploy as a static site

### Update API rewrite before or after first deploy

Edit `vercel.json` and replace:

```json
https://fielddoor-backend.onrender.com
```

with your real Render backend URL:

```json
https://your-backend.onrender.com
```

Then redeploy in Vercel.

### Vercel environment variables

For the current static frontend, none are strictly required if you use the rewrite.

If later you want environment-based API URLs, then add:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

But for the current plain HTML setup, `vercel.json` rewrite is enough.

## 6. Screen-by-screen deployment order

### Screen 1: GitHub

Push repo first.

### Screen 2: Supabase

- create project
- copy pooled Postgres URL

### Screen 3: Upstash

- create Redis DB
- copy Redis URL

### Screen 4: Render

- create Node web service from GitHub repo
- set root dir to `fielddoor-backend`
- paste env vars
- deploy

### Screen 5: Render verify

Open:

- `/api/v1/health`
- `/api/v1/frontend/bootstrap`
- `/api/docs`

### Screen 6: Seed

Run:

```bash
npm run db:seed
```

### Screen 7: Vercel

- import repo
- update `vercel.json`
- deploy

### Screen 8: Final verify

Check:

- frontend loads
- venue cards still render
- backend docs open
- API health works

## 7. Credentials still missing and where to get them

### Already enough to test website shell and API

- Supabase DB URL
- Upstash Redis URL
- Render backend URL
- Vercel frontend URL
- JWT secrets

### Needed later for richer features

#### SMTP

Get from:

- Gmail App Password
- Zoho Mail
- Resend SMTP
- Brevo SMTP

Need:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`

#### Firebase

Get from:

1. Firebase Console
2. Project Settings
3. Service Accounts
4. Generate new private key

Need:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

#### AWS S3

Get from AWS:

1. Create bucket
2. Create IAM user with S3 access
3. Create access key

Need:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `CDN_URL`

#### Razorpay

Keep blank for now as requested.

Later get from:

1. Razorpay Dashboard
2. API Keys
3. Webhooks

Need:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

## 8. Push to GitHub after these changes

From the repo root:

```powershell
git status
git add .
git commit -m "Configure production deployment for Supabase Upstash Render and Vercel"
git remote add origin https://github.com/vinayak200306/Turf-website.git
git branch -M main
git push -u origin main
```

If `origin` already exists:

```powershell
git remote set-url origin https://github.com/vinayak200306/Turf-website.git
git push -u origin main
```

## 9. Important note

Do not push the local `fielddoor-backend/.env` file to GitHub.

This repo now includes `.gitignore` rules to protect that, but always check `git status` before pushing.
