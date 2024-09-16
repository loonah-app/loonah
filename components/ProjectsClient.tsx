'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button } from "@/_components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/_components/ui/card"
import { ViewRepoModal } from '@/components/ViewRepoModal'
import axios from 'axios'
import { ProjectType } from '@/types/global.types'
import { BsThreeDots } from "react-icons/bs";
import { LuLink } from "react-icons/lu";
import { useRouter } from 'next/navigation'
import { Input } from '@/_components/ui/input'
import { Skeleton } from '@/_components/ui/skeleton'

function ProjectsClient() {

    const router = useRouter();
    const [isFetching, setIsFetching] = useState(true);
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [searchInput, setSearchInput] = useState("");

    async function getProjectInfo() {
        try {
            const projectResp = (await axios.get(`/api/projects`)).data.data as ProjectType[];
            console.log(projectResp)
            setProjects(projectResp);
            // setProjects([{
            //     _id: "66e61cfa32508515380867e5",
            //     name: "authapp-testapp",
            //     githubRepo: "https://github.com/penelopewhites08/authapp-testapp",
            //     tempDomain: "734gf8374bf874fg4387fg43f78.walrus.site",
            //     storageObjectId: "734gf8374bf874fg4387fg43f78",
            //     connectedDomain: null,
            //     status: 'DEPLOYED',
            //     createdAt: '05/09/2024 13:11'
            // }, {
            //     _id: "66e61cfa32508515380867e5",
            //     name: "authapp-testapp",
            //     githubRepo: "https://github.com/penelopewhites08/authapp-testapp",
            //     tempDomain: "734gf8374bf874fg4387fg43f78.walrus.site",
            //     storageObjectId: "734gf8374bf874fg4387fg43f78",
            //     connectedDomain: null,
            //     status: 'DEPLOYED',
            //     createdAt: '05/09/2024 13:11'
            // }])
            setIsFetching(false);
        } catch (error) {
            console.log((error as any));
            // .response.data
        }
    }

    function getInfoFromRepoUrl(repoUrl: string) {
        const repoPath = new URL(repoUrl).pathname.split('/');
        const repoOwner = repoPath[1];
        const repoName = repoPath[2];
        return { repoOwner, repoName }
    }

    const filtered = useMemo(() => {
        if (projects.length === 0) return [];

        const filtered_ = searchInput.length > 0 ?
            projects.filter((e) => `${e.name}`.toLowerCase().includes(searchInput.toLowerCase())) :
            projects;

        return filtered_;

    }, [searchInput, projects]);

    useEffect(() => {
        getProjectInfo();
    }, [])

    return (
        <>
            {
                !isFetching ?
                    projects.length > 0 ?
                        // found projects
                        <div>
                            <div className="mb-8">
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10'>
                                    <div className='md:inline-block hidden'>
                                        <Input value={searchInput} type="text" onChange={(e) => setSearchInput(e.target.value)} placeholder="Search repo" className="border-2" />
                                    </div>
                                    <div>
                                        <ViewRepoModal>
                                            <div className='text-right'>
                                                <Button variant="default" className=''>Launch New project</Button>
                                            </div>
                                        </ViewRepoModal>
                                    </div>
                                    <div className='inline-block md:hidden'>
                                        <Input value={searchInput} type="text" onChange={(e) => setSearchInput(e.target.value)} placeholder="Search repo" className="border-2" />
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {
                                    filtered.map((p, i) => (
                                        <div className='cursor-pointer' key={i} onClick={() => router.push(`/app/projects/${p._id}`)}>
                                            <Card className="w-full bg-secondary/30 hover:bg-accent/70">
                                                <CardContent>
                                                    <div className='pt-8 pb-3'>
                                                        <div className='space-y-4'>
                                                            <div className='flex justify-between gap-3 items-center'>
                                                                <div>
                                                                    <div className='text-xs font-medium text-foreground/70'>Name</div>
                                                                    <div className='text-sm'>{p.name}</div>
                                                                </div>
                                                                <div>
                                                                    <Button variant={'ghost'} size={'icon'}>
                                                                        <BsThreeDots />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className='flex items-center gap-3'>
                                                                <div className='w-[20px] bg-white px-1 py-1 rounded-full'>
                                                                    {
                                                                        // eslint-disable-next-line @next/next/no-img-element
                                                                        <img src="/assets/icons/github.png" alt="github" className='w-full' />
                                                                    }
                                                                </div>
                                                                <div>
                                                                    <div className='text-xs font-medium text-foreground/70'>Repo</div>
                                                                    <div className='text-xs'>{getInfoFromRepoUrl(p.githubRepo).repoOwner}/{getInfoFromRepoUrl(p.githubRepo).repoName}</div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className='text-xs text-foreground/70 flex items-center gap-2 mb-1'>
                                                                    <div className='font-medium'>Created</div>
                                                                    <div className=''>{p.createdAt}</div>
                                                                </div>
                                                                <div className='flex gap-2 items-center'>
                                                                    <LuLink className='w-3 h-3' />
                                                                    <div className='text-sm'>master</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        :
                        // no projects
                        <div>
                            {/* <div className='font-semibold text-2xl mb-[100px]'>My Projects</div> */}

                            <div className='md:px-[100px] mt-[40px] md:mt-[200px]'>
                                <div>
                                    <Card className="w-full">
                                        <CardHeader>
                                            <CardTitle>Create project</CardTitle>
                                            <CardDescription>Launch your first website on the decentralized web</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className='flex items-center gap-5'>
                                                {
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src="/assets/icons/react.webp" alt="" className='w-[24px]' />
                                                }
                                                {
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src="/assets/icons/vue.png" alt="" className='w-[24px]' />
                                                }
                                                {
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src="/assets/icons/html2.webp" alt="" className='w-[25px]' />
                                                }
                                            </div>
                                        </CardContent>
                                        <CardFooter className="flex justify-between">
                                            <ViewRepoModal>
                                                <Button variant="default" className='mt-5'>Launch project</Button>
                                            </ViewRepoModal>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>

                            {
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src="/assets/planet.png" alt="planet" className='fixed w-[600px] right-[-200px] md:top-[200px]' />
                            }
                        </div>
                    :
                    // Loading skeleton
                    <div>
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-10'>
                            {
                                Array.from(Array(6)).map((_, i) => (
                                    <Card className="w-full bg-secondary/30 hover:bg-accent/70" key={i}>
                                        <CardContent>
                                            <div className='pt-8 pb-3'>
                                                <div className='space-y-4'>
                                                    <div className='flex justify-between gap-3 items-center'>
                                                        <div>
                                                            <div className='text-xs font-medium text-foreground/70'><Skeleton className='h-4 w-[100px] mb-1' /></div>
                                                            <div className='text-sm'>
                                                                <Skeleton className='h-4 w-[200px]' />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {/*  */}
                                                        </div>
                                                    </div>
                                                    <div className='flex items-center gap-3'>
                                                        <Skeleton className='h-7 w-7 rounded-full' />
                                                        <div>
                                                            <div className='text-xs font-medium text-foreground/70'><Skeleton className='h-3 w-[60px] mb-1' /></div>
                                                            <div className='text-xs'><Skeleton className='h-4 w-[200px]' /></div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='text-xs text-foreground/70 flex items-center gap-2 mb-1'>
                                                            <div className='font-medium'><Skeleton className='h-4 w-[40px] mb-1' /></div>
                                                            <div className=''><Skeleton className='h-4 w-[100px] mb-1' /></div>
                                                        </div>
                                                        <div className='flex gap-2 items-center'>
                                                            <Skeleton className='h-4 w-4 mb-1' />
                                                            <div className='text-sm'><Skeleton className='h-4 w-[80px] mb-1' /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            }
                        </div>
                    </div>
            }
        </>
    )
}

export default ProjectsClient