from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import json
from datetime import datetime
import time

def setup_driver():
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')  # Run in background
    options.add_argument('--disable-notifications')
    return webdriver.Chrome(options=options)

def scrape_facebook_profile(driver, profile_url):
    try:
        driver.get(profile_url)
        time.sleep(5)  # Wait for dynamic content to load
        
        # Find the first post
        posts = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, '[data-ad-preview="message"]'))
        )
        
        if posts:
            post = posts[0]
            # Get post text
            post_text = post.text[:200] if post.text else "No text available"
            
            # Try to get post timestamp
            try:
                timestamp = driver.find_element(By.CSS_SELECTOR, 'a[href*="/posts/"]').get_attribute('href')
            except:
                timestamp = None
            
            return {
                "text": post_text,
                "url": timestamp or profile_url,
                "last_updated": datetime.now().isoformat()
            }
    except Exception as e:
        return {"error": str(e), "last_updated": datetime.now().isoformat()}

def main():
    collector_profiles = {
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
    results = {}
    driver = setup_driver()
    
    try:
        for district, url in collector_profiles.items():
            print(f"Scraping {district}...")
            results[district] = scrape_facebook_profile(driver, url)
            
        with open('collector_posts.json', 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
            
    finally:
        driver.quit()

if __name__ == "__main__":
    main()