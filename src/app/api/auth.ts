import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import clientPromise from "../../../config/database/connection";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const usersCollection = client
          .db(process.env.DB_NAME)
          .collection("users");
        const email = credentials?.email.toLowerCase();
        const user = await usersCollection.findOne({ email });
        if (!user) {
          throw new Error("User does not exist.");
        }

        //validate password
        const passwordIsValid = await bcrypt.compare(
          credentials?.password!,
          user.password
        );

        if (!passwordIsValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          ...user,
        };
      },
    }),
  ],
  //   secret: process.env.SECRET,
  //   jwt: {
  //     secret: process.env.SECRET,
  //     maxAge: 60 * 60 * 24 * 30,
  //   },
  session: {
    strategy: "jwt",
  },
  //   adapter: MongoDBAdapter(clientPromise),
});
