import { authOptions } from "@/utils/authOptions";
import { Octokit } from "@octokit/rest";
import { getServerSession } from 'next-auth/next';

export async function POST(request: Request) {
  const { repoOwner, repoName } = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  try {
    const octokit = new Octokit({ auth: session.accessToken });

    // Fetch the repository details
    const { data } = await octokit.repos.get({
      owner: repoOwner,
      repo: repoName,
    });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    console.error('Error fetching repository details:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch repository details' }), { status: 500 });
  }
}
