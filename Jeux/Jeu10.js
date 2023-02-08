import React, { useRef, useEffect, useState } from 'react';
import {AppState,StyleSheet, Text, Alert, BackHandler, View, Dimensions, Animated, Easing, Image, ActivityIndicator, StatusBar, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import  AsyncStorage  from '@react-native-async-storage/async-storage'


import Coulis from './Components/Jeux210/Coulis'
import Gateau from './Components/Jeux210/Gateau'
import * as ScreenOrientation from 'expo-screen-orientation';
import { BlurView } from 'expo-blur';
import ConnexionManager from '../connexion/ConnexionManager'


import { Audio } from 'expo-av'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();



export default function Jeu10({ navigation }) {
  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height
  const [anglais, setAnglais] = useState(navigation.getParam("anglais"))
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
        await ScreenOrientation.unlockAsync()
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
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(navigation.getParam('bestScore'))
  const [niveau, setNiveau] = useState(1)
  const [vies, setVies] = useState(5 - niveau)

  const sortQuestions = (niv) => {
    const array = [...navigation.getParam('questions')].filter((value) =>  value.presence == 1 && value.niveau == niv)
    return array.sort(() => Math.random() - 0.5)
  }

  const getSound = (name) => {
    return { uri: 'https://lh-tech.fr/API/ESSCA/Assets/Sounds/' + name + '.mp3' }
  }
  const getImage = (name) => {
    return { uri: 'https://lh-tech.fr/API/ESSCA/Assets/Images/' + name + '.png' }
  }

  const [questions, setQuestions] = useState(null)

  const [idQuestion, setIdQuestion] = useState(-1)

  const play = useRef(false)
  const [blur, setBlur] = useState(150)

  const sourceFond = getImage('Jeux210/Fond')
  const sourceConsigne = anglais ? getImage('Jeux210/BulleEng') : getImage('Jeux210/Bulle')
  const sourceAlice1 = getImage('DebutAlice1')
  const sourceAlice2 = getImage('DebutAlice2')
  const [sourceAlice, setSourceAlice] = useState(sourceAlice1)

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
  const sourcePerduSplash =anglais ? getImage('PerduSplashEng') : getImage('PerduSplash')



  useEffect(() => {
    if (vies <= 0) {
      play.current = false
      setBlur(152)
    }
  }, [vies])


  const launchGame = (niv) => {
    console.log("Launch Game")
    setIdQuestion(-1)
    setQuestions(sortQuestions(niv))
    setScore(0)
    setVies(5 - niv)
    // setIdQuestion(0)
    if (sourceAlice.uri === sourceAlice2.uri) {
      playSon("Son_Sonnette")

      setBlur(0)
      play.current = (true)
    } else {
      setSourceAlice(sourceAlice2)
      playSon("Son_Sonnette")
      setTimeout(() => {
        setBlur(0)
        play.current = (true)
        playMusique("Musique5")
      }, 1000)
    }

  }

  // const sourceMusic = getSound('Musique5')
  // const sourceVrai = getSound('Son_Correct')
  // const sourceFaux = getSound('Son_Faux')
  // const sourceSonnette = getSound('Son_Sonnette')

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
          await ScreenOrientation.unlockAsync()
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
          navigation.navigate('JeuxSI')
        }else{
          console.log("impossible de retourner en arrière pdt le chargement")
        }     
      }
    );

    return () => {
      backHandler.remove()

    };
  });




  const saveData = async () => {
    const idUser = navigation.getParam('idUser')
    console.log("ENREGISTREMENT DES DONNEES : id User : " + idUser)

    const data = {
      idUser: navigation.getParam('idUser'),
      numJeu: 10,
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
      AsyncStorage.setItem("bestScore10", JSON.stringify(score))
      setBestScore(score)
    }

  }












  const [colorsGateaux, setColorsGateaux] = useState([0, 1, 2])
  const [colorCoulis, setColorCoulis] = useState(0)
  const [reponses, setReponses] = useState([
    "",
    "",
    ""
  ].sort(() => Math.random() - 0.5))
  const [clickedGateaux,setClickedGateaux]=useState([false,false,false])

  const [gateauxFaux, setGateauxFaux] = useState([false, false, false])

  const setColors = () => {

    const couleurCoulis = Math.floor(Math.random() * 6)
    var couleurs = []
    while (couleurs.length < 3) {
      const index = Math.floor(Math.random() * 6)
      if (!couleurs.includes(index) && index != couleurCoulis) couleurs.push(index)
    }
    setGateauxFaux([false, false, false])
    setColorsGateaux(couleurs)
    setColorCoulis(couleurCoulis)
  }
  const handleClicGateau = (bonneReponse, num) => {
    if(!clickedGateaux[num]){
      var c = [...clickedGateaux]
      c[num]=true
      
      if (bonneReponse) {
        c=[true,true,true]
        playSon("Son_Correct")
        renderCoeurs()
        setScore(score => score + 1)
  
      } else {
        playSon("Son_Faux")
        if(vies-1<=0){
          c=[true,true,true]
        }
        setVies(vies => vies - 1)
        var g = [...gateauxFaux]
        g[num] = true
        setGateauxFaux(g)
      }
      setClickedGateaux(c)
    }
    
  }

  const gateauScale = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]).current

  const animateGateaux = (value) => {
    const duration = 500
    const delay = duration / 3
    const indices = [0, 1, 2].sort(() => Math.random() - 0.5)

    Animated.parallel([
      Animated.timing(gateauScale[indices[0]], {
        duration: duration,
        toValue: value,
        useNativeDriver: false,
        Easing: Easing.exp(2)
      }),
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(gateauScale[indices[1]], {
          duration: duration,
          toValue: value,
          useNativeDriver: false,
          Easing: Easing.exp(2)
        })
      ]),
      Animated.sequence([
        Animated.delay(delay * 2),
        Animated.timing(gateauScale[indices[2]], {
          duration: duration,
          toValue: value,
          useNativeDriver: false,
          Easing: Easing.exp(2)
        })
      ])

    ])
      .start(() => {
        if (play.current) {
          if (value == 0) {
            if (idQuestion < questions.length - 1) {
              setIdQuestion(idQuestion => idQuestion + 1)
            } else {
              play.current = false
              if (vies > 0) {
                setBlur(151)
              } else {
                setBlur(152)
              }
            }
            // console.log("fin des départs")
          } else {
            // console.log("fin des arrivées")
          }
        }
      })
  }



  const interpolateTransform = (value) => {
    return value.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight * 0.4, 0],
    })
  }



  const [anim1, setAnim1] = useState([0, 0])
  const [anim2, setAnim2] = useState([0, 0])
  const [anim3, setAnim3] = useState([0, 0])
  const [anim4, setAnim4] = useState([0, 0])
  const [anim5, setAnim5] = useState([0, 0])

  const durationCoeur = 700

  const useAnimCoeur = (delay = 0) => {

    var valueSca = (new Animated.Value(0))
    var valueOpa = (new Animated.Value(0))


    const animationCoeur = () => {
      Animated.sequence([

        Animated.parallel([
          Animated.timing(valueSca, {
            toValue: 1,
            duration: durationCoeur,
            useNativeDriver: false,
            easing: Easing.cubic
          }),
          Animated.timing(valueOpa, {
            toValue: 1,
            duration: durationCoeur,
            useNativeDriver: false,
            easing: Easing.cubic
          }),

        ]),


        Animated.delay(durationCoeur / 2),
        Animated.timing(valueOpa, {
          toValue: 0,
          duration: durationCoeur,
          useNativeDriver: false,
          easing: Easing.cubic

        }),

        Animated.timing(valueSca, {
          toValue: 0,
          duration: durationCoeur,
          useNativeDriver: false

        })


      ]).start(

        () => {
          if (delay == durationCoeur * 4 / 5) {
              animateGateaux(0)


          }
          clearTimeout(timer1)
        }


      )
    }

    let timer1 = setTimeout(() => animationCoeur(), delay)
    return [valueSca, valueOpa]
  }



  const renderCoeurs = () => {
    console.log("render Coeurs")
    setAnim1(useAnimCoeur(0))
    setAnim2(useAnimCoeur(durationCoeur / 5))
    setAnim3(useAnimCoeur(durationCoeur * 2 / 5))
    setAnim4(useAnimCoeur(durationCoeur * 3 / 5))
    setAnim5(useAnimCoeur(durationCoeur * 4 / 5))

  }

  useEffect(() => {
    if(questions!==null)     setIdQuestion(0)
  }, [questions])

  useEffect(() => {
    console.log("Nouvelle Question")
    setColors()
    if (idQuestion == 0) {
      animateGateaux(1)
    }
    
    if(idQuestion>=0){
      console.log(questions[idQuestion])
      setReponses([
        anglais ? questions[idQuestion].reponseVraieEng+"" : questions[idQuestion].reponseVraie+"",
        anglais ? questions[idQuestion].reponseFausse1Eng+"" : questions[idQuestion].reponseFausse1+"",
        anglais ? questions[idQuestion].reponseFausse2Eng+"" : questions[idQuestion].reponseFausse2+""
        ].filter(value => value.length > 0)
        .sort(() => Math.random() - 0.5))
    }
  }, [idQuestion])

  useEffect(() => {
    setClickedGateaux([false,false,false])
    setTimeout(()=>{
      animateGateaux(1)
    },200)
  }, [reponses])


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
          style={styles.fond}
          source={sourceFond}
          fadeDuration={0}
          onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
        />
        <StatusBar hidden />
        <Coulis
          question={idQuestion>=0 ? questions[idQuestion] : null}
          score={score}
          vies={vies}
          niveau={niveau}
          colorCoulis={colorCoulis}
          anglais={anglais}
        />

        <View style={styles.gateauxContainer}>
          <Gateau
            num={0}
            reponse={reponses[0]}
            couleur={colorsGateaux[0]}
            handleClicGateau={handleClicGateau}
            scale={gateauScale[0]}
            transformY={interpolateTransform(gateauScale[0])}
            anim1={anim1}
            anim2={anim2}
            anim3={anim3}
            anim4={anim4}
            anim5={anim5}
            trueResponse={idQuestion>=0 && questions!==null ? anglais ? reponses[0] == questions[idQuestion].reponseVraieEng : reponses[0] == questions[idQuestion].reponseVraie : false}
            faux={gateauxFaux[0]}

          />
          <Gateau
            num={1}
            reponse={reponses[1]}
            couleur={colorsGateaux[1]}
            handleClicGateau={handleClicGateau}
            scale={gateauScale[1]}
            transformY={interpolateTransform(gateauScale[1])}
            anim1={anim1}
            anim2={anim2}
            anim3={anim3}
            anim4={anim4}
            anim5={anim5}
            trueResponse={idQuestion>=0 && questions!==null ? anglais ? reponses[1] == questions[idQuestion].reponseVraieEng : reponses[1] == questions[idQuestion].reponseVraie : false}
            faux={gateauxFaux[1]}
          />
          <Gateau
            num={2}
            reponse={reponses[2]}
            couleur={colorsGateaux[2]}
            handleClicGateau={handleClicGateau}
            scale={gateauScale[2]}
            transformY={interpolateTransform(gateauScale[2])}
            anim1={anim1}
            anim2={anim2}
            anim3={anim3}
            anim4={anim4}
            anim5={anim5}
            trueResponse={idQuestion>=0 && questions!==null ? anglais ? reponses[2] == questions[idQuestion].reponseVraieEng : reponses[2] == questions[idQuestion].reponseVraie : false}
            faux={gateauxFaux[2]}

          />

        </View>
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
              source={niveau == 4 ? sourceGagneMedaille : sourceGagneCoupe} />
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

              <Text style={[GlobalStyle.titre, { position: 'absolute',lineHeight:null,textAlign: "left", left: "35%", color: "#2685A4", shadowColor: "#024373"}]}>{anglais ? "Play again" : "Rejouer"}</Text>
            </TouchableOpacity>

            {
              niveau < 4 ?
                <TouchableOpacity
                  onPress={() => {

                    if (niveau < 4) {
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

                  <Text style={[GlobalStyle.titre, {  position: 'absolute',lineHeight:null,textAlign: "left", left: "35%", color: "#2685A4", shadowColor: "#024373" }]}>{anglais ? "Continue" : "Continuer"}</Text>
                </TouchableOpacity>
                : null
            }

            <TouchableOpacity
              onPress={async() => {
                setIsImageLoaded(false)
                await saveData()
                await stopSounds()
                await ScreenOrientation.unlockAsync()
                await  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                navigation.navigate('JeuxSI')

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

              <Text style={[GlobalStyle.titre, {  position: 'absolute',lineHeight:null,textAlign: "left", left: "35%", color: "#2685A4", shadowColor: "#024373" }]}>{anglais ? "Quit" : "Quitter"}</Text>

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

              <Text style={[GlobalStyle.titre, { position: 'absolute',lineHeight:null,textAlign: "left", left: "35%"}]}>{anglais ? "Play again" : "Rejouer"}</Text>
            </TouchableOpacity>
            {
              niveau < 4?
                <TouchableOpacity
                  onPress={() => {

                    if (niveau < 4) {
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

                  <Text style={[GlobalStyle.titre, { position: 'absolute',lineHeight:null,textAlign: "left", left: "35%"}]}>{anglais ? "Continue" : "Continuer"}</Text>
                </TouchableOpacity>
                : null
            }

            <TouchableOpacity
              onPress={async() => {
                setIsImageLoaded(false)
                await saveData()
                await stopSounds()
                await ScreenOrientation.unlockAsync()
                await  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
                navigation.navigate('JeuxSI')
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

              <Text style={[GlobalStyle.titre, { position: 'absolute',lineHeight:null,textAlign: "left", left: "35%"}]}>{anglais ? "Quit" : "Quitter"}</Text>
            </TouchableOpacity>
          </BlurView>


          : null}

      </View>
    </>
  )


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateauxContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: "1%",
    width: "90%",
    height: "40%",
    // backgroundColor:"red",
    justifyContent: "space-around",
    alignItems: "flex-end"
  },
  fond: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flex: 1
  }
});
