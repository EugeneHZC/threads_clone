import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Search = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
  const user = await currentUser();
  if (!user) return null;

  const response = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: parseInt(searchParams.page ?? "1"),
    pageSize: 10,
  });

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section>
      <h1 className="head-text mb-5">Search</h1>

      <Searchbar routeType="search" />

      <div className="mt-14 flex flex-col gap-9">
        {response.users.length === 0 ? (
          <p className="no-result">No users</p>
        ) : (
          <>
            {response.users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}

        <Pagination path="search" isNext={response.isNext} pageNumber={parseInt(searchParams.page ?? "1")} />
      </div>
    </section>
  );
};

export default Search;
