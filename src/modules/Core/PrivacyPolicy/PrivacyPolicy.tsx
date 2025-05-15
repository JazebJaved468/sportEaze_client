import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';

export const PrivacyPolicy = () => {
  const textColor = useTextColor();
  const cardColor = useCardColor();
  const containerShadow = useContainerShadow();

  return (
    <PageContainer>
      <GeneralHeader title='Privacy Policy' showRightElement={false} />

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
            SportEaze Privacy Policy
          </Text>

          <Text style={[fontRegular(14, textColor), styles.lastUpdated]}>
            Effective Date: May 16, 2025
          </Text>

          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            This Privacy Policy explains how SportEaze collects, uses, and
            shares your personal information when you use our mobile application
            and services.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            1. Information We Collect
          </Text>

          <Text style={[fontBold(15, textColor), styles.subheading]}>
            1.1 Information You Provide
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Account information: name, email address, password, date of birth,
            gender
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Profile information: profile photos, biographical information,
            sports interests
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Posts and communications: content you post, messages you send,
            comments
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Payment information: when you engage in financial transactions
            (for patrons/sponsors)
          </Text>

          <Text style={[fontBold(15, textColor), styles.subheading]}>
            1.2 Information Collected Automatically
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Device information: device type, operating system, unique device
            identifiers
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Usage information: interactions with the app, content viewed,
            features used
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Location information: general location based on IP address
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            2. How We Use Your Information
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Provide, maintain, and improve our services
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Process transactions and manage sponsorship contracts
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Connect athletes with potential sponsors and mentors
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Communicate with you about our services, updates, and promotions
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Monitor and analyze trends and usage to improve user experience
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Detect and prevent fraud, abuse, and security incidents
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            3. Sharing of Information
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • With other users: profile information, posts, and interactions as
            part of the platform functionality
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Service providers: companies that perform services on our behalf
            (payment processing, data analysis)
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Business transfers: in connection with a merger, acquisition, or
            sale of assets
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Legal requirements: to comply with applicable law, regulation,
            legal process, or governmental request
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            4. Data Security
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            We implement appropriate technical and organizational measures to
            protect your personal information. However, no method of
            transmission or storage is 100% secure, and we cannot guarantee
            absolute security.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            5. Your Rights and Choices
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Account settings: You can update your profile information through
            the app settings
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Communication preferences: You can opt out of marketing
            communications
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Device permissions: You control app permissions such as camera and
            photo access
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            • Deletion: You can request deletion of your account and personal
            information
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            6. Children's Privacy
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            Our services are not directed to children under 13. We do not
            knowingly collect personal information from children under 13. If we
            learn we have collected personal information from a child under 13,
            we will delete this information.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            7. International Data Transfers
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            Your information may be transferred to and processed in countries
            other than your country of residence, which may have different data
            protection laws.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            8. Changes to This Privacy Policy
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            We may update this Privacy Policy from time to time. The updated
            version will be indicated by an updated "Effective Date" at the top
            of this Privacy Policy. We encourage you to review this Privacy
            Policy frequently.
          </Text>

          <Text style={[fontBold(16, textColor), styles.heading]}>
            9. Contact Us
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            If you have questions or concerns about this Privacy Policy or our
            data practices, please contact us at:
          </Text>
          <Text style={[fontRegular(14, textColor), styles.paragraph]}>
            Email: sporteaze.devs@gmail.com
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
  subheading: {
    marginTop: customHeight(10),
    marginBottom: customHeight(8),
  },
  paragraph: {
    marginBottom: customHeight(10),
    lineHeight: 22,
  },
});
