// lib/facebook.js
const bizSdk = require('facebook-nodejs-business-sdk');

// District collector Facebook page IDs or usernames
const DISTRICT_PAGES = {
  "Thiruvananthapuram": "collectortvpm",
  "Kollam": "dckollam", 
  "Pathanamthitta": "dc.pathanamthitta",
  "Alappuzha": "districtcollectoralappuzha",
  "Kottayam": "collectorkottayam",
  "Idukki": "collectoridukki",
  "Ernakulam": "dcekm",
  "Thrissur": "thrissurcollector",
  "Palakkad": "DISTRICTCOLLECTORPALAKKAD",
  "Malappuram": "malappuramcollector",
  "Kozhikode": "CollectorKKD",
  "Wayanad": "wayanadWE",
  "Kannur": "CollectorKNR",
  "Kasaragod": "KasaragodCollector"
};

// Keywords for leave analysis (same as legacy)
const LEAVE_KEYWORDS = {
  leave: [
    'leave', 'holiday', 'അവധി', 'ലീവ്',
    'school', 'college', 'സ്കൂൾ', 'കോളേജ്', 'വിദ്യാലയം',
    'weather', 'rain', 'മഴ', 'കാലാവസ്ഥ'
  ],
  educational: [
    'educational', 'academic', 'വിദ്യാഭ്യാസ', 'അക്കാദമിക്'
  ]
};

class FacebookService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.api = bizSdk.FacebookAdsApi.init(accessToken);
  }

  // Analyze text for leave-related keywords
  analyzeLeaveContent(text) {
    if (!text) {
      return {
        hasLeaveInfo: false,
        keywords: [],
        likelyLeave: false
      };
    }

    const textLower = text.toLowerCase();
    const foundKeywords = [];

    // Find matching keywords
    Object.values(LEAVE_KEYWORDS).flat().forEach(keyword => {
      if (textLower.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    });

    const hasLeaveKeywords = LEAVE_KEYWORDS.leave.some(word => 
      textLower.includes(word.toLowerCase())
    );
    const hasEducationalKeywords = LEAVE_KEYWORDS.educational.some(word => 
      textLower.includes(word.toLowerCase())
    );

    return {
      hasLeaveInfo: foundKeywords.length > 0,
      keywords: foundKeywords,
      likelyLeave: hasLeaveKeywords && hasEducationalKeywords
    };
  }

  // Get posts from a Facebook page
  async getPagePosts(pageId, limit = 5) {
    try {
      const Page = bizSdk.Page;
      const Post = bizSdk.Post;
      
      const page = new Page(pageId);
      
      // Get recent posts
      const posts = await page.getPosts(
        [Post.Fields.message, Post.Fields.created_time, Post.Fields.permalink_url],
        { limit }
      );

      return posts.map(post => ({
        id: post.id,
        message: post.message || '',
        created_time: post.created_time,
        permalink_url: post.permalink_url
      }));

    } catch (error) {
      console.error(`Error fetching posts for ${pageId}:`, error);
      return [];
    }
  }

  // Get data for all districts
  async getAllDistrictsData() {
    const results = {};

    for (const [district, pageId] of Object.entries(DISTRICT_PAGES)) {
      try {
        console.log(`Fetching data for ${district}...`);
        
        const posts = await this.getPagePosts(pageId, 3);
        let analysis = { hasLeaveInfo: false, keywords: [], likelyLeave: false };
        let latestPost = null;

        if (posts.length > 0) {
          // Analyze the most recent post
          const recentPost = posts[0];
          analysis = this.analyzeLeaveContent(recentPost.message);
          latestPost = recentPost;
        }

        results[district] = {
          hasLeaveInfo: analysis.hasLeaveInfo,
          likelyLeave: analysis.likelyLeave,
          keywords: analysis.keywords,
          lastUpdated: new Date().toISOString(),
          fbPost: latestPost?.permalink_url || `https://facebook.com/${pageId}`,
          recentPosts: posts
        };

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing ${district}:`, error);
        results[district] = {
          hasLeaveInfo: false,
          likelyLeave: false,
          keywords: [],
          lastUpdated: new Date().toISOString(),
          fbPost: `https://facebook.com/${pageId}`,
          error: error.message
        };
      }
    }

    return results;
  }
}

module.exports = FacebookService;
