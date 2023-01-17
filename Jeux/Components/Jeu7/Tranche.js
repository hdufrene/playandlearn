import React, { useState ,useEffect} from 'react';
import { StyleSheet, Text, View, Animated, Image } from 'react-native';

const Tranche = (
  {
    tranche,
    numero,
    opacity,
    index,
    screenWidth,
    anglais
  }
) => {

  const rapportTranche = 547 / 1000
  const rapportTopTranche = 237 / 1000
  const [sourcesTranches, setSourcesTranches] = useState([
    null,
    null,
    null,
    null,
    null
  ])
  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }
  useEffect(() => {
    if (sourcesTranches[0] == null) {
      setSourcesTranches([
        getImage('Jeu7/TrancheBlanc'),
        getImage('Jeu7/TrancheVert'),
        getImage('Jeu7/TrancheViolet'),
        getImage('Jeu7/TrancheJaune'),
        getImage('Jeu7/TrancheRouge')
      ])
    }
  }, [])



  const colors = [
    "purple",
    "red",
    "yellow",
    "green"
  ]
  return (
    <Animated.View style={{
      width: screenWidth / 6,
      height: screenWidth / 6 * rapportTranche,
      alignItems: "center",
      // justifyContent: "flex-end",
      // backgroundColor:"gray",
      zIndex: index,
      bottom: -rapportTopTranche * screenWidth / 6 * (index - 1) - 43 / 1000 * screenWidth / 6,
      opacity: opacity
    }}>
      <Image
        fadeDuration={0}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          resizeMode: "contain",
          // bottom: -rapportTopTranche * screenWidth / 6 ,
          // backgroundColor:"pink"
        }}
        source={tranche.gateau == numero + 1 ? sourcesTranches[tranche.gateau] : sourcesTranches[0]} />
      <View
        style={{
          width: screenWidth / 6 - 84 * 2 / 1000 * screenWidth / 6,
          height: (1 - rapportTopTranche - 48 / 1000) * screenWidth / 6,
          justifyContent: "center",
          alignItems: "center",

        }}
      >
        <Text style={{
          fontSize: 12,
          width: "95%",
          textAlign: "center",
          fontFamily: 'Helvetica-italic',
          lineHeight: 12
          // backgroundColor:"red"
        }}>
          {anglais ? tranche.libelleEng : tranche.libelle}
        </Text>
      </View>
    </Animated.View>
  )
}


export default Tranche
