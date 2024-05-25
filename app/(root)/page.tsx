import ThreadCard from "@/components/cards/ThreadCard";
import Pagination from "@/components/shared/Pagination";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Home = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const response = await fetchPosts(parseInt(searchParams.page ?? "1"), 10);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {response.posts.length === 0 ? (
          <p className="no-response">No threads found</p>
        ) : (
          <>
            {response.posts.map((post) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}

        {response.posts.length > 0 && (
          <Pagination path="" isNext={response.isNext} pageNumber={parseInt(searchParams.page ?? "1")} />
        )}
      </section>
    </>
  );
};

export default Home;
