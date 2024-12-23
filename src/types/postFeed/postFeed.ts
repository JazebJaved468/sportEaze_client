import {CropRect} from 'react-native-image-crop-picker';

export type SelectedImage = {
  data: string;
  filename: string;
  height: number;
  mime: string;
  modificationDate: string;
  path: string;
  size: number;
  width: number;
  cropRect?: CropRect;
};

export type SelectedVideo = {
  duration: number;
  height: number;
  mime: string;
  modificationDate: string;
  path: string;
  size: number;
  width: number;
};

export type CloudinaryAudio = {
  codec: string;
  bit_rate: string;
  frequency: number;
  channels: number;
  channel_layout: string;
};

export type CloudinaryVideo = {
  pix_format: string;
  codec: string;
  level: number;
  profile: string;
  bit_rate: string;
  time_base: string;
};
