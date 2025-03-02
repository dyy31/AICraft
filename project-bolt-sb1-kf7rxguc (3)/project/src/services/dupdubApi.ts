import axios from 'axios';

const API_KEY = '772914cc9dea460e9c0c9638cb821c4d';
const BASE_URL = 'https://moyin-gateway.dupdub.com/tts/v1';

interface CloneVoiceResponse {
  data: {
    speaker: string;
  };
}

interface GenerateVoiceResponse {
  code: number;
  message: string;
  data: {
    resList: Array<{
      url: string;
      text: string;
    }>;
  };
}

export const dupdubApi = {
  async uploadAudio(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://tmpfiles.org/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const downloadUrl = response.data.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload audio file');
    }
  },

  async cloneVoice(file: File, name: string) {
    try {
      // For testing purposes, use the exact URL from the Python file
      // const audioUrl = await this.uploadAudio(file);
      const audioUrl = "https://drive.google.com/uc?export=download&id=1gvU-5SEQx9GEM7wPQMNxS6yEXPo4GKy0";

      console.log('Cloning voice with payload:', {
        name,
        url: audioUrl,
        language: 'English',
        accent: 'INDIAN',
        gender: 'MALE',
        age: 'Adults',
        style: 'chat'
      });

      const response = await axios.post<CloneVoiceResponse>(
        `${BASE_URL}/speakerClone`,
        {
          name,
          url: audioUrl,
          language: 'English',
          accent: 'INDIAN',
          gender: 'MALE',
          age: 'Adults',
          style: 'chat'
        },
        {
          headers: {
            'dupdub_token': API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Clone voice response:', response.data);

      if (!response.data?.data?.speaker) {
        throw new Error('No Voice ID found! Check API response format.');
      }

      return response.data.data.speaker;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Clone voice error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(`Failed to clone voice: ${errorMessage}`);
      }
      console.error('Unexpected error during voice cloning:', error);
      throw error;
    }
  },

  async generateVoice(speakerId: string, text: string, speed: number = 1, pitch: number = 0) {
    try {
      // Using the exact payload format from the Python file
      const payload = {
        speaker: speakerId,
        speed: speed,
        pitch: pitch,
        textList: [text],
        source: "web"
      };

      console.log('Generating voice with payload:', payload);

      const response = await axios.post<GenerateVoiceResponse>(
        `${BASE_URL}/playDemo/dubForSpeaker`,
        payload,
        {
          headers: {
            'dupdub_token': API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Generate voice response:', response.data);

      if (response.data.code !== 200) {
        throw new Error(`API Error: ${response.data.message}`);
      }

      const generatedVoice = response.data.data.resList[0];
      if (!generatedVoice?.url) {
        console.error('Invalid response format:', response.data);
        throw new Error('No audio URL received from the server. The voice generation may have failed.');
      }

      return generatedVoice.url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Generate voice error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers,
          request: {
            speakerId,
            text,
            speed,
            pitch
          }
        });
        
        const errorData = error.response?.data;
        const errorMessage = errorData?.message || errorData?.error || error.message;
        throw new Error(`Failed to generate voice: ${errorMessage}`);
      }
      console.error('Unexpected error during voice generation:', error);
      throw error;
    }
  }
};