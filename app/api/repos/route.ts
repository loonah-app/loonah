import { Octokit } from "@octokit/rest";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const octokit = new Octokit({ auth: session.accessToken });

  try {
    const { data } = await octokit.repos.listForAuthenticatedUser({
      visibility: 'all',
      sort: 'updated',
      per_page: 100
    });

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch repositories' }), { status: 500 });
  }
}
