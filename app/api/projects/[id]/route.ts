import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import Project from "@/db/models/Project";
import { connectToDB } from "@/db/connection";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id: projectId } = params;

    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    await connectToDB();

    try {
        const _project = await Project.findById(projectId);
        if (!_project) return new Response(JSON.stringify({ message: "Invalid project" }), { status: 400 });
        return new Response(JSON.stringify({ data: _project }), { status: 200 });
    } catch (error) {
        // console.error('Error fetching projects:', error);
        return new Response(JSON.stringify({ message: 'Failed to fetch project' }), { status: 500 });
    }
}