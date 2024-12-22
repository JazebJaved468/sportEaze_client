import {sampleApiResponse} from '../../types/sample/sample.response';
import {sporteazeBaseApi} from '../baseApi.service';

export const sampleApi = sporteazeBaseApi.injectEndpoints({
  endpoints: builder => ({
    getSampleColors: builder.query<sampleApiResponse, void>({
      query: () => `sample`,
    }),
  }),
});

export const {useGetSampleColorsQuery} = sampleApi;
