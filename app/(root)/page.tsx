import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs/server";

const Home = async () => {
  const user = await currentUser();

  const response = await fetchPosts(1, 30);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {response.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {response.posts.map((post) => (
              <ThreadCard key={post._id} currentUserId={user?.id || ""} post={post} author={post.author} />
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
