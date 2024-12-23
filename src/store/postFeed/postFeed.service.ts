import {
  CloudinaryImageUploadParams,
  CloudinaryVideoUploadParams,
} from '../../types/postFeed/postFeed.params';
import {CloudinaryImageUploadResponse} from '../../types/postFeed/postFeed.response';
import {cloudinaryBaseApi} from '../baseApi.service';

export const postFeedApi = cloudinaryBaseApi.injectEndpoints({
  endpoints: builder => ({
    // Add a new mutation for uploading images to cloudinary
    uploadImage: builder.mutation<
      CloudinaryImageUploadResponse,
      CloudinaryImageUploadParams
    >({
      query: ({imageDataBase64, uploadPreset}) => ({
        url: `image/upload`,
        method: 'POST',
        body: {
          file: imageDataBase64,
          upload_preset: uploadPreset,
        },
      }),
    }),

    // Add a new mutation for uploading videos to cloudinary
    uploadVideo: builder.mutation<
      CloudinaryImageUploadResponse,
      CloudinaryVideoUploadParams
    >({
      query: ({formData}) => ({
        url: 'video/upload',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }),
    }),
  }),
});

export const {useUploadImageMutation, useUploadVideoMutation} = postFeedApi;
