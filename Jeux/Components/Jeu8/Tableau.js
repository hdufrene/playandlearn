import React,{useState,useEffect} from 'react';

import { StyleSheet, Text, View, Image, BackHandler } from 'react-native';

const Tableau = ({
    vies,
    score,
    niveau,
    question,
    anglais
}) => {

    const getImage=(name)=>{
        return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
      }
    const [sourceCoeur,setSourceCoeur]= useState(null)
    
    useEffect(()=>{
        if(sourceCoeur==null  ){
          setSourceCoeur(getImage("Coeur"))        }
      },[])

    const styles = StyleSheet.create({
     
   
        infos:{
            position:"absolute",
            top:"5%",
            right:"2%",
            width:"15%",
            backgroundColor:"#1B1B1B",
            height:"25%",
            justifyContent:"center",
            alignItems:"center",
            borderRadius:15,
            // backgroundColor:"Tableau",
            borderWidth:2,
            borderColor:"#FFFFFF",
            maxHeight:110
        },
        info:{
            color:"#FFFFFF",
            fontSize:23,
            lineHeight:24,
            // backgroundColor:"purple",
            textAlign:"center",
            fontFamily:'HELVETICACOMP',
            textShadowColor :"black",
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 3,
            paddingLeft:4,
            paddingRight:4
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
        //   flex:1,
          width:"80%",
        //   backgroundColor:"red",
          height:"30%",
          
          flexDirection:"row",
          alignItems:"center",
          justifyContent:"center",
        }}>
          {composants}
        </View>
      )
      }



    return (
            <>
     
            <View
                style={[styles.infos,{
                    left:"2%",
                    width:"20%",
                }]}
            >
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={3}
                    style={[styles.info,{
                        fontSize:25,
                        lineHeight:26
                    }]}
                >
                    {question}
                </Text>
                
            </View>
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
                    {anglais ? "Level" : 'Niv.'} {niveau}
                </Text>
                {renderVies()}
            </View>
       
        </>

    )
}

export default Tableau
