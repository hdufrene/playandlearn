import React, { useEffect, useState } from 'react';

import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import Draggable from 'react-native-draggable';
const Carton = ({
  id,
  x,
  y,
  handleDrag,
  largeurReponse,
  hauteurReponse,
  rapportPerspective,
  opacity,
  reponse,
  cartonsDisabled

}) => {
  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }
  const [sourceCarton, setSourceCarton] = useState(null)
  useEffect(() => {
    if (sourceCarton == null) {
      setSourceCarton(getImage('Jeu4/Co04_Carton_05'))
    }
  }, [])
  const styles = StyleSheet.create({
    reponse: {
      width: largeurReponse,
      height: hauteurReponse,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: rapportPerspective * hauteurReponse,
    },
    reponseImage: {
      position: "absolute",
      width: largeurReponse,
      height: hauteurReponse,
      resizeMode: "contain",
    },
    textReponse: {
      fontSize: 20,
      // lineHeight:22,
      // width:"90%",
      color: "#3F0F00",
      textAlign: "center",
      fontFamily: 'HELVETICACOMP',

    }
  })
  return (
    <View

      style={{
        opacity: opacity,
        // backgroundColor:"red"
      }}>
      <Draggable
        x={x}
        y={y}
        disabled={cartonsDisabled}
        renderText=''
        shouldReverse
        // onShortPressRelease={()=>alert('touched!!')}
        onDragRelease={(event, gestureState, bounds) => {
          handleDrag(gestureState, id)
        }}
      >

        <View style={
          styles.reponse
        }>
          <Image
            source={sourceCarton}
            style={styles.reponseImage} />
          <Text
            numberOfLines={2}
            ellipsizeMode='middle'
            adjustsFontSizeToFit
            style={styles.textReponse}
          >{reponse}</Text>
        </View>


      </Draggable>
    </View>
  )
}

export default Carton
