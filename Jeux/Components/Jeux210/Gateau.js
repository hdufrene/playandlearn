import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, Image, Animated, TouchableOpacity } from 'react-native';
import Coeurs from './Coeurs';

const Gateau = ({
  reponse,
  num,
  handleClicGateau,
  couleur,
  scale,
  transformY,
  anim1,
  anim2,
  anim3,
  anim4,
  anim5,
  trueResponse,
  faux
}) => {
  // console.log(num,reponse.split(" ").length-2,reponse.split(" "))
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
const [sourceFaux,setSourceFaux]=useState(null)
const [sourcesGateau,setSourcesGateau]=useState([
  null,
  null,
  null,
  null,
  null,
  null
])


useEffect(()=>{
    if(sourceFaux==null || sourcesGateau[0]==null){
        setSourceFaux(getImage('Jeux210/GateauFaux'))
        setSourcesGateau([
          getImage('Jeux210/GateauJaune'),
          getImage('Jeux210/GateauOrange'),
          getImage('Jeux210/GateauRose'),
          getImage('Jeux210/GateauRouge'),
          getImage('Jeux210/GateauVert'),
          getImage('Jeux210/GateauViolet')
        ])
    }
},[])

  const renderGateau = () => {
    var components = []
    sourcesGateau.forEach((source, index) => {
      components.push(
        <Image
          key={index+"2"}
          fadeDuration={0}
          style={[styles.imageGateau, {
            opacity: faux ? 1 : 0
          }]}
          source={sourceFaux}
        />
      )
      components.push(
        <Image
          key={index+"1"}
          fadeDuration={0}
          style={[styles.imageGateau, {
            opacity: couleur == index && !faux ? 1 : 0
          }]}
          source={source}
        />)
      
    });
    return components
  }
  const styles = StyleSheet.create({
    gateauContainer: {
      position: "relative",
      // flex: 1,
      //  backgroundColor:"yellow",
      width: "30%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center"

    },
    imageGateau: {
      position: "absolute",
      left: 0,
      width: "100%",
      height: "100%",
      resizeMode: "contain",
    },
    reponse: {
      position: "absolute",
      // backgroundColor: "purple",
      fontSize: 28,
      minWidth:100,
      minHeight:28,
      width: "80%",
      maxHeight:"60%",
      textAlign: "center",
      color: "white",
      textShadowColor: "black",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
      fontFamily:"HELVETICACOMP",
      // backgroundColor:"red",


    },
    touchableZone: {
      // flex:1,
      // backgroundColor:"purple",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "100%",
      // yIndex:2
    }
  });




  return (
    <>
      {reponse != null

        ?
        <Animated.View
          style={[styles.gateauContainer, {
            transform: [{
              scale: scale,
            }, {
              translateY: transformY
            }]
          }]}
        >
         
          <TouchableOpacity
            onPress={() =>{ 
                handleClicGateau(trueResponse,num)
            }}
            style={[styles.touchableZone, {
              width: "100%"
            }]}
          >
            {renderGateau()}

            <Text
              adjustsFontSizeToFit
              numberOfLines={3}
              ellipsizeMode='middle'
              style={styles.reponse}
            >
              { reponse}
            </Text>
            {trueResponse ?
            <Coeurs
              anim1={anim1}
              anim2={anim2}
              anim3={anim3}
              anim4={anim4}
              anim5={anim5}
            />
            : null }
          </TouchableOpacity>

          

        </Animated.View>
        :
        null
      }

    </>
  )
}




export default Gateau
