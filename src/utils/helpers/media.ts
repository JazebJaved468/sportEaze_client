import {MediaType} from '../../constants/enums';

export const getMediaType = (
  mimeType: string,
): MediaType.IMAGE | MediaType.VIDEO | MediaType.DOCUMENT => {
  if (mimeType.startsWith('image/') || mimeType === 'image') {
    return MediaType.IMAGE;
  }
  if (mimeType.startsWith('video/') || mimeType === 'video') {
    return MediaType.VIDEO;
  }
  if (
    [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ].includes(mimeType)
  ) {
    return MediaType.DOCUMENT;
  }
  return MediaType.DOCUMENT; // Default case if MIME type doesn't match
};
