import React,{useState,useEffect } from "react";
import { StyleSheet, Animated, Image, View } from 'react-native';



const Coeurs = ({ anim1, anim2, anim3, anim4, screenWidth, screenHeight }) => {
    const getImage=(name)=>{
        return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
      }

    const [sourceCoeur,setSourceCoeur]= useState(null)

  useEffect(()=>{
    if(sourceCoeur==null){
      setSourceCoeur(getImage('Jeu4/CoeurHD'))
    }
  },[])
   
    return (
        <Animated.View style={[styles.container, { width: screenWidth, height: screenHeight }]}>
            <Animated.View
                style={[styles.boiteCoeur, {
                    width: "25%",
                    height: "25%",
                    left: "15%",
                    top: "35%",
                    // backgroundColor: "yellow",
                    opacity: anim1[0],
                    transform: [
                        {
                            scale: anim1[1]
                        },
                    ]

                }]}>
                <Image
                    fadeDuration={0}
                    style={[styles.coeur, {

                        transform: [
                            { rotate: "-35deg" }
                        ]

                    }]}
                    source={sourceCoeur}
                />
            </Animated.View>
            <Animated.View
                style={[styles.boiteCoeur, {
                    width: "20%",
                    height: "20%",
                    right: "20%",
                    top: "40%",
                    opacity: anim2[0],
                    // backgroundColor: "purple",
                    transform: [
                        {
                            scale: anim2[1]
                        },
                    ]

                }]}>
                <Image
                    fadeDuration={0}
                    style={[styles.coeur, {

                        transform: [
                            { rotate: "40deg" }
                        ]

                    }]}
                    source={sourceCoeur}
                />
            </Animated.View>
            <Animated.View
                style={[styles.boiteCoeur, {
                    width: "15%",
                    height: "15%",
                    left: "30%",
                    top: "20%",
                    opacity: anim3[0],
                    // backgroundColor: "blue",
                    transform: [
                        {
                            scale: anim3[1]
                        },
                    ]

                }]}>
                <Image
                    fadeDuration={0}
                    style={[styles.coeur, {

                        transform: [
                            { rotate: "-15deg" }
                        ]

                    }]}
                    source={sourceCoeur}
                />
            </Animated.View>
            <Animated.View
                style={[styles.boiteCoeur, {
                    width: "17%",
                    height: "17%",
                    left: "52%",
                    top: "23%",
                    opacity: anim4[0],
                    // backgroundColor: "black",
                    transform: [
                        {
                            scale: anim4[1]
                        },
                    ]

                }]}>
                <Image
                    fadeDuration={0}
                    style={[styles.coeur, {

                        transform: [
                            { rotate: "10deg" }
                        ]

                    }]}
                    source={sourceCoeur}
                />
            </Animated.View>
        </Animated.View>
    );
}
const styles = StyleSheet.create({
    coeur: {
        width: "100%",
        height: "100%",

        resizeMode: "contain",
    },
    boiteCoeur: {
        flex: 1,
        position: "absolute",
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        position: "absolute",
        // backgroundColor: "white",
        // zIndex: 100,
        // opacity: 0.7
    }
})
export default Coeurs;