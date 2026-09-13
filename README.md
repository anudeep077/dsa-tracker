# DSA Tracker

A minimal dashboard that visualizes your LeetCode progress. You solve problems on LeetCode; this site reads your public profile and shows stats, streaks, and activity.

- No accounts, no database — your username and cached data live in `localStorage`.
- Data comes from LeetCode's public GraphQL API via a small proxy route (`/api/leetcode`) to work around CORS.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000, go to **Settings**, enter your LeetCode username.
