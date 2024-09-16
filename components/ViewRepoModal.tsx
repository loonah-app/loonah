'use client'

import { Button } from "@/_components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/_components/ui/dialog"
import {
    Card,
    CardContent,
} from "@/_components/ui/card"
import { Input } from "@/_components/ui/input"
import { Label } from "@/_components/ui/label"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { GitHubRepository } from "@/types/global.types"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/_components/ui/skeleton"
import { PiSpinner } from "react-icons/pi"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation';

export function ViewRepoModal({
    children
}: {
    children: React.ReactNode
}) {

    const router = useRouter();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [repos, setRepos] = useState<GitHubRepository[]>([]);
    const [searchInput, setSearchInput] = useState("");
    const [activeRepo, setActiveRepo] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setIsFetching(true)
            try {
                const response = await axios.get('/api/repos');
                console.log(response.data.data);
                setRepos(response.data.data);
            } catch (err) {
                // console.log(err);
                toast({
                    title: "Error",
                    description: "Error fetching repositories",
                })
            } finally {
                setIsFetching(false)
            }
        };

        if (isOpen && !isFetching) {
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const filtered = useMemo(() => {
        if (repos.length === 0) return [];

        const filtered_ = searchInput.length > 0 ?
            repos.filter((e) => `${e.name}`.toLowerCase().includes(searchInput.toLowerCase())) :
            repos;

        return filtered_;

    }, [searchInput, repos]);

    async function handleValidateActiveRepo(id: string) {
        if (activeRepo.length > 0) return ;
        setActiveRepo(id);
        await isRepoValid(id);
    }

    async function isRepoValid(_activeRepo: string) {
        try {
            if (_activeRepo.length < 1) throw new Error("Invalid repo selected") ;
            const getRepo = repos.find((f) => `${f.id}` === _activeRepo);
            if (!getRepo) throw new Error("Invalid repo: not found");

            await axios.post(
                '/api/repos/isvalid' , 
                {repoOwner: getRepo.owner.login, repoName: getRepo.name}
            );

            const response = await axios.post(
                '/api/projects' , 
                {repoOwner: getRepo.owner.login, repoName: getRepo.name}
            );

            router.push(`/app/projects/${response.data.project_id}`);
        } catch (err) {
            // console.log(err);
            setActiveRepo('');
            toast({
                title: "Error",
                description: (err as any).response.data.message || (err as any).message,
                variant: 'destructive',
                duration: 4000
            });
        }
    }

    function handleToogleOpen() {
        setIsOpen((e) => e ? false : true);
        setIsFetching(false);
        setActiveRepo('')
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleToogleOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Your repositories</DialogTitle>
                    <DialogDescription>
                        Select a repo to deploy
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full pt-1">

                    {
                        !isFetching ?
                            <>
                                {
                                    filtered.length > 0 ?
                                        <>
                                            <div className="mb-8">
                                                <Input value={searchInput} type="text" onChange={(e) => setSearchInput(e.target.value)} placeholder="Search repo" className="border-4" />
                                            </div>

                                            <div className="space-y-3 max-h-[200px] overflow-auto mb-3">
                                                {
                                                    filtered.map((r, i) => (
                                                        <div className={`w-full px-3 py-3 border border-accent rounded-lg flex items-center gap-2 justify-between ${activeRepo === `${r.id}` ? 'bg-accent' : activeRepo !== '' && activeRepo !== `${r.id}` ? 'hover:cursor-not-allowed' : 'hover:bg-accent hover:cursor-pointer'}`} key={i} onClick={() => { handleValidateActiveRepo(`${r.id}`) }}>
                                                            <div>
                                                                <div className="text-sm font-semibold">{r.name}</div>
                                                                <div className="text-xs text-foreground/40">{r.full_name}</div>
                                                            </div>
                                                            {
                                                                activeRepo === `${r.id}` &&
                                                                <div>
                                                                    <PiSpinner className="animate-spin" />
                                                                </div>
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </> :
                                        <div className="mt-3 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className='w-[30px] bg-white px-1 py-1 rounded-full'>
                                                    {
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src="/assets/icons/github.png" alt="github" className='w-full' />
                                                    }
                                                </div>

                                                <div>
                                                    <div className="text-sm">Empty github repository</div>
                                                    <div className=""><span className="text-xs text-foreground/60">Push your projects to github and come back</span> 😇</div>
                                                </div>
                                            </div>
                                        </div>
                                }
                            </> :
                            <>
                                <div className="space-y-3 max-h-[300px] overflow-auto mb-3 mt-3">
                                    {
                                        Array.from(Array(3)).map((_, i) => (
                                            <div className="w-full px-3 py-3 border border-accent rounded-lg flex items-center gap-2" key={i}>
                                                <div className="space-y-2">
                                                    <Skeleton className="h-4 w-[200px]" />
                                                    <Skeleton className="h-4 w-[250px]" />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                    }

                </div>
                {/* <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}
