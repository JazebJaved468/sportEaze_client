import {sampleApiResponse} from '../../types/sample/sample.response';
import {baseApi} from '../baseApi.service';

export const sampleApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getSampleColors: builder.query<sampleApiResponse, void>({
      query: () => `sample`,
    }),
  }),
});

export const {useGetSampleColorsQuery} = sampleApi;
