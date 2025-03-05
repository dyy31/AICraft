import requests
import json
import os
import openai
from story import generate_story 
global speaker_id



# DupDub API endpoint
clone_url = "https://moyin-gateway.dupdub.com/tts/v1/speakerClone"

# Your DupDub API key
api_key = "772914cc9dea460e9c0c9638cb821c4d"
openai.api_key = "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"

#Story Generation
text_prompt = input("📜 Enter a text prompt for the story: ").strip()
story = generate_story(text_prompt=text_prompt) 

#Voice Sample Input 
vaudio_path = input("Enter the path to your voice sample (e.g., sample.wav): ").strip()

# Payload for voice cloning
data = {
    "name": "cloned_1",
    "url": vaudio_path,  # Ensure this URL is valid
    "language": "English",
    "accent": "INDIAN",
    "gender": "MALE",
    "age": "Adults",
    "style": "chat"
}

headers = {
    "dupdub_token": f"{api_key}",
    "Content-Type": "application/json"
}

# Send request to clone voice
response = requests.post(clone_url, json=data, headers=headers)

# Parse response
if response.status_code == 200:
    result = response.json()
    print("Voice cloned successfully. Full Response:")
    print(json.dumps(result, indent=4))  # Pretty print response

    # Extract the correct voice ID
    speaker_id = result.get("data", {}).get("speaker")
    
    if speaker_id:
        print("✅ Voice ID:", speaker_id)
    else:
        print("⚠️ No Voice ID found! Check API response format.")
else:
    print("❌ Failed to clone voice. Status Code:", response.status_code)
    print("Error Message:", response.text)

#Step 2
# API endpoint for query the AI avatar project status
url = "https://moyin-gateway.dupdub.com/tts/v1/playDemo/dubForSpeaker"


headers = {
    "dupdub_token": f"{api_key}",
    "Content-Type": "application/json"
}

payload = {
    "speaker": speaker_id,
    "speed": 1.0,
    "pitch": 0,
    "textList": [story],
    "source": "web"
}

response = requests.post(url, json=payload, headers=headers)

# Parse the response
if response.status_code == 200:
    result = response.json()
    print(result)
else:
    print("Failed to synthesis speech. Status Code:", response.status_code)
