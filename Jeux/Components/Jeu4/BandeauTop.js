import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';

const BandeauTop = ({question,score,bandeauTopHeight,viesRestantes,niveau,screenWidth}) =>{
  const hauteurCategorie=20
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  const [sourceCoeur,setSourceCoeur]= useState(null)

  useEffect(()=>{
    if(sourceCoeur==null){
      setSourceCoeur(getImage('Coeur'))
    }
  },[])
  
  const renderVies=()=>{

    var vies =[]



    for (let i=1;i<5;i++){
      var opacity=1
      if(5-i>viesRestantes){
        opacity=0
      }
      vies.push(
        <Image
            key={i}
            style={[styles.coeur,{opacity:opacity}]}
            source = {sourceCoeur} />
        )
    }

  return(

    <View
    style={{
      flex:1,
      width:"80%",
      // height:"10%",
      
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"center",
    }}>
      {vies}
    </View>
  )
  }

  return(
    <View
      style={{
        position:"absolute",
        top:0,

        width:'100%',
        height:bandeauTopHeight,
        justifyContent:'flex-end',
        zIndex:2,
        backgroundColor:'#4D4D4D',
        shadowColor: "black",
        shadowOffset: {
        	width: 3,
        	height:1,
        },
        shadowOpacity: 1,
        // elevation: 10,
        shadowRadius: 1,
        borderBottomRightRadius:8,
        borderBottomLeftRadius:8,
      }}
    >
      <View style={
        {
          height:"80%",
          width:"100%",
          justifyContent:"center",
          alignItems:"center",
          flexDirection:"row",
          bottom:"1%",
          // backgroundColor:"red"
        }
      }
    >
    <Text 
     numberOfLines={2}
     adjustsFontSizeToFit 
    style={{
        fontSize:28,
        lineHeight:30,
      color:'#F0EAD9',
      fontWeight:"normal",
      paddingLeft:"5%",
      paddingRight:"5%",
      textAlign:'left',
      width:'65%',
      fontFamily:'HELVETICACOMP',
      textShadowColor :"black",
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 3

    }}>
      {question}
    </Text>

      <View
      style={{
        width:"30%",
        paddingTop:10,
        alignItems:"center",
        bottom:0,
      }}>

        <Text 
        numberOfLines={1}
        adjustsFontSizeToFit 
        style={{

          fontSize:20,
          color:'#F0EAD9',
          fontWeight:"normal",
          textAlign:'right',
          fontFamily:'HELVETICACOMP',
          textShadowColor :"black",
          textShadowOffset: {width: 1, height: 1},
          textShadowRadius: 3

        }}>
          Score : {Math.max(0,score)}
        </Text>
        <Text
        numberOfLines={1}
        adjustsFontSizeToFit 
        style={{

          fontSize:20,
          color:'#F0EAD9',
          fontWeight:"normal",
          textAlign:'right',
          fontFamily:'HELVETICACOMP',
          textShadowColor :"black",
          textShadowOffset: {width: 1, height: 1},
          textShadowRadius: 3

          }}>
          Niveau : {niveau}
          </Text>
      {renderVies()}
      </View>
    </View>
    </View>

  )
}

const styles=StyleSheet.create({
  coeur: {
    flex:1,
    position:"relative",
    resizeMode:"contain",
    height:"90%"
  },
})


export default BandeauTop
