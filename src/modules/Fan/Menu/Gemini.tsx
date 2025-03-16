import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {GoogleGenerativeAI, Part} from '@google/generative-ai';
import {Button} from 'native-base';

import {ImageOrVideo} from 'react-native-image-crop-picker';
import {openImageOrVideoPicker} from '../../../utils/helpers/mediaPicker';
import {appColors} from '../../../constants/colors';
import {useTextColor} from '../../../utils/customHooks/colorHooks';

import RNFS from 'react-native-fs';
import {POST_MEDIA_LIMIT} from '../../../constants/media';
import {
  GEMINI_DEFAULT_MODEL,
  systemInstructions,
} from '../../../utils/helpers/gemini';

const extractValidJSONFromGeminiResponse = (responseText: string) => {
  try {
    // Extract JSON content from triple backticks ```json ... ```
    const match = responseText.match(/```json\n([\s\S]*?)\n```/);

    if (match && match[1]) {
      const jsonString = match[1]; // Extract the JSON portion
      return JSON.parse(jsonString); // Parse into a JS object
    }

    throw new Error('No valid JSON found in the response.');
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null; // Return null if parsing fails
  }
};

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = gemini.getGenerativeModel({
  model: GEMINI_DEFAULT_MODEL,
  systemInstruction: systemInstructions,
});

const Gemini = () => {
  const [selectedMedia, setSelectedMedia] = useState<ImageOrVideo[] | null>(
    null,
  );

  const selectMedia = async () => {
    const selectedMedia = await openImageOrVideoPicker();

    if (selectedMedia.length > 0) {
      // Limiting the number of videos to 5
      const maxSelectedMedia = selectedMedia.slice(0, POST_MEDIA_LIMIT);
      setSelectedMedia(maxSelectedMedia);
    }
  };

  const getGeminiResponse = async () => {
    const caption = '';
    // const selectedFiles = [...(selectedMedia || [])];

    // return;
    try {
      const prompt = `## Input: - Caption (text): ${caption || 'No caption provided'} - Media (image/video): ${selectedMedia?.length || 0 > 0 ? 'Attached' : 'None'}`;

      // Creating parts array for multiple images/videos
      const mediaToVerify: Part[] = selectedMedia
        ? await Promise.all(
            selectedMedia.map(async media => {
              const base64 = await RNFS.readFile(media.path, 'base64');
              return {
                inlineData: {
                  mimeType: media.mime,
                  data: base64,
                },
              };
            }),
          )
        : [];

      console.log('Meida TO verify Length', mediaToVerify.length);

      const geminiResponse = await model.generateContent([
        prompt,
        ...mediaToVerify,
      ]);

      if (geminiResponse)
        // console.log(
        //   '  Response',
        //   response?.response?.candidates?.[0].content.parts[0].text,
        // );
        console.log(
          'JSON Response',

          extractValidJSONFromGeminiResponse(
            geminiResponse?.response?.candidates?.[0].content.parts[0].text ||
              '{}',
          ),
        );
    } catch (error) {
      console.log('error', error);
    }

    //   console.log(response);
  };

  const textColor = useTextColor();
  return (
    <View>
      <Text>Gemini</Text>

      <Button
        m={10}
        py={3}
        onPress={async () => {
          try {
            await getGeminiResponse();
          } catch (e) {
            console.log(e);
          }
        }}>
        Get Gemini Response
      </Button>

      <Button
        m={10}
        py={3}
        onPress={async () => {
          await selectMedia();
        }}>
        GEt media
      </Button>
      <View
        style={{
          backgroundColor: appColors.whisperGray,
          width: 140,
          height: 140,
          borderRadius: 200,
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
        {/* {selectedImages === null ? (
          <UserPlaceholderIcon width={100} height={100} color={textColor} />
        ) : (
          <Image
            // source={{uri: selectedImage.path}}
            style={{width: 140, height: 140}}
          />
        )} */}
      </View>
    </View>
  );
};

export default Gemini;

const styles = StyleSheet.create({});
