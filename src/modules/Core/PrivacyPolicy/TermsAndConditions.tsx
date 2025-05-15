import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';

export const TermsAndConditions = () => {
  const textColor = useTextColor();
  const cardColor = useCardColor();
  const containerShadow = useContainerShadow();

  return (
    <PageContainer>
      <GeneralHeader title='Terms and Conditions' showRightElement={false} />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.contentCard,
            {backgroundColor: cardColor},
            containerShadow,
          ]}>
          <Text style={[fontBold(18, textColor), styles.sectionTitle]}>
            SportEaze Terms and Conditions
          </Text>

          <Text style={[fontRegular(14, textColor), styles.lastUpdated]}>
            Last Updated: May 16, 2025
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            1. Introduction
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            Welcome to SportEaze! These Terms and Conditions govern your use of
            the SportEaze mobile application and services. By accessing or using
            our platform, you agree to be bound by these terms.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            2. Definitions
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            "SportEaze", "we", "us", or "our" refers to the SportEaze platform.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            "User", "you", or "your" refers to individuals who access or use the
            SportEaze platform in any capacity.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            "Platform" refers to the SportEaze mobile application and related
            services.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            3. Account Registration
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            3.1 You must be at least 13 years old to create an account on
            SportEaze.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            3.2 You agree to provide accurate, current, and complete information
            during registration.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            3.3 You are responsible for maintaining the confidentiality of your
            account credentials.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            4. User Conduct
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            4.1 You agree not to use SportEaze for any illegal or unauthorized
            purpose.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            4.2 You will not post content that is false, misleading, or
            fraudulent.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            4.3 You will not harass, intimidate, or discriminate against other
            users.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            5. Content Guidelines
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            5.1 All content posted must be sports-related and appropriate for
            our platform.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            5.2 You retain ownership of content you post, but grant SportEaze a
            license to use it.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            5.3 We reserve the right to remove any content that violates these
            terms.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            6. Patronage and Sponsorships
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            6.1 SportEaze facilitates connections between athletes and sponsors
            but is not a party to agreements.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            6.2 Users are responsible for complying with applicable laws
            regarding sponsorships.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            6.3 SportEaze does not guarantee sponsorship outcomes or financial
            benefits.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            7. Limitation of Liability
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            7.1 SportEaze is provided "as is" without warranties of any kind.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            7.2 We shall not be liable for any indirect, incidental, or
            consequential damages.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            8. Changes to Terms
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            8.1 We may modify these terms at any time by posting the revised
            version.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            8.2 Your continued use after changes constitutes acceptance of the
            revised terms.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            9. Termination
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            9.1 We reserve the right to suspend or terminate your account for
            violations.
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            9.2 You may terminate your account at any time through the app
            settings.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            10. Contact Information
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            If you have any questions about these Terms and Conditions, please
            contact us at support@sporteaze.com.
          </Text>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: customWidth(16),
    paddingBottom: customHeight(40),
  },
  contentCard: {
    padding: customWidth(20),
    borderRadius: 14,
  },
  sectionTitle: {
    marginBottom: customHeight(4),
  },
  lastUpdated: {
    marginBottom: customHeight(20),
    fontStyle: 'italic',
  },
  heading: {
    marginTop: customHeight(20),
    marginBottom: customHeight(8),
  },
  paragraph: {
    marginBottom: customHeight(10),
    lineHeight: 22,
  },
});
