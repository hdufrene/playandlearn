import React, { useEffect, useState } from 'react';

import { StyleSheet, Text, View, Image, Animated } from 'react-native';


const Fond = ({
    num,
    opacities
}) => {
    const [sourcesGares,setSourcesGares] = useState([
        null,
        null,
        null,
        null,
        null,
    ])
    const getImage = (name) => {
        return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
      }
    
    useEffect(()=>{
        if(sourcesGares[0]==null){
            setSourcesGares([
                getImage('Jeu8/Gare1'),
                getImage('Jeu8/Gare2'),
                getImage('Jeu8/Gare3'),
                getImage('Jeu8/Gare4'),
                getImage('Jeu8/Gare5')
            ])
        }
    })
    
    const styles = StyleSheet.create({
        fond: {
            position: "absolute",
            width: "100%",
            height: "100%",
            resizeMode: "cover"
        }
    })

    const renderGares = () => {
        var components = []
        sourcesGares.forEach((source, index) => {
            components.push(
                <Animated.View
                    key={index}
                    style={[
                        styles.fond,
                        {opacity: opacities[index]}
                    ]}>
                    <Image
                        style={styles.fond}
                        source={source}
                    />
                </Animated.View>

            )
        });
        return components
    }

    return (
        <>
            {renderGares()}
        </>
    )
}

export default Fond
