import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const BottomNav = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom - 10 : 0, height: 80 + (insets.bottom > 0 ? insets.bottom - 10 : 0) }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const renderIcon = () => {
          if (route.name === 'index') {
            return (
              <Svg width="24" height="24" viewBox="0 0 24 24" fill={isFocused ? "#FFFFFF" : "none"} stroke={isFocused ? "none" : "#B0B9CB"} strokeWidth="2">
                <Path d="M12 3l10 9h-3v9H5v-9H2z" />
              </Svg>
            );
          } else if (route.name === 'course') {
            return (
              <Svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isFocused ? "#FFFFFF" : "#B0B9CB"} strokeWidth="2" strokeLinecap="round">
                <Rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <Line x1="16" y1="2" x2="16" y2="6" />
                <Line x1="8" y1="2" x2="8" y2="6" />
                <Line x1="3" y1="10" x2="21" y2="10" />
              </Svg>
            );
          } else if (route.name === 'exam') {
            return (
              <Svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isFocused ? "#FFFFFF" : "#B0B9CB"} strokeWidth="2" strokeLinecap="round">
                <Circle cx="12" cy="12" r="10" />
                <Line x1="12" y1="6" x2="12" y2="12" />
                <Line x1="12" y1="12" x2="16" y2="14" />
              </Svg>
            );
          } else if (route.name === 'profile') {
            return (
              <Svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isFocused ? "#FFFFFF" : "#B0B9CB"} strokeWidth="2" strokeLinecap="round">
                <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <Circle cx="12" cy="7" r="4" />
              </Svg>
            );
          }
        };

        // Don't render routes that aren't mapped above
        if (['index', 'course', 'exam', 'profile'].includes(route.name)) {
            return (
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={onPress}
                style={isFocused ? styles.activeIconContainer : styles.iconPadding}
                key={route.key}
              >
                {renderIcon()}
              </TouchableOpacity>
            );
        }
        return null;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    width: '100%', 
    backgroundColor: '#FFFFFF', 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -10 }, 
    shadowOpacity: 0.03, 
    shadowRadius: 30, 
    elevation: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center'
  },
  activeIconContainer: {
    width: 48, 
    height: 48, 
    backgroundColor: '#259D7A', 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  iconPadding: {
    padding: 10
  }
});
