import React ,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';

export default function CaseReponse({
  numero,
  dimCase,
  offset,
  revealed,
  reponses // TRUE FALSE
}) {


  const limitesCases = [
    [5,19]
    ,[5,15]
  ]


  const colorReponses =[
    "#E6E5E5", // On sait pas
    "#C7E18E",//true
    "#E980A2", // false
    
  ]



  const caseDansZone=(x,y)=>{
    //console.log(x,y)
    return (y<limitesCases[0][0] || y>limitesCases[0][1] ) && (x<limitesCases[1][0]  || x>limitesCases[1][1] )
  }

    //PACMAN 0
    // FANTOME 1
    // FANTOME 2
    // FANTOME 3
    // FANTOME 4
    // MUR 5
    // SOL 6
    // VIDE 7

  

  return (
    <View style={{
     
      position:"absolute",
      left:numero%2==1 ? offset : null,
      right:numero%2==0 ? offset : null,
      top:numero<3 ? 0 : null,
      bottom:numero>2 ? 0 : null,
      width:dimCase*limitesCases[0][0],
      height:dimCase*limitesCases[1][0],
      opacity:0.4,
      backgroundColor:  numero>0 ? (revealed[numero-1] ? ( reponses[numero-1] ? colorReponses[1] : colorReponses[2] ) : colorReponses[0] ) : "transparent",
    }}>

     


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageReponse:{
    position:"absolute",
    width:"100%",
    height:"90%",
    resizeMode:"contain",
    
  }
});
