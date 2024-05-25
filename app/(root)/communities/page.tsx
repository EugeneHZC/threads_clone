import CommunityCard from "@/components/cards/CommunityCard";
import Searchbar from "@/components/shared/Searchbar";
import { fetchCommunities } from "@/lib/actions/community.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Communities = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const user = await currentUser();
  if (!user) return null;

  const response = await fetchCommunities({ searchString: searchParams.q, pageNumber: 1, pageSize: 10 });

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("");

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <Searchbar routeType="communities" />

      <div className="mt-14 grid grid-cols-2 gap-9">
        {response.communities.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          <>
            {response.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Communities;
