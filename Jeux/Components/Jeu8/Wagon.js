import React,{useState,useEffect} from 'react';

import { StyleSheet, Text, View, Image, BackHandler } from 'react-native';

const Wagon = ({
    question,
    num,
    maxNum,
    anglais,
    screenWidth,
    largeurSac
}) => {

    const getImage=(name)=>{
        return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
      }
    const [sourceLoco,setSourceLoco]=useState(null) 
    const [sourceWagon,setSourceWagon]= useState(null)
    const [sourceWagonFin,setSourceWagonFin]= useState(null)
    const [sourceSac,setSourceSac]= useState(null)

    useEffect(()=>{
        if(sourceLoco==null || sourceWagon==null || sourceWagonFin==null || sourceSac==null){
            setSourceLoco(getImage("Jeu8/Locomotive"))
            setSourceWagon(getImage('Jeu8/Wagon'))
            setSourceWagonFin(getImage('Jeu8/WagonFin'))
            setSourceSac(getImage('Jeu8/Sac'))
        }
      },[])


    const styles = StyleSheet.create({
        wagonContainer: {
            position: "relative",
            width: screenWidth/4,
            height: screenWidth*190/300/4,
            // justifyContent:"center",
            alignItems: "center",
            // backgroundColor:"blue"
        },
        imageWagon: {
            width: "100%",
            height: "100%",
            // backgroundColor:"purple",
            resizeMode: "contain",

        },
        imageLoco: {
            // top: -loco + 112 + "%",
            width: "100%",
            height: "100%",
            // height: loco + "%",
            resizeMode: "contain",
            // backgroundColor:"yellow"
        },
        sacContainer: {
            position: "absolute",
            // backgroundColor:"yellow",
            bottom:56/190*screenWidth*190/300/4,
            height:largeurSac * 183 / 512* 0.8,
            width: largeurSac* 0.8,
            left: screenWidth/4*0.08,
            // opacity: 1,
            justifyContent: "center",
            alignItems: "center"
        },
        imageSac: {
            position: "absolute",
            width: largeurSac* 0.8,
            height: largeurSac * 183 / 512* 0.8,
            resizeMode: "contain"
        },
        libelle: {
            position: "absolute",
            fontSize: 22,
            // lineHeight:23,
            // backgroundColor:"purple",
            left: "30%",
            
            textAlign: "center",
            textAlign: "center",
                fontFamily:"HELVETICACOMP",
                color:"#401800",
                fontSize: 22,
                left: 181 / 512 * 100 + "%",
                width: (1 - (30 + 181) / 512) * 100 + "%",
        },
        libelleLoco: {
            fontSize: 28,
            // lineHeight:28,
            color: "#F1F1F3",
            textAlign: "center",
            fontFamily:"HELVETICACOMP",
            width: "95%",

            textShadowColor :"black",
            textShadowOffset: {width: 1, height: 1},
            textShadowRadius: 3,
            // backgroundColor:"red"

        }
    })



    return (
        <View
            style={styles.wagonContainer}
        >
            {num > 0 && maxNum!=num ?


                <>





                    <Image

                        style={styles.imageWagon}
                        source={sourceWagon}
                    />

                    <View
                        style={styles.sacContainer}
                    >
                        {question != null ?
                        <>
                            <Image
                                style={styles.imageSac}
                                source={sourceSac}
                            />
                            <Text
                             ellipsizeMode="middle"
                             numberOfLines={2}
                             adjustsFontSizeToFit
                            style={styles.libelle}
                        >
                            {anglais ? question.libelleEtapeEng : question.libelleEtape}
                        </Text>
                        </>
                            : null

                        }


                        


                    </View>



                </>
                :

                <>

                    <Image

                        style={styles.imageLoco}
                        source={num==0 ? sourceLoco : sourceWagonFin}
                    />


                    <View
                        style={{
                            position: "absolute",
                            top: num!=maxNum ? "25%" : "31%",
                            left: num!=maxNum ? "10%" : null,
                            width:num!=maxNum ? "52%" : "52%",
                            height:num!=maxNum ? "42%" : "30%",
                            justifyContent: "center",
                            alignItems: "center",
                            // backgroundColor:"purple"
                        }}
                    >


                        <Text
                            ellipsizeMode="middle"
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            style={
                                styles.libelleLoco
                            }
                        >
                            {anglais ? question.libelleEtapeEng : question.libelleEtape}
                        </Text>

                    </View>

                </>
            }
        </View>
    )
}

export default Wagon
