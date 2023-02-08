import React, { useEffect, useState, useLayoutEffect } from 'react';
import { AppState, StatusBar, Text, View, Alert, TouchableOpacity, Image, StyleSheet, BackHandler, ActivityIndicator, Dimensions, Linking } from 'react-native';
import GlobalStyle from '../styles/globalStyle'
import AsyncStorage from '@react-native-async-storage/async-storage'

import ConnexionManager from '../connexion/ConnexionManager'
import * as ScreenOrientation from 'expo-screen-orientation';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();


export default function JeuxCompta({ navigation }) {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('screen').width)
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('screen').height)
  const [isLoading, setIsLoading] = useState(false)

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

  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }
  const sourceCoulis = getImage('Compta/Coulis')
  const sourceFond = getImage('Accueil/PremierePage_FondGaufrette_010')
  const sourceEtiquette = getImage('Compta/Etiquette')


  const [sourcesGateaux, setSourcesGateaux] = useState([
    getImage('Compta/Gateau1'),
    getImage('Compta/Gateau2'),
    getImage('Compta/Gateau3'),
    getImage('Compta/Gateau4'),
    getImage('Compta/Gateau5')
  ])

  const sourcesEtiquettes = [
    getImage('Compta/EtiquetteCompta1'),
    getImage('Compta/EtiquetteCompta2'),
    getImage('Compta/EtiquetteCompta3'),
    getImage('Compta/EtiquetteCompta4'),
    getImage('Compta/EtiquetteCompta5')
  ]

  const sourceLivre = getImage('Accueil/Livre')
  const sourceVideo = getImage('Accueil/Video')

  const nomsJeux = [
    "L'attaque des cupcakes",
    "Quiz",
    "Panique au PCG",
    "Balance ton écriture",
    "Belle brioche"
  ]




  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        console.log('Retour')
        setTimeout(() => {
          navigation.navigate('Univers', { idUser: navigation.getParam('idUser') })
        }, 100);
      }
    );
    return () => backHandler.remove()
  }, [])
  
  const analyseOrientation = async()=>{
    console.log("analyse orientation")
    const current = await ScreenOrientation.getOrientationLockAsync()
    if(current !== ScreenOrientation.OrientationLock.PORTRAIT_UP && !isLoading){
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    }
  }
  
  useEffect(()=>{
    analyseOrientation()
  },[sourcesGateaux])

  const pressHandler = async (numJeu) => { // COMPTA

    console.log(numJeu + " CLiqué")
    const idUser = navigation.getParam('idUser')

    // if (numJeu == 1 || numJeu == 3 || numJeu == 4 || numJeu == 5) {
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
      if (numJeu == 2 || numJeu == 3 || numJeu == 5) {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE)
      } else {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
      }
      setTimeout(() => {
        navigation.navigate('Jeu' + numJeu, {
          questions: json.questions,
          bestScore: bestScore,
          niveau: niveau,
          idUser: idUser
        })
        setTimeout(() => {
          setIsLoading(false)
        }, 1000);


      }, 1500)





      console.log('Ouverture du ' + 'Jeu' + numJeu + " !!!")

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
        onPress={() => pressHandler(item)}
        style={styles.gateau}>


        <View
          style={{
            position: "absolute",
            flex: 1,
            width: "70%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
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
              resizeMode: "contain"
            }}
            source={sourcesGateaux[item - 1]} />

          {
            sourcesEtiquettes[item - 1] != null ?

              <Image
                onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
                fadeDuration={0}
                style={{
                  position: "absolute",
                  width: "100%",
                  maxWidth:180,
                  height: "100%",
                  resizeMode: "contain",
                  bottom: "-30%",
                  // backgroundColor:"pink"

                }}
                source={sourcesEtiquettes[item - 1]} />

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
          style={[GlobalStyle.fond]}
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
          >Compta</Text>
        </View>
        <TouchableOpacity title="" onPress={() => { Linking.openURL('https://librairie.studyrama.com/produit/4546/9782759042388/la-compta-avec-alice-c-est-du-gateau') }} style={{
          position: "absolute",
          bottom: "3%",
          left: "5%",
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

            }}
          />
        </TouchableOpacity>
        <TouchableOpacity title="" onPress={() => { Linking.openURL('https://www.youtube.com/watch?v=y7O8rT1Y1V8&list=PLRSqS0lB_rOhywZrfZqudQzc8wQZ8gA0K') }} style={{
          position: "absolute",
          bottom: "3%",
          right: "5%",
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
  },
  ligne: {
    flexDirection: "row",
    position: "absolute",
    width: "90%",
    height: "20%",
    alignItems: "center",
    justifyContent: "center"
  }

})
