"use client";

import { deleteThread } from "@/lib/actions/thread.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Props {
  threadId: string;
}

const DeleteThread = ({ threadId }: Props) => {
  const pathname = usePathname();

  async function handleDelete() {
    await deleteThread(JSON.parse(threadId), pathname);
  }

  return (
    <Image
      src="/assets/delete.svg"
      alt="delete"
      width={18}
      height={18}
      className="cursor-pointer object-contain"
      onClick={handleDelete}
    />
  );
};

export default DeleteThread;
