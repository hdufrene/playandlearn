import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyle from '../styles/globalStyle'
import * as ScreenOrientation from 'expo-screen-orientation';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();


export default function Home({ navigation }) {

  const screenWidth = (Dimensions.get('screen').width)
  const screenHeight = (Dimensions.get('screen').height)

  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }
  const sourceCoulis = getImage('Accueil/Coulis')

  const sourceFond = getImage('Accueil/PremierePage_FondGaufrette_010')
  const sourceAlice = getImage('Accueil/PremierePage_Alice_010')

  const [essca, setEssca] = useState("")

  useEffect(() => {
    // AsyncStorage.removeItem('bestScore1')
    // AsyncStorage.removeItem('user')
    getData()
  }, [essca])

  const pressHandler = async (essca) => {
    console.log('Clic : ' + essca)
    if (essca) {
      console.log("clic essca")
      await navigation.navigate("Connexion")

    } else {
      console.log("clic non essca")

      await AsyncStorage.setItem('user', JSON.stringify({ idUser: -1 }))
      await setScores()
      await navigation.navigate("Univers", { idUser: -1 })
    }
  }

  const setScores = async () => {
    for (let i = 1; i < 11; i++) {
      await AsyncStorage.setItem('bestScore' + 1, JSON.stringify(0))
    }
  }

  const getData = async () => {
    try {
      console.log('HOME : Récupération des données locales ')
      const user = await AsyncStorage.getItem('user')
      console.log("USER : " + user)


      if (user != null) {
        const idUser = await JSON.parse(user).idUser
        console.log("ID USER : " + idUser)
        console.log("HOME : DIRECTION UNIVERS")
        navigation.navigate('Univers', { idUser: idUser })
      }


    } catch (error) {
      console.log(error)
    }
  }


  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [countImagesLoaded, setCountImagesLoaded] = useState(0)

  useEffect(() => {
    if (countImagesLoaded >= 2) {
      setIsImageLoaded(true)
    }
  }, [countImagesLoaded])

  return (
    <>
      <StatusBar hidden />
      <ActivityIndicator
        size="large" color="#541E06"
        style={[GlobalStyle.container, { display: isImageLoaded ? "none" : "flex", zIndex: 0 }]} />

      <View style={[GlobalStyle.container, { opacity: isImageLoaded ? 1 : 0 }]}>





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
        <TouchableOpacity
          onPress={() => pressHandler(true)}
          style={[GlobalStyle.champConnexion,
          {
            position: "absolute",
            top: "40%",
            width: "50%",
            alignItems: 'center',
            justifyContent: 'center'
          }]}
        >

          <Text style={GlobalStyle.btn}>J'étudie à l'ESSCA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => pressHandler(false)}
          style={[GlobalStyle.champConnexion,
          {
            position: "absolute",
            top: "60%",
            width: "50%",
            alignItems: 'center',
            justifyContent: 'center'
          }]}
        >

          <Text style={GlobalStyle.btn}>Je n'étudie pas à l'ESSCA</Text>
        </TouchableOpacity>
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
          >Connexion</Text>
        </View>
      </View>
    </>
  );

}
