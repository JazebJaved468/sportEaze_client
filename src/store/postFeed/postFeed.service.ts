import {CloudinaryImageUploadParams} from '../../types/postFeed/postFeed.params';
import {CloudinaryImageUploadResponse} from '../../types/postFeed/postFeed.response';
import {cloudinaryBaseApi} from '../baseApi.service';

export const postFeedApi = cloudinaryBaseApi.injectEndpoints({
  endpoints: builder => ({
    uploadImage: builder.mutation<
      CloudinaryImageUploadResponse,
      CloudinaryImageUploadParams
    >({
      query: ({imageDataBase64, uploadPreset}) => ({
        url: 'image/upload',
        method: 'POST',
        body: {
          file: imageDataBase64,
          upload_preset: uploadPreset,
        },
      }),
    }),
  }),
});

export const {useUploadImageMutation} = postFeedApi;
