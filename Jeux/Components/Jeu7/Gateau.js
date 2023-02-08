import React, { useEffect, useState,useRef } from 'react';
import { TouchableWithoutFeedback, Animated } from 'react-native';
import Tranche from "../Jeu7/Tranche"

const Gateau = (
  {
    numero,
    tranches,
    screenWidth,
    opacity,
    opacityTop,
    handleClicGateau,
    anglais
  }
) => {
  



  const renderTranches = () => {
    return tranches.slice(0).reverse().map((tranche, index) =>{
      // console.log(tranche)
      if(typeof(tranche)!="undefined" && tranche.libelle!=="" && tranche.libelleEng!=="") return <Tranche key={index} tranche={tranche} index={tranches.length-index} anglais={anglais} numero={numero} opacity={index==0 ? opacityTop : 1} screenWidth={screenWidth}/>
    })
  }

  return (
    <TouchableWithoutFeedback
      
      onPress={()=>handleClicGateau(numero)}
    >
      <Animated.View
        style={{
          // flex:1,
          maxWidth: screenWidth / 6,
          position: "relative",
          width: screenWidth / 6,
          // backgroundColor: "blue",
          height: "100%",
          opacity: opacity,
          justifyContent:"flex-end",
          bottom:144/1000*screenWidth / 6,

          zIndex:2
        }}
      >
        {renderTranches()}
      </Animated.View>
    </TouchableWithoutFeedback>

  )
}


export default Gateau
