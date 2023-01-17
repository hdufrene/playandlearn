import React ,{useState,useEffect} from 'react';
import { StyleSheet, Text, View ,Image} from 'react-native';

export default function Case({
  type,
  x,
  y,
  dimCase,
  offset,
  revealed,
  reponses
}) {
  const colors =[
    "orange", //PACMAN 0
    "#73E3FF",  // FANTOME 1
    "#AA1919",// FANTOME 2
    "#FF6C00",// FANTOME 3
    "#CFCFCF",// FANTOME 4
    "#752909",// MUR 5
    "white",// 6 SOL SMARTIES
    "white", // 7 SOL VIDE
    "transparent"  // 8 VIDE 
  ]



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
  });

  const limitesCases = [
    [5,19]
    ,[5,15]
  ]


    //PACMAN 0
    // FANTOME 1
    // FANTOME 2
    // FANTOME 3
    // FANTOME 4
    // MUR 5
    // SOL 6
    // VIDE 7

    const colorReponses =[
      "#C0C0C0", // On sait pas
      "#ADD349",//true
      "#DF3B75", // false
      
    ]
    const caseDansZone=(x,y)=>{
      if(y<limitesCases[0][0] && x<limitesCases[1][0] ) return 1
      if(y<limitesCases[0][0] && x>limitesCases[1][1] ) return 2
      if(y>limitesCases[0][1] && x<limitesCases[1][0] ) return 3
      if(y>limitesCases[0][1] && x>limitesCases[1][1] ) return 4
      return 0
  
    }
    const numCase = caseDansZone(x,y)

  return (
    <View style={{
      position:"absolute",
      left:offset+x*dimCase,
      top:y*dimCase,
      width:dimCase,
      height:dimCase,
      opacity:type==6 || type==7 ? 0.8 : 1,
      borderWidth:type==5 ? 0.5 : 0,
      borderColor:"black",
      borderRadius:type==5 ? 2 : (type<1 ? 100 : 0),
      justifyContent:"center",
      alignItems:"center",
      opacity:type==4 || type<1? 0.95 : 0.5,
      zIndex:1

    }}>

    {type==4 ?

      <View style={{
        backgroundColor:  numCase>0 ? (revealed[numCase-1] ? ( reponses[numCase-1] ? colorReponses[1] : colorReponses[2] ) : colorReponses[0] ) : "transparent",
 
        position:"absolute",
        right:0,
        top:0,
        width:dimCase-2,
        height:dimCase-2,
        borderColor:"#F4F4F4",
        borderBottomLeftRadius:3,
        borderWidth:0.5,
        borderTopColor:"#4D4D4D",
        borderRightColor:"#4D4D4D",
      }}/>
    : null }

    {type==6 || type==2 ? // smarties
      <View style={{
        position:"absolute",
        borderWidth:3,
        borderRadius:100,
        borderColor:"#F627ED"
      }}/>


      : null}

 
    </View>
  );
}
