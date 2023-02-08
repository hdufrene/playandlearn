import React from 'react';
import { Image, View, StyleSheet,Animated} from 'react-native';

const Cupcakes = ({
  screenWidth,
  screenHeight,
  topCupcake,
  hauteurCupcake,
  opacityCupcake,
  sourceCupcake1,
  sourceCupcake2,
  sourceCupcake3,
  sourceCupcake4
}) =>{


  return(
    <Animated.View
      style={{
        flex:1,
        flexDirection:"row",
        position:'absolute',
        top:topCupcake,
        width:"90%",
        height:hauteurCupcake,
        zIndex:2,
        opacity:opacityCupcake
      }}
    >
        <Image
          fadeDuration={0}
          style={styles.cupcake}
          source = {sourceCupcake1}
        />
        <Image
        fadeDuration={0}
        style={styles.cupcake}
          source = {sourceCupcake2}
        />
        <Image
          fadeDuration={0}
        style={styles.cupcake}
          source = {sourceCupcake3}
        />
        <Image
          fadeDuration={0}        style={styles.cupcake}
          source = {sourceCupcake4}
        />

    </Animated.View>

  )
}


const styles = StyleSheet.create({
  cupcake: {
    flex:1,
    width:"25%",
    height:"100%",
    position:"relative",
    resizeMode:"contain",

  },
  image_cupcake: {
    flex:1,
    position:"absolute",
    width:"100%",
    height:"100%",
    resizeMode:"contain",
  },
});

export default Cupcakes
