# MarketMind AI

Turn customer data into smarter marketing decisions.

MarketMind AI is a frontend-first marketing intelligence dashboard that helps businesses turn raw customer data into actionable, explainable recommendations. It ingests customer CSV data, scores and segments customers, highlights opportunities, and helps teams build targeted campaigns with transparent reasoning instead of opaque AI output.

## Problem

Businesses collect large amounts of customer data across spend, frequency, recency, and engagement, but turning that information into smart marketing decisions is often difficult. Manual analysis is slow, inconsistent, and hard to explain. Many teams end up with generic campaigns that are not targeted to the right segment or supported by clear evidence.

## Solution

MarketMind AI analyzes customer data directly in the browser, calculates customer value and risk using deterministic rules, and groups customers into clear segments such as High Value, Loyal, Regular, New / Potential, and At Risk. Each customer receives an explainable rationale for their classification, the system highlights growth and churn risks, and it recommends campaigns based on segment-level evidence rather than vague generic suggestions.

The app also estimates campaign impact using segment-level assumptions and can generate marketing copy when Gemini is configured. The core differentiator is that the decision logic stays transparent: numbers are computed first, and AI is used to interpret the verified context rather than inventing outcomes.

## Key Features

- CSV upload and customer data parsing in the browser
- Deterministic customer scoring based on spend, purchase frequency, recency, and digital engagement
- Automatic customer segmentation into five tiers
- Explainable reasons for each customer's segment assignment
- Opportunity and churn-risk insights derived from customer behavior
- Segment-based marketing recommendation engine
- Campaign creation flow with budget and channel selection
- Estimated campaign impact and revenue projection
- Local persistence of customers and saved campaigns in browser storage
- Optional Gemini-powered executive insights and marketing copy generation
- Clear demo fallback when Gemini is not configured

## How It Works

Customer CSV → Browser Analysis → Customer Scoring → Segmentation → Explainability → Opportunities → Marketing Recommendation → Campaign → Estimated Impact

## Explainable Customer Scoring

MarketMind AI calculates a weighted customer score from 0 to 100 using the logic implemented in the scoring utilities:

- Spend contributes up to 30 points, scaled against a maximum of ₹4,500 total spend
- Purchase frequency contributes up to 25 points, scaled against 10 purchases
- Recency contributes up to 25 points, decreasing as inactivity grows and tapering to zero after roughly 90 days
- Digital engagement contributes up to 20 points using website visits, email opens, and email clicks

The final score is then mapped to customer segments:

- 80–100: High Value
- 60–79: Loyal
- 40–59: Regular
- 20–39: New / Potential
- 0–19: At Risk

Each customer classification includes an explanation array that describes why the customer belongs to that segment, ensuring the output is explainable and auditable rather than black-box.

## AI Layer

The app includes an optional Gemini integration for insight and copy generation. In the current implementation, the Gemini logic lives in the AI service layer and expects an environment variable named `VITE_GEMINI_API_KEY`.

When configured, the application sends aggregated business context and campaign brief data to Gemini for interpretation, such as:

- segment counts and percentages
- average spend and engagement
- at-risk customer counts
- campaign target segment, goal, and offer context

The AI does not override the scoring or calculation engine. The deterministic logic remains the source of truth for metrics. If the key is missing, invalid, or the API call fails, the app falls back to a clearly labeled demo mode instead of pretending AI generated the output.

> Important: `VITE_*` variables are exposed client-side in Vite builds and should not be treated as secure server-side secrets.

## Tech Stack

This project uses the following technologies as implemented in the codebase:

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- PostCSS + Autoprefixer
- Recharts
- Papa Parse for CSV parsing
- Lucide React icons
- clsx and tailwind-merge
- Google Gemini API via fetch-based client calls

## Architecture

The app is a frontend-only dashboard with a route-driven layout and local browser persistence.

- `src/App.tsx`: application routing and page composition
- `src/pages/`: dashboard, customers, segments, campaigns, analytics, insights, settings, and landing pages
- `src/components/`: reusable UI, campaign, and CSV uploader components
- `src/services/`: Gemini integration and browser storage service
- `src/utils/`: scoring, segmentation, campaign recommendation, and estimation logic
- `src/data/`: seeded mock customer dataset
- `src/types/`: shared TypeScript models for customers and campaigns

The app stores campaigns and customer data in `localStorage`, making it a self-contained demo environment without a backend service layer.

## Data Privacy

Customer CSV analysis and scoring are performed in the browser on the local application. The uploaded CSV is parsed with Papa Parse and the customer score/segment logic runs locally before the data is displayed in the dashboard.

When Gemini is configured, the app sends only relevant aggregated or contextual data for AI interpretation, not the raw customer row set. This includes segment summary metrics and campaign brief context, rather than the full file contents. The implementation explicitly avoids sending raw customer-level numerical data to Gemini for the business insight flow; it sends summarized facts and campaign intent instead.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The app will run using the Vite development server for local preview and iteration.

## Environment Variables

Copy the environment template and add your Gemini key if you want to enable AI-generated insight or copy features:

```bash
cp .env.example .env
```

Then set:

```bash
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

This project uses a Vite environment variable, which means it is exposed in the browser bundle. It should not be considered a secure server-side secret. For production deployments, a backend proxy would be the safer approach.

## Project Structure

```text
.
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── scripts/
│   ├── testGemini.cjs
│   ├── testGemini.js
│   └── testGemini_v3.cjs
├── src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── components/
│   │   ├── campaigns/
│   │   ├── common/
│   │   └── ui/
│   ├── data/
│   │   └── mockCustomers.ts
│   ├── layouts/
│   │   └── DashboardLayout.tsx
│   ├── pages/
│   │   ├── AnalyticsPage.tsx
│   │   ├── CampaignsPage.tsx
│   │   ├── CustomersPage.tsx
│   │   ├── DashboardOverview.tsx
│   │   ├── InsightsPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── SegmentsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/
│   │   ├── aiService.ts
│   │   └── storageService.ts
│   ├── types/
│   │   ├── campaign.ts
│   │   └── customer.ts
│   └── utils/
│       ├── campaignEstimator.ts
│       ├── cn.ts
│       ├── marketingRecommendations.ts
│       └── segmentation.ts
└── README.md
```

## Screenshots

Placeholder screenshots for future documentation:

- Dashboard Overview: [Add screenshot]
- Customer Segmentation View: [Add screenshot]
- Campaign Builder / Preview: [Add screenshot]
- Insights & Opportunity Dashboard: [Add screenshot]

## Demo

- Live Demo: [Coming Soon]
- Demo Video: [Coming Soon]

## Future Improvements

The following are realistic future enhancements and are clearly outside the current implementation:

- Secure backend proxy for Gemini API key management
- More robust CSV validation and schema mapping tools
- Real database and authentication layer
- Deeper analytics and forecasting models
- Exportable campaign reports and CSV downloads
- Advanced A/B testing and performance tracking
- Accessibility refinements and localization support

## Hackathon

MarketMind AI is well-suited for a frontend-first hackathon because it combines real customer data workflows, explainable analytics, and polished product UX in a single browser-based experience. It demonstrates how a modern web app can turn raw customer information into actionable marketing strategy without requiring a complex backend, while still showing clear technical depth in segmentation logic, AI augmentation, and responsive dashboard design.

## License

This repository does not currently include a license file, so no license has been specified for the project at this time.
