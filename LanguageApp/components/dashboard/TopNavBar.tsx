import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { useRouter } from 'expo-router';

export const TopNavBar = () => {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => console.log('Menu Opening')}>
         <Svg width="24" height="24" viewBox="0 0 24 24">
           <Line x1="3" y1="8" x2="21" y2="8" stroke="#2B2D42" strokeWidth="2.5" strokeLinecap="round" />
           <Line x1="3" y1="16" x2="16" y2="16" stroke="#2B2D42" strokeWidth="2.5" strokeLinecap="round" />
         </Svg>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/profile' as any)}>
         <Image source={{ uri: 'https://flagcdn.com/w80/us.png' }} style={styles.avatar} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingBottom: 16
  },
  avatar: {
    width: 28, 
    height: 28, 
    borderRadius: 14
  }
});
