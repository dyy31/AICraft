import openai
import base64

# Set your OpenAI API key here
openai.api_key = "sk-proj-BIE4wXDDp1tELWcJpdDmT3BlbkFJwc0Dz927RAlkdC0fAcSs"  # Replace with your actual API key

def extract_features_from_image(image_path):
    """Extracts features from an image using OpenAI's Vision API."""
    with open(image_path, "rb") as image_file:
        # Convert image to base64 format
        base64_image = base64.b64encode(image_file.read()).decode("utf-8")

    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "Analyze the image and describe its key features in detail."},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Describe the image in detail."},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                ]
            }
        ],
        max_tokens=300
    )
    return response["choices"][0]["message"]["content"]

def generate_story(image_features, context=""):
    """Generates a story using GPT based on image features and additional context."""
    prompt = f"""
    Create a heartfelt and vivid short story based on the following details:
    - Image Features: {image_features}
    - Additional Context: {context}
    """
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[{"role": "system", "content": "You are a creative storyteller."},
                  {"role": "user", "content": prompt}],
        max_tokens=500
    )
    return response["choices"][0]["message"]["content"]

def generate_image_prompts(image_features):
    """Generates 2-3 text prompts for AI image generation tools."""
    prompt = f"""
    Based on these image features:
    {image_features}
    Generate 3 detailed prompts for an AI image generation tool to create visuals that align with a story inspired by these features.
    """
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[{"role": "system", "content": "You create highly detailed AI image generation prompts."},
                  {"role": "user", "content": prompt}],
        max_tokens=300
    )
    return response["choices"][0]["message"]["content"].split("\n")

# Example Usage:
image_path = "WhatsApp Image 2025-02-18 at 21.12.10_f0300f73.jpg"  # Provide the path to your JPG image
context = "This image is of my friend who went to an old age home on his birthday and celebrates his birthday with some old folks."

image_features = extract_features_from_image(image_path)
story = generate_story(image_features, context)
image_prompts = generate_image_prompts(image_features)

print("Extracted Features:\n", image_features)
print("\nGenerated Story:\n", story)
print("\nImage Generation Prompts:")
for i, prompt in enumerate(image_prompts, 1):
    print(f"{i}. {prompt}")
    
