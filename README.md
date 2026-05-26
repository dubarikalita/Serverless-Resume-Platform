# Serverless Resume Platform — Frontend

A cloud-hosted personal resume and portfolio website built with AWS and automated DevOps practices. This is the frontend repository containing the static site — HTML, CSS, and JavaScript — deployed to AWS S3 and served globally via CloudFront.

> **Live site:** [https://your-cloudfront-url.cloudfront.net](https://d1ka3yqfxmsg18.cloudfront.net)

---

## What This Project Is

Instead of deploying a resume to a simple platform like GitHub Pages or Netlify, this project uses production-grade AWS infrastructure. The site is statically hosted on S3, distributed globally through CloudFront's CDN with HTTPS, and automatically deployed on every `git push` via GitHub Actions.

The site includes a **live visitor counter** that calls a serverless backend API — built with AWS Lambda, API Gateway, and DynamoDB — to increment and display the count in real time.

---

## Architecture

```
User Browser
     │
     ▼
CloudFront (CDN + HTTPS)          ← Global edge caching, SSL termination
     │
     ▼
S3 Bucket (Private)               ← Static files: HTML, CSS, JS
     │
     │  (JavaScript fetch call)
     ▼
API Gateway → Lambda → DynamoDB   ← Serverless visitor counter backend
                                     (see backend repo)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Hosting | AWS S3 (static website) |
| CDN + HTTPS | AWS CloudFront |
| DNS | AWS Route 53 *(optional)* |
| SSL Certificate | AWS ACM |
| CI/CD | GitHub Actions |
| Frontend | HTML5, CSS3, Vanilla JavaScript |

---

## Repository Structure

```
Serverless-Resume-Platform/
├── index.html                  # Resume structure and content
├── style.css                   # Styling — dark editorial theme
├── script.js                   # Visitor counter — calls backend API
└── .github/
    └── workflows/
        └── deploy-frontend.yml # CI/CD pipeline — auto deploys on push
```

---

## CI/CD Pipeline

Every push to the `main` branch automatically triggers the GitHub Actions pipeline defined in `.github/workflows/deploy-frontend.yml`.

**Pipeline steps:**

```
git push → GitHub Actions triggers
                │
                ▼
       1. Checkout code
       2. Configure AWS credentials (from GitHub Secrets)
       3. Sync files to S3 (aws s3 sync)
       4. Invalidate CloudFront cache
                │
                ▼
         Live in ~20 seconds
```

No manual uploads. No manual cache invalidations. Every change ships automatically.

---

## GitHub Secrets Required

These secrets must be set in the repository under **Settings → Secrets and variables → Actions**:

| Secret Name | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | AWS region (e.g. `ap-south-1`) |
| `S3_BUCKET` | S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID |

---

## AWS Resources Used

| Service | Purpose |
|---|---|
| S3 | Stores and serves static files |
| CloudFront | CDN — caches files at edge locations worldwide, provides HTTPS |
| ACM | Free SSL/TLS certificate for HTTPS |
| Route 53 | Custom domain DNS *(optional)* |
| IAM | Credentials and permissions for CI/CD |

---

## How to Deploy Manually

If you need to deploy without GitHub Actions (e.g. first-time setup):

**Step 1 — Clone the repo:**
```bash
git clone https://github.com/dubarikalita/Serverless-Resume-Platform.git
cd Serverless-Resume-Platform
```

**Step 2 — Sync to S3:**
```bash
aws s3 sync . s3://YOUR_BUCKET_NAME/ \
  --delete \
  --exclude ".git/*" \
  --exclude ".github/*"
```

**Step 3 — Invalidate CloudFront cache:**
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## Visitor Counter

The visitor counter in the bottom of the header communicates with a separate serverless backend. The JavaScript in `script.js` sends a `POST` request to an API Gateway endpoint on every page load. The backend increments a counter in DynamoDB and returns the new count.

**Backend repository:** [Serverless-Resume-Platform-Backend](https://github.com/dubarikalita/Serverless-Resume-Platform-Backend)

---

## Local Development

No build tools or package managers needed. Just open `index.html` directly in your browser:

```bash
# On Linux/Mac
open index.html

# Or simply double-click index.html in your file explorer
```

The visitor counter will show `—` locally because the API endpoint requires the deployed backend. Everything else renders fully.

---

## Related Repository

| Repo | Description |
|---|---|
| [Serverless-Resume-Platform-Backend](https://github.com/dubarikalita/Serverless-Resume-Platform-Backend) | Lambda + API Gateway + DynamoDB visitor counter backend, managed with AWS SAM |

---

## Author

**dubarikalita**
- GitHub: [@dubarikalita](https://github.com/dubarikalita)
- Built as part of the Cloud Resume Challenge
