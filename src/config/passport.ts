import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './env';
import { user_profile_model } from '../models';
import { v4 as uuidv4 } from 'uuid';

/**
 * Google OAuth Strategy Configuration
 *
 * This handles the OAuth flow with Google:
 * 1. User clicks "Sign in with Google"
 * 2. Redirected to Google's consent screen
 * 3. User approves
 * 4. Google redirects back with authorization code
 * 5. This strategy exchanges code for user profile
 * 6. We find or create user in our database
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google_client_id,
      clientSecret: config.google_client_secret,
      callbackURL: `${config.api_base_url}/auth/google/callback`,
      scope: ['profile', 'email'],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Extract user info from Google profile
        const google_id = profile.id;
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const picture = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Try to find existing user by Google ID
        let user = await user_profile_model.findOne({ google_id });

        if (!user) {
          // Try to find by email (user might have signed up with email before)
          user = await user_profile_model.findOne({ user_email: email });

          if (user) {
            // Link Google account to existing email account
            user.google_id = google_id;
            user.profile_picture = picture;
            user.auth_provider = 'google';
            await user.save();
          } else {
            // Create new user
            user = await user_profile_model.create({
              user_id: uuidv4(),
              user_name: name,
              user_email: email,
              google_id,
              profile_picture: picture,
              auth_provider: 'google',
              is_first_login: true,
            });
          }
        } else {
          // Update existing user's picture if changed
          if (picture && user.profile_picture !== picture) {
            user.profile_picture = picture;
            await user.save();
          }
        }

        // Return user to be added to session
        return done(null, user);
      } catch (error) {
        console.error('❌ Google OAuth Error:', error);
        return done(error as Error, undefined);
      }
    }
  )
);

/**
 * Serialize user for session storage
 * Only store user_id in session (minimal data)
 */
passport.serializeUser((user: any, done) => {
  done(null, user.user_id);
});

/**
 * Deserialize user from session
 * Fetch full user data from database using user_id
 */
passport.deserializeUser(async (user_id: string, done) => {
  try {
    const user = await user_profile_model.findOne({ user_id });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
