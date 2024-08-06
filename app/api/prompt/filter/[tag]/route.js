import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";
import User from "@models/user"; // Import User model

export const GET = async (req) => {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "";

    let prompts;
    if (query) {
      const regex = new RegExp(query, "i");
      prompts = await Prompt.find({
        $or: [{ title: regex }, { content: regex }],
      }).populate("creator");
    } else {
      prompts = await Prompt.find({}).populate("creator");
    }

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
