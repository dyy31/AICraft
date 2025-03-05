import openai
import base64
import os
global image_prompts

def extract_features_from_image(image_path):
    """Extracts features from an image using OpenAI's Vision API."""
    with open(image_path, "rb") as image_file:
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

def generate_story(image_features="", text_prompt=""):
    """Generates a story using GPT based on image features and/or a text prompt."""
    prompt = """
    Create a vivid and engaging short story based on the following details:
    """
    if image_features:
        prompt += f"\n- Image Features: {image_features}"
    if text_prompt:
        prompt += f"\n- Additional Context: {text_prompt}"
    
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are a creative storyteller."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000
    )
    return response["choices"][0]["message"]["content"]

def generate_image_prompts(story):
    """Generates 2-3 detailed prompts for AI image generation tools based on the story."""
    prompt = f"""
    Based on this story:
    {story}
    Generate 3 detailed prompts for an AI image generation tool.
    """
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You create highly detailed AI image generation prompts."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=1000
    )
    return response["choices"][0]["message"]["content"].split("\n")

# Main Program
def main():
    openai.api_key = "sk-proj-BIE4wXDDp1tELWcJpdDmT3BlbkFJwc0Dz927RAlkdC0fAcSs"  # Use environment variable for security
    
    print("Choose input type:")
    print("1. Only Text")
    print("2. Only Image")
    print("3. Both Text and Image")
    choice = input("Enter your choice (1/2/3): ").strip()
    
    text_prompt = ""
    image_features = ""
    
    if choice == "1":
        text_prompt = input("Enter a text prompt for the story: ").strip()
    elif choice == "2":
        image_path = input("Enter the path to the image: ").strip()
        image_features = extract_features_from_image(image_path)
    elif choice == "3":
        text_prompt = input("Enter a text prompt for the story: ").strip()
        image_path = input("Enter the path to the image: ").strip()
        image_features = extract_features_from_image(image_path)
    else:
        print("Invalid choice. Please restart the program and enter a valid option.")
        return
    
    story = generate_story(image_features, text_prompt)
    image_prompts = generate_image_prompts(story)  # Storing image prompts without displaying
    
    print("\nGenerated Story:\n")
    print(story)

if __name__ == "__main__":
    main()
