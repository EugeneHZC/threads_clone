import Link from "next/link";
import Image from "next/image";

interface Props {
  parentId: string;
  author: {
    image: string;
    name: string;
    id: string;
  };
}

const ActivityCard = ({ parentId, author }: Props) => {
  return (
    <Link href={`/thread/${parentId}`}>
      <article className="activity-card">
        <Image src={author.image} alt="profile picture" width={20} height={20} className="rounded-full object-cover" />
        <p className="!text-small-regular text-light-1">
          <span className="mr-1 text-primary-500">{author.name}</span> replied to your thread
        </p>
      </article>
    </Link>
  );
};

export default ActivityCard;
