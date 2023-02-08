import React ,{useState,useEffect} from 'react';
import { StyleSheet, Text, View ,Image} from 'react-native';

export default function Reponse({
  libelle,
  numero,
  revealed,
  reponse,
  dimCase,
  screenHeight
}) {
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }

  const [coulis,setCoulis]=useState([])
  const [coulisRouge,setCoulisRouge]=useState([])
  const [coulisVert,setCoulisVert]=useState([])
 
  useEffect(()=>{
    if(coulis.length==0 || coulisRouge.length==0 || coulisVert.length==0 ){
      setCoulis([getImage('Jeu6/CoulisD'),getImage('Jeu6/CoulisG')])
      setCoulisRouge([getImage('Jeu6/CoulisRougeD'),getImage('Jeu6/CoulisRougeG')])
      setCoulisVert([getImage('Jeu6/CoulisVertD'),getImage('Jeu6/CoulisVertG')])
    }
    
  },[])


  const styles = StyleSheet.create({
    reponse:{
      position:"absolute",
      bottom:numero<3 ? -dimCase/3 : null,
      top:numero>2 ? -dimCase/3 : null,
      height:"100%",
      width:"49%",
      maxWidth:screenHeight*0.08*400/180,
      //left:numero%2==0 ? "1%" : "50%" ,
      right:numero%2==0 ? 0 : null,
      //justifyContent:numero<3 ? 'flex-end' : 'flex-start',
      //borderTopLeftRadius:numero<3 || numero%2==0 ? 15 : 0,
      //borderTopRightRadius:numero<3 || numero%2==1 ? 15 : 0,
      //borderBottomRightRadius:numero%2==1 || numero>2 ? 15 : 0,
      //borderBottomLeftRadius:numero%2==0 || numero>2 ? 15 : 0,
      justifyContent:"center",
        // elevation:3,
        zIndex:5,
      // backgroundColor:"red"
      // opacity:0
    },
    texteReponse:{
      position:"absolute",
      fontSize:22,
      fontSize:24,
      right:numero%2==0 ? "1%" : null,
      left:numero%2==1 ? "1%" : null,
      width:"75%",
      textAlign:"center",
      color:revealed ? "#F0EAD9":'#4D4D4D',
      fontWeight:"normal",
      textAlign:'center',
      fontFamily:'HELVETICACOMP',
      textShadowColor :revealed ?'#4D4D4D': "#F0EAD9",
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 1,
      // backgroundColor:"pink"
    },
    imageReponse:{
      position:"absolute",
      width:"100%",
      height:"145%",
      resizeMode:"contain",
    }
  });

  return (
    <View
      style={[styles.reponse]}
    >
       <Image
        style={[styles.imageReponse]}
        
        source={revealed ? ( reponse ? coulisVert[(numero)%2] : coulisRouge[(numero)%2] ) : coulis[(numero)%2]}
      />
    <Text 
    adjustsFontSizeToFit
    numberOfLines={2}
    ellipsizeMode={"middle"}
    style={styles.texteReponse}>
      {libelle}
    </Text>

    </View>
  );



}
