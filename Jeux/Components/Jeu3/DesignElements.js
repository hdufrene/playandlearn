import React, { useState,useEffect } from 'react';
import {View,Image,Text,StyleSheet} from 'react-native';

const DesignElements = ({
  screenWidth,
  screenHeight,
  libelle="Libellé",
  score=0,
  viesRestantes=0,
  niveau,
  longueurTapis,
  positionDepartTapis
})=> {
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  const [sourceCuisine,setSourceCuisine]=  useState(null)
  const [sourceTapis,setSourceTapis]=  useState(null)
  const [sourceCoeur,setSourceCoeur]= useState(null)
  useEffect(()=>{
    if(sourceCoeur==null || sourceTapis==null || sourceCuisine==null ){
      setSourceCoeur(getImage("Coeur"))
      setSourceCuisine(getImage('Jeu3/J03_Cuisine_06'))
      setSourceTapis(getImage('Jeu3/J03_TapisRoulant_01'))
    }
  },[])

   
    const ratioCuisine = 6250/8000
    const ratioTapis = 792/2000
    const widthTapis=longueurTapis
    const bottomTapis=100

    const renderVies=()=>{

        var vies =[]



        for (let i=1;i<5;i++){
          var opacity=1
          if(5-i>viesRestantes){
            opacity=0
          }
          vies.push(
            <Image
                fadeDuration={0}
                key={i}
                style={[styles.coeur,{opacity:opacity}]}
                source = {sourceCoeur} />
            )
        }
        return(

        <View
        style={{
          position:"absolute",
          height:"18%",
          width:"14%",
          bottom:"5%",
          right:"16%",
          justifyContent:"center",
          alignItems:"center",
          flexDirection:"row",
          alignItems:"center",
          justifyContent:"center",
          padding:5
        }}>
          {vies}
        </View>
      )
    }

    return (
      <>
      <View style={{
          flex:1,
          flexDirection:"column",
          width:screenHeight,
          height:screenWidth,
          zIndex:0,
          justifyContent:"center",
          alignItems:"flex-start",
      }}>

      <View style={{
        position:"absolute",
        left:725/3000*screenWidth,
        // alignSelf:"center",
        top:screenHeight/2-145,
        width:1000/2344*screenWidth,
        height:"15%",
        maxHeight:80,
        zIndex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"#1A1A1A",
        // borderWidth:2,
        // borderColor:"white",
        borderRadius:15,
        shadowColor:"#1A1A1A",
        shadowOffset: {
          width: 1,
          height: 2,
        },
        shadowOpacity:0.5,

        elevation: 2,
        shadowRadius:10


      }}>
        <Text 
         numberOfLines={2}
         adjustsFontSizeToFit 
         ellipsizeMode="middle"
        style={{
          textAlign:'center',
          fontSize:27,
          width:"95%",
          color:'#F0EAD9',
          fontFamily:'HELVETICACOMP',
          textShadowColor :"black",
          textShadowOffset: {width: 1, height: 1},
          textShadowRadius: 4,
        }}>
          {libelle}
        </Text>
      </View>


        <Image
          fadeDuration={0}
          style={{
            flex:1,
            position:"absolute",
            width:screenWidth,
            height:screenHeight,
            resizeMode:"cover",
            bottom:0,
            left:0
          }}

          source = {sourceCuisine}

        />
        <View

        style={{
          flex:1,
          position:"absolute",
          width:widthTapis,
          height:widthTapis*ratioTapis,
          top:screenHeight/2-216/792*widthTapis*ratioTapis+20,
          left:positionDepartTapis,
        }}
        >
        <Image
          fadeDuration={0}
          style={{
            flex:1,
            position:"absolute",
            width:widthTapis,
            height:widthTapis*ratioTapis,
            resizeMode:"contain"
          }}

          source = {sourceTapis}

        />


        <View
          style={{
            position:"absolute",
            height:"20%",
            width:"10%",
            bottom:"24%",
            right:"18%",
            justifyContent:"center",
            alignItems:"center"
        }}>
        <Text
        numberOfLines={1}
        adjustsFontSizeToFit 
          style={styles.score}
        >{score}</Text>
         <Text
         numberOfLines={1}
         adjustsFontSizeToFit 
          style={styles.score}
        >Niv. {niveau}</Text>
        </View>
        {renderVies()}

          </View>

      </View>

      </>

    )
}

const styles=StyleSheet.create({
  coeur: {
    flex:1,
    position:"relative",
    resizeMode:"contain",
    width:"100%",
    height:"100%"
  },
  score:{
    fontSize:20,
    color:'white',
    fontFamily:'Helvetica-italic',
    textAlign:"right",
    width:"100%",
    padding:0
  }
})

export default DesignElements
