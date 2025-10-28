// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import { prisma } from "./prisma";
// import bcrypt from "bcryptjs";

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   session: {
//     strategy: "jwt",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         const user = await prisma.user.findUnique({
//           where: {
//             email: credentials.email,
//           },
//         });

//         if (!user || !user.hashedPassword) {
//           return null;
//         }

//         const passwordMatch = await bcrypt.compare(
//           credentials.password,
//           user.hashedPassword
//         );

//         if (!passwordMatch) {
//           return null;
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           image: user.image,
//         };
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       allowDangerousEmailAccountLinking: true, // Add this line
//     }),
//   ],
//   callbacks: {
//     session: async ({ session, token }) => {
//       if (session?.user && token.sub) {
//         session.user.id = token.sub;
//       }
//       return session;
//     },
//     jwt: async ({ user, token }) => {
//       if (user) {
//         token.sub = user.id;
//       }
//       return token;
//     },
//     async signIn({ user, account, profile }) {
//       if (account?.provider === "google") {
//         try {
//           // Check if user already exists with this email
//           const existingUser = await prisma.user.findUnique({
//             where: { email: user.email! },
//           });

//           if (existingUser) {
//             // Check if Google account is already linked
//             const existingAccount = await prisma.account.findFirst({
//               where: {
//                 userId: existingUser.id,
//                 provider: "google",
//               },
//             });

//             if (!existingAccount) {
//               // Link Google account to existing user
//               await prisma.account.create({
//                 data: {
//                   userId: existingUser.id,
//                   type: "oauth",
//                   provider: "google",
//                   providerAccountId: account.providerAccountId,
//                   access_token: account.access_token,
//                   expires_at: account.expires_at,
//                   token_type: account.token_type,
//                   scope: account.scope,
//                   id_token: account.id_token,
//                 },
//               });
//             }

//             user.id = existingUser.id;
//             return true;
//           } else {
//             // Create new user for Google OAuth
//             const newUser = await prisma.user.create({
//               data: {
//                 email: user.email!,
//                 name: user.name,
//                 image: user.image,
//                 emailVerified: new Date(),
//               },
//             });

//             user.id = newUser.id;
//             return true;
//           }
//         } catch (error) {
//           console.error("Error in Google signIn callback:", error);
//           return false;
//         }
//       }
//       return true;
//     },
//   },
//   pages: {
//     signIn: "/login",
//     error: "/auth/error", // Add custom error page
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub!;
        session.user.email = token.email!;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
    jwt: async ({ token, user, account, profile }) => {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // For Google OAuth, ensure we have the user in database
      if (account?.provider === "google" && profile) {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email: profile.email! },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: profile.email!,
                name: profile.name!,
                image: profile.image || profile.image,
                emailVerified: new Date(),
              },
            });
          }

          token.sub = dbUser.id;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.picture = dbUser.image;
        } catch (error) {
          console.error("Error in JWT callback for Google:", error);
        }
      }

      return token;
    },
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google") {
          // Ensure user exists in database
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name!,
                image: user.image,
                emailVerified: new Date(),
              },
            });
          }

          // Ensure account is linked
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: dbUser.id,
              provider: "google",
              providerAccountId: account.providerAccountId,
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: dbUser.id,
                type: "oauth",
                provider: "google",
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }

          user.id = dbUser.id;
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
