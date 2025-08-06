import json
from datetime import datetime
import re
import sys

# Set console to use UTF-8
if sys.platform == 'win32':
    import os
    os.system('chcp 65001')

# Keywords to look for in both English and Malayalam
KEYWORDS = {
    'leave': [
        'leave', 'holiday', 'അവധി', 'ലീവ്',
        'school', 'college', 'സ്കൂൾ', 'കോളേജ്', 'വിദ്യാലയം',
        'weather', 'rain', 'മഴ', 'കാലാവസ്ഥ'
    ],
    'educational': [
        'educational', 'academic', 'വിദ്യാഭ്യാസ', 'അക്കാദമിക്'
    ]
}

def analyze_post(text):
    if not text:
        return {
            'has_leave_info': False,
            'keywords_found': [],
            'likely_leave': False
        }
    
    # Convert text to lowercase for better matching
    text_lower = text.lower()
    
    # Find all matching keywords
    found_keywords = []
    for category, words in KEYWORDS.items():
        for word in words:
            if word.lower() in text_lower:
                found_keywords.append(word)
    
    # Determine if this is likely a leave announcement
    has_leave_keywords = any(word in text_lower for word in KEYWORDS['leave'])
    has_educational_keywords = any(word in text_lower for word in KEYWORDS['educational'])
    
    likely_leave = has_leave_keywords and has_educational_keywords
    
    return {
        'has_leave_info': bool(found_keywords),
        'keywords_found': found_keywords,
        'likely_leave': likely_leave
    }

def check_leave_announcements():
    try:
        with open('collector_posts.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        results = {}
        for district, info in data.items():
            if 'error' in info:
                results[district] = {
                    'status': 'error',
                    'error': info['error'],
                    'last_updated': info['last_updated']
                }
                continue
            
            analysis = analyze_post(info.get('text', ''))
            results[district] = {
                'status': 'analyzed',
                'url': info.get('url', ''),
                'last_updated': info.get('last_updated', ''),
                'has_leave_info': analysis['has_leave_info'],
                'likely_leave': analysis['likely_leave'],
                'keywords_found': analysis['keywords_found']
            }
        
        # Save analysis results
        with open('leave_analysis.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        return results

    except Exception as e:
        print(f"Error analyzing posts: {str(e)}")
        return None

if __name__ == "__main__":
    results = check_leave_announcements()
    if results:
        print("\n=== Leave Announcement Analysis ===")
        for district, info in results.items():
            try:
                print(f"\n{district}:")
                if info['status'] == 'error':
                    print(f"  Error: {info['error']}")
                else:
                    print(f"  Leave Information Found: {info['has_leave_info']}")
                    if info['has_leave_info']:
                        print(f"  Likely Leave: {info['likely_leave']}")
                        # Safe printing of keywords
                        keywords = info['keywords_found']
                        try:
                            print(f"  Keywords Found: {', '.join(keywords)}")
                        except UnicodeEncodeError:
                            # Fallback for console display
                            print("  Keywords Found: [Malayalam text]")
                    print(f"  Last Updated: {info['last_updated']}")
            except UnicodeEncodeError as e:
                print(f"  [Display Error: Malayalam text present]")