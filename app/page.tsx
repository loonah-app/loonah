
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SigninButton from "@/components/SigninButton";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Home() {

  const session = await getServerSession(authOptions);

  return (
    <div className="flex justify-center h-lvh items-center">

      <div className="xx-[100px] py-20 -mt-[200px] relative z-10">

        <div className="w-full">

          <div className="font-extrabold text-6xl md:text-8xl mb-3 text-center">Loonah</div>

          <div className="flex justify-center mb-5">
            <div className="font-light text-md text-center">{`With Loonah, you're not just deploying a website; you're launching a mission.`}</div>
          </div>

          <center>
            <div className="flex justify-center w-full md:w-[400px] mb-[30px]">
              <div className="text-xs px-[20px]">
                {
                  `Our user-friendly interface makes it easy to connect your GitHub repository, build your site, and deploy it to the decentralized web.
                  with our subdomain, your site will have a unique cosmic address that's easy to remember. Loonah is built on `
                }
                <Link href={'https://www.walrus.xyz/'} className="text-sky-600 dark:text-sky-200" target="_blank">walrus</Link>
              </div>
            </div>

            <div className="pb-[0px] md:pb-[100px]">
              {
                session ?
                  <Link href={'/app/projects'} className="px-4 py-2.5 border">
                    Launch app
                  </Link> :
                  <SigninButton />
              }
            </div>
          </center>

        </div>

      </div>

      <div className="fixed bottom-[-330px] sm:bottom-[-350px] md:bottom-[-40%] md:right-[10%] z-0">
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img src={'/assets/space-ranger.png'} alt="space-ranger" className="w-[500px]" />
        }
      </div>

      {/* <div className="fixed bottom-[-330px] sm:bottom-[-350px] md:bottom-[-100px]">
        {
          // eslint-disable-next-line @next/next/no-img-element
          <img src={'/assets/planet.png'} alt="space-ranger" className="w-[700px]" />
        }
      </div> */}

    </div>
  );
}
