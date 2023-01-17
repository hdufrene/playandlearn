import React, { useEffect, useState } from 'react';

import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import Draggable from 'react-native-draggable';
const Sac = ({
  id,
  x,
  y,
  handleDrag,
  largeurSac,
  reponse,
  sacDisabled,
  rouge
}) => {
  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }

  const [sourceSac,setSourceSac]=useState(null) 
  const [sourceSacRouge,setSourceSacRouge]=useState(null) 

  useEffect(()=>{
    if(sourceSac==null || sourceSacRouge==null){
      setSourceSac(getImage('Jeu8/Sac'))
      setSourceSacRouge( getImage('Jeu8/SacRouge'))
    }
  },[])




  const largeur = largeurSac * 0.8
  const styles = StyleSheet.create({
    reponse: {
      width: largeur,
      height: largeur * 183 / 512,
      justifyContent: "center",
      alignItems: "center",
    },
    reponseImage: {
      position: "absolute",
      width: largeur,
      height: largeur * 183 / 512,
      resizeMode: "contain",
    },
    libelle: {
      position: "absolute",
      fontSize: 22,
      // lineHeight:23,
      left: 181 / 512 * 100 + "%",
      width: (1 - (30 + 181) / 512) * 100 + "%",
      textAlign: "center",
      fontFamily:"HELVETICACOMP",
      color:"#401800",
      
    },
  })
  return (
   
    <View 
    >
      { reponse!=null ?
     
      <Draggable
        x={x}
        y={y}
        disabled={sacDisabled}
        renderText=''
        shouldReverse
        // onShortPressRelease={() => alert('touched!!')}
        onDragRelease={(event, gestureState, bounds) => {
          handleDrag(gestureState, id)
        }}

      >

        <View style={
          [styles.reponse,{
            
            // backgroundColor:"yellow",
            // transform: [{ scale: scale}]
          }]
        }>

          
          <Image
          source={sourceSacRouge}
          style={[styles.reponseImage,{
            opacity: rouge ? 1 : 0
          }]} />
        
          
          <Image
            source={sourceSac}
            style={[styles.reponseImage,{
              opacity: rouge ? 0 : 1
            }]} />
          
          
            
          <Text
            ellipsizeMode="middle"
            numberOfLines={2}
            adjustsFontSizeToFit
            style={styles.libelle}
          >{reponse}</Text>
        </View>


      </Draggable>
      :null
       }
      </View>
  ) 
}

export default Sac
