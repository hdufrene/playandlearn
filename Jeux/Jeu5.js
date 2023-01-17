import React, { useRef, useEffect, useState } from 'react';
import {AppState, ActivityIndicator,Alert, StatusBar, StyleSheet, BackHandler, Text, View, Dimensions, TouchableOpacity, Animated, Easing, Image, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import Brioche from './Components/Jeu5/Brioche';
import Fours from './Components/Jeu5/Fours';
import Comptoir from './Components/Jeu5/Comptoir';
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av'
import ConnexionManager from '../connexion/ConnexionManager'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Jeu5({ navigation }) {
  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height
  // console.log([...navigation.getParam('questions')])
  const sortQuestions = (niv) => {
    const array = [...navigation.getParam('questions')].filter((value) => value.presence == 1 && value.niveau == niv)
    return array.sort(() => Math.random() - 0.5)
    // return array.filter((value, index) => index < 3)
  }

  const [appState,setAppState]=useState(AppState.currentState)

  useEffect(()=>{
    AppState.addEventListener('change', handleAppStateChange);
  })
  
  const handleAppStateChange = async(nextAppState) => {

    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      if(!isImageLoaded){
        play.current=false
        await stopSounds()
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
        navigation.navigate('Univers', { idUser: navigation.getParam('idUser') })
      }else{
        console.log("impossible de retourner en arrière pdt le chargement")
      }
    }
    if (appState.match(/active/) && (nextAppState === 'inactive' || nextAppState === 'background')) {
      setIsImageLoaded(false)
    }
    setAppState(nextAppState);
  }

  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }
  const getSound = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Sounds/' + name + '.mp3' }
  }
  const [score, setScore] = useState(0)
  const [niveau, setNiveau] = useState(1)
  const [vies, setVies] = useState(3 - niveau)
  const [questions, setQuestions] = useState(sortQuestions(niveau))

  const [idQuestion, setIdQuestion] = useState(0)
  const [question, setQuestion] = useState(questions[0])
  const [blur, setBlur] = useState(150)

  const [briocheDisabled, setBriocheDisabled] = useState(true)

  const sourceAlice1 = getImage('DebutAlice1')
  const sourceAlice2 = getImage('DebutAlice2')
  const sourceConsigne = getImage('Jeu5/Bulle')

  const [sourceAlice, setSourceAlice] = useState(sourceAlice1)
  const [bestScore, setBestScore] = useState(navigation.getParam('bestScore'))
  const sourceGagneAlice = getImage('GagneAlice')
  const sourceGagneRond = getImage('GagneRond')
  const sourceGagneCoupe = getImage('GagneCoupe')
  const sourceGagneMedaille = getImage('MedailleOr')

  const sourceGagneContinuer = getImage('GagneContinuer')
  const sourceGagneQuitter = getImage('GagneQuitter')
  const sourceGagneRejouer = getImage('GagneRejouer')

  const sourcePerduAlice = getImage('PerduAlice')
  const sourcePerduContinuer = getImage('PerduContinuer')
  const sourcePerduQuitter = getImage('PerduQuitter')
  const sourcePerduRejouer = getImage('PerduRejouer')
  const sourcePerduSplash = getImage('PerduSplash')

  // useEffect(() => {
  //   console.log(questions)
  // }, [questions])


  const styles = StyleSheet.create({
    container: {
      // flex: 1,
      position: "absolute",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center"
    },
    fond: {
      position: "absolute",
      width: "100%",
      height: "100%",
      resizeMode: "cover"
    }
  })






  // ETEINT, ALLUME, CRAME
  const sourceFond = getImage('Jeu5/FondCuisine')

  const largeurBrioche = screenWidth * 0.15
  const hauteurBrioche = largeurBrioche * 108 / 500

  const opacityBrioche = useRef(new Animated.Value(1)).current


  const [x, setX] = useState(screenWidth / 2 - largeurBrioche / 2)
  const [y, setY] = useState(screenHeight/2)


  const [numerosFours, setNumerosFours] = useState([0, 1, 2].sort(() => Math.random() - 0.5))
  const opacity = useRef([
    [new Animated.Value(1), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)],
    [new Animated.Value(1), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)],
    [new Animated.Value(1), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]
  ]).current



  const [son, setSon] = useState(null)
  const [musique, setMusique] = useState(null)
  async function playMusique(name) {
    const connManager = new ConnexionManager()
    if (connManager.getStatus()) {
      console.log('Loading Musique');
      const { sound } = await Audio.Sound.createAsync(
        getSound(name),{
          isLooping:true,
          volume:0.3
        }
      );
      setMusique(sound);

      console.log('Playing Musique');
      await sound.playAsync();
    }

  }

  async function stopSounds() {

    if (musique != null) {
      
      try {
        await musique.stopAsync();
        setMusique(null)
        console.log('Stoping Musique');
      } catch (error) {
      }
      
    }
    if (son != null) {
      try {
        await son.stopAsync();
        setSon(null)
        console.log('Stoping Son');
      } catch (error) {
      }
    }
  }

  async function playSon(name) {
    const connManager = new ConnexionManager()
    if (connManager.getStatus()) {
      console.log('Loading Son');
      const { sound } = await Audio.Sound.createAsync(
        getSound(name)
      );
      setSon(sound);

      console.log('Playing Son');
      await sound.playAsync();
    }

  }

  useEffect(() => {
    return musique
      ? () => {
        console.log('Unloading Musique');
        musique.unloadAsync();
      }
      : undefined;
  }, [musique]);

  useEffect(() => {
    return son
      ? () => {
        console.log('Unloading Son');
        son.unloadAsync();
      }
      : undefined;
  }, [son]);

  useEffect(() => {

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      async () => {
        if(isImageLoaded){
          setIsImageLoaded(false)
          play.current=false
          await stopSounds()
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
          navigation.navigate('JeuxCompta')
        }else{
          console.log("impossible de retourner en arrière pdt le chargement")
        }     

      }
    );

    return () => backHandler.remove();
  });


  const saveData = async () => {
    const idUser = navigation.getParam('idUser')
    console.log("ENREGISTREMENT DES DONNEES : id User : " + idUser)

    const data = {
      idUser: navigation.getParam('idUser'),
      numJeu: 5,
      score: score
    }

    if (idUser >= 0) {
      const connManager = new ConnexionManager()

      if (connManager.getStatus()) {
        if (score > bestScore) {
          const response = await connManager.postData(
            {
              type: 'saveScore',
              data: data
            }
          )
          const json = await response.text()

          await console.log("Score enregistré : ")
          await console.log(json)

        }
        const partie = await connManager.postData(
          {
            type: "partieJouee",
            data: data
          }
        )
      } else {

        Alert.alert("Absence de connexion", "Veuillez activer votre connexion internet pour continuer.")
        console.log("Pas d'enregistrement BDD")
      }

    } else {
      console.log("Pas d'enregistrement BDD")
    }

    if (score > bestScore) {
      AsyncStorage.setItem("bestScore5", JSON.stringify(score))
      setBestScore(score)
    }

  }



  const play = useRef(false)

  useEffect(() => {


    setNumerosFours([0, 1, 2].sort(() => Math.random() - 0.5))


  }, [idQuestion])



  const initialize = () => {
    setCartonsDisabled(true)

  }

  useEffect(() => {
    if (vies <= 0) {
      play.current = false
    }
  }, [vies])

  useEffect(() => {
    setVies(3 - niveau)
  }, [niveau])

  const launchGame = (niveau) => {
    console.log("launchGame")
    play.current = true
    setScore(0)
    setVies(3 - niveau)
    setQuestions(sortQuestions(niveau))
    setIdQuestion(0)
    if (sourceAlice.uri === sourceAlice2.uri) {
      playSon("Son_Sonnette")

      setBlur(0)
    } else {
      setSourceAlice(sourceAlice2)
      playSon("Son_Sonnette")

      setTimeout(() => {
        setBlur(0)
        setBriocheDisabled(false)
        playMusique("Musique1")
      }, 1000)
    }
    // idQuestion=0
    // setQuestions(sortQuestions(niveau))
  }

  useEffect(() => {
    if (blur > 0) {
      setBriocheDisabled(true)
    } else {
      setBriocheDisabled(false)
    }
  }, [blur])

  useEffect(() => {
    if (vies <= 0) {
      setBlur(152)
      play.current = false
    }
  }, [vies])

  const newQuestion = () => {
    console.log("new question")

    if (idQuestion < questions.length - 1 && play.current) {
      setIdQuestion(idQuestion => idQuestion + 1)
      // console.log(questions[idQuestion])
    } else {
      play.current = false

      if (vies > 0) {
        setBlur(151)
      } else {
        setBlur(152)
      }
      console.log("Plus de question diponible pour le niveau | nb questions : " + questions.length + " id question : " + idQuestion)
    }

  }

  const updateStatus = (num) => {
    var reponse = -1
    switch (questions[idQuestion].reponse) {
      case "T":
        reponse = 0
        break;

      case "R":
        reponse = 1
        break;
      case "TR":
        reponse = 2
        break;
    }


    const bonneReponse = num == reponse
    const duration = 1000

    Animated.sequence([

      Animated.parallel([
        Animated.timing(opacity[num][0], {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
          Easing: Easing.cubic
        }),
        Animated.timing(opacity[num][1], {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: false,
          Easing: Easing.cubic
        })
      ]),
      Animated.timing(opacityBrioche, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
        Easing: Easing.cubic
      }),
      Animated.parallel([
        Animated.timing(opacity[num][1], {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
          Easing: Easing.cubic
        }),
        Animated.timing(opacity[num][2], {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: false,
          Easing: Easing.cubic
        })
      ]),
      Animated.delay(400),

    ]).start(() => {
      console.log("animation terminée")

      if (bonneReponse) {
        setScore(score => score + 1)
        playSon("Son_Sonnette")
      } else {
        setVies(vies => vies - 1)
        playSon("Son_Feu")
      }

      setX(screenWidth / 2 - largeurBrioche / 2)
      setY(0.5 * screenHeight )
      
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity[num][2], {
            toValue: 0,
            duration: duration,
            useNativeDriver: false,
            Easing: Easing.cubic
          }),
          Animated.timing(opacity[num][bonneReponse ? 3 : 4], {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: false,
            Easing: Easing.cubic
          })
        ]),
        Animated.timing(opacityBrioche, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
          Easing: Easing.cubic
        })

      ])
        .start(() => {
          if (bonneReponse) {
            newQuestion()
          }

          Animated.sequence([
            Animated.delay(1000),
            Animated.parallel([
              Animated.timing(opacity[num][bonneReponse ? 3 : 4], {
                toValue: 0,
                duration: duration,
                useNativeDriver: false,
                Easing: Easing.cubic
              }),
              Animated.timing(opacity[num][0], {
                toValue: 1,
                duration: duration,
                useNativeDriver: false,
                Easing: Easing.cubic
              })
            ])

          ]).start()
        })
    })

  }


  const enfourner = (num) => {
    // setOpacityBrioche(0)

    setTimeout(() => {
      updateStatus(num)

    }, 1000);
  }


  const handleDrag = (gestureState) => {

    if (gestureState.dy < - hauteurBrioche ) {
      // console.log(screenWidth)
      // console.log(gestureState.dx )
      // console.log(screenWidth *0.9*0.33*(0.15+0.85/2)+screenWidth*0.05 -largeurBrioche/2)
      // console.log()
      if (gestureState.dx < -(screenWidth * 0.9 * 0.33 * (0.15 + 0.85 / 2) + screenWidth * 0.05) + largeurBrioche / 2) { // GAUCHE
        console.log("gauche")
        setX(screenWidth * 0.9 * 0.33 * (0.15 + 0.85 / 2) + screenWidth * 0.06 - largeurBrioche / 2)
        setY(0.8 * 0.7 * screenHeight / 2 +hauteurBrioche/2)        
        enfourner(numerosFours[0])
      }
      if (gestureState.dx > screenWidth * 0.9 * 0.33 * (0.15 + 0.85 / 2) + screenWidth * 0.05 - largeurBrioche / 2) { // DROITE
        console.log("droite")
        setX(screenWidth * 0.9 * 0.33 * (2 + 0.15 + 0.85 / 2) + screenWidth * 0.04 - largeurBrioche / 2)
        setY(0.8 * 0.7 * screenHeight / 2 +hauteurBrioche/2)
        enfourner(numerosFours[2])
      }
      if (gestureState.dx > -(screenWidth * 0.9 * 0.33 * (0.15 + 0.85 / 2) + screenWidth * 0.05) + largeurBrioche / 2 && gestureState.dx < screenWidth * 0.9 * 0.33 * (0.15 + 0.85 / 2) + screenWidth * 0.05 - largeurBrioche / 2) { // MILIEU
        console.log("milieu")
        setX(screenWidth * 0.9 * 0.33 * (1 + 0.15 + 0.85 / 2) + screenWidth * 0.05 - largeurBrioche / 2)
        setY(0.8 * 0.7 * screenHeight / 2 +hauteurBrioche/2)
        enfourner(numerosFours[1])
      }

    }
  }

  // useEffect(() => {
  //   console.log(questions)
  // }, [questions])



  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [countImagesLoaded, setCountImagesLoaded] = useState(0)

  useEffect(() => {
    if (countImagesLoaded == 3) {
      setIsImageLoaded(true)
    }
  }, [countImagesLoaded])

  return (
    <>
      <StatusBar hidden />

      <ActivityIndicator
        size="large" color="#541E06"
        style={[GlobalStyle.container, { display: isImageLoaded ? "none" : "flex", zIndex: 0 }]} />

      <View style={[styles.container, {
        opacity: isImageLoaded ? 1 : 0,
      }]}>
        <Image
          onLoad={() => {
            setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)
          }}
          source={sourceFond}
          style={styles.fond}
        />



        <Fours
          opacity={opacity}
          largeur={largeurBrioche}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          numerosFours={numerosFours}
        />

        <Comptoir
          vies={vies}
          score={score}
          niveau={niveau}
          question={questions[idQuestion]}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        />

        <Brioche
          x={x}
          y={y}
          handleDrag={handleDrag}
          largeur={largeurBrioche}
          hauteur={hauteurBrioche}
          opacity={opacityBrioche}
          briocheDisabled={briocheDisabled}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
        />
        {blur == 150 ? // ENTREE
          <TouchableWithoutFeedback
            onPress={() =>{
              if (!play.current) launchGame(niveau)
            }}
            style={{
              position: "absolute",
              justifyContent: 'flex-start',
              alignItems: "center",
              flex: 1,
              width: screenWidth,
              height: screenHeight,
              elevation: 200,
              zIndex: 20,


            }}>
            <BlurView
              intensity={blur}
              style={{
                position: "absolute",
                justifyContent: 'center',
                alignItems: "center",
                flex: 1,
                width: screenWidth,
                height: screenHeight,
                opacity: blur > 0 ? 1 : 0,
                elevation: 200,
                zIndex: 20,


              }}
            >

              <Image
                onLoad={() => {
                  setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)

                }}
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  width: screenWidth,
                  height: screenHeight,
                  resizeMode: "contain",
                  right: "10%"


                }}
                source={sourceAlice} />
              <View

                style={{
                  flex: 1,
                  position: 'absolute',
                  width: "40%",
                  height: "25%",
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: "8%",
                  left: "30%",
                  elevation: 5,
                }}>
                <Image
                  onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
                  fadeDuration={0}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain"
                  }}
                  source={sourceConsigne}
                />
              </View>
            </BlurView>
          </TouchableWithoutFeedback>

          : null}

        {blur == 151 ? // GAGNE

          <BlurView
            intensity={blur}
            style={{
              position: "absolute",
              justifyContent: 'flex-start',
              alignItems: "center",
              flex: 1,
              width: screenWidth,
              height: screenHeight,
              elevation: 200,
              zIndex: 20
            }}
          >
            <Image
              fadeDuration={0}
              style={{
                position: 'absolute',
                width: "90%",
                height: "90%",
                resizeMode: "contain",
                left:"20%",

              }}
              source={sourceGagneRond} />
            <Image
              fadeDuration={0}
              style={{
                position: 'absolute',
                top: "20%",
                width: "50%",
                height: "50%",
                resizeMode: "contain",
                left:"40%"
              }}
              source={niveau == 2 ? sourceGagneMedaille : sourceGagneCoupe} />
            <Image
              fadeDuration={0}
              style={{
                position: 'absolute',
                width: "50%",
                height: "100%",
                resizeMode: "contain",
                left:"35%"

              }}
              source={sourceGagneAlice} />
            <TouchableOpacity
              onPress={() => {

                saveData()
                if (!play.current) launchGame(niveau)

              }}
              style={{
                position: "absolute",
                width: "30%",
                flex: 1,
                flexDirection: "row",
                height: "14%",
                top: "20%",
                left: "5%",
                alignItems:"center"
              }}

            >
              <Image
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  width: "30%",
                  height: "100%",
                  resizeMode: "contain",

                }}
                source={sourceGagneRejouer} />

              <Text style={[GlobalStyle.titre, { position: 'absolute',lineHeight:null,textAlign: "left", left: "35%", color: "#2685A4", shadowColor: "#024373"}]}>{"Rejouer"}</Text>
            </TouchableOpacity>

            {
              niveau < 2 ?
                <TouchableOpacity
                  onPress={() => {

                    if (niveau < 2) {
                      setNiveau(niveau => niveau + 1)
                    }
                    if (!play.current) launchGame(niveau+1)

                    saveData()

                  }}
                  style={{
                    position: "absolute",
                    width: "30%",
                    flex: 1,
                    flexDirection: "row",
                    height: "14%",
                    top: "43%",
                    left: "5%",
                    alignItems:"center"
                  }}

                >
                  <Image
                    fadeDuration={0}
                    style={{
                      position: 'absolute',
                      top: "0%",
                      width: "30%",
                      height: "100%",
                      resizeMode: "contain",

                    }}
                    source={sourceGagneContinuer} />

                  <Text style={[GlobalStyle.titre, {  position: 'absolute',lineHeight:null,textAlign: "left", left: "35%", color: "#2685A4", shadowColor: "#024373" }]}>{"Continuer"}</Text>
                </TouchableOpacity>
                : null
            }

            <TouchableOpacity
              onPress={async() => {
                setIsImageLoaded(false)
                await saveData()
                await stopSounds()
                await  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                navigation.navigate('JeuxCompta')

              }}
              style={{
                position: "absolute",
                width: "30%",
                flex: 1,
                flexDirection: "row",
                height: "14%",
                top: "66%",
                left: "5%",
                alignItems:"center"
              }}

            >
              <Image
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  width: "30%",
                  height: "100%",
                  resizeMode: "contain",

                }}
                source={sourceGagneQuitter} />

              <Text style={[GlobalStyle.titre, {  position: 'absolute',lineHeight:null,textAlign: "left", left: "35%", color: "#2685A4", shadowColor: "#024373" }]}>{"Quitter"}</Text>

            </TouchableOpacity>
          </BlurView>

          : null}

        {blur == 152 ? // PERDU


          <BlurView
            intensity={blur}
            style={{
              position: "absolute",
              justifyContent: 'center',
              alignItems: "center",
              flex: 1,
              width: screenWidth,
              height: screenHeight,
              elevation: 200,
              zIndex: 5
            }}
          >
            <Image
              fadeDuration={0}
              style={{
                position: 'absolute',
                width: "40%",
                right: "25%",
                height: "80%",
                resizeMode: "contain",
              }}
              source={sourcePerduSplash} />
            <Image
              fadeDuration={0}
              style={{
                position: 'absolute',
                width: "40%",
                right: "15%",
                height: screenHeight,
                resizeMode: "contain"

              }}
              source={sourcePerduAlice} />

            <TouchableOpacity
              onPress={() => {

                saveData()
                if (!play.current) launchGame(niveau)

              }}
              style={{
                position: "absolute",
                width: "30%",
                flex: 1,
                flexDirection: "row",
                height: "14%",
                top: "20%",
                left: "5%",
                alignItems:"center"

              }}

            >
              <Image
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  top: "0%",
                  width: "30%",
                  height: "100%",
                  resizeMode: "contain",

                }}
                source={sourcePerduRejouer} />

              <Text style={[GlobalStyle.titre, { position: 'absolute',lineHeight:null,textAlign: "left", left: "35%"}]}>{"Rejouer"}</Text>
            </TouchableOpacity>
            {
              niveau < 2?
                <TouchableOpacity
                  onPress={() => {

                    if (niveau < 2) {
                      console.log("Niveau")
                      setNiveau(niveau => niveau + 1)
                    }
                    if (!play.current) launchGame(niveau+1)
                    saveData()

                  }}
                  style={{
                    position: "absolute",
                    width: "30%",
                    flex: 1,
                    flexDirection: "row",
                    height: "14%",
                    top: "43%",
                    left: "5%",
                    alignItems:"center"
                  }}

                >
                  <Image
                    fadeDuration={0}
                    style={{
                      position: 'absolute',
                      top: "0%",
                      width: "30%",
                      height: "100%",
                      resizeMode: "contain",

                    }}
                    source={sourcePerduContinuer} />

                  <Text style={[GlobalStyle.titre, { position: 'absolute',lineHeight:null,textAlign: "left", left: "35%"}]}>{"Continuer"}</Text>
                </TouchableOpacity>
                : null
            }

            <TouchableOpacity
              onPress={async() => {
                setIsImageLoaded(false)
                await saveData()
                await stopSounds()
                await  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                navigation.navigate('JeuxCompta')
              }}
              style={{
                position: "absolute",
                width: "30%",
                flex: 1,
                flexDirection: "row",
                height: "14%",
                top: "66%",
                left: "5%",
                alignItems:"center"
              }}

            >
              <Image
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  top: "0%",
                  width: "30%",
                  height: "100%",
                  resizeMode: "contain",

                }}
                source={sourcePerduQuitter} />

              <Text style={[GlobalStyle.titre, { position: 'absolute',lineHeight:null,textAlign: "left", left: "35%"}]}>{"Quitter"}</Text>
            </TouchableOpacity>
          </BlurView>


          : null}
      </View>
    </>
  );


}
