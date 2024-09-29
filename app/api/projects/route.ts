
import { getServerSession } from 'next-auth/next';
import Project from '@/db/models/Project';
import { connectToDB } from '@/db/connection';
import amqp from 'amqplib';
import { Octokit } from '@octokit/rest';
import { authOptions } from '@/utils/authOptions';

const RABBITMQ_URL = process.env.NEXT_PUBLIC_RABBITMQ_URL || 'amqp://localhost';
const QUEUE_NAME = process.env.NEXT_PUBLIC_QUEUE_NAME || 'walrus_publishing';

export async function GET(request: Request) {

  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await connectToDB();

  try {
    const _projects = await Project.find({ user: session.userId });
    return new Response(JSON.stringify({ data: _projects }), { status: 200 });
  } catch (error) {
    // console.error('Error fetching projects:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch projects' }), { status: 500 });
  }
}

export async function POST(request: Request) {
  const { repoOwner, repoName } = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await connectToDB();

  try {

    const _projectType = await projectType(repoOwner, repoName, session.accessToken!);
    const _defaultBranch =  await projectDefaultBranch(repoOwner, repoName, session.accessToken!);
    console.log({_projectType, _defaultBranch});

    const _repo = `https://github.com/${repoOwner}/${repoName}`;

    const getExistingRepo = await Project.exists({
      githubRepo: _repo
    })

    if (getExistingRepo) {
      return new Response(JSON.stringify({ message: 'Project with repo already exist' }), { status: 400 });
    }

    const newProject = await Project.create({
      name: repoName,
      githubRepo: _repo,
      user: session.userId,
    });

    // Send message to RabbitMQ
    const message = {
      projectId: newProject._id.toString(),
      accessToken: session.accessToken,
      branch: _defaultBranch || "master",
      projectType: _projectType
    };

    await sendToRabbitMQ(message);

    return new Response(JSON.stringify({ project_id: newProject._id }), { status: 200 });

  } catch (error) {
    // console.error('Error creating repo: ', error);
    return new Response(JSON.stringify({ message: 'Error creating project' }), { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { repoOwner, repoName, projectId } = await request.json();
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }

  await connectToDB();

  try {

    const _projectType = await projectType(repoOwner, repoName, session.accessToken!);
    const _defaultBranch =  await projectDefaultBranch(repoOwner, repoName, session.accessToken!);
    console.log({_projectType, _defaultBranch});

    const _repo = `https://github.com/${repoOwner}/${repoName}`;

    const updateProject = await Project.findById(projectId);

    if (!updateProject) throw new Error("Invalid project");
    if (!updateProject.storageObjectId) throw new Error("Project has not been deployed yet")

    updateProject.status = "QUEUED";
    await updateProject.save();

    // Send message to RabbitMQ
    const message = {
      projectId: updateProject._id.toString(),
      accessToken: session.accessToken,
      branch: _defaultBranch || "master",
      projectType: _projectType,
      updateObjectId: updateProject.storageObjectId
    };

    await sendToRabbitMQ(message);

    return new Response(JSON.stringify({ data: updateProject }), { status: 200 });

  } catch (error) {
    // console.error('Error creating repo: ', error);
    return new Response(JSON.stringify({ message: 'Error creating project' }), { status: 500 });
  }
}


async function sendToRabbitMQ(message: object) {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // Assert queue
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // Send message
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)), { persistent: true });

    // Close channel and connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
    throw new Error('Failed to send message to RabbitMQ');
  }
}

async function projectDefaultBranch(repoOwner: string, repoName: string, accessToken: string) {
  try {
    const octokit = new Octokit({ auth: accessToken });
    // Fetch the repository contents
    const { data } = await octokit.repos.get({
      owner: repoOwner,
      repo: repoName,
      path: '', // Root directory
    });

    return data.default_branch;
  } catch (error) {
    throw new Error("Failed to get repository default branch name");
  }
}

async function projectType(repoOwner: string, repoName: string, accessToken: string) {
  try {
    const octokit = new Octokit({ auth: accessToken });
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

    if (isReact) {
      return "react"
    } else if (isVue) {
      return "vue"
    } else if (isHTML) {
      return "html"
    } else {
      return "unknwon"
    }
  } catch (error) {
    // console.error('Error checking repository type:', error);
    throw new Error("Failed to check repository type");
  }
}