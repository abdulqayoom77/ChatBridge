// backend/src/lib/stream.js
import { StreamChat } from "stream-chat";
import "dotenv/config";

// ✅ Correct variable names
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream API key or Secret is missing");
}

// ✅ Export this so controllers can use it
export const serverClient = StreamChat.getInstance(apiKey, apiSecret);

// Upsert (create/update) a user in Stream
export const upsertStreamUser = async (userData) => {
  try {
    await serverClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
    throw error;
  }
};

// Generate a token for a given user
export const generateStreamToken = (userId) => {
  try {
    // Ensure userId is a string
    const userIdStr = userId.toString();
    return serverClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw error;
  }
};
