import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongoDB from '@utils/database';
import User from '@models/user';
import bcrypt from 'bcrypt';
import { welcomeNewUserMail } from '@app/api/auth/send-mail/welcomeNewUserMail';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password", placeholder: "Password" },
        role: { label: "Role", type: "role", placeholder: "role" },
      },
      async authorize(credentials) {
        await connectMongoDB();

        const user = await User.findOne({ email: credentials.email, role: credentials.role });

        if (user) {
          const passwordMatched = await bcrypt.compare(credentials.password, user.password);

          if (passwordMatched) {
            return { id: user._id, name: user.name, email: user.email, image: user.image, provider: user.provider, role: user.role };
          }
        }

        return null;
      }
    })
  ],
  pages: {
    callbackUrl: '/dashboard',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Save user data in the JWT token when user is logged in
      if (account && user) {
        token.provider = account.provider;

        // For credentials provider, save the id and user data in the token
        if (account.provider === 'credentials') {
          token.id = user.id;
          token.email = user.email;
          token.role = user.role;
          token.image = user.image;
        }

        await connectMongoDB();

        // For external providers (Google, GitHub)
        if (account.provider === 'google' || account.provider === 'github') {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            // Save the new user to the database
            const newUser = new User({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              role: 'user',
            });
            await newUser.save();
            await welcomeNewUserMail(newUser.email, newUser.name);

            token = {
              id: newUser._id.toString(),
              email: newUser.email,
              role: newUser.role,
              image: newUser.image,
            };
          } else {
            token = {
              id: existingUser._id.toString(),
              email: existingUser.email,
              role: existingUser.role,
              image: existingUser.image,
            };
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token;

      await connectMongoDB();
      const dbUser = await User.findOne({ email: token.email });

      if (dbUser) {
        session.user.name = dbUser.name;
        session.user.image = dbUser.image;
      }

      return session;
    },
  }
});


export { handler as GET, handler as POST };