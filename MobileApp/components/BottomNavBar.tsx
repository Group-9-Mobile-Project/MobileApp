import * as React from "react";
import { View } from "react-native";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import { Text, PlatformPressable } from "@react-navigation/elements";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

export default function BottomNavBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={{ flexDirection: "row", height: 60, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        
        const label =
          options.tabBarLabel !== undefined
            ? typeof options.tabBarLabel === 'function'
              ? options.tabBarLabel({ focused: isFocused, color: isFocused ? colors.primary : colors.text, position: 'below-icon', children: route.name })
              : options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            {options.tabBarIcon && options.tabBarIcon({ 
              focused: isFocused, 
              color: isFocused ? colors.primary : colors.text, 
              size: 24 
            })}
            <Text style={{ color: isFocused ? colors.primary : colors.text, fontSize: 12, marginTop: 4 }}>
              {label}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}
