declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;
      NEXTAUTH_URL:string;
      ZITADEL_ISSUER: string;
      ZITADEL_CLIENT_ID: string;
    }
  }
}