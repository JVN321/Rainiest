# utilities/data_updater.py
# This script can be run separately or integrated with a background job service

import json
import re
from datetime import datetime
import requests
from typing import Dict, List

class DistrictDataUpdater:
    def __init__(self):
        self.collector_profiles = {
            "Thiruvananthapuram": "https://www.facebook.com/collectortvpm",
            "Kollam": "https://www.facebook.com/dckollam",
            "Pathanamthitta": "https://www.facebook.com/dc.pathanamthitta",
            "Alappuzha": "https://www.facebook.com/districtcollectoralappuzha",
            "Kottayam": "https://www.facebook.com/collectorkottayam",
            "Idukki": "https://www.facebook.com/collectoridukki",
            "Ernakulam": "https://www.facebook.com/dcekm",
            "Thrissur": "https://www.facebook.com/thrissurcollector",
            "Palakkad": "https://www.facebook.com/DISTRICTCOLLECTORPALAKKAD",
            "Malappuram": "https://www.facebook.com/malappuramcollector",
            "Kozhikode": "https://www.facebook.com/CollectorKKD",
            "Wayanad": "https://www.facebook.com/wayanadWE",
            "Kannur": "https://www.facebook.com/CollectorKNR",
            "Kasaragod": "https://www.facebook.com/KasaragodCollector"
        }
        
        self.keywords = {
            'leave': [
                'leave', 'holiday', 'അവധി', 'ലീവ്',
                'school', 'college', 'സ്കൂൾ', 'കോളേജ്', 'വിദ്യാലയം',
                'weather', 'rain', 'മഴ', 'കാലാവസ്ഥ'
            ],
            'educational': [
                'educational', 'academic', 'വിദ്യാഭ്യാസ', 'അക്കാദമിക്'
            ]
        }

    def analyze_text(self, text: str) -> Dict:
        """Analyze text for leave-related keywords"""
        if not text:
            return {
                'hasLeaveInfo': False,
                'keywords': [],
                'likelyLeave': False
            }
        
        text_lower = text.lower()
        found_keywords = []
        
        for category, words in self.keywords.items():
            for word in words:
                if word.lower() in text_lower:
                    found_keywords.append(word)
        
        has_leave_keywords = any(word in text_lower for word in self.keywords['leave'])
        has_educational_keywords = any(word in text_lower for word in self.keywords['educational'])
        
        return {
            'hasLeaveInfo': bool(found_keywords),
            'keywords': found_keywords,
            'likelyLeave': has_leave_keywords and has_educational_keywords
        }

    def update_district_data(self) -> Dict:
        """Update district data and return formatted results"""
        results = {}
        
        for district, fb_url in self.collector_profiles.items():
            try:
                # In a real implementation, you would scrape Facebook here
                # For now, we'll simulate with mock data
                mock_text = self._get_mock_post_text(district)
                analysis = self.analyze_text(mock_text)
                
                results[district] = {
                    'hasLeaveInfo': analysis['hasLeaveInfo'],
                    'likelyLeave': analysis['likelyLeave'],
                    'keywords': analysis['keywords'],
                    'fbPost': fb_url,
                    'lastUpdated': datetime.now().isoformat()
                }
                
            except Exception as e:
                results[district] = {
                    'hasLeaveInfo': False,
                    'likelyLeave': False,
                    'keywords': [],
                    'fbPost': fb_url,
                    'lastUpdated': datetime.now().isoformat(),
                    'error': str(e)
                }
        
        return results

    def _get_mock_post_text(self, district: str) -> str:
        """Mock post text for testing"""
        mock_posts = {
            "Kottayam": "കാലാവസ്ഥ പ്രതികൂലമായതിനാൽ ജാഗ്രത പാലിക്കുക",
            "Thiruvananthapuram": "Today's meeting with department heads completed successfully",
            "Wayanad": "സ്കൂൾ അവധി പ്രഖ്യാപിച്ചു കാരണം കനത്ത മഴ"
        }
        return mock_posts.get(district, "General administrative update")

    def save_to_file(self, data: Dict, filename: str = 'district_data.json'):
        """Save data to JSON file"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    updater = DistrictDataUpdater()
    data = updater.update_district_data()
    updater.save_to_file(data)
    print("District data updated successfully!")
