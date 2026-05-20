import bcrypt from "bcryptjs";
import { db, eq } from "@repo/database";
import { users } from "@repo/database/schema";
import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";
import { GetAuthenticationMethodOutputSchema } from "./model";

class UserService {
  public async getAuthenticationMethods(): Promise<
    ReadonlyArray<GetAuthenticationMethodOutputSchema>
  > {
    const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchema[] = [];

    const isGoogleConfigured = !!(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET);

    if (isGoogleConfigured) {
      const url = googleOAuth2Client.generateAuthUrl();
      supportedAuthenticationProviders.push({
        provider: "GOOGLE_OAUTH",
        displayName: "Google",
        displayText: "Signin with Google",
        authUrl: url,
      });
    }

    return supportedAuthenticationProviders;
  }
  //Create User
  public async createUser(email: string, fullName: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({
        email,
        fullName,
        password: hashed,
      })
      .returning();
    return user;
  }

  //Find User by Email
  public async findUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user || null;
  }

  //Find User by ID
  public async getUserById(userId: string) {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user || null;
  }

  //verifyPassword()
  public async verifyPassword(plainPassword: string, hashedPassword: string) {
    const isVerified = await bcrypt.compare(plainPassword, hashedPassword);
    return isVerified;
  }
}

export default UserService;
