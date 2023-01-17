import React,{useEffect, useState } from "react";
import { StyleSheet, Animated, Image, View } from 'react-native';



const Coeurs = ({ anim1, anim2, anim3, anim4, anim5 }) => {
    const getImage=(name)=>{
        return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
      }
    const [sourceCoeur,setSourceCoeur]=useState(null)
    
    useEffect(()=>{
        if(sourceCoeur==null){
            setSourceCoeur(getImage('Jeux210/CoeurHD'))
        }
    },[])
   
    return (
        <Animated.View style={[styles.container, { width: "100%", height: "100%" }]}>
            <Animated.View
                style={[styles.boiteCoeur, {
                    width: "30%",
                    height: "30%",
                    left: "-8%",
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
                    width: "30%",
                    height: "30%",
                    right: "-5%",
                    top: "50%",
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
                    width: "20%",
                    height: "20%",
                    left: "10%",
                    top: "5%",
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
                            { rotate: "-20deg" }
                        ]

                    }]}
                    source={sourceCoeur}
                />
            </Animated.View>
            
            <Animated.View
                style={[styles.boiteCoeur, {
                    width: "25%",
                    height: "25%",
                    left: "65%",
                    top: "10%",
                    opacity: anim4[0],
                    // backgroundColor: "red",
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
                            { rotate: "20deg" }
                        ]

                    }]}
                    source={sourceCoeur}
                />
            </Animated.View>
            <Animated.View
                style={[styles.boiteCoeur, {
                    width: "18%",
                    height: "18%",
                    left: "40%",
                    top: "-5%",
                    opacity: anim5[0],
                    // backgroundColor: "black",
                    transform: [
                        {
                            scale: anim5[1]
                        },
                    ]

                }]}>
                <Image
                    fadeDuration={0}
                    style={[styles.coeur, {

                        transform: [
                            { rotate: "5deg" }
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
        // backgroundColor:"blue",        
        alignItems: "center",
        justifyContent: "center",
 
    },
    container: {
        flex: 1,
        position: "absolute",
        // backgroundColor: "white",
        // zIndex: 100,
        //  opacity: 1
    }
})
export default Coeurs;