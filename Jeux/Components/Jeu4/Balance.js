import React,{useEffect,useState} from 'react';
import { Animated, StyleSheet, Text, View, Image } from 'react-native';

const Balance = ({
  yGauche,
  yDroite,
  largeurReponse,
  hauteurReponse,
  screenWidth,
  screenHeight,
  libLeft,
  libRight,
  longueurBarre,
  rotation,
  rapportPerspective,
  rotationPlateauG,
  rotationPlateauD,
  translateXCartonG1,
  translateXCartonG2,
  translateXCartonD1,
  translateXCartonD2,
  translateYCartonG1,
  translateYCartonG2,
  translateYCartonD1,
  translateYCartonD2
}) => {
  const epaisseur = largeurReponse * 1.2 * 173/500
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  const [sourcePlateau,setSourcePlateau]=useState(null)
  const [sourcePied,setSourcePied]=useState(null)
  const [sourceComptoir,setSourceComptoir]=useState(null)
  const [sourceCarton,setSourceCarton]=useState(null)

  useEffect(()=>{
    if(sourcePlateau==null || sourcePied==null || sourceComptoir==null || sourceCarton==null){
      setSourcePlateau(getImage('Jeu4/Co04_BalancePlateau_02'))
      setSourcePied(getImage('Jeu4/Co04_BalancePied_01'))
      setSourceComptoir(getImage('Jeu4/Co04_Comptoir_01'))
      setSourceCarton(getImage('Jeu4/Co04_Carton_05'))
    }
    
  },[])

  const hauteurPied = ( hauteurReponse + 37/173 * largeurReponse* 1.2) 
  const epaisseurBarre = 8

  const styles = StyleSheet.create({
    reponse: {
      width: largeurReponse,
      height: hauteurReponse,
      justifyContent: "center",
      alignItems: "center",
      left: largeurReponse * 0.1,
      paddingTop: rapportPerspective * hauteurReponse,

    },
    reponseImage: {
      position: "absolute",
      width: largeurReponse,
      height: hauteurReponse,
      resizeMode: "contain",
    },
    textReponse: {
      fontSize: 20,
      color: "#3F0F00",
      textAlign: "center",
      fontFamily: 'HELVETICACOMP',    

    },
    plateau: {
      position: "absolute",
      bottom: 0,
      // backgroundColor:"purple",
      width: "100%",
      resizeMode: "contain",
      height: epaisseur*1.05,
      zIndex:2
    },
    pied: {
      position: "absolute",
      top: hauteurReponse+ epaisseur + hauteurReponse * 2-0.19186 *epaisseur-hauteurPied* (1.08050-1),
      height: hauteurPied,
      // backgroundColor:"purple",
      width: "100%",
      resizeMode: "contain",
    },
    barre: {
      position: "absolute",
      height: epaisseurBarre,
      top: hauteurReponse+ epaisseur + hauteurReponse * 2-0.19186 *epaisseur-hauteurPied* (1.08050-1)+ epaisseurBarre / 2,
      // bottom: hauteurPied / 1.08050 - epaisseurBarre / 2,
      backgroundColor: "#95A4B1"
      // backgroundColor:"blue"
    },
    comptoir: {
      position: "absolute",
      width: screenWidth * 0.98,
      height: screenWidth * 0.98 * 0.4083,
      resizeMode: "contain",
      top:hauteurReponse+ epaisseur + hauteurReponse * 2-0.19186 *epaisseur-hauteurPied* (1.08050-1)+hauteurPied-25/490*screenWidth * 0.98/2
    }
  })

  return (
    <View style={{
      flexDirection: "column",
      position: "absolute",
      width: screenWidth,
      maxWidth:550,
      alignItems: "center",
      top: "20%",
      height: screenHeight*0.7,
      // backgroundColor:"red"
    }}>

      <Image
        source={sourceComptoir}
        style={styles.comptoir} 
      />




      <Animated.View
        style={{
          width: screenWidth*0.9<550 ? "80%" : "100%",
          height: "50%",
          // backgroundColor:"yellow",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Animated.View
          style={[styles.barre, {
            // left:leftBarre,
            width: longueurBarre,
            transform: [{ rotate: rotation }]

          }]}
        />


        <Animated.View
          style={{
            position: "absolute",
            top: yGauche,
            left: 0,
            width: largeurReponse * 1.2,
            height: epaisseur + hauteurReponse * 2,
            // opacity:0.8,
            // backgroundColor:"red",
            transform:[
            {   
              translateY: hauteurReponse/2+ (1-0.19186/2) *epaisseur
            },
            {
                rotate: rotationPlateauG
            },
            {   
              translateY: -(hauteurReponse/2+(1-0.19186/2) * epaisseur)
            },
            ]
          }}
        >
          <Animated.View style={[styles.reponse, {
            opacity: libLeft.length > 1 ? 1 : 0,
            bottom:-rapportPerspective*hauteurReponse,
            zIndex:1,
            transform:[{
              translateX:translateXCartonG2
            },{
              translateY:translateYCartonG2
            }]
          }]}>
            <Image
              source={sourceCarton}
              style={styles.reponseImage} />
             <Text 
              numberOfLines={2}
              ellipsizeMode='middle'
              adjustsFontSizeToFit
            style={styles.textReponse}>
              {libLeft.length > 1 ? libLeft[1] : ""}
              </Text>
          </Animated.View>

          <Animated.View style={[styles.reponse, {
            opacity: libLeft.length > 0 ? 1 : 0,
            // backgroundColor:"red",
            transform:[{
              translateX:translateXCartonG1
            },{
              translateY:translateYCartonG1
            }]
          }]}>
            <Image
              source={sourceCarton}
              style={styles.reponseImage} />

            <Text 
              numberOfLines={2}
              ellipsizeMode='middle'
              adjustsFontSizeToFit
            style={styles.textReponse}>
              {libLeft.length > 0 ? libLeft[0] : ""}
              </Text>
          </Animated.View>

          <Image
            source={sourcePlateau}
            style={styles.plateau}
          />
        </Animated.View>

        <Animated.View
          style={{
            position: "absolute",
            height: epaisseur + hauteurReponse * 2,
            top: yDroite,
            // top:0,
            right: 0,
            width: largeurReponse * 1.2,
            // backgroundColor:"blue",
            width: largeurReponse * 1.2,
            height: epaisseur + hauteurReponse * 2,
            // opacity:0.8,
            transform:[
            {   
              translateY: hauteurReponse/2+ (1-0.19186/2) *epaisseur
            },
            {
                rotate: rotationPlateauD
            },
            {   
              translateY: -(hauteurReponse/2+(1-0.19186/2) * epaisseur)
            },
            
            ]
          }}
        >
          <Animated.View style={[styles.reponse, {
            opacity: libRight.length > 1 ? 1 : 0,
            bottom:-rapportPerspective*hauteurReponse,
            zIndex:1,
            transform:[{
              translateX:translateXCartonD2
            },{
              translateY:translateYCartonD2
            }]
          }]}>
            <Image
              source={sourceCarton}
              style={styles.reponseImage} />
            <Text 
              numberOfLines={2}
              ellipsizeMode='middle'
              adjustsFontSizeToFit
            style={styles.textReponse}>
              {libRight.length > 1 ? libRight[1] : ""}
              </Text>
          </Animated.View>

          <Animated.View style={[styles.reponse, {
            opacity: libRight.length > 0 ? 1 : 0,
            transform:[{
              translateX:translateXCartonD1
            },{
              translateY:translateYCartonD1
            }]
          }]}>
            <Image
              source={sourceCarton}
              style={styles.reponseImage} />
            <Text 
              numberOfLines={2}
              ellipsizeMode='middle'
              adjustsFontSizeToFit
            style={styles.textReponse}>
              {libRight.length > 0 ? libRight[0] : ""}
              </Text>
          </Animated.View>


          <Image
            source={sourcePlateau}
            style={styles.plateau}

          />
        </Animated.View>



        <Image
          source={sourcePied}
          style={styles.pied} />

      </Animated.View>


    </View>
  )
}



export default Balance
