// https://github.com/nextauthjs/next-auth-typescript-example/blob/main/pages/api/auth/%5B...nextauth%5D.ts
import NextAuth from "next-auth";
import type { NextAuthOptions } from 'next-auth'
import { Provider } from "next-auth/providers";
// import ZitadelProvider from "next-auth/providers/zitadel";

export const ZITADEL: Provider = {
  id: "zitadel",
  name: "zitadel",
  type: "oauth",
  version: "2",
  wellKnown: process.env.ZITADEL_ISSUER,
  authorization: {
    params: {
      scope: "openid email profile",
    },
  },
  idToken: true,
  checks: ["pkce", "state"],
  client: {
    token_endpoint_auth_method: "none",
  },
  async profile(profile) {
    return {
      id: profile.sub,
      name: profile.name,
      firstName: profile.given_name,
      lastName: profile.family_name,
      email: profile.email,
      loginName: profile.preferred_username,
      image: profile.picture,
    };
  },
  clientId: process.env.ZITADEL_CLIENT_ID,
}

export const authOptions: NextAuthOptions = {
  // providers: [ZitadelProvider({
  //   issuer: process.env.ZITADEL_ISSUER,
  //   clientId: process.env.ZITADEL_CLIENT_ID,
  //   clientSecret: process.env.NEXTAUTH_SECRET,
  // })],
  providers: [ZITADEL],

  theme: {
    colorScheme: "auto", // "auto" | "dark" | "light"
    // brandColor: "", // Hex color code
    // logo: "", // Absolute URL to image
    // buttonText: "" // Hex color code
  },

  // // required in production
  // // $ openssl rand -base64 32
  // secret: process.env.NEXTAUTH_SECRET,

  // You can define custom pages to override the built-in ones. These will be regular Next.js pages
  // so ensure that they are placed outside of the '/api' folder, e.g. signIn: '/auth/mycustom-signin'
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: '/auth/signin',  // Displays signin buttons
    signOut: '/auth/singout', // Displays form with sign out button
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // Used for check email page
    // newUser: '/auth/new-user' // If set, new users will be directed here on first sign in
  },

  // // Callbacks are asynchronous functions you can use to control what happens
  // // when an action is performed.
  // // https://next-auth.js.org/configuration/callbacks
  // callbacks: {
  //   // async signIn({ user, account, profile, email, credentials }) { return true },
  //   // async redirect({ url, baseUrl }) { return baseUrl },
  //   // async session({ session, token, user }) { return session },
  // },

  // // Events are useful for logging
  // // https://next-auth.js.org/configuration/events
  // events: {
  //   async signIn(message) { /* on successful sign in */ },
  //   async signOut(message) { /* on signout */ },
  //   async createUser(message) { /* user created */ },
  //   async updateUser(message) { /* user updated - e.g. their email was verified */ },
  //   async linkAccount(message) { /* account (e.g. Twitter) linked to a user */ },
  //   async session(message) { /* session is active */ },
  // },

  // // You can use this to send NextAuth.js logs to a third-party logging service.
  // logger: {
  //   error(code, metadata) {
  //     log.error(code, metadata)
  //   },
  //   warn(code) {
  //     log.warn(code)
  //   },
  //   debug(code, metadata) {
  //     log.debug(code, metadata)
  //   }
  // }

  // // Enable debug messages in the console if you are having problems
  // debug: false,
}

export default NextAuth(authOptions);

// export default NextAuth({
//   providers: [ZITADEL],
// });

