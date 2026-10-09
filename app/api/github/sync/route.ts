import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { buildProjectIndex } from "@/lib/projects/project-index";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secretMatches(received: string | null, expected: string): boolean {
  if (!received) return false;
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const secret = process.env.SAFTA_SYNC_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Project sync is not configured." }, { status: 503 });
  }
  const authorization = request.headers.get("authorization");
  const bearer = authorization?.match(/^Bearer\s+(.+)$/i)?.[1] ?? null;
  if (!secretMatches(bearer, secret)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const index = await buildProjectIndex(true);
    return NextResponse.json({
      ok: true,
      builtAt: index.builtAt,
      projectsIndexed: index.projects.length,
      omittedRepositories: index.omittedRepositories,
      projects: index.projects.map((project) => ({
        name: project.name,
        totalScore: project.totalScore,
        url: project.url,
        commitSha: project.commitSha,
      })),
      disclaimer: index.disclaimer,
    });
  } catch (error) {
    console.error("Safta AI project sync failed:", error);
    return NextResponse.json({ error: "Unable to refresh the GitHub project index." }, { status: 502 });
  }
}
