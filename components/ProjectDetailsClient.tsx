'use client'

import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
} from "@/_components/ui/card"
import { Button } from '@/_components/ui/button'
import axios from 'axios'
import { GitHubRepository, ProjectType } from '@/types/global.types'
import { Skeleton } from '@/_components/ui/skeleton'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { timeAgo } from '@/utils/helpers'
import { CgSpinner } from "react-icons/cg";
import { BsCheckCircle } from 'react-icons/bs'
import { MdOutlineCancel } from "react-icons/md";
import { toast } from '@/hooks/use-toast'

function ProjectDetailsClient({ params: { id: projectId } }: { params: { id: string } }) {

    const router = useRouter();
    const [isFetchingData, setIsFetchingData] = useState(true)
    const [isUpdatingData, setisUpdatingData] = useState(false)
    const [datas, setDatas] = useState<{
        project: ProjectType | undefined,
        repo: GitHubRepository | undefined
    }>({
        project: undefined,
        repo: undefined
    })

    function getInfoFromRepoUrl(repoUrl: string) {
        const repoPath = new URL(repoUrl).pathname.split('/');
        const repoOwner = repoPath[1];
        const repoName = repoPath[2];
        return { repoOwner, repoName }
    }

    async function getProjectInfo() {
        try {
            const projectResp = (await axios.get(`/api/projects/${projectId}`)).data.data as ProjectType;
            const repoInfo = (await axios.post(`/api/repos/fetch`, {
                repoOwner: getInfoFromRepoUrl(projectResp.githubRepo).repoOwner,
                repoName: getInfoFromRepoUrl(projectResp.githubRepo).repoName
            })).data.data as GitHubRepository;

            console.log({
                project: projectResp,
                repo: repoInfo
            })

            setDatas({
                project: projectResp,
                repo: repoInfo
            });

            setIsFetchingData(false);

            if (projectResp.status !== "DEPLOYED" && projectResp.status !== "DECLINED") {
                setTimeout(() => {
                    console.log("refetching project status")
                    getProjectInfo();
                }, 10000)
            }
        } catch (error) {
            console.log((error as any).response.data);
            router.push('/app/projects');
        }
    }

    useEffect(() => {
        getProjectInfo();
    }, [])

    function isUpdateButtonDisabled() {
        if ((datas.project?.status !== "DEPLOYED" && datas.project?.status !== "DECLINED") || isUpdatingData) {
            return true
        }else {
            return false
        }
    }

    async function updateProject() {
        setisUpdatingData(true);
        try {
            const response = await axios.put(
                '/api/projects' , 
                {repoOwner: datas.repo?.owner.login, repoName: datas.repo?.name, projectId: datas.project?._id}
            );

            setDatas((d) => ({...d, project: response.data.data}))
        } catch (err) {
            toast({
                title: "Error",
                description: (err as any).response.data.message || (err as any).message,
                variant: 'destructive',
                duration: 4000
            });
        } finally {
            setisUpdatingData(false);
        }
    }

    return (
        <>
            {
                !isFetchingData ?
                    <div>
                        <div className='grid grid-cols-1 md:flex items-center justify-between gap-6 pt-3 pb-8 px-3 border-b mb-8'>
                            <div>
                                <div className='font-light text-sm text-foreground/70'>Project name</div>
                                <div className='font-extrabold text-2xl'>
                                    authapp-testapp
                                </div>
                            </div>

                            <div className='flex gap-5 items-center'>
                                <Link href={`${datas.repo?.html_url}`} target='_blank'>
                                    <Button variant={'outline'} className='flex items-center gap-5'>
                                        <div className='w-[20px] bg-white px-1 py-1 rounded-full'>
                                            {
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src="/assets/icons/github.png" alt="github" className='w-full' />
                                            }
                                        </div>
                                        <div>Repository</div>
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => (datas.project?.tempDomain !== null && datas.project?.tempDomain !== undefined) && window.open(datas.project.tempDomain, '_blank')}
                                    disabled={datas.project?.tempDomain === null || datas.project?.tempDomain === undefined ? true : false}
                                >
                                    Visit
                                </Button>
                            </div>
                        </div>

                        <div className='mb-10'>
                            <div className='flex justify-between items-center gap-6'>
                                <div>
                                    <div className='font-bold'>Deployment Launch information</div>
                                    <div className='text-sm text-foreground/60'>project launch information, if deployed users can visit your website</div>
                                </div>

                                <div>
                                    <Button variant={'outline'} size={'sm'}>Build logs</Button>
                                </div>
                            </div>
                        </div>

                        <div className='mb-8'>
                            <Card className="w-full">
                                <CardContent>
                                    <div className='pt-8 pb-3'>

                                        <div className='space-y-4'>
                                            <div>
                                                <div className='text-xs font-medium text-foreground/70'>Deployment ID</div>
                                                <div className='text-sm'>{datas.project?.storageObjectId ? datas.project.storageObjectId : '------'}</div>
                                            </div>
                                            <div>
                                                <div className='text-xs font-medium text-foreground/70'>walrus Domain</div>
                                                {datas.project?.tempDomain ? <Link href={datas.project.tempDomain} className='text-sm text-sky-400'>{datas.project.tempDomain}</Link> : <div className='text-sm'>---------</div>}
                                            </div>
                                            <div>
                                                <div className='text-xs font-medium text-foreground/70'>Custom Domains</div>
                                                <div className='text-sm'>{datas.project?.connectedDomain ? datas.project.connectedDomain : '---------'}</div>
                                            </div>
                                            <div>
                                                <div className='text-xs font-medium text-foreground/70'>Status</div>
                                                <div className='flex items-center gap-2'>
                                                    <div className={`text-[13px] font-bold
                                                        ${datas.project?.status === "DECLINED" ? 'text-red-500' :
                                                            datas.project?.status === "QUEUED" ? 'text-sky-500' :
                                                                datas.project?.status === "BUILDING" ? 'text-yellow-500' :
                                                                    datas.project?.status === "DEPLOYING" ? 'text-yellow-500' :
                                                                        datas.project?.status === "DEPLOYED" ? 'text-green-500' :
                                                                            ''
                                                        }
                                                    `}>
                                                        {datas.project?.status}
                                                    </div>
                                                    {(datas.project?.status === "QUEUED" || datas.project?.status === "DEPLOYING" || datas.project?.status === "BUILDING") ?
                                                        <CgSpinner className='animate-spin' />
                                                        :
                                                        datas.project?.status === "DEPLOYED" ?
                                                            <BsCheckCircle className='text-green-500' />
                                                            :
                                                            <MdOutlineCancel className='text-red-500' />
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <div className='text-xs font-medium text-foreground/70'>Created</div>
                                                <div className='text-sm'>
                                                    {timeAgo(datas.project?.createdAt)}
                                                    {/* by {datas.project?.status} */}
                                                </div>
                                            </div>
                                            <div>
                                                <div className='text-xs font-medium text-foreground/70'>Source</div>
                                                <div className='text-sm'>master</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card className="w-full">
                                <CardContent>
                                    <div className='pt-8 pb-3'>
                                        <div className='flex items-center gap-3 md:gap-10 justify-between'>
                                            <div className='text-sm text-foreground/70'>To update your Production Deployment, push to the "master" branch. and click the update button</div>
                                            <Button size={'sm'} disabled={isUpdateButtonDisabled()} onClick={() => updateProject()}>
                                                {
                                                    !isUpdatingData ?
                                                    <div>Update</div> :
                                                    <CgSpinner className='animate-spin' />
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div> :
                    <div>
                        <div>
                            <div className='grid grid-cols-1 md:flex items-center justify-between gap-6 pt-3 pb-8 px-3 border-b mb-8'>
                                <div>
                                    <div className='font-light text-sm text-foreground/70'><Skeleton className='h-4 w-[100px] mb-1' /></div>
                                    <div className='font-extrabold text-2xl'>
                                        <Skeleton className='h-4 w-[200px] mb-1' />
                                    </div>
                                </div>

                                <div className='flex gap-5 items-center '>
                                    <Skeleton className='h-10 w-[60px]' />
                                    <Skeleton className='h-10 w-[60px]' />
                                </div>
                            </div>

                            <div className='mb-10'>
                                <div className='flex justify-between items-center gap-6'>
                                    <div>
                                        <div className='font-bold'><Skeleton className='h-4 w-[250px] mb-1' /></div>
                                        <div className='text-sm text-foreground/60'><Skeleton className='h-4 w-[350px] mb-1' /></div>
                                    </div>

                                    <div>
                                        <Skeleton className='h-7 w-[60px]' />
                                    </div>
                                </div>
                            </div>

                            <div className='mb-8'>
                                <Card className="w-full">
                                    <CardContent>
                                        <div className='pt-8 pb-3'>

                                            <div className='space-y-4'>
                                                <div>
                                                    <Skeleton className='h-4 w-[100px] mb-1' />
                                                    <Skeleton className='h-4 w-[250px] mb-1' />
                                                </div>
                                                <div>
                                                    <Skeleton className='h-4 w-[100px] mb-1' />
                                                    <Skeleton className='h-4 w-[200px] mb-1' />
                                                </div>
                                                <div>
                                                    <Skeleton className='h-4 w-[60px] mb-1' />
                                                    <Skeleton className='h-4 w-[100px] mb-1' />
                                                </div>
                                                <div>
                                                    <Skeleton className='h-4 w-[100px] mb-1' />
                                                    <Skeleton className='h-4 w-[300px] mb-1' />
                                                </div>
                                                <div>
                                                    <Skeleton className='h-4 w-[60px] mb-1' />
                                                    <Skeleton className='h-4 w-[100px] mb-1' />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div>
                                <Card className="w-full">
                                    <CardContent>
                                        <div className='pt-8 pb-3'>
                                            <Skeleton className='h-4 w-[400px] mb-1' />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default ProjectDetailsClient