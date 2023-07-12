import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { LoadingSpinner } from "~/components/loading";
import { api } from "~/utils/api";

const CreateList = () => {
    const ctx = api.useContext();
    const { mutate, isLoading: isCreating } = api.list.create.useMutation({
        onSuccess: () => {
            setName("");
            void ctx.list.byCurrentUser.invalidate();
        },
    });
    const [name, setName] = useState("");
    return (
        <div className="flex w-full md:w-1/2">
            <input
                className="bg-transparent outline-none border-solid border-b border-b-zinc-900 dark:border-b-zinc-100 grow p-1"
                type="text"
                value={name}
                placeholder="Name your list!"
                disabled={isCreating}
                onChange={(e) => {
                    setName(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        if (name !== "") {
                            mutate({ name });
                        }
                    }
                }}
            />
            {name !== "" && !isCreating && (
                <button
                    className="px-3 bg-seagreen-500 rounded-xl text-zinc-100 text-2xl"
                    disabled={isCreating}
                    onClick={() => {
                        mutate({ name });
                    }}
                >
                    +
                </button>
            )}
        </div>
    )
}

const ListsView = () => {
    const { data, isLoading } = api.list.byCurrentUser.useQuery();
    if (isLoading) return <LoadingSpinner size={48} />;
    if (!data) return <div />;
    const lists = data.map((list) => {
        return <div key={list.id}>
            <Link href={`/list/${list.id}`} className="hover:underline">{list.name}</Link>
        </div>
    });
    return <>
        {lists}
        <CreateList />
    </>
}

export default function Home() {
    const { /*isLoaded: userLoaded,*/ isSignedIn } = useUser();
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
                    <ListsView />
                    {isSignedIn && (<SignOutButton />)}
                </div>
            </main>
        </>
    );
}
