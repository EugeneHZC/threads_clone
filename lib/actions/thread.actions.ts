"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { text } from "stream/consumers";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({ text, author, communityId, path }: Params) {
  try {
    await connectToDB();

    const createdThread = await Thread.create({ text, author, community: null, isLiked: false });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  await connectToDB();

  // Calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize;

  // fetch posts that have no parent
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: -1 })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });
  const posts = await postsQuery.exec();
  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}

// export async function likeThread(id: string, isLiked: boolean) {
//   await connectToDB();

//   try {
//     const thread = await Thread.findByIdAndUpdate({ _id: id }, { isLiked });
//   } catch (error: any) {
//     throw new Error(`Failed to update thread: ${error.message}`);
//   }
// }

export async function fetchThreadById(id: string) {
  await connectToDB();

  try {
    // TODO: populate community
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error: any) {
    throw new Error(`Failed to get thread: ${error.message}`);
  }
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
  await connectToDB();

  try {
    // Find original thread by its id
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) throw new Error("Thread not found");

    // Create a new thread with the comment text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // Save new comment thread
    const savedCommentThread = await commentThread.save();

    // Update the original thread to include new comment
    originalThread.children.push(savedCommentThread._id);

    // Save the original thread
    await originalThread.save();
  } catch (error: any) {
    throw new Error(`Failed to add comment to thread: ${error.message}`);
  }
}