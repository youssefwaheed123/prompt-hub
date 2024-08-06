import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import User from "@models/user"; // Import User model

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const regex = new RegExp(params.tag, "i"); // 'i' makes it case-insensitive

    const users = await User.find({ username: { $regex: regex } });

    const userIds = users.map((user) => user._id);

    const prompts = await Prompt.find({
      $or: [{ tag: { $regex: regex } }, { creator: { $in: userIds } }],
    }).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (err) {
    console.error("Error fetching prompts:", err);
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
