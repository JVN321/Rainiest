// scripts/test-facebook-api.js
// Run this script to test Facebook API connectivity
require("dotenv").config();
const FacebookService = require("../lib/facebook.js");

async function testFacebookAPI() {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    if (!accessToken) {
        console.error("❌ FACEBOOK_ACCESS_TOKEN not found in environment variables");
        console.log("📝 Create a .env.local file with your Facebook access token");
        console.log("📖 See .env.example for guidance");
        return;
    }

    console.log("🚀 Testing Facebook API connection...");
    console.log("🔑 Access Token:", accessToken.substring(0, 20) + "...");

    try {
        const fbService = new FacebookService(accessToken);

        // Test with just one district first
        console.log("\n📍 Testing with Thiruvananthapuram collector page...");
        const posts = await fbService.getPagePosts("dcekm", 2);

        if (posts.length > 0) {
            console.log("✅ Successfully retrieved posts!");
            console.log("📄 Latest post preview:");
            console.log("   Created:", posts[0].created_time);
            console.log("   Message:", posts[0].message?.substring(0, 100) + "...");
            console.log("   URL:", posts[0].permalink_url);

            // Test analysis
            const analysis = fbService.analyzeLeaveContent(posts[0].message);
            console.log("\n🔍 Leave Analysis:");
            console.log("   Has Leave Info:", analysis.hasLeaveInfo);
            console.log("   Likely Leave:", analysis.likelyLeave);
            console.log("   Keywords Found:", analysis.keywords);
        } else {
            console.log("⚠️  No posts retrieved - check page permissions");
        }
    } catch (error) {
        console.error("❌ Error testing Facebook API:", error.message);

        if (error.message.includes("Invalid OAuth")) {
            console.log("💡 Token might be expired or invalid");
            console.log("🔗 Get a new token: https://developers.facebook.com/tools/explorer/");
        }

        if (error.message.includes("permissions")) {
            console.log("💡 Token needs pages_read_engagement permission");
        }
    }
}

// Run the test
testFacebookAPI()
    .then(() => {
        console.log("\n✨ Test completed");
    })
    .catch(console.error);
