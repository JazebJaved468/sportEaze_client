export const fontWeight = {
  thin: '200',
  light: '300',
  regular: '400',
  bold: '500',
  black: '600',
};

export const fonts = {
  thin: 'LatoThin',
  light: 'LatoLight',
  regular: 'LatoRegular',
  bold: 'LatoBold',
  black: 'LatoBlack',
};

export const fontSize = {
  xxJumbo: 48,
  xJumbo: 36,
  jumbo: 30,
  huge: 22,
  xxLarge: 20,
  xLarge: 18,
  large: 16,
  medium: 14,
  xMedium: 13,
  small: 12,
  xSmall: 11,
  xxSmall: 10,
};
export const fontThin = (fontSize: number = 14, color?: string) => ({
  fontFamily: fonts.thin,
  fontSize,
  ...(color && {color}),
  lineHeight: fontSize * 1.1,
});

export const fontLight = (fontSize: number = 14, color?: string) => ({
  fontFamily: fonts.light,
  fontSize,
  ...(color && {color}),

  lineHeight: fontSize * 1.1,
});

export const fontRegular = (fontSize: number = 14, color?: string) => ({
  fontFamily: fonts.regular,
  fontSize,
  ...(color && {color}),

  lineHeight: fontSize * 1.1,
});

export const fontBold = (fontSize: number = 14, color?: string) => ({
  fontFamily: fonts.bold,
  fontSize,
  ...(color && {color}),
  lineHeight: fontSize * 1.1,
});

export const fontExtraBold = (fontSize: number = 14, color?: string) => ({
  fontFamily: fonts.black,
  fontSize,
  ...(color && {color}),

  lineHeight: fontSize * 1.1,
});
