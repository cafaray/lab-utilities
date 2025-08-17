import admin from "firebase-admin";

// Initialize Firebase Admin
let db;

// Inject Firestore instance when registering
export async function authRoutes(fastify, options) {
  db = options.db;
  // Middleware to verify ID Token
  async function verifyToken(idToken) {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      return decoded;
    } catch (err) {
      console.error("Token verification failed:", err);
      return null;
    }
  }

  // Route: check login
  fastify.post("/login-check", async (req, reply) => {
    const { idToken } = req.body;
    const decoded = await verifyToken(idToken);

    if (!decoded) {
      return reply.code(401).send({ error: "Invalid token" });
    }

    const uid = decoded.uid;
    const email = decoded.email;

    // Store user in Firestore if not exists
    const userRef = db.collection("users").doc(uid);
    const docSnap = await userRef.get();
    if (!docSnap.exists) {
      await userRef.set({
        email,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    return { message: "User authenticated", uid, email };
  });

  // Route: store user data
  fastify.post("/user-data", async (req, reply) => {
    const { idToken, profileData } = req.body;
    const decoded = await verifyToken(idToken);

    if (!decoded) {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const uid = decoded.uid;
    const userRef = db.collection("users").doc(uid);
    await userRef.set({ profileData }, { merge: true });

    return { message: "Data stored", uid };
  });
  
  async function authRoutes(fastify, options) {
    fastify.get("/", async () => {
      return { message: "Hello from auth route" };
    });
  }
}