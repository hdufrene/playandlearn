import React,{useState,useEffect} from 'react';

import { StyleSheet, Text, View, Image, BackHandler,Animated} from 'react-native';
import Wagon from './Wagon';
const Train = ({
    wagons,
    left,
    maxNum,
    anglais,
    screenWidth,
    screenHeight,
    largeurSac
}) => {
    
   
    // console.log(screenWidth,screenh)
    const styles = StyleSheet.create({
        trainContainer: {
            // backgroundColor: "red",
            top:-(781/2-556)*screenWidth/1000-screenWidth*190/300/4/2,
            width:"100%",
            // height:190/300*100+"%",
            flexDirection:"row",
            alignItems:"flex-end",
        }
    })
    // 
    const renderWagons=()=>{
        var components=[]
        wagons.forEach((element,index) => {
            components.push(
                <Wagon
                    key={index}
                    question={element}
                    num={index}
                    maxNum={maxNum}
                    anglais={anglais}
                    screenWidth={screenWidth}
                    largeurSac={largeurSac}
                />
            )
        });
        return components
    }
    const nbWagons = 2
    return (
        <Animated.View
            style={[
                styles.trainContainer
                ,{
                    left:left
                }
            ]}
        >
           {renderWagons()}


        </Animated.View>

    )
}

export default Train
