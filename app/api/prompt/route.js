import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, { searchParams }) => {
  try {
    await connectToDB();

    const filter = {};
    if (searchParams.has("tag")) {
      filter.tag = searchParams.get("tag");
    }

    const prompts = await Prompt.find(filter).populate("creator");
    if (!prompts) return new Response("Prompts not found", { status: 404 });
    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (err) {
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
