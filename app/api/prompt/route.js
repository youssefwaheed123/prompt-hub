import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req) => {
  try {
    await connectToDB();

    const prompts = await Prompt.find().populate("creator");
    if (!prompts) return new Response("Prompts not found", { status: 404 });

    return new Response(JSON.stringify(prompts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Error fetching prompts:", err.message);
    console.error(err.stack); // Log the stack trace to identify where the error is coming from
    return new Response("Failed to fetch all prompts", { status: 500 });
  }
};
