import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const Loader = () => {
  const balls = Array.from({ length: 7 }, () => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    balls.forEach((ball, index) => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(ball, {
            toValue: 1,
            duration: 1000 + (index % 2 === 0 ? 50 * (index + 1) : 100 * (index + 1)),
            useNativeDriver: true,
          }),
          Animated.timing(ball, {
            toValue: 0,
            duration: 1000 + (index % 2 === 0 ? 50 * (index + 1) : 100 * (index + 1)),
            useNativeDriver: true,
          })
        ])
      );

      animation.start();
    });
  }, [balls]);

  const translateBall = (ball, direction) => ({
    transform: [
      {
        translateX: ball.interpolate({
          inputRange: [0, 1],
          outputRange: direction === 'right' ? [-15, 15] : [15, -15],
        }),
      },
    ],
  });

  return (
    <View style={styles.loaderOverlay}>
      <View style={styles.container}>
        {balls.map((ball, index) => (
          <Animated.View
            key={index}
            style={[
              styles.ball,
              index % 2 === 0
                ? translateBall(ball, 'right')
                : translateBall(ball, 'left'),
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderOverlay: {
    zIndex: 100,
    position: 'absolute',
    height: height,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  container: {
    width: 200,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    width: 10,
    height: 10,
    margin: 2,
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
});

export default Loader;