import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import mockProfileData from './mockProfileData'; // Adjust path as needed
import PageContainer from '../../../components/PageContainer';
import {appColors} from '../../../constants/colors';
import {EditIcon, HeartIcon, LocationIcon} from '../../../assets/icons';

export const PatronProfile = () => {
  const {
    name,
    title,
    location,
    coverImage,
    profileImage,
    description,
    telephone,
    email,
    packages,
  } = mockProfileData;
  return (
    <SafeAreaView>
      <StatusBar
        backgroundColor='transparent'
        translucent={true}
        barStyle='light-content'
      />
      <ScrollView>
        <View style={styles.main}>
          {/* Cover Image + Profile Image */}
          <View style={styles.coverImageView}>
            <Image source={{uri: coverImage}} style={styles.coverImage} />
            <Image source={{uri: profileImage}} style={styles.profileImage} />
          </View>
          {/* ====== */}

          <View style={styles.mainContainer}>
            {/* head1 */}
            <View style={styles.head1}>
              <View style={styles.right}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.locContainer}>
                  <LocationIcon style={styles.locIcon} />

                  <Text style={styles.location}>{location}</Text>
                </View>
              </View>
              <View style={styles.left}>
                <EditIcon />
              </View>
            </View>
            {/* ==== */}

            {/* quickReview */}
            <View style={styles.quickReview}>
              <View style={styles.quickReviewBox}>
                <Text style={styles.boxNumber}>127</Text>
                <Text style={styles.boxText}>Sponsorships</Text>
              </View>
              <View style={styles.quickReviewBox}>
                <Text style={styles.boxNumber}>4.9</Text>
                <Text style={styles.boxText}>Rating</Text>
              </View>
              <View style={styles.quickReviewBox}>
                <Text style={styles.boxNumber}>15+</Text>
                <Text style={styles.boxText}>Years</Text>
              </View>
            </View>

            {/* description */}

            <View style={styles.description}>
              <Text style={styles.heading}>Description</Text>
              <Text style={{color: 'black', fontSize: 12}}>{description}</Text>
            </View>

            {/* ===== */}

            {/* what we offer */}
            <View style={styles.whatWeOffer}>
              <Text
                style={styles.heading}
                //   style={styles.heading}
              >
                Sponsorship Packages
              </Text>
              {/* <View
        //    style={styles.packagesContainer}
        >
          {packages.map((pkg, index) => (
            <View
              key={index}
              //   style={styles.package}
            >
              <Text
              // style={styles.packageTitle}
              >
                {pkg.title}
              </Text>
              <Text
              // style={styles.packagePrice}
              >
                {pkg.price}
              </Text>
              {pkg.features.map((feature, i) => (
                <Text
                  key={i}
                  //   style={styles.packageFeature}
                >
                  • {feature}
                </Text>
              ))}
            </View>
          ))}
        </View> */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer} // Applies styling to the content
              >
                <TouchableOpacity>
                  <View style={styles.box}>
                    <View style={styles.packageContent}>
                    <Text style={styles.packageTitle}> 
                      ATHLETE PRO SILVER PACKAGE
                    </Text>
                   <View style={styles.priceView}>
                   <Text style={styles.packagePrice}>
                      Rs. 25,000+
                  </Text>
                   </View>
                  <Text style={styles.packageDesc}>
                  Full equipment sponsorship with monetary support
Package Feaure 2
Package Feaure 3
 
                  </Text>
                  <Text style={styles.seeMore}>
                    See more
                  </Text>
                  </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity>
                  <View style={styles.box}>
                    
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.box}>
                    
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <View style={styles.box}>
                  
                  </View>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
  },
  coverImageView: {
    width: '100%',
    height: 210,
    // borderWidth: 2,
    // borderColor: 'red',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 160,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    left: 15,
    borderWidth: 2,
    borderColor: 'white',
  },
  mainContainer: {
    padding: 10,
    paddingLeft: 0,
    paddingRight: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'green',
    fontFamily: 'InderRegular',
  },
  head1: {
    // borderWidth:2,
    // borderColor:'yellow',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    // borderBottomWidth:1,
    // borderBottomColor:appColors.divider,
    marginBottom: 10,
    paddingLeft: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#262626',
    fontFamily: 'InderRegular',
    marginBottom: 1,
  },
  title: {
    fontSize: 15,
    color: '#262626',
    fontFamily: 'InderRegular',
    marginBottom: 3,
    // borderWidth:2,
  },
  location: {
    fontSize: 15,
    color: '#A6A6AA',
    fontFamily: 'InderRegular',
  },
  right: {},
  left: {
    marginRight: 15,
  },
  locContainer: {
    flexDirection: 'row',
    padding: 0,
    // borderWidth:2,
    alignItems: 'center',
  },
  locIcon: {
    marginRight: 5,
    // borderWidth:2,
  },

  //  Quick review
  quickReview: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: appColors.divider,
    borderBottomColor: appColors.divider,
    marginBottom: 10,
    // height:40,
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 15,
  },
  quickReviewBox: {
    borderRightWidth: 1,
    borderRightColor: appColors.divider,
    height: 40,
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'InderRegular',
  },
  boxNumber: {
    fontWeight: 'bold',
    color: appColors.black,
  },
  boxText: {},

  //  description
  description: {
    // borderWidth:2,
    // borderColor:'yellow',
    paddingLeft: 15,
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#262626',
    fontFamily: 'InderRegular',
    marginBottom: 2,
  },

  // Sponsorship packages
  whatWeOffer: {
    paddingLeft: 15,
  },

  scrollContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  box: {
    width: 250,
    height: 200,
    // justifyContent: 'center',
    // alignItems: 'center',
    marginRight: 10, // Space between boxes
    borderRadius: 20,
    backgroundColor: appColors.warmRed,
    padding:15,
    // paddingLeft:10,
  },
packageContent:{
borderWidth:2,
},
packageTitle:{
  fontFamily:'InderRegular',
  fontSize:20,
  fontWeight:'600',
  color:appColors.white,

},
priceView:{
  marginTop:10,
backgroundColor:appColors.white,
width:90,
padding:2,
justifyContent:'center',
alignItems:'center',
borderRadius:10,
},
packagePrice:{
  fontFamily:'InderRegular',
  color:appColors.warmRed,


},
packageDesc:{
  fontFamily:'InderRegular',
  marginTop:10,
  color:appColors.white,
  fontWeight:'100',
},
seeMore:{
  marginTop:5,
color:appColors.whisperGray,
fontFamily:'InderRegular'
},

});
