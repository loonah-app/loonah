import { Octokit } from "@octokit/rest";
import { getServerSession } from 'next-auth/next';
import { authOptions } from "../../auth/[...nextauth]/route";
import Project from "@/db/models/Project";
import { connectToDB } from "@/db/connection";

export async function POST(request: Request) {
  const { repoOwner, repoName } = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  const octokit = new Octokit({ auth: session.accessToken });

  await connectToDB();

  try {
    // Fetch the repository contents
    const { data } = await octokit.repos.getContent({
      owner: repoOwner,
      repo: repoName,
      path: '', // Root directory
    });

    let isReact = false;
    let isVue = false;
    let isHTML = false;

    // Handle case where the path is a directory (array of items)
    if (Array.isArray(data)) {
      const packageJsonFile = data.find(item => item.type === 'file' && item.name === 'package.json');

      if (packageJsonFile) {
        // Fetch the content of package.json
        const packageJsonData = await octokit.repos.getContent({
          owner: repoOwner,
          repo: repoName,
          path: 'package.json', // Path to package.json file
        });

        // Assert that packageJsonData contains the content property
        if (typeof packageJsonData.data === 'object' && 'content' in packageJsonData.data) {

          const content = packageJsonData.data.content as string; // Type assertion to string
          
          // Decode from base64
          const packageJsonContent = Buffer.from(content, 'base64').toString();
          const packageJson = JSON.parse(packageJsonContent);

          // Static React check: Must include "react" but exclude "next"
          isReact = packageJson.dependencies?.react && !packageJson.dependencies?.next;

          // Static Vue check: Must include "vue" but exclude "nuxt"
          isVue = packageJson.dependencies?.vue && !packageJson.dependencies?.nuxt;
        }
      }

      // Basic HTML check: Look for .html files in the root
      isHTML = data.some(item => item.type === 'file' && item.name.endsWith('.html'));
    }

    const getExistingRepo = await Project.exists({
      githubRepo: `https://github.com/${repoOwner}/${repoName}`
    })

    if (getExistingRepo) {
      return new Response(JSON.stringify({ message: 'Project with repo already exist' }), { status: 400 });
    }

    if (isReact) {
      return new Response(JSON.stringify({ type: 'React (static)' }), { status: 200 });
    } else if (isVue) {
      return new Response(JSON.stringify({ type: 'Vue (static)' }), { status: 200 });
    } else if (isHTML) {
      return new Response(JSON.stringify({ type: 'HTML' }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ type: 'Unknown', message: 'Not a valid repo. you can only launch either react, vue, or html website' }), { status: 400 });
    }
  } catch (error) {
    // console.error('Error checking repository type:', error);
    return new Response(JSON.stringify({ message: 'Failed to check repository type' }), { status: 500 });
  }
}