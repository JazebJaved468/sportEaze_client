import {ColorParams} from '../../types/sample/sample.params';
import {sampleApiResponse} from '../../types/sample/sample.response';
import {baseApi} from '../baseApi.service';

export const sampleApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getSampleColors: builder.query<sampleApiResponse, void>({
      query: () => `sample`,
      // query: () => `/api/greeting`,
    }),

    // Post Call
    // postColor: builder.mutation<sampleApiResponse, ColorParams>({
    //   query: color => ({
    //     url: `sample`,
    //     method: 'POST',
    //     body: {color},
    //   }),
    // }),
  }),
});

export const {useGetSampleColorsQuery} = sampleApi;
