import { NextResponse } from 'next/server';

// Import the Facebook service (will only work in Node.js environment)
let FacebookService;
try {
  FacebookService = require('../../../../lib/facebook.js');
} catch (error) {
  console.log('Facebook SDK not available in browser environment');
}

// Mock data as fallback
const mockDistrictData = {
  "Thiruvananthapuram": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/collectortvpm"
  },
  "Kollam": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/dckollam"
  },
  "Pathanamthitta": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/dc.pathanamthitta"
  },
  "Alappuzha": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/districtcollectoralappuzha"
  },
  "Kottayam": {
    hasLeaveInfo: true,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: ["കാലാവസ്ഥ"],
    fbPost: "https://www.facebook.com/collectorkottayam"
  },
  "Idukki": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/collectoridukki"
  },
  "Ernakulam": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/dcekm"
  },
  "Thrissur": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/thrissurcollector"
  },
  "Palakkad": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/DISTRICTCOLLECTORPALAKKAD"
  },
  "Malappuram": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/malappuramcollector"
  },
  "Kozhikode": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/CollectorKKD"
  },
  "Wayanad": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/wayanadWE"
  },
  "Kannur": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/CollectorKNR"
  },
  "Kasaragod": {
    hasLeaveInfo: false,
    likelyLeave: false,
    lastUpdated: new Date().toISOString(),
    keywords: [],
    fbPost: "https://www.facebook.com/KasaragodCollector"
  }
};

export async function GET() {
  try {
    // Check if we have a valid Facebook access token
    const fbAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    
    if (fbAccessToken && FacebookService) {
      console.log('Using Facebook API to fetch real data...');
      
      const fbService = new FacebookService(fbAccessToken);
      const realData = await fbService.getAllDistrictsData();
      
      return NextResponse.json(realData);
    } else {
      console.log('Using mock data - Facebook token not configured');
      
      // Simulate some randomness for demo purposes
      const simulatedData = {};
      Object.keys(mockDistrictData).forEach(district => {
        simulatedData[district] = {
          ...mockDistrictData[district],
          hasLeaveInfo: Math.random() > 0.8,
          likelyLeave: Math.random() > 0.9,
          lastUpdated: new Date().toISOString()
        };
      });

      return NextResponse.json(simulatedData);
    }
  } catch (error) {
    console.error('Error fetching district data:', error);
    return NextResponse.json({ error: 'Failed to fetch district data' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const fbAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    
    if (fbAccessToken && FacebookService) {
      const fbService = new FacebookService(fbAccessToken);
      const updatedData = await fbService.getAllDistrictsData();
      
      // In a real app, you'd save this to a database here
      return NextResponse.json({ 
        message: 'Data updated successfully', 
        data: updatedData 
      });
    } else {
      return NextResponse.json({ 
        message: 'Facebook API not configured - using mock data' 
      });
    }
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}
