import React, { useEffect, useState } from 'react';

import { StyleSheet, View,Animated, Image } from 'react-native';
import Four from './Four';

const Fours = ({
    largeur,
    screenWidth,
    screenHeight,
    opacity,
    numerosFours
}) => {
    const getImage=(name)=>{
        return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
      }
    const [sourceFondFour,setSourceFondFour]=useState(null)

    useEffect(()=>{
        if(sourceFondFour==null) setSourceFondFour(getImage('Jeu5/FondFour'))
        
    },[])

    const styles = StyleSheet.create({
        fours: {
            position:"absolute",
            width:"90%",
            height:0.428*screenWidth,
            flexDirection:"row",
            justifyContent:"space-between",
            top:"15%",
            // backgroundColor:"yellow"
        },
        fond: {
            position: "absolute",
            width: "100%",
            height: "100%",
            resizeMode: "contain"
          }
    })


    const renderFours=()=>{
        var components =[]
        for(let i=0;i<3;i++){
            components.push(
                <Four
                    key={i}
                    numero={numerosFours[i]}
                    largeur={largeur}
                    screenWidth={screenWidth}
                    screenHeight={screenHeight}
                    opacity={opacity}
                />  
            )
        }
        return components
    }

    return (
        <View
            style={[
                styles.fours,
                {
                    opacity:1
                }

            ]}
        >
            <Image
                style={styles.fond}
                source={sourceFondFour}
            />
            {renderFours()}
          
        </View>

    )
}

export default Fours
