import Fastify from "fastify";
import cors from "@fastify/cors";
import {authRoutes} from "./services/server.js";
import * as dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();
console.info("FIREBASE_CREDENTIALS:", process.env.FIREBASE_CREDENTIALS);
const credPath = process.env.FIREBASE_CREDENTIALS;
admin.initializeApp({
  credential: admin.credential.cert(credPath)
});
const db = admin.firestore();
const server = Fastify({  logger: true });

server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

server.register(authRoutes, { db });

server.get("/", async ()=>{
  return { message: "Login utility started"  }
});

// Start server:
server.listen({port:3000}, (err, address) => {
  if (err) throw err;
  console.log(`🚀 Server running at ${address}`);
})
