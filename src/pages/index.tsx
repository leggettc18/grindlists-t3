import { SignIn, SignOutButton, useUser } from "@clerk/nextjs";
import type { Item, ListItem } from "@prisma/client";
import Head from "next/head";
import { useState } from "react";
import { api } from "~/utils/api";

type ListItemViewProps = {
    listItem: ListItem & { item: Item }
}

const ListItemView = ({ listItem }: ListItemViewProps) => {
    const ctx = api.useContext();
    const [quantity, setQuantity] = useState(listItem.quantity);
    const { mutate: update, isLoading: isUpdating } = api.listItem.update.useMutation({
        onSuccess: () => {
            void ctx.list.byId.invalidate();
        }
    })
    return (
        <>
            <li className="flex items-center justify-between">
                <div className="text-3xl">
                    {listItem.item.name}
                </div>

                <div className="flex text-3xl md:text-lg">
                    <button
                        onClick={() => setQuantity(value => {
                            update({ listItemId: listItem.id, quantity: value + 1 });
                            return value + 1;
                        })}
                        className="px-2 mx-1 rounded-l-xl bg-seagreen-500"
                    >
                        +
                    </button>
                    {quantity}
                    <button
                        onClick={() => setQuantity(value => {
                            update({ listItemId: listItem.id, quantity: value - 1 });
                            return value - 1;
                        })}
                        className="px-2 mx-1 rounded-r-xl bg-sunset-600"
                    >
                        -
                    </button>
                </div>
            </li>
        </>
    );
}

type ListViewProps = {
    listId: string
}

const ListView = ({ listId }: ListViewProps) => {
    const { data, isLoading } = api.list.byId.useQuery({ listId });

    if (!data) return <div />;

    const listItems = data.listItems.map((listItem) => {
        return <ListItemView key={listItem.id} listItem={listItem} />
    })

    return (
        <>
            <ul className="flex flex-col">
                {listItems}
            </ul>
        </>
    )
}

export default function Home() {
    const listsData = api.list.byCurrentUser.useQuery();
    const lists = listsData.data?.map((list) => {
        return (
            <div key={list.id}>
                <p className="text-5xl text-zinc-100 py-10">{list.name}</p>
                <ListView listId={list.id} />
            </div>
        );
    });

    const { isLoaded: userLoaded, isSignedIn } = useUser();

    if (!userLoaded) return <div />

    return (
        <>
            <Head>
                <title>Grindlists</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-steel-900">
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-zinc-100">
                    <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
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
