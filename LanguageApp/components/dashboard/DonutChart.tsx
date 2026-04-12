import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface DonutChartProps {
  percent: number;
  trackColor: string;
  fillColor: string;
  textColor: string;
}

export const DonutChart = ({ percent, trackColor, fillColor, textColor }: DonutChartProps) => {
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg width="48" height="48" viewBox="0 0 48 48" style={styles.svg}>
        <Circle cx="24" cy="24" r={radius} stroke={trackColor} strokeWidth={strokeWidth} fill="none" />
        <Circle 
          cx="24" 
          cy="24" 
          r={radius} 
          stroke={fillColor} 
          strokeWidth={strokeWidth} 
          fill="none" 
          strokeDasharray={circumference} 
          strokeDashoffset={strokeDashoffset} 
          strokeLinecap="round" 
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.centered]}>
        <Text style={[styles.text, { color: textColor }]}>{Math.round(percent)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 48, 
    height: 48, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  svg: {
    transform: [{ rotate: '-90deg' }]
  },
  centered: {
    justifyContent: 'center', 
    alignItems: 'center'
  },
  text: {
    fontSize: 12, 
    fontWeight: '700'
  }
});
