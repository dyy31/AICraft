import os
from moviepy import *
def create_slideshow(image_folder, audio_file, output_file, fps=24):
    # Get list of images
    images = sorted([os.path.join(image_folder, img) for img in os.listdir(image_folder) if img.endswith(('.png', '.jpg', '.jpeg'))])

    if not images:
        print("No images found in the specified folder.")
        return

    # Load audio
    audio = AudioFileClip(audio_file)
    audio_duration = audio.duration

    # Calculate duration per image
    duration_per_image = audio_duration / len(images)

    # Create video clips from images
    clips = [ImageClip(img).with_duration(duration_per_image) for img in images]


    # Concatenate images
    video = concatenate_videoclips(clips, method="compose")

    # Set audio
    video = video.with_audio(audio)

    # Export final video
    video.write_videofile(output_file, fps=fps, codec="libx264", audio_codec="aac")

# Example usage
image_folder = "/Users/dy/Desktop/images"  # Replace with your image folder
audio_file = "/Users/dy/Desktop/Sector 134.m4a"  # Replace with your audio file
output_file = "slideshow.mp4"

create_slideshow(image_folder, audio_file, output_file)

