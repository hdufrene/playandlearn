import React, { useEffect, useState, useRef } from 'react';
import { AppState, StatusBar, Text, Alert, View, BackHandler, Switch, TouchableWithoutFeedback, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Linking, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import GlobalStyle from '../styles/globalStyle'
import ConnexionManager from '../connexion/ConnexionManager'
import * as ScreenOrientation from 'expo-screen-orientation';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function JeuxSI({ navigation }) {
  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }
  const sourceCoulis = getImage('SI/Coulis')
  const sourceFond = getImage('Accueil/PremierePage_FondGaufrette_010')
  const sourceEtiquette = getImage('SI/Etiquette')

  const sourceAnglais = getImage('Accueil/Anglais')
  const sourceAnglaisGris = getImage('Accueil/AnglaisGris')
  const sourceFrancais = getImage('Accueil/Francais')
  const sourceFrancaisGris = getImage('Accueil/FrancaisGris')
  const opacityAnglais = useRef(new Animated.Value(0)).current

  const [anglais, setAnglais] = useState(false)


  // const [appState,setAppState]=useState(AppState.currentState)

  // useEffect(()=>{
  //   AppState.addEventListener('change', handleAppStateChange);
  // })

  // const handleAppStateChange = (nextAppState) => {
  //   if (appState.match(/active/) && (nextAppState === 'inactive' || nextAppState === 'background')) {
  //     navigation.navigate('Univers')
  //   }
  //   setAppState(nextAppState);
  // }




  const toggleSwitch = (value) => {
    setAnglais(value)
    const duration = 300
    const animate = (tovalue) => {
      Animated.timing(opacityAnglais, {
        toValue: tovalue,
        duration: duration,
        useNativeDriver: false,

      }).start()
    }
    if (value) {
      animate(1)
    } else {
      animate(0)
    }
  }


  const oppositeOpacity = (value) => {
    return value.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    })
  }



  const renderSwitch = () => {


    return (
      <View
        style={{
          position: "absolute",
          bottom: "3%",
          // left: "5%",
          width: "40%",
          height: "15%",
          // backgroundColor:"red",
          flexDirection: "row"
        }}
      >

        <View
          style={styles.imagePaysContainer}>

          <TouchableWithoutFeedback
            onPress={() => toggleSwitch(false)}
          >
            <View
              style={[styles.imagePays, {
              }]}>
              <Animated.Image
                source={sourceFrancais}
                style={[styles.imagePays, {
                  opacity: oppositeOpacity(opacityAnglais)
                }]}
              />


              <Animated.Image
                source={sourceFrancaisGris}
                style={[styles.imagePays, {
                  opacity: opacityAnglais
                }]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>

        <Switch
          trackColor={{ false: "#DFDFDF", true: "#DFDFDF" }}
          thumbColor={"#9C9C9C"}
          ios_backgroundColor="#DFDFDF"
          onValueChange={toggleSwitch}
          value={anglais}
        />
        <View
          style={styles.imagePaysContainer}>
          <TouchableWithoutFeedback
            onPress={() => toggleSwitch(true)}
          >
            <View
              style={[styles.imagePays, {
              }]}>
              <Animated.Image
                source={sourceAnglais}
                style={[styles.imagePays, {
                  opacity: opacityAnglais
                }]}
              />
              <Animated.Image
                source={sourceAnglaisGris}
                style={[styles.imagePays, {
                  opacity: oppositeOpacity(opacityAnglais)
                }]}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>

    )

  }

  const [isLoading, setIsLoading] = useState(false)

  const [sourcesGateaux,setSourcesGateaux] = useState([
    getImage('SI/Gateau1'),
    getImage('SI/Gateau2'),
    getImage('SI/Gateau3'),
    getImage('SI/Gateau4'),
    getImage('SI/Gateau5')
  ])


  const sourcesEtiquettes = [
    getImage('SI/EtiquetteSI1'),
    getImage('SI/EtiquetteSI2'),
    getImage('SI/EtiquetteSI3'),
    getImage('SI/EtiquetteSI4'),
    getImage('SI/EtiquetteSI5')
  ]
  const sourcesEtiquettesEng = [
    getImage('SI/EtiquetteSI1Eng'),
    getImage('SI/EtiquetteSI2Eng'),
    getImage('SI/EtiquetteSI3Eng'),
    getImage('SI/EtiquetteSI4Eng'),
    getImage('SI/EtiquetteSI5Eng')
  ]
  // getImage('SI/EtiquetteSI2'),
  // getImage('SI/EtiquetteSI3'),
  // getImage('SI/EtiquetteSI4'),
  // getImage('SI/EtiquetteSI5')]

  const sourceLivre = getImage('Accueil/Livre')
  const sourceVideo = getImage('Accueil/Video')
  const nomsJeux = [
    "",
    "",
    "Train",
    "Datacrush",
    "Quiz"
  ]

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        setTimeout(() => {
          navigation.navigate('Univers', { idUser: navigation.getParam('idUser') })

        }, 100);
      }
    );
    return () => backHandler.remove()
  }, [])

  const pressHandler = async (numJeu) => { // COMPTA
    console.log(numJeu + " CLiqué")
    const idUser = navigation.getParam('idUser')
    console.log(idUser)
    // if (numJeu == 6 || numJeu == 7 || numJeu == 8 || numJeu==10) {
    var niveau = await AsyncStorage.getItem('niveau' + numJeu)
    if (niveau == null) {
      niveau = 1
    }
    if (niveau > 4) {
      niveau = 4
    }
    const connManager = new ConnexionManager()
    const data = {
      idUser: idUser,
      numJeu: numJeu
    }
    if (connManager.getStatus()) {
      setIsLoading(true)

      const response = await connManager.postData(

        {
          type: 'getContenusJeux',
          data: data
        }

      )
      const json = await response.json()
      console.log("Données Jeu " + numJeu + " : récupérées")
      console.log("ID USER " + idUser)

      var bestScore = JSON.parse(await AsyncStorage.getItem("bestScore" + numJeu))

      if (json.bestScore != null) {
        bestScore = Math.max(bestScore, json.bestScore)
      }

      console.log("Best Score Jeu " + numJeu + " : " + bestScore)
      console.log("Niveau Jeu " + numJeu + " : " + niveau)
      await AsyncStorage.setItem("bestScore" + numJeu, JSON.stringify(bestScore))
      try{
        await ScreenOrientation.unlockAsync()
      } catch (error) {
      }
      if (numJeu == 7 || numJeu == 8 || numJeu == 9 || numJeu == 10) {
        await ScreenOrientation.unlockAsync()
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      } else {
        await ScreenOrientation.unlockAsync()
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
      }
     
      
      setTimeout(() => {
        navigation.navigate('Jeu' + numJeu, {
          questions: json.questions,
          bestScore: bestScore,
          niveau: niveau,
          idUser: idUser,
          anglais: anglais
        })
        setTimeout(() => {
          setIsLoading(false)
        }, 1000);
      }, 1500)

      // }

    } else {
      setIsLoading(false)
      Alert.alert("Absence de connexion", "Veuillez activer votre connexion internet pour continuer.")
    }
  }
  const renderLigne = (ligne, indices) => {
    var elements = []
    indices.forEach((item, i) => {




      elements.push(<TouchableOpacity
        key={item}
        onPress={() => pressHandler(5 + item)}
        style={styles.gateau}>

        <View
          style={{
            position: "absolute",
            flex: 1,
            width: "70%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor:"yellow"
          }}>

          <Image
            onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
            fadeDuration={0}
            style={{
              position: "absolute",
              flex: 1,
              width: "100%",
              height: "100%",
              // top: 0,
              resizeMode: "contain",
              // backgroundColor:"pink"
            }}
            source={sourcesGateaux[item - 1]} />


          {
            sourcesEtiquettes[item - 1] != null && sourcesEtiquettesEng[item - 1] != null ?
              <>
                <Image
                  onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
                  fadeDuration={0}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                    bottom: "-30%",
                    maxWidth:180,

                  }}
                  source={anglais ? sourcesEtiquettesEng[item - 1] : sourcesEtiquettes[item - 1]} />

              </>
              :

              <>
                <Image
                  onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
                  fadeDuration={0}
                  style={{
                    position: "absolute",
                    width: "100%",
                    // height:"100%",
                    resizeMode: "contain",
                    bottom: 0,
                    opacity: 0.5,
                    // backgroundColor:"red"

                  }}
                  source={sourceEtiquette} />
                <Text
                  style={{
                    position: "absolute",
                    width: "70%",
                    textAlign: "center",
                    fontFamily: "HELVETICACOMP",
                    fontSize: 20,
                    lineHeight: 23,
                    color: "red",
                    bottom: "20%",

                  }}
                >{nomsJeux[item - 1]}</Text>
              </>
          }

        </View>
      </TouchableOpacity>
      )
    });



    return (
      <View style={[styles.ligne, { top: 20 * ligne + "%" }]}>
        {elements}

      </View>
    )
  }

  const analyseOrientation = async()=>{
    console.log("analyse orientation")
    const current = await ScreenOrientation.getOrientationLockAsync()
    if(current !== ScreenOrientation.OrientationLock.PORTRAIT_UP && !isLoading){
      await ScreenOrientation.unlockAsync()
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    }
  }
  
  useEffect(()=>{
    analyseOrientation()
  },[sourcesGateaux])

  const renderGateaux = () => {
    return (
      <>
        {renderLigne(1, [1, 2])}
        {renderLigne(2, [3])}
        {renderLigne(3, [4, 5])}
      </>
    )

  }
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [countImagesLoaded, setCountImagesLoaded] = useState(0)

  useEffect(() => {
    if (countImagesLoaded >= 12) {
      setIsImageLoaded(true)
    }
  }, [countImagesLoaded])

  return (

    <>
      <StatusBar hidden />
      <ActivityIndicator
        size="large" color="#541E06"
        style={[GlobalStyle.container, { display: isImageLoaded || !isLoading ? "none" : "flex", zIndex: 0 }]} />
      <View style={[GlobalStyle.container, { opacity: isImageLoaded && !isLoading ? 1 : 0 }]}>

        <Image
          onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
          fadeDuration={0}
          style={GlobalStyle.fond}
          source={sourceFond}
        />

        <Image
          onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
          fadeDuration={0}
          style={GlobalStyle.coulis}
          source={sourceCoulis}
        />
        {renderGateaux()}

        <View
          style={{
            position: "absolute",
            top: "5%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            ellipsizeMode="middle"
            style={GlobalStyle.titre}
          >{anglais ? "Information systems" : "Système d'Information"}</Text>
        </View>
        <TouchableOpacity title="" onPress={() => { Linking.openURL('https://librairie.studyrama.com/produit/4555/9782759042371/le-systeme-d-information-avec-alice') }} style={{
          position: "absolute",
          bottom: "3%",
          left: "3%",
          width: "20%",
          height: "15%",
          maxWidth:120,

        }}>
          <Image
            source={sourceLivre}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              // backgroundColor:"yellow",

            }}
          />
        </TouchableOpacity>
        {renderSwitch()}
        <TouchableOpacity title="" onPress={() => { Linking.openURL('https://www.youtube.com/watch?v=W80OAZ75j2k&list=PLRSqS0lB_rOhywZrfZqudQzc8wQZ8gA0K&index=5') }} style={{
          position: "absolute",
          bottom: "3%",
          right: "3%",
          width: "20%",
          height: "15%",
          maxWidth:120,

        }}>
          <Image
            source={sourceVideo}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              resizeMode: "contain",

            }}
          />
        </TouchableOpacity>
      </View>
    </>
  );

}

const styles = StyleSheet.create({
  gateau: {
    position: "relative",
    flex: 1,
    height: "100%",
    maxWidth: "50%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    // backgroundColor:"green"
  },
  ligne: {
    flexDirection: "row",
    position: "absolute",
    width: "90%",
    height: "20%",
    alignItems: "center",
    justifyContent: "center"
  },
  imagePaysContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent:"center",
    alignItems:"center",
  },
  imagePays: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    maxWidth:80,

  }

})
