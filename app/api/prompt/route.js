import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request) => {
  try {
    await connectToDB();

    // Ensure that the connection is refreshed each time
    const prompts = await Prompt.find({}).populate("creator").exec();
    console.log("Fetched prompts:", prompts); // Debugging log

    return new Response(JSON.stringify(prompts), {
      status: 200,
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err) {
    console.error("Error fetching prompts:", err); // Debugging log
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
