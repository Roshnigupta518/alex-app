import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, wp, fonts } from '../constants';

const TabsHeader = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <View style={styles.tabsContainer}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)} style={styles.tabWrapper}>
            <View style={[styles.tabItem, { borderBottomColor: isActive ? colors.primaryColor : colors.black }]}>
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                {tab.title}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabsHeader;

const styles = StyleSheet.create({
tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: wp(20),
    marginHorizontal: wp(20),
  },

  tabWrapper: {
    flex: 1,
    alignItems: 'center',
  },

  tabItem: {
    // paddingBottom: wp(10),
    borderBottomWidth: 3,
    width: '100%',
    alignItems: 'center',
  },

  tabText: {
    fontFamily: fonts.semiBold,
    fontSize: wp(12),
    color: colors.black,
  },

  activeTabText: {
    color: colors.black,
  },
});

