import requests
import json
import os
import base64

# ✅ Freepik API Key (Replace with your actual key)
API_KEY = "FPSX66d6ecd9dcd5444c9a90c34153081f94"

# ✅ Freepik API Endpoint
API_URL = "https://api.freepik.com/v1/ai/beta/text-to-image/reimagine-flux"

# ✅ Function to Convert Image to Base64
def encode_image_to_base64(image_path):
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode("utf-8")
    except FileNotFoundError:
        print("❌ Error: Image file not found. Check the file path.")
        exit()

# ✅ Set Image Path (Update with your image file location)
IMAGE_PATH = "/Users/dy/Desktop/images/img1.jpg"

# ✅ Convert Image to Base64
base64_image = encode_image_to_base64(IMAGE_PATH)

# ✅ Prepare API Payload
payload = {
    "image": base64_image,
    "prompt": "Birthday party with balloons and cake on a table, Indian brown skin man of age 55",
    "imagination": "wild",
    "aspect_ratio": "square_1_1"
}

# ✅ Set Headers
headers = {
    "x-freepik-api-key": API_KEY,
    "Content-Type": "application/json"
}

# ✅ Send API Request
print("🚀 Sending request to Freepik API...")
response = requests.post(API_URL, json=payload, headers=headers)

# ✅ Handle API Response
if response.status_code == 200:
    result = response.json()
    
    # 🔹 Print Full API Response for Debugging
    print("\n🔹 Full API Response:")
    print(json.dumps(result, indent=4))
    
    # ✅ Extract Generated Image URL
    generated_images = result.get("generated", [])
    
    if generated_images:
        image_url = generated_images[0]  # Get the first image URL
        print("\n✅ Generated Image URL:", image_url)
    else:
        print("\n⚠ No image generated. Check API response for issues.")
else:
    print(f"\n❌ Error {response.status_code}: {response.text}")
