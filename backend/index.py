import requests
import json

# Configuration
API_KEY = "YOUR_RAPIDAPI_KEY"
URL = "https://lingua-robot.p.rapidapi.com/language/v1/entries/fr/"

def get_french_data(word):
    headers = {
        "X-RapidAPI-Key": API_KEY,
        "X-RapidAPI-Host": "lingua-robot.p.rapidapi.com"
    }
    
    response = requests.get(URL + word, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        try:
            # Extracting IPA and Audio
            ipa = data['entries'][0]['pronunciations'][0]['transcriptions'][0]['notation']
            audio = data['entries'][0]['pronunciations'][0]['audio']['url']
            return {"phonetics": f"[{ipa}]", "audioUrl": audio}
        except (KeyError, IndexError):
            return {"phonetics": "N/A", "audioUrl": None}
    return None

# Example usage with your Lexicon Schema
words_to_seed = ["Bonjour", "Enchanté", "Chat"]
seeded_data = []

for word in words_to_seed:
    details = get_french_data(word)
    seeded_data.append({
        "term": word,
        "phonetics": details['phonetics'] if details else "Pending",
        "audioUrl": details['audioUrl'] if details else ""
    })

print(json.dumps(seeded_data, indent=2))