import React, { useState,useEffect } from 'react';

import { StyleSheet, Text, View, Image, BackHandler } from 'react-native';
import Four from './Four';

const Comptoir = ({
    vies,
    score,
    niveau,
    question,
    screenWidth,
    screenHeight
}) => {
    const getImage=(name)=>{
        return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
      }
    const [sourceComptoir,setSourceComptoir]=useState(null) 
    const [sourceCoeur,setSourceCoeur]= useState(null)
    
    useEffect(()=>{
        if(sourceCoeur==null || sourceComptoir==null ){
          setSourceCoeur(getImage("Coeur"))
          setSourceComptoir(getImage('Jeu5/Comptoir'))
        }
      },[])


    const styles = StyleSheet.create({
        comptoir: {
            position: "absolute",
            width: "90%",
            height: 0.9*0.29*screenWidth,
            top:screenHeight*0.5+24/298*screenWidth*0.9,
            // bottom: -0.29*screenWidth,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor:"yellow"
        },
        fond: {
            position: "absolute",
            width: "100%",
            height: "100%",
            resizeMode: "contain",

        },
        ardoise: {
            position: "absolute",
            width: "70%",
            height: "35%",
            backgroundColor: "#303030",
            top: "24%",
            shadowColor: "black",
            shadowOffset: {
                width: 3,
                height: 1,
            },
            borderColor: "#CCCCCC",
            borderWidth: 1,
            shadowOpacity: 1,
            justifyContent:"space-evenly",
            alignItems:"center",
            flexDirection:"row"
            
        },
        question:{
            // flex:1,
            color:"white",
            fontSize:25,
            // backgroundColor:"red",
            width:"65%",
            // padding:10,
            fontFamily:'HELVETICACOMP',
            textShadowColor :"black",
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 3,
            alignItems:"center",
            textAlign:"center"
        },
        infos:{
            width:"30%",
            // backgroundColor:"blue",
            height:"90%",
            justifyContent:"center",
            alignItems:"center"
        },
        info:{
            color:"white",
            fontSize:20,
            // backgroundColor:"purple",
            textAlign:"center",
            fontFamily:'HELVETICACOMP',
            textShadowColor :"black",
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 3
        },
        coeur:{
            flex:1,
            position:"relative",
            resizeMode:"contain",
            height:"80%"
        }
        
    })

    const renderVies=()=>{

        var composants =[]
    
    
    
        for (let i=1;i<5;i++){
          var opacity=1
          if(5-i>vies){
            opacity=0
          }
          composants.push(
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
          width:"60%",
        //   backgroundColor:"red",
        //   height:"10%",
          
          flexDirection:"row",
          alignItems:"center",
          justifyContent:"center",
        }}>
          {composants}
        </View>
      )
      }



    return (
        <View
            style={styles.comptoir}
        >
            <Image
                style={styles.fond}
                source={sourceComptoir}
            />
            <View
                style={styles.ardoise}
            >
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={2}
                    ellipsizeMode={"middle"}
                    style={styles.question}
                >
                    {question.libelle}
                </Text>
                <View
                    style={styles.infos}
                >
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={styles.info}
                    >
                        Score : {score}
                    </Text>
                    <Text
                        adjustsFontSizeToFit
                        numberOfLines={1}
                        style={styles.info}
                    >
                        Niv. {niveau}
                    </Text>
                    {renderVies()}
                </View>
            </View>
            

        </View>

    )
}

export default Comptoir
