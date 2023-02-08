import React, { useState,useEffect } from 'react';

import { StyleSheet, Text, View, Image,Animated } from 'react-native';

const Four = ({
    numero,
    // statut,
    largeur,
    screenHeight,
    screenWidth,
    opacity
    // opacity11,
    // opacity12

}) => {
    const getImage=(name)=>{
        return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
      }

    const [sourceCadre,setSourceCadre]=useState(null)
    const [sourceTelecommande,setSourceTelecommande]=useState(null)

    const [sources,setSources] =useState([
        [
            null,
            null,
            null,
            null,
            null
        ],
        [
            null,
            null,
            null,
            null,
            null
        ],
        [
            null,
            null,
            null,
            null,
            null
        ],
        
    ])

    useEffect(()=>{
        if(sourceCadre==null || sourceTelecommande==null || sources==null){
            setSourceCadre(getImage('Jeu5/CadreFour'))
            setSourceTelecommande(getImage('Jeu5/Telecommande'))
            setSources([
                [
                    getImage('Jeu5/Four1Ferme'),
                    getImage('Jeu5/Four1Ouvert'),
                    getImage('Jeu5/Four1Normal'),
                    getImage('Jeu5/Four1Cuit'),
                    getImage('Jeu5/Four1Crame')
                ],
                [
                    getImage('Jeu5/Four2Ferme'),
                    getImage('Jeu5/Four2Ouvert'),
                    getImage('Jeu5/Four2Normal'),
                    getImage('Jeu5/Four2Cuit'),
                    getImage('Jeu5/Four2Crame')
                ],
                [
                    getImage('Jeu5/Four3Ferme'),
                    getImage('Jeu5/Four3Ouvert'),
                    getImage('Jeu5/Four3Normal'),
                    getImage('Jeu5/Four3Cuit'),
                    getImage('Jeu5/Four3Crame')
                ]
            ])
        }
        
    },[])

    const titles = [
        "Trésorerie",
        "Résultat",
        "Trésorerie et résultat"
    ]
    const styles = StyleSheet.create({
        four: {
            position:'relative',
            height: "70%",
            flex:1,
            justifyContent:"flex-end",
            alignItems:"center",
            // backgroundColor:"purple"
        },
        cadreFour:{
            position:"absolute",
            height: "90%",
            width: "85%",
            right:"2.5%",
            resizeMode: "contain",
            justifyContent:"center",
            alignItems:"center"
        },
        telecommande:{
            position:"absolute",
            height: "50%",
            width: "10%",
            left:"2.5%",
            bottom:"5%",
            resizeMode: "contain",
        },
        imageCadre: {
            position: "absolute",
            height: "100%",
            width: "100%",
            resizeMode: "contain",
        },
        imageFour: {
            position:"absolute",
            height: 100+"%",
            width: 396/500/665*750*100+"%",
            resizeMode: "contain",
            bottom:0
        },

        labelContainer:{
            position: "absolute",
            top: "-8%",
            width: "90%",
            backgroundColor: "#303030",
            height: "20%",
            borderRadius: 10,
            justifyContent:"center",
            alignItems:"center",
            shadowColor: "black",
            shadowOffset: {
                width: 3,
                height:1,
            },
            borderColor:"#CCCCCC",
            borderWidth:1,
            shadowOpacity: 1,
            elevation:10,
            shadowRadius: 1,
        },
        label: {
            textAlign: "center",
            fontSize: 22,
            color: "white",
            fontFamily:'HELVETICACOMP',
            
            textShadowColor :"black",
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 3,
            paddingLeft:5,
            paddingRight:5
        }
    })

    const renderImages = () => {
        var components = []
        for (let i = 0; i < sources[numero].length; i++) {
            // console.log(getOpacity(i))
            components.push(
                <Animated.View
                key={i}
                style={[
                    styles.cadreFour,
                    {
                        opacity: opacity[numero][i]
                    }
                ]}>
                 <Image
                    style={styles.imageCadre}
                    source={sourceCadre}
                />
                <Image
                    fadeDuration={0}
                    source={sources[numero][i]}
                    style={[
                        styles.imageFour

                    ]}
                />
                </Animated.View>
            )
        }
        return components
    }

    return (
        <View
            style={styles.four}
        >   
            <Image
                style={styles.telecommande}
                source={sourceTelecommande}
            />
           
            {renderImages()}
            <View
                style={styles.labelContainer}
            >
                <Text

adjustsFontSizeToFit={true}
ellipsizeMode={"tail"}
numberOfLines={1}
                    style={styles.label}
                >
                    {titles[numero]}
                </Text>
            </View>


        </View>

    )
}

export default Four
