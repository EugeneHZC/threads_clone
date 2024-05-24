import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  let response: any;

  if (accountType === "Community") {
    response = await fetchCommunityPosts(accountId);
  } else {
    response = await fetchUserPosts(accountId);
  }

  if (!response) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {response.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          currentUserId={currentUserId}
          post={thread}
          author={
            accountType === "User"
              ? { name: response.name, image: response.image, id: response.id }
              : { name: thread.author.name, image: thread.author.image, id: thread.author.id }
          }
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
