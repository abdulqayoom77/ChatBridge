import { generateStreamToken, serverClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    console.log("🔍 getStreamToken called");
    console.log("📝 req.user:", req.user);

    // Check if user is authenticated
    if (!req.user) {
      console.log("❌ No authenticated user found");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { targetUserId, targetUserName, targetUserImage } = req.query;

    console.log("🔍 getStreamToken called with:", {
      userId: req.user._id, // Use _id instead of id
      userFullName: req.user.fullName,
      targetUserId,
      targetUserName,
      targetUserImage,
    });

    // 1️⃣ Create logged-in user in Stream
    await serverClient.upsertUser({
      id: req.user._id.toString(), // Convert to string and use _id
      name: req.user.fullName,
      image: req.user.profilePic || "",
    });

    console.log("✅ Current user upserted to Stream");

    // 2️⃣ If target user is provided, create them in Stream too
    if (targetUserId) {
      await serverClient.upsertUser({
        id: targetUserId,
        name: targetUserName || "Unknown User",
        image: targetUserImage || "",
      });
      console.log("✅ Target user upserted to Stream");
    }

    // 3️⃣ Generate token for logged-in user
    const token = generateStreamToken(req.user._id); // Use _id

    console.log("✅ Token generated successfully");

    res.status(200).json({ token });
  } catch (error) {
    console.log("❌ Error in getStreamToken controller:", error.message);
    console.log("❌ Full error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}
