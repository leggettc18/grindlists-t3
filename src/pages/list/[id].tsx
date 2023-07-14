import type { Item, List, ListItem } from "@prisma/client";
import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { LoadingPage } from "~/components/loading";
import useDebounce from "~/hooks/debounce";
import { generateSSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

type ListItemAddProps = {
    listId: string
}

const ListItemAdd = ({ listId }: ListItemAddProps) => {
    const ctx = api.useContext();
    const { mutate: createListItem, isLoading: isCreating } = api.listItem.create.useMutation({
        onSuccess: () => {
            setName("");
            void ctx.list.byId.invalidate();
        },
    });
    const [name, setName] = useState("");
    const [showResults, setShowResults] = useState(false);
    const { data: results, isLoading, refetch } = api.item.search.useQuery({ name }, { enabled: false });
    const { mutate: createItem, isLoading: isCreatingItem, data: newItemData } = api.item.create.useMutation({
        onSuccess: (data) => {
            void ctx.item.search.invalidate();
            createListItem({ itemId: data.id, listId });
        },
    })
    const debouncedSearch = useDebounce(() => {
        if (name !== "") {
            void refetch();
            setShowResults(true);
        }
    }, 500)
    return (
        <div className="flex flex-col">
            <div className="flex">
                <input
                    className="bg-transparent outline-none border-solid border-b border-b-zinc-900 dark:border-b-zinc-100 grow p-1"
                    type="text"
                    value={name}
                    placeholder="Find or Create an Item"
                    disabled={isCreating}
                    onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value === "") {
                            setShowResults(false);
                        }
                        debouncedSearch();
                    }}
                />
            </div>
            {showResults && (results?.map((result) => {
                return (
                    <div
                        key={result.id}
                        className="hover:underline"
                        onClick={() => {
                            createListItem({ itemId: result.id, listId })
                        }}>
                        {result.name}
                    </div>
                )
            }))}
            {showResults && (
                <button
                    onClick={() => {
                        if (!isCreatingItem) {
                            createItem({ name });
                        }
                    }}
                >
                    Create new item for {name}
                </button>
            )}
        </div>
    )
}

type ListItemViewProps = {
    listItem: ListItem & { item: Item }
}

const ListItemView = ({ listItem }: ListItemViewProps) => {
    const ctx = api.useContext();
    const [quantity, setQuantity] = useState(listItem.quantity);
    const { mutate: update, /* isLoading: isUpdating */ } = api.listItem.update.useMutation({
        onSuccess: () => {
            void ctx.list.byId.invalidate();
        }
    });
    const debouncedUpdate = useDebounce(() => {
        if (quantity != listItem.quantity) {
            update({ listItemId: listItem.id, quantity });
        }
    });
    const handleClick = (value: number) => {
        setQuantity(value);
        debouncedUpdate();
    }
    return (
        <>
            <li className="flex items-center justify-between">
                <div className="text-3xl">
                    {listItem.item.name}
                </div>

                <div className="flex text-3xl md:text-lg">
                    <button
                        onClick={() => { handleClick(quantity + 1) }}
                        className="px-2 mx-1 rounded-l-xl bg-seagreen-500"
                    >
                        +
                    </button>
                    {quantity}
                    <button
                        onClick={() => { handleClick(quantity - 1) }}
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
    list: List & { listItems: Array<ListItem & { item: Item }> }
}

const ListView = ({ list }: ListViewProps) => {
    const listItems = list.listItems.map((listItem) => {
        return <ListItemView key={listItem.id} listItem={listItem} />
    })

    return (
        <div className="flex flex-col w-full md:w-1/2">
            <h3 className="text-5xl text-zinc-900 dark:text-zinc-100 py-10 flex justify-center">{list.name}</h3>
            <ul className="flex flex-col mb-10">
                {listItems}
            </ul>
            <ListItemAdd listId={list.id} />
        </div>
    )
}
type PageProps = InferGetStaticPropsType<typeof getStaticProps>;

const SingleListPage: NextPage<PageProps> = ({ id }) => {
    const { data, isLoading } = api.list.byId.useQuery({ listId: id });
    if (isLoading) return <LoadingPage />
    if (!data) return <div />;

    return (
        <>
            <Head>
                <title>{data.name}</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 dark:bg-steel-900 text-zinc-900 dark:text-zinc-100">
                <Link href="/" className="hover:underline">{`< Back to Lists`}</Link>
                <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                    <ListView list={data} />
                </div>
            </main>
        </>
    )
}

export const getStaticProps = async (context: GetStaticPropsContext<{ id: string }>) => {
    const ssg = generateSSSGHelper();

    const id = context.params?.id;

    if (typeof id !== "string") throw new Error("no list matching that id");

    await ssg.list.byId.prefetch({ listId: id });

    return {
        props: {
            trpcState: ssg.dehydrate(),
            id,
        },
    };
};

export const getStaticPaths: GetStaticPaths = () => {
    return { paths: [], fallback: "blocking" };
}

export default SingleListPage;
