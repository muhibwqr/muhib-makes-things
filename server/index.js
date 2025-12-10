import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// X (Twitter) API v2 route
// API Tiers: Free (100 reads/month), Basic ($200/mo - 15k reads), Pro ($5k/mo - 1M reads)
app.get('/api/x-feed', async (req, res) => {
  try {
    const bearerToken = process.env.X_BEARER_TOKEN;
    
    if (!bearerToken) {
      return res.status(200).json([]);
    }

    // Get user ID first using X API v2
    const userResponse = await fetch(
      'https://api.x.com/2/users/by/username/muhibwqr?user.fields=id',
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Failed to fetch user:', errorText);
      
      // Handle rate limiting
      if (userResponse.status === 429) {
        console.error('X API rate limit exceeded');
        return res.status(200).json([]);
      }
      
      return res.status(200).json([]);
    }

    const userData = await userResponse.json();
    const userId = userData.data?.id;

    if (!userId) {
      return res.status(200).json([]);
    }

    // Fetch tweets using X API v2
    // max_results=10 to stay within free tier limits (100 posts/month)
    const tweetsResponse = await fetch(
      `https://api.x.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at,public_metrics&exclude=replies,retweets`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
      }
    );

    if (!tweetsResponse.ok) {
      const errorText = await tweetsResponse.text();
      console.error('Failed to fetch tweets:', errorText);
      
      // Handle rate limiting
      if (tweetsResponse.status === 429) {
        console.error('X API rate limit exceeded');
        return res.status(200).json([]);
      }
      
      return res.status(200).json([]);
    }

    const tweetsData = await tweetsResponse.json();
    
    const posts = (tweetsData.data || []).map((tweet) => ({
      source: 'x',
      text: tweet.text,
      url: `https://x.com/muhibwqr/status/${tweet.id}`,
      createdAt: tweet.created_at,
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching X feed:', error);
    res.status(200).json([]);
  }
});

// LinkedIn API route
app.get('/api/linkedin-feed', async (req, res) => {
  try {
    // LinkedIn API requires OAuth and is more complex
    // For now, return empty array - user can implement their own LinkedIn integration
    // This is a placeholder that can be extended with LinkedIn API v2
    
    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const personId = process.env.LINKEDIN_PERSON_ID;
    
    if (!accessToken || !personId) {
      return res.status(200).json([]);
    }

    // LinkedIn API v2 endpoint for fetching posts
    // Note: This requires proper OAuth setup and permissions
    const response = await fetch(
      `https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(${personId})`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch LinkedIn posts:', await response.text());
      return res.status(200).json([]);
    }

    const data = await response.json();
    
    // Transform LinkedIn posts to match our format
    const posts = (data.elements || []).map((post) => ({
      source: 'linkedin',
      text: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || '',
      url: post.id ? `https://www.linkedin.com/feed/update/${post.id}` : '',
      createdAt: post.created?.time || new Date().toISOString(),
    }));

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching LinkedIn feed:', error);
    res.status(200).json([]);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

