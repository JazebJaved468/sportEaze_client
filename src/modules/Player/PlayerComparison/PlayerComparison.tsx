import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import {Avatar, Input, Button, Skeleton} from 'native-base';
import {useLazyGetPlayerComparisonQuery} from '../../../store/player/player.service';
import {useGetAvailableSportsQuery} from '../../../store/core/core.service';
import {fontBold, fontRegular} from '../../../styles/fonts';
import {appColors} from '../../../constants/colors';
import {PlayingLevel} from '../../../constants/enums';
import {
  useCardColor,
  useTextColor,
} from '../../../utils/customHooks/colorHooks';
import {
  extractValidJSONFromGeminiResponse,
  geminiModel,
} from '../../../utils/helpers/gemini';
import {CircularInfoIcon, UserPlaceholderIcon} from '../../../assets/icons';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {useAppNavigation} from '../../../utils/customHooks/navigator';
import {customHeight, customWidth} from '../../../styles/responsiveStyles';
import {useContainerShadow} from '../../../utils/customHooks/customHooks';
import {PulseEffect} from '../../../components/PulseEffect';

type GeminiComparisonResponse = {
  winner: string;
  score: string;
  explanation: string;
};

type GeminiAnalysisType = {
  response?: GeminiComparisonResponse;
  analysisDone: boolean;
  analysisCIP: boolean;
};

export const PlayerComparison = () => {
  const navigation = useAppNavigation();
  const [playerOneUsername, setPlayerOneUsername] = useState('');
  const [playerTwoUsername, setPlayerTwoUsername] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [geminiAnalysis, setGeminiAnalysis] = useState<GeminiAnalysisType>({
    response: undefined,
    analysisDone: false,
    analysisCIP: false,
  });

  const [getPlayerComparison, {data, isFetching, error}] =
    useLazyGetPlayerComparisonQuery();

  const {data: sports} = useGetAvailableSportsQuery();

  const textColor = useTextColor();
  const cardColor = useCardColor();

  useEffect(() => {
    if (data && showComparison) {
      performGeminiAnalysis();
    }
  }, [data, showComparison]);

  const performGeminiAnalysis = async () => {
    if (!data) return;

    try {
      setGeminiAnalysis(prev => ({
        ...prev,
        analysisDone: false,
        analysisCIP: true,
      }));

      const playerOneMetrics = {
        name: data.playerOne.fullName,
        username: data.playerOne.username,
        primarySport: data.playerOne.player.primarySport,
        playingLevel: data.playerOne.player.playingLevel,
        followerCount: data.playerOne.player.followerCount,
        connectionCount: data.playerOne.connectionCount || 0,
        pendingConnectionCount: data.playerOne.player.pendingConnectionCount,
        endorsementsReceived: data.playerOne.player.endorsementsReceived || 0,
        countSharedPosts: data.playerOne.player.countSharedPosts || 0,
        commentsCount: data.playerOne.player.commentsCount || 0,
        userPostLikesCount: data.playerOne.player.userPostLikesCount || 0,
        postCount: data.playerOne.player.postCount || 0,
        contractsCount: data.playerOne.player.totalContracts || 0,
      };

      const playerTwoMetrics = {
        name: data.playerTwo.fullName,
        username: data.playerTwo.username,
        primarySport: data.playerTwo.player.primarySport,
        playingLevel: data.playerTwo.player.playingLevel,
        followerCount: data.playerTwo.player.followerCount,
        connectionCount: data.playerTwo.connectionCount || 0,
        pendingConnectionCount: data.playerTwo.player.pendingConnectionCount,
        endorsementsReceived: data.playerTwo.player.endorsementsReceived || 0,
        countSharedPosts: data.playerTwo.player.countSharedPosts || 0,
        commentsCount: data.playerTwo.player.commentsCount || 0,
        userPostLikesCount: data.playerTwo.player.userPostLikesCount || 0,
        postCount: data.playerTwo.player.postCount || 0,
        contractsCount: data.playerTwo.player.totalContracts || 0,
      };

      const prompt = `
        TASK: Compare two sports players and output a clear winner based on their metrics.

        FORMAT YOUR RESPONSE EXACTLY LIKE THIS JSON, with no other text, markdown, or comments:
        {
          "winner": "Player Name Here",
          "score": "X - Y",
          "explanation": "Clear explanation of why one player performs better"
        }

        PLAYER 1: ${playerOneMetrics.name}
        - Playing Level: ${getPlayingLevelText(playerOneMetrics.playingLevel)} (${playerOneMetrics.playingLevel})
        - Followers: ${playerOneMetrics.followerCount}
        - Connections: ${playerOneMetrics.connectionCount}
        - Posts: ${playerOneMetrics.postCount}
        - Endorsements: ${playerOneMetrics.endorsementsReceived}
        - Comments: ${playerOneMetrics.commentsCount}
        - Likes: ${playerOneMetrics.userPostLikesCount}

        PLAYER 2: ${playerTwoMetrics.name}
        - Playing Level: ${getPlayingLevelText(playerTwoMetrics.playingLevel)} (${playerTwoMetrics.playingLevel})
        - Followers: ${playerTwoMetrics.followerCount}
        - Connections: ${playerTwoMetrics.connectionCount}
        - Posts: ${playerTwoMetrics.postCount}
        - Endorsements: ${playerTwoMetrics.endorsementsReceived}
        - Comments: ${playerTwoMetrics.commentsCount}
        - Likes: ${playerTwoMetrics.userPostLikesCount}

        Compare these two players holistically considering all metrics:
        1. Playing level
        2. Followers and connections
        3. Content engagement (posts, comments, likes)
        4. Social influence (endorsements, shared posts)

        Consider all metrics equally in your analysis. Don't prioritize any single metric. Look at the complete profile of each player.

        Important: Your response must be ONLY the JSON object with the fields mentioned above, nothing else.
      `;

      try {
        const geminiResponse = await geminiModel.generateContent([prompt]);
        // console.log(
        //   '🚀 ~ performGeminiAnalysis ~ geminiResponse:',
        //   geminiResponse,
        // );

        if (
          geminiResponse &&
          geminiResponse.response &&
          geminiResponse.response.candidates &&
          geminiResponse.response.candidates.length > 0
        ) {
          const responseText =
            geminiResponse.response.candidates[0]?.content?.parts?.[0]?.text ||
            '';
          // console.log(
          //   '🚀 ~ performGeminiAnalysis ~ responseText:',
          //   responseText,
          // );

          // Try to parse the JSON response directly
          try {
            if (responseText) {
              // Clean the text before parsing (remove markdown code blocks if present)
              let cleanedText = responseText;
              if (responseText.includes('```json')) {
                cleanedText = responseText.replace(/```json\n|\n```/g, '');
              } else if (responseText.includes('```')) {
                cleanedText = responseText.replace(/```\n|\n```/g, '');
              }

              // Find JSON in the text
              const jsonStart = cleanedText.indexOf('{');
              const jsonEnd = cleanedText.lastIndexOf('}');

              if (jsonStart >= 0 && jsonEnd > jsonStart) {
                const jsonText = cleanedText.substring(jsonStart, jsonEnd + 1);
                // console.log('🚀 ~ performGeminiAnalysis ~ jsonText:', jsonText);

                const parsedResponse = JSON.parse(jsonText);
                // console.log(
                //   '🚀 ~ performGeminiAnalysis ~ parsedResponse:',
                //   parsedResponse,
                // );

                // Verify the required fields exist
                if (
                  parsedResponse.winner &&
                  parsedResponse.score &&
                  parsedResponse.explanation
                ) {
                  setGeminiAnalysis(prev => ({
                    ...prev,
                    response: parsedResponse,
                    analysisDone: true,
                    analysisCIP: false,
                  }));
                  return;
                } else {
                  // console.log('Missing required fields in the response');
                  throw new Error('Missing required fields in the response');
                }
              } else {
                // console.log('No JSON found in the response');
                throw new Error('No JSON found in the response');
              }
            }
          } catch (parseError) {
            console.log('JSON parsing failed:', parseError);
            throw parseError; // Rethrow to trigger fallback
          }
        } else {
          console.log('Invalid response from Gemini');
          throw new Error('Invalid response from Gemini');
        }
      } catch (error) {
        console.log('Error with Gemini API:', error);
        // Create a fallback response if API errors
        const fallbackResponse = createFallbackResponse(
          data.playerOne,
          data.playerTwo,
        );
        setGeminiAnalysis(prev => ({
          ...prev,
          response: fallbackResponse,
          analysisDone: true,
          analysisCIP: false,
        }));
      }
    } catch (error) {
      console.log('Gemini analysis error:', error);
      // Create a fallback response on general error
      const fallbackResponse = createFallbackResponse(
        data.playerOne,
        data.playerTwo,
      );
      setGeminiAnalysis(prev => ({
        ...prev,
        response: fallbackResponse,
        analysisDone: true,
        analysisCIP: false,
      }));
    }
  };

  // Function to create fallback response when Gemini fails
  const createFallbackResponse = (playerOne: any, playerTwo: any) => {
    // Calculate total points for each player across all metrics
    const p1 = playerOne.player;
    const p2 = playerTwo.player;

    let p1Points = 0;
    let p2Points = 0;

    // Playing level
    if (p1.playingLevel > p2.playingLevel) p1Points += 1;
    else if (p1.playingLevel < p2.playingLevel) p2Points += 1;

    // Followers
    if (p1.followerCount > p2.followerCount) p1Points += 1;
    else if (p1.followerCount < p2.followerCount) p2Points += 1;

    // Connections
    if (playerOne.connectionCount > playerTwo.connectionCount) p1Points += 1;
    else if (playerOne.connectionCount < playerTwo.connectionCount)
      p2Points += 1;

    // Endorsements
    if ((p1.endorsementsReceived || 0) > (p2.endorsementsReceived || 0))
      p1Points += 1;
    else if ((p1.endorsementsReceived || 0) < (p2.endorsementsReceived || 0))
      p2Points += 1;

    // Posts
    if ((p1.postCount || 0) > (p2.postCount || 0)) p1Points += 1;
    else if ((p1.postCount || 0) < (p2.postCount || 0)) p2Points += 1;

    // Comments
    if ((p1.commentsCount || 0) > (p2.commentsCount || 0)) p1Points += 1;
    else if ((p1.commentsCount || 0) < (p2.commentsCount || 0)) p2Points += 1;

    // Likes
    if ((p1.userPostLikesCount || 0) > (p2.userPostLikesCount || 0))
      p1Points += 1;
    else if ((p1.userPostLikesCount || 0) < (p2.userPostLikesCount || 0))
      p2Points += 1;

    // Shared posts
    if ((p1.countSharedPosts || 0) > (p2.countSharedPosts || 0)) p1Points += 1;
    else if ((p1.countSharedPosts || 0) < (p2.countSharedPosts || 0))
      p2Points += 1;

    // Determine winner based on total points
    let winner, explanation, score;

    if (p1Points > p2Points) {
      winner = playerOne.fullName;
      score = `${p1Points} - ${p2Points}`;
      explanation = `${playerOne.fullName} outperforms ${playerTwo.fullName} in ${p1Points} metrics compared to ${p2Points}. They have better overall engagement and metrics across most categories.`;
    } else if (p1Points < p2Points) {
      winner = playerTwo.fullName;
      score = `${p1Points} - ${p2Points}`;
      explanation = `${playerTwo.fullName} outperforms ${playerOne.fullName} in ${p2Points} metrics compared to ${p1Points}. They have better overall engagement and metrics across most categories.`;
    } else {
      winner = 'Tie';
      score = `${p1Points} - ${p2Points}`;
      explanation = `${playerOne.fullName} and ${playerTwo.fullName} are evenly matched with similar metrics across all categories.`;
    }

    return {
      winner,
      score,
      explanation,
    };
  };

  const getPlayingLevelText = (level: number) => {
    switch (level) {
      case PlayingLevel.BEGINNER:
        return 'Beginner';
      case PlayingLevel.AMATEUR:
        return 'Amateur';
      case PlayingLevel.PROFESSIONAL:
        return 'Professional';
      default:
        return 'Unknown';
    }
  };

  const handleCompare = () => {
    if (playerOneUsername && playerTwoUsername) {
      setShowComparison(true);
      getPlayerComparison({playerOneUsername, playerTwoUsername});
    }
  };

  const renderComparisonItem = (
    label: string,
    leftValue: string | number | null,
    rightValue: string | number | null,
  ) => {
    return (
      <View style={styles.comparisonRow}>
        <Text
          style={[
            fontBold(14, textColor),
            styles.comparisonValue,
            {textAlign: 'left'},
          ]}>
          {leftValue ?? 'N/A'}
        </Text>
        <Text style={[fontBold(14, appColors.warmRed), styles.comparisonLabel]}>
          {label}
        </Text>
        <Text
          style={[
            fontBold(14, textColor),
            styles.comparisonValue,
            {textAlign: 'right'},
          ]}>
          {rightValue ?? 'N/A'}
        </Text>
      </View>
    );
  };

  const renderInputScreen = () => {
    return (
      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: 100}}
          showsVerticalScrollIndicator={false}>
          {/* <Text style={fontBold(14, textColor)}> Enter Player Usernames</Text> */}
          <Text
            style={[
              fontBold(13, textColor),
              {
                marginTop: customHeight(6),
                marginBottom: customHeight(20),
              },
            ]}>
            Enter the usernames of the players you want to compare.
          </Text>

          <View style={styles.inputContainer}>
            <View style={styles.profileImagePlaceholder}>
              <View style={styles.profilePicContainer}>
                <UserPlaceholderIcon width={30} height={30} color={textColor} />
              </View>
              <Input
                borderRadius={12}
                placeholder='@player_1'
                value={playerOneUsername}
                onChangeText={setPlayerOneUsername}
                mt={3}
                width='100%'
                variant='filled'
                backgroundColor={cardColor}
                color={textColor}
                focusOutlineColor={textColor}
              />
            </View>

            <View style={styles.profileImagePlaceholder}>
              <View style={styles.profilePicContainer}>
                <UserPlaceholderIcon width={30} height={30} color={textColor} />
              </View>
              <Input
                placeholder='@player_2'
                value={playerTwoUsername}
                onChangeText={setPlayerTwoUsername}
                mt={3}
                width='100%'
                variant='filled'
                backgroundColor={cardColor}
                color={textColor}
                borderRadius={12}
                focusOutlineColor={textColor}
              />
            </View>
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, {backgroundColor: cardColor}]}>
          <PulseEffect>
            <Button
              style={[styles.compareButton]}
              onPress={handleCompare}
              isDisabled={
                !playerOneUsername.trim() || !playerTwoUsername.trim()
              }
              _text={{color: 'white', fontWeight: 'bold'}}
              backgroundColor={appColors.warmRed}>
              Compare Players
            </Button>
          </PulseEffect>
        </View>
      </View>
    );
  };

  const renderLoadingScreen = () => {
    return (
      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: customHeight(100)}}
          showsVerticalScrollIndicator={false}>
          {/* Player Profiles Skeletons */}
          <View style={styles.profilesRow}>
            <View style={[styles.profileCard, {backgroundColor: cardColor}]}>
              <Skeleton
                rounded='full'
                h='80px'
                w='80px'
                startColor={`${appColors.whisperGray}60`}
              />
              <Skeleton.Text
                mt='4'
                lines={2}
                startColor={`${appColors.whisperGray}60`}
                w='80%'
              />
            </View>

            <View style={[styles.profileCard, {backgroundColor: cardColor}]}>
              <Skeleton
                rounded='full'
                h='80px'
                w='80px'
                startColor={`${appColors.whisperGray}60`}
              />
              <Skeleton.Text
                mt='4'
                lines={2}
                startColor={`${appColors.whisperGray}60`}
                w='80%'
              />
            </View>
          </View>

          {/* Metrics Skeleton */}
          <View style={[styles.metricsContainer, {backgroundColor: cardColor}]}>
            <Skeleton
              h='6'
              rounded='md'
              w='50%'
              alignSelf='center'
              mb='4'
              startColor={`${appColors.whisperGray}60`}
            />

            {[...Array(10)].map((_, index) => (
              <View key={index} style={styles.comparisonRow}>
                <Skeleton
                  h='5'
                  rounded='md'
                  w='30%'
                  startColor={`${appColors.whisperGray}60`}
                />
                <Skeleton
                  h='5'
                  rounded='md'
                  w='30%'
                  startColor={`${appColors.whisperGray}60`}
                />
                <Skeleton
                  h='5'
                  rounded='md'
                  w='30%'
                  startColor={`${appColors.whisperGray}60`}
                />
              </View>
            ))}
          </View>

          {/* AI Analysis Skeleton */}
          <View style={[styles.aiContainer, {backgroundColor: cardColor}]}>
            <Skeleton
              h='6'
              rounded='md'
              w='70%'
              mb='4'
              startColor={`${appColors.whisperGray}60`}
            />
            <Skeleton.Text
              lines={3}
              startColor={`${appColors.whisperGray}60`}
            />
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, {backgroundColor: cardColor}]}>
          <Button
            style={styles.compareButton}
            isDisabled={true}
            _text={{color: 'white', fontWeight: 'bold'}}
            backgroundColor={appColors.warmRed}>
            Compare Other Players
          </Button>
        </View>
      </View>
    );
  };

  const renderErrorScreen = () => {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.loadingContainer}>
          <Text style={{color: textColor}}>
            Error while doing player comparison. Please try again.
          </Text>
        </View>

        <View style={[styles.buttonContainer, {backgroundColor: cardColor}]}>
          <PulseEffect>
            <Button
              style={styles.compareButton}
              onPress={() => setShowComparison(false)}
              _text={{color: 'white', fontWeight: 'bold'}}
              backgroundColor={appColors.warmRed}>
              Try Again
            </Button>
          </PulseEffect>
        </View>
      </View>
    );
  };

  const containerShadow = useContainerShadow(6);

  const renderComparisonScreen = () => {
    if (!data) return null;

    const {playerOne, playerTwo} = data;

    // Calculate total engagement score
    const getTotalEngagement = (player: any) => {
      const p = player.player;
      return (
        p.followerCount +
        // p.pendingConnectionCount +
        (p.totalContracts || 0) +
        (p.endorsementsReceived || 0) +
        (p.countSharedPosts || 0) +
        (p.commentsCount || 0) +
        (p.userPostLikesCount || 0) +
        (p.postCount || 0)
      );
    };

    const engagementOne = getTotalEngagement(playerOne);
    const engagementTwo = getTotalEngagement(playerTwo);

    return (
      <View style={styles.contentContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: customHeight(50)}}
          showsVerticalScrollIndicator={false}>
          {/* Player Profiles */}
          <View style={styles.profilesRow}>
            <View
              style={[
                styles.profileCard,
                {backgroundColor: cardColor},
                containerShadow,
              ]}>
              <View style={styles.profilePicContainer}>
                {playerOne.profilePicUrl ? (
                  <Image
                    source={{uri: playerOne.profilePicUrl}}
                    style={{
                      width: customWidth(80),
                      height: customHeight(80),
                      objectFit: 'contain',
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <UserPlaceholderIcon
                    width={customWidth(28)}
                    height={customHeight(28)}
                    color={textColor}
                  />
                )}
              </View>
              <Text
                style={[
                  fontBold(16),
                  {color: textColor, marginTop: customHeight(14)},
                ]}>
                {playerOne.fullName}
              </Text>
              <Text
                style={[
                  fontRegular(12),
                  {color: `${textColor}90`, marginTop: customHeight(6)},
                ]}>
                {playerOne.username}
              </Text>
            </View>

            <View
              style={[
                styles.profileCard,
                {backgroundColor: cardColor},
                containerShadow,
              ]}>
              <View style={styles.profilePicContainer}>
                {playerTwo.profilePicUrl ? (
                  <Image
                    source={{uri: playerTwo.profilePicUrl}}
                    style={{
                      width: customWidth(80),
                      height: customHeight(80),
                      objectFit: 'contain',
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <UserPlaceholderIcon
                    width={customWidth(28)}
                    height={customHeight(28)}
                    color={textColor}
                  />
                )}
              </View>
              <Text
                style={[
                  fontBold(16),
                  {color: textColor, marginTop: customHeight(14)},
                ]}>
                {playerTwo.fullName}
              </Text>
              <Text
                style={[
                  fontRegular(12),
                  {color: `${textColor}90`, marginTop: customHeight(6)},
                ]}>
                {playerTwo.username}
              </Text>
            </View>
          </View>

          {/* AI Analysis */}
          {geminiAnalysis.analysisCIP && (
            <View
              style={[
                styles.aiContainer,
                {backgroundColor: cardColor},
                styles.analysisBox,
                {
                  borderWidth: 0.5,
                  borderColor: appColors.success,
                  backgroundColor: `${appColors.success}30`,
                  gap: 8,
                  marginBottom: 30,
                },
              ]}>
              <Text
                style={[
                  fontBold(16),
                  {color: textColor, marginBottom: customHeight(10)},
                ]}>
                AI Comparison Analysis
              </Text>
              <ActivityIndicator size='small' color={appColors.black} />
              <Text
                style={[
                  fontRegular(14),
                  {color: textColor, marginTop: customHeight(10)},
                ]}>
                AI is analyzing player metrics...
              </Text>
            </View>
          )}

          {geminiAnalysis.analysisDone && geminiAnalysis.response && (
            <View
              style={[
                styles.aiContainer,
                {backgroundColor: cardColor},
                styles.analysisBox,
                {
                  borderWidth: 0.5,
                  borderColor: appColors.success,
                  backgroundColor: `${appColors.success}30`,
                  gap: 8,
                  marginBottom: 30,
                },
              ]}>
              <Text
                style={[
                  fontBold(16, textColor),
                  {marginBottom: customHeight(10), textAlign: 'center'},
                ]}>
                AI Comparison Analysis
              </Text>

              <Text
                style={[
                  fontRegular(14),
                  {color: textColor, marginBottom: customHeight(5)},
                ]}>
                <Text style={fontBold(14)}>Winner: </Text>
                {geminiAnalysis.response.winner}
              </Text>

              <Text
                style={[
                  fontRegular(14),
                  {color: textColor, marginBottom: customHeight(5)},
                ]}>
                <Text style={fontBold(14)}>Analysis: </Text>
              </Text>

              <Text style={[fontRegular(14), {color: textColor}]}>
                {geminiAnalysis.response.explanation}
              </Text>
            </View>
          )}

          {/* Comparison Metrics */}
          <View
            style={[
              styles.metricsContainer,
              {backgroundColor: cardColor},
              containerShadow,
            ]}>
            <Text
              style={[
                fontBold(16, textColor),
                {
                  marginBottom: customHeight(30),
                  textAlign: 'center',
                },
              ]}>
              Players Statistics
            </Text>

            {renderComparisonItem(
              'Sport',
              sports
                ? sports[playerOne.player.primarySport]
                : playerOne.player.primarySport,
              sports
                ? sports[playerTwo.player.primarySport]
                : playerTwo.player.primarySport,
            )}

            {renderComparisonItem(
              'Playing Level',
              getPlayingLevelText(playerOne.player.playingLevel),
              getPlayingLevelText(playerTwo.player.playingLevel),
            )}

            {renderComparisonItem(
              'Followers',
              playerOne.player.followerCount,
              playerTwo.player.followerCount,
            )}

            {/* {renderComparisonItem(
              'Connections',
              playerOne.connectionCount,
              playerTwo.connectionCount,
            )} */}

            {renderComparisonItem(
              'Sponsorships',
              playerOne.player.totalContracts,
              playerTwo.player.totalContracts,
            )}

            {renderComparisonItem(
              'Endorsements',
              playerOne.player.endorsementsReceived || 0,
              playerTwo.player.endorsementsReceived || 0,
            )}

            {renderComparisonItem(
              'Shared Posts',
              playerOne.player.countSharedPosts || 0,
              playerTwo.player.countSharedPosts || 0,
            )}

            {renderComparisonItem(
              'Comments',
              playerOne.player.commentsCount || 0,
              playerTwo.player.commentsCount || 0,
            )}

            {renderComparisonItem(
              'Post Likes',
              playerOne.player.userPostLikesCount || 0,
              playerTwo.player.userPostLikesCount || 0,
            )}

            {renderComparisonItem(
              'Total Posts',
              playerOne.player.postCount || 0,
              playerTwo.player.postCount || 0,
            )}

            {renderComparisonItem(
              'Total Engagement',
              engagementOne,
              engagementTwo,
            )}
          </View>

          <View
            style={{
              marginTop: customHeight(20),
              marginBottom: customHeight(30),
            }}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: customWidth(8),
              }}
              onPress={() => Linking.openURL('https://gemini.google.com')}
              hitSlop={20}
              activeOpacity={0.6}>
              <CircularInfoIcon
                width={customWidth(16)}
                height={customHeight(16)}
                color={appColors.warmRed}
              />
              <Text
                style={[
                  fontRegular(14, appColors.warmRed),
                  {textDecorationLine: 'underline'},
                ]}>
                Powered by Gemini AI
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, {backgroundColor: cardColor}]}>
          <PulseEffect>
            <Button
              style={styles.compareButton}
              onPress={() => setShowComparison(false)}
              _text={{color: 'white', fontWeight: 'bold'}}
              backgroundColor={appColors.warmRed}>
              Compare Different Players
            </Button>
          </PulseEffect>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (!showComparison) {
      return renderInputScreen();
    }

    if (isFetching) {
      return renderLoadingScreen();
    }

    if (error || !data) {
      return renderErrorScreen();
    }

    return renderComparisonScreen();
  };

  return (
    <PageContainer>
      <GeneralHeader
        title='Player Comparison'
        showLeftElement={true}
        backHandler={() => {
          if (showComparison) {
            setShowComparison(false);
          } else {
            navigation.goBack();
          }
        }}
      />
      {renderContent()}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: customWidth(16),
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: customHeight(20),
    marginBottom: customHeight(30),
    marginHorizontal: customWidth(16),
  },
  profileImagePlaceholder: {
    width: '48%',
    alignItems: 'center',
  },
  profilePicContainer: {
    width: customWidth(80),
    height: customHeight(80),
    backgroundColor: `${appColors.whisperGray}90`,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: customHeight(0),
    left: customWidth(16),
    right: customWidth(16),
    backgroundColor: 'red',
    paddingVertical: customHeight(10),
  },
  compareButton: {
    height: customHeight(50),
    borderRadius: 10,
  },
  profilesRow: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: customHeight(20),
  },
  profileCard: {
    width: '48%',
    padding: customWidth(16),
    borderRadius: 16,
    alignItems: 'center',
  },
  metricsContainer: {
    padding: customWidth(16),
    borderRadius: 10,
    marginBottom: customHeight(20),
    paddingHorizontal: customWidth(20),
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: customHeight(15),
  },
  comparisonLabel: {
    fontSize: 14,
    textAlign: 'center',
  },
  comparisonValue: {
    width: '30%',
    textAlign: 'center',
  },
  aiContainer: {
    padding: customWidth(16),
    borderRadius: 14,
    marginBottom: customHeight(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisBox: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 16,
  },
});
