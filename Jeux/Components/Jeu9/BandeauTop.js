import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback, Animated } from 'react-native';

const BandeauTop = ({
    score,
    niveau,
    vies,
    anglais
}) => {

    const getImage = (name) => {
        return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
    }
    const [sourceCoeur, setSourceCoeur] = useState(null)
    const [sources,setSources] = useState(null)
    const dtype = anglais ? ["data", "information", "knowledge"] : ["donnée", "information", "connaissance"]

    useEffect(() => {
        if (sourceCoeur == null) {
            setSourceCoeur(getImage("Coeur"))
        }
        if(sources==null){
            setSources([getImage('Jeu9/Oeuf'), getImage('Jeu9/Beurre'), getImage('Jeu9/Chocolat')])
        }
    }, [sourceCoeur,sources])

    const renderVies = () => {

        var components = []



        for (let i = 1; i < 5; i++) {
            var opacity = 1
            if (5 - i > vies) {
                opacity = 0
            }
            components.push(
                <Image
                    key={i}
                    style={[styles.coeur, { opacity: opacity }]}
                    source={sourceCoeur} />
            )
        }
        return (
            <View style={styles.coeurs}>
            {components}
            </View>
            )
    }

    const renderLegendes = () => {
        var components = []
        if(sources!=null){
            sources.forEach((source,index) => {
                components.push(
                    <View
                        key={index}
                        style={
                            styles.legende
                        }>
                        <Image
                            source={source}
                            style={styles.imageLegende}
                        />
                        <Text 
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={styles.texteLegende}
                        >{dtype[index]}</Text>
    
                    </View>
                )
            });
        }
        
        return (
            <View
                style={styles.legendes}>
            {components}
            </View>
            )
    }

    return (
        <View
            style={styles.panneau}>
            
            {renderLegendes()}

            <View 
                style={styles.infos}
                >
                <Text style={styles.ecriturePanneau}>Score : {score}</Text>
                <Text style={styles.ecriturePanneau}>{anglais ? "Level": "Niv. "} :  {niveau}</Text>
            </View>
            {renderVies()}
        </View>
    )

}

const styles = StyleSheet.create({
    panneau: {
        width: "100%",
        height: "20%",
        backgroundColor: "#2D2D2D",
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        elevation: 10,
        marginBottom: "0%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection:"row"

    },
    ecriturePanneau: {
        color: "white",
        textAlign: "center",
        fontSize: 24,
        fontFamily:'HELVETICACOMP',
        textAlign:"center",
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4
    },
    coeurs:{
        position:"absolute",
        left:"75%",
        // backgroundColor:"red",
        width:"13%",
        height:"80%",
        flexDirection:"row"
    },
    coeur: {
        flex: 1,
        position: "relative",
        resizeMode: "contain",
        width: "100%",
        height: "100%"
    },
    legendes:{
        position:"absolute",
        width:"45%",
        height:"100%",
        // backgroundColor:"red",
        left:"2%",
        alignItems:"center",
        flexDirection:"row"
    },
    legende:{
        flex:1,
        height:"80%",
        width:"100%",
        alignItems:"center",
        justifyContent:"center"
    },
    imageLegende:{
        flex:1,
        width:"100%",
        height:"100%",
        resizeMode:"contain"
    },
    texteLegende:{
        flex:1,
        // width:"100%",
        // backgroundColor:"pink",
        fontSize: 24,
        fontFamily:'HELVETICACOMP',
        textAlign:"center",
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 4,
        textAlign:"center",
        color:"white"
    },
    infos:{
        position:"absolute",
        left:"55%",
        width:"15%",
        height:"90%",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center",
        // backgroundColor:"green"
    }
})

export default BandeauTop