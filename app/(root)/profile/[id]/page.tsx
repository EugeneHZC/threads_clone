import ProfileHeader from "@/components/shared/ProfileHeader";
import RepliesTab from "@/components/shared/RepliesTab";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";

const Profile = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(params.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activities = await getActivity(userInfo._id);

  return (
    <section>
      <ProfileHeader info={userInfo} authUserId={user.id} />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-contain" />
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo?.threads?.length}
                  </p>
                )}

                {tab.label === "Replies" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {activities.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {profileTabs.map((tab) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
              {tab.label === "Threads" && <ThreadsTab accountId={userInfo.id} accountType="User" />}

              {tab.label === "Replies" && <RepliesTab />}

              {tab.label === "Tagged" && <ThreadsTab accountId={userInfo.id} accountType="User" />}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Profile;
