import axios from 'axios';

// Speaker ID from the cloning process
let speaker_id: string | null = null;

// API key for DupDub
const API_KEY = "772914cc9dea460e9c0c9638cb821c4d";

export const voiceService = {
  /**
   * Upload audio file to a temporary file hosting service
   */
  async uploadAudioFile(file: File): Promise<string> {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload to tmpfiles.org which provides direct download links
      const response = await axios.post('https://tmpfiles.org/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (!response.data || !response.data.data || !response.data.data.url) {
        throw new Error('Failed to get URL from file hosting service');
      }
      
      // Convert the view URL to a download URL
      // tmpfiles.org URLs are in format: https://tmpfiles.org/xxxxx
      // Download URLs are in format: https://tmpfiles.org/dl/xxxxx
      const downloadUrl = response.data.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
      console.log("File uploaded successfully. Download URL:", downloadUrl);
      
      return downloadUrl;
    } catch (error) {
      console.error("Failed to upload audio file:", error);
      throw new Error("Failed to upload audio file to temporary storage");
    }
  },

  /**
   * Clone a voice using the provided audio file
   */
  async cloneVoice(audioFile: File): Promise<string> {
    // DupDub API endpoint
    const clone_url = "https://moyin-gateway.dupdub.com/tts/v1/speakerClone";

    try {
      // Upload to temporary file hosting and get URL
      const audioUrl = await this.uploadAudioFile(audioFile);
      
      // Payload for voice cloning
      const data = {
        "name": "cloned_voice_" + Date.now(),
        "url": audioUrl,
        "language": "English",
        "accent": "INDIAN",
        "gender": "MALE",
        "age": "Adults",
        "style": "chat"
      };

      console.log("Cloning voice with payload:", data);

      const headers = {
        "dupdub_token": API_KEY,
        "Content-Type": "application/json"
      };

      // Send request to clone voice
      const response = await axios.post(clone_url, data, { headers });

      console.log("Clone voice response:", response.data);

      if (response.status !== 200) {
        throw new Error(`Failed to clone voice. Status Code: ${response.status}`);
      }

      const result = response.data;

      // Extract the correct voice ID
      speaker_id = result.data?.speaker;
      
      if (speaker_id) {
        console.log("✅ Voice ID:", speaker_id);
        return speaker_id;
      } else {
        console.log("⚠️ No Voice ID found! Check API response format.");
        throw new Error("No Voice ID found in response");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Clone voice error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
      }
      console.error("❌ Failed to clone voice:", error);
      throw error;
    }
  },

  /**
   * Generate voice using the provided text
   */
  async generateVoice(text: string, speed: number = 1.0, pitch: number = 0): Promise<string> {
    if (!speaker_id) {
      throw new Error("No speaker ID available. Please clone a voice first.");
    }

    // API endpoint for generating speech
    const url = "https://moyin-gateway.dupdub.com/tts/v1/playDemo/dubForSpeaker";

    const headers = {
      "dupdub_token": API_KEY,
      "Content-Type": "application/json"
    };

    // Using the exact same payload structure from the Python file
    const payload = {
      "speaker": speaker_id,
      "speed": speed,
      "pitch": pitch,
      "textList": [text],
      "source": "web"
    };

    try {
      console.log("Generating voice with payload:", payload);
      
      const response = await axios.post(url, payload, { headers });

      console.log("Generate voice response:", response.data);

      if (response.status !== 200) {
        throw new Error(`Failed to generate speech. Status Code: ${response.status}`);
      }

      const result = response.data;

      if (result.code !== 200) {
        throw new Error(`API Error: ${result.message}`);
      }

      // The API response structure is different than expected
      // Check all possible paths where the audio URL might be
      let audioUrl = null;
      
      if (result.data?.resList && result.data.resList.length > 0) {
        audioUrl = result.data.resList[0]?.url;
      } else if (result.data?.url) {
        audioUrl = result.data.url;
      }
      
      if (audioUrl) {
        console.log("Successfully generated audio URL:", audioUrl);
        return audioUrl;
      }
      
      throw new Error("No audio URL found in the API response");
    } catch (error) {
      console.error("Failed to generate speech:", error);
      throw error;
    }
  }
};