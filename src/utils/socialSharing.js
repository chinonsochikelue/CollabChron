import { TwitterApi } from 'twitter-api-v2';
import { summarizeText, generateHashtags } from './geminiAI';
import toast from 'react-hot-toast';

/**
 * Shares a post to a specified social media platform.
 *
 * @param {object} postDetails - Details of the post to share.
 * @param {string} postDetails.title - The title of the post.
 * @param {string} postDetails.content - The main content/body of the post.
 * @param {string} postDetails.slug - The slug of the post, used to construct the URL.
 * @param {string} platform - The social media platform to share to (e.g., "twitter").
 * @param {object} credentials - Credentials for the social media platform.
 * @param {string} [credentials.apiKey] - API key (for user or site).
 * @param {string} [credentials.apiSecret] - API secret (for user or site).
 * @param {string} [credentials.accessToken] - Access token (for user or site).
 * @param {string} [credentials.accessSecret] - Access secret (for user's Twitter).
 * @param {boolean} isSiteAccount - Flag to indicate if sharing is for a site account.
 */
export async function sharePostToSocialMedia(postDetails, platform, credentials, isSiteAccount = false) {
  const { title, content, slug } = postDetails;
  const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`;

  let summary;
  let hashtags = [];

  try {
    summary = await summarizeText(content, 180); // Keep summary shorter to allow for URL and hashtags
    hashtags = await generateHashtags(title + " " + content, 3); // Generate 3 hashtags
  } catch (error) {
    console.error(`Gemini AI error for ${platform} sharing:`, error);
    toast.error(`AI content generation failed for ${platform}. Sharing with basic content.`);
    // Fallback to using title if summary fails, and no hashtags
    summary = title;
  }

  const hashtagString = hashtags.join(" ");
  // Ensure the post text + URL + hashtags are within Twitter's limit (280 chars)
  // Approx calculation: summary (180) + URL (23 for t.co) + hashtags (e.g., 3 * 10 = 30) + spaces = ~230-250
  // This leaves some buffer. More precise calculation might be needed.
  
  let postText = `${summary} ${hashtagString} ${postUrl}`;
  if (postText.length > 280) {
      // If too long, try to shorten summary further or reduce hashtags
      const excessLength = postText.length - 280;
      summary = summary.substring(0, summary.length - excessLength - 5) + "..."; // -5 for " ..." and buffer
      postText = `${summary} ${hashtagString} ${postUrl}`;
      if (postText.length > 280) { // If still too long, remove hashtags
          postText = `${summary} ${postUrl}`;
          if (postText.length > 280) { // Final fallback, truncate summary drastically
              summary = summary.substring(0, 277 - postUrl.length) + "...";
              postText = `${summary} ${postUrl}`;
          }
      }
  }


  switch (platform.toLowerCase()) {
    case "twitter":
      try {
        let twitterClient;
        if (isSiteAccount) {
          // Site-level account (using App keys and specific Access Token/Secret for the site's Twitter)
          // These should be environment variables for the site's own Twitter account
          twitterClient = new TwitterApi({
            appKey: process.env.TWITTER_APP_KEY,
            appSecret: process.env.TWITTER_APP_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET,
          });
        } else if (credentials.accessToken && credentials.accessSecret) {
          // User-level account (OAuth 1.0a tokens)
          twitterClient = new TwitterApi({
            appKey: process.env.TWITTER_CLIENT_ID, // Or your app's consumer key
            appSecret: process.env.TWITTER_CLIENT_SECRET, // Or your app's consumer secret
            accessToken: credentials.accessToken,
            accessSecret: credentials.accessSecret,
          });
        } else {
          throw new Error("Twitter credentials (accessToken & accessSecret or site keys) not provided.");
        }
        
        const rwClient = twitterClient.readWrite;
        await rwClient.v2.tweet(postText);
        toast.success(`Successfully shared to Twitter${isSiteAccount ? ' (Site)' : ''}!`);
      } catch (error) {
        console.error(`Failed to share on Twitter${isSiteAccount ? ' (Site)' : ''}:`, error);
        toast.error(`Failed to share on Twitter${isSiteAccount ? ' (Site)' : ''}. ${error.message || ''}`);
      }
      break;
    // Add cases for other platforms like Facebook, LinkedIn here
    // case "facebook":
    //   // Placeholder for Facebook sharing logic
    //   console.log("Sharing to Facebook (not implemented)", { postText, credentials });
    //   toast.info("Facebook sharing is not yet implemented.");
    //   break;
    default:
      console.warn(`Social media platform ${platform} is not supported.`);
      // toast.warn(`Social media platform ${platform} is not supported.`);
      break;
  }
}
