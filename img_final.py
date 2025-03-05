import openai
import requests
import json
import os
import base64
import webbrowser
from story import extract_features_from_image  # Import feature extraction function

# ✅ Load API Keys Securely
API_KEY = "FPSX66d6ecd9dcd5444c9a90c34153081f94"  # Ensure this is set in your environment
OPENAI_KEY ="sk-proj-BIE4wXDDp1tELWcJpdDmT3BlbkFJwc0Dz927RAlkdC0fAcSs" # Ensure this is set in your environment

if not API_KEY or not OPENAI_KEY:
    print("❌ Error: API keys are missing. Set FREEPIK_API_KEY and OPENAI_API_KEY as environment variables.")
    exit()

# ✅ Freepik API Endpoint
API_URL = "https://api.freepik.com/v1/ai/beta/text-to-image/reimagine-flux"
openai.api_key = OPENAI_KEY  

def encode_image_to_base64(image_path):
    """Converts an image to a Base64 string."""
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode("utf-8")
    except FileNotFoundError:
        print("❌ Error: Image file not found. Check the file path.")
        exit()

# ✅ Get User Input (Only Image or Both)
choice = input("Choose input type (image/both): ").strip().lower()

if choice not in ["image", "both"]:
    print("❌ Invalid choice. Only 'image' or 'both' is allowed.")
    exit()

image_path = input("Enter the path to your image: ").strip()
text_prompt = ""

if choice == "both":
    text_prompt = input("Enter your text prompt: ").strip()

# ✅ Extract Image Features
base64_image = encode_image_to_base64(image_path)
image_features = extract_features_from_image(image_path)

# ✅ Prepare Image Prompt
prompt_text = image_features if choice == "image" else f"{text_prompt}, {image_features}"

# ✅ Prepare API Payload
payload = {
    "prompt": prompt_text,
    "imagination": "wild",
    "aspect_ratio": "square_1_1",
    "image": base64_image  # Attach image
}

# ✅ Set Headers
headers = {
    "x-freepik-api-key": API_KEY,
    "Content-Type": "application/json"
}

# ✅ Send API Request
print("🚀 Sending request to Freepik API...")

try:
    response = requests.post(API_URL, json=payload, headers=headers)
    response.raise_for_status()  # Check for errors
    
    result = response.json()
    generated_images = result.get("generated", [])

    if generated_images:
        image_url = generated_images[0]  # Get first generated image URL
        print("\n✅ Generated Image URL:", image_url)

        # ✅ Open Image in Browser
        webbrowser.open(image_url)

    else:
        print("\n⚠ No image generated. API Response:", json.dumps(result, indent=4))

except requests.exceptions.RequestException as e:
    print(f"\n❌ API Request Failed: {e}")
