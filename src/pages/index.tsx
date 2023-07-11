import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";



export default function Home() {
    const { isLoaded: userLoaded, isSignedIn } = useUser();
    const { data, isLoading } = api.list.byCurrentUser.useQuery();
    if (isLoading) <LoadingSpinner size={48} />
    if (!data) return <div>Unauthorized</div>
    const lists = data.map((list) => {
        return (
            <div key={list.id}>
                <Link href={`/list/${list.id}`} className="hover:underline">{list.name}</Link>
            </div>
        );
    });


    if (!userLoaded) return <div />

    return (
        <>
            <Head>
                <title>Grindlists</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 dark:bg-steel-900">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-zinc-900 dark:text-zinc-100">
                    <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-[5rem]">
                        Grindlists
                    </h1>
                    {!isSignedIn && (
                        <SignIn />
                    )}
                    {isSignedIn && (lists)}
                    {isSignedIn && (<SignOutButton />)}
                </div>
            </main>
        </>
    );
}
