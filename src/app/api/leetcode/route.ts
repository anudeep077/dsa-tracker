import type { NextRequest } from "next/server";
import type { AcSubmission, DifficultyCount, LeetCodeSnapshot, TagCount } from "@/lib/types";

// LeetCode's GraphQL endpoint rejects cross-origin browser requests, so this
// route acts as a thin proxy. No credentials are involved — only public data.
const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

const QUERY = `
query dsaTracker($username: String!, $limit: Int!) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $username) {
    username
    profile { realName userAvatar ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    userCalendar { streak totalActiveDays submissionCalendar }
    tagProblemCounts {
      advanced { tagName tagSlug problemsSolved }
      intermediate { tagName tagSlug problemsSolved }
      fundamental { tagName tagSlug problemsSolved }
    }
  }
  recentAcSubmissionList(username: $username, limit: $limit) {
    id title titleSlug timestamp
  }
}`;

interface RawResponse {
  data?: {
    allQuestionsCount: DifficultyCount[];
    matchedUser: {
      username: string;
      profile: { realName: string | null; userAvatar: string | null; ranking: number | null };
      submitStatsGlobal: { acSubmissionNum: DifficultyCount[] };
      userCalendar: { streak: number; totalActiveDays: number; submissionCalendar: string };
      tagProblemCounts: { advanced: TagCount[]; intermediate: TagCount[]; fundamental: TagCount[] };
    } | null;
    recentAcSubmissionList: Array<Omit<AcSubmission, "timestamp"> & { timestamp: string }> | null;
  };
  errors?: Array<{ message: string }>;
}

function toRecord(counts: DifficultyCount[]) {
  const out = { All: 0, Easy: 0, Medium: 0, Hard: 0 };
  for (const c of counts) out[c.difficulty] = c.count;
  return out;
}

function fail(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim();
  if (!username) return fail("Username is required.", 400);

  let raw: RawResponse;
  try {
    const res = await fetch(LEETCODE_GRAPHQL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "Mozilla/5.0 (dsa-tracker)",
      },
      body: JSON.stringify({ query: QUERY, variables: { username, limit: 20 } }),
      cache: "no-store",
    });

    if (res.status === 429) return fail("LeetCode is rate-limiting requests. Try again in a minute.", 429);
    if (!res.ok) return fail(`LeetCode responded with ${res.status}.`, 502);

    raw = (await res.json()) as RawResponse;
  } catch {
    return fail("Could not reach LeetCode. Check your connection and try again.", 502);
  }

  const user = raw.data?.matchedUser;
  if (!user) {
    const msg = raw.errors?.[0]?.message;
    if (msg && /not exist|not found/i.test(msg)) return fail(`No LeetCode user named "${username}".`, 404);
    return fail(msg ?? `No LeetCode user named "${username}".`, 404);
  }

  let calendar: Record<string, number> = {};
  try {
    calendar = JSON.parse(user.userCalendar.submissionCalendar ?? "{}");
  } catch {
    /* leave empty */
  }

  const t = user.tagProblemCounts;
  const tags = [...t.fundamental, ...t.intermediate, ...t.advanced]
    .filter((tag) => tag.problemsSolved > 0)
    .sort((a, b) => b.problemsSolved - a.problemsSolved);

  const snapshot: LeetCodeSnapshot = {
    username: user.username,
    realName: user.profile.realName || null,
    avatar: user.profile.userAvatar,
    ranking: user.profile.ranking,
    solved: toRecord(user.submitStatsGlobal.acSubmissionNum),
    total: toRecord(raw.data!.allQuestionsCount),
    calendar,
    streak: user.userCalendar.streak,
    totalActiveDays: user.userCalendar.totalActiveDays,
    tags,
    recentAc: (raw.data?.recentAcSubmissionList ?? []).map((s) => ({
      ...s,
      timestamp: Number(s.timestamp),
    })),
    fetchedAt: new Date().toISOString(),
  };

  return Response.json(snapshot);
}
