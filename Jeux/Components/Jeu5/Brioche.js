import React, { useEffect, useState } from 'react';

import { StyleSheet, Text, View, Image,Animated } from 'react-native';
import Draggable from 'react-native-draggable';
const Brioche = ({
  x,
  y,
  handleDrag,
  largeur,
  hauteur,
  opacity,
  briocheDisabled,
  screenWidth,
  screenHeight

}) => {
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  
  const [sourceBrioche,setSourceBrioche]=useState(null) 

  useEffect(()=>{
    if(sourceBrioche==null){
      setSourceBrioche(getImage('Jeu5/BriochePlate'))

    }
  },[])

  const styles = StyleSheet.create({
    brioche: {
      width: largeur,
      height: largeur,
      justifyContent: "center",
      alignItems: "center",
      resizeMode: "contain",
      // backgroundColor:"red",
      // opacity:0.7
    }
  })

  return (
    <Animated.View
      style={{
        opacity: opacity,
        position: "absolute",
        // flex: 1,
        width: screenWidth,
        height: screenHeight,
        elevation:11,
      }}

    >
      <Draggable
        x={x}
        y={y}
        disabled={briocheDisabled}
        renderText=''
        shouldReverse
        // onShortPressRelease={() => alert('touched!!')}
        onDragRelease={(event, gestureState, bounds) => {
          handleDrag(gestureState)
        }}
      >

        <Image
          source={sourceBrioche}
          style={styles.brioche} />


      </Draggable>
    </Animated.View>
  )
}

export default Brioche
