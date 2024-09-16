
import React from 'react'
import ProjectDetailsClient from '@/components/ProjectDetailsClient'


async function CreateProject({ params: { id: projectId } }: { params: { id: string } }) {

  return (
    <div>
      <ProjectDetailsClient params={{ id: projectId }} />
    </div>
  )
}

export default CreateProject