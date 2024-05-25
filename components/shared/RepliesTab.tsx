import { currentUser } from "@clerk/nextjs/server";
import ActivityCard from "../cards/ActivityCard";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const RepliesTab = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activities = await getActivity(userInfo._id);

  return (
    <section className="mt-9 flex flex-col gap-10">
      {activities ? (
        activities.map((activity: any) => (
          <ActivityCard key={activity._id} author={activity.author} parentId={activity.parentId} />
        ))
      ) : (
        <p className="!text-base-regular text-light-3">No activity yet</p>
      )}
    </section>
  );
};

export default RepliesTab;
