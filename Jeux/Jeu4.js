
import React, { useRef, useEffect, useState } from 'react';
import { StatusBar, AppState, Alert,StyleSheet, ActivityIndicator, Easing, Text, BackHandler, TouchableWithoutFeedback, TouchableOpacity, View, Dimensions, Animated, Image } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage'

import BandeauTop from "./Components/Jeu4/BandeauTop"

import Balance from "./Components/Jeu4/Balance"
import Carton from "./Components/Jeu4/Carton"
import Coeurs from "./Components/Jeu4/Coeurs"
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation';
import ConnexionManager from '../connexion/ConnexionManager'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['%s: ...']);
LogBox.ignoreAllLogs();

export default function Jeu4({ navigation }) {
  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height

  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(navigation.getParam('bestScore'))

  const [niveau, setNiveau] = useState(1)
  const [vies, setVies] = useState(5 - niveau)

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

  const sortQuestions = (niv) => {
    const array = [...navigation.getParam('questions')].filter((value) => value.presence == 1 && value.niveau == niv )
    // const array = [...navigation.getParam("questions")].filter((value)=>value.idQuestion=="12")
    return array.sort(() => Math.random() - 0.5)
  }
  const [questions, setQuestions] = useState(sortQuestions(1))
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  const getSound=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Sounds/'+name+'.mp3'}
  }

  // const [question,setQuestion]=useState(questions[8])
  const [idQuestion, setIdQuestion] = useState(-1)
  //  console.log(questions)

  const [reponsesG, setReponsesG] = useState([])
  const [reponsesD, setReponsesD] = useState([])


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
  const sourcePerduSplash = getImage('PerduSplash')


  const [son, setSon] = useState(null)
  const [musique,setMusique]=useState(null)
  async function playMusique(name) {
    const connManager = new ConnexionManager()
    if(connManager.getStatus()){
      console.log('Loading Musique');
      const  {sound}  = await Audio.Sound.createAsync(
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
    if(connManager.getStatus()){
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




  const sourceFond = getImage('Jeu4/Co04_Cuisine_01')

  const bandeauTopHeight = "15%"


  const [blur, setBlur] = useState(150)
  const sourceConsigne = getImage('Jeu4/Bulle')

  const play = useRef(false)
  const largeurReponse = Math.max(120,Math.min(550,screenWidth*0.9)*0.3)
  const hauteurReponse = largeurReponse * 0.5
  const rapportPerspective = 81 / 492

  const hauteurTouchableArea = screenHeight * 0.7

  // console.log(screenWidth* 0.9)


  const [yGauche, setYGauche] = useState(new Animated.Value(hauteurReponse))
  const [yDroite, setYDroite] = useState(new Animated.Value(hauteurReponse))
  const [x0, setX0] = useState(0)
  const [y0, setY0] = useState(hauteurTouchableArea - hauteurReponse)
  const [x1, setX1] = useState(Math.min(550,screenWidth* 0.9) /2 - largeurReponse / 2)
  const [y1, setY1] = useState(hauteurTouchableArea - hauteurReponse)//useState(hauteurTouchableArea - hauteurReponse)
  const [x2, setX2] = useState(Math.min(550,screenWidth*0.9 ) - largeurReponse)
  const [y2, setY2] = useState(hauteurTouchableArea - hauteurReponse)
  const [x3, setX3] = useState(Math.min(550,screenWidth*0.9) * 1 / 3  - largeurReponse / 2)
  const [y3, setY3] = useState(hauteurTouchableArea - hauteurReponse * 2 + rapportPerspective * hauteurReponse)
  const [x4, setX4] = useState(Math.min(550,screenWidth*0.9) * 2 / 3  - largeurReponse / 2)
  const [y4, setY4] = useState(hauteurTouchableArea - hauteurReponse * 2 + rapportPerspective * hauteurReponse)
  const [cartonsDisabled, setCartonsDisabled] = useState(true)
  const [rotation, setRotation] = useState(new Animated.Value(0))
  const [translateXCartonG1, setTranslateXCartonG1] = useState(new Animated.Value(0))
  const [translateXCartonG2, setTtranslateXCartonG2] = useState(new Animated.Value(0))
  const [translateXCartonD1, setTranslateXCartonD1] = useState(new Animated.Value(0))
  const [translateXCartonD2, setTtranslateXCartonD2] = useState(new Animated.Value(0))
  const [translateYCartonG1, setTranslateYCartonG1] = useState(new Animated.Value(0))
  const [translateYCartonG2, setTtranslateYCartonG2] = useState(new Animated.Value(0))
  const [translateYCartonD1, setTranslateYCartonD1] = useState(new Animated.Value(0))
  const [translateYCartonD2, setTtranslateYCartonD2] = useState(new Animated.Value(0))
  const [rotationPlateauG, setRotationPlateauG] = useState(new Animated.Value(0))
  const [rotationPlateauD, setRotationPlateauD] = useState(new Animated.Value(0))
  const [leftBarre, setLeftBarre] = useState(new Animated.Value(largeurReponse * 0.6))
  const [longueurBarre, setLongueurBarre] = useState(new Animated.Value((screenWidth*0.9<550 ? screenWidth * 0.8 : 550) - largeurReponse * 1.2))
  const [moving, setMoving] = useState(null)
  const [draggableOpacities, setDraggrableOpacities] = useState([1, 1, 1, 1, 1, 1])

  const [libLeft, setLibLeft] = useState([])
  const [libRight, setLibRight] = useState([])

  const poidsReponses = hauteurReponse / 2
  const duration = 2000
  let moveTimer

  const [reponses, setReponses] = useState(['', '', '', '', ''])


  const getLongueurBarre = (yGauche, yDroite) => {
    const largeurInit = (screenWidth*0.9<550 ? screenWidth * 0.8 : 550)
    return (Math.sqrt((largeurInit - largeurReponse * 1.2) * (largeurInit - largeurReponse * 1.2) + (yGauche - yDroite) * (yGauche - yDroite)))
  }

  const calculRotation = (rotate) => {
    return rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', "1deg"],
    })
  }

  const calculRotationPlateau = (rotate) => {
    return rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', "1deg"],
    })
  }

  const angle = Math.floor(Math.atan((poidsReponses) / (screenWidth * 0.4 - largeurReponse * 0.6)) * 180 / Math.PI)

  // const changeOpacity=(id)=>{
  //   draggableOpacities.current[id]=0
  // }

  // useEffect(() => {
  //   console.log("Opcities : " + draggableOpacities)
  // }, [draggableOpacities])



  useEffect(() => {
    // console.log("moving : " + moving)
    var array = [...draggableOpacities]
    array[moving] = 0
    setDraggrableOpacities(array)

  }, [libLeft, libRight])


  const animation = (id) => {

    let x
    let y
    switch (id) {
      case 0:
        x = x0
        y = y0
        break;

      case 1:
        x = x1
        y = y1
        break;
      case 2:
        x = x2
        y = y2
        break;
      case 3:
        x = x3
        y = y3
        break;
      case 4:
        x = x4
        y = y4
        break;
    }



    setTimeout(() => {
      var facteur = 0
      if (x < screenWidth * 0.4 - largeurReponse / 2) { // gauche
        facteur = Math.round(1 * 2 / reponsesG.length)
      } else {
        facteur = -Math.round(1 * 2 / reponsesD.length)
      }
      if (facteur < 0) {
        var libsRight = [...libRight]
        libsRight.push(reponses[moving])
        setLibRight(libsRight)
      } else {
        var libsLeft = [...libLeft]
        libsLeft.push(reponses[moving])
        setLibLeft(libsLeft)
      }
      var calculBarre = 1.1 * getLongueurBarre(Number.parseInt(JSON.stringify(yGauche)) + facteur * poidsReponses, Number.parseInt(JSON.stringify(yDroite)) - facteur * poidsReponses)



      Animated.parallel([

        Animated.timing(yGauche, {
          toValue: Number.parseInt(JSON.stringify(yGauche)) + facteur * poidsReponses,
          duration: duration,
          useNativeDriver: false,
          easing: Easing.elastic(4)

        }),

        Animated.timing(yDroite, {
          toValue: Number.parseInt(JSON.stringify(yDroite)) - facteur * poidsReponses,
          duration: duration,
          useNativeDriver: false,
          easing: Easing.elastic(4)

        }),
        Animated.timing(longueurBarre, {
          toValue: calculBarre,
          duration: duration * 0.95,
          useNativeDriver: false,
          easing: Easing.elastic(4)

        }),
        Animated.timing(rotation, {
          toValue: Number.parseInt(JSON.stringify(rotation)) - facteur * angle,
          duration: duration,
          useNativeDriver: false,
          easing: Easing.elastic(4)

        }),
        Animated.timing(leftBarre, {
          toValue: largeurReponse * 0.6 - ((screenWidth*0.9<550 ? screenWidth * 0.8 : 550) - largeurReponse * 1.2 - getLongueurBarre(Number.parseInt(JSON.stringify(yGauche)) + facteur * poidsReponses, Number.parseInt(JSON.stringify(yDroite)) -facteur * poidsReponses)) / 2,
          duration: duration,
          useNativeDriver: false,
          easing: Easing.elastic(4)

        }),
      ])
        .start(() => {
          setMoving(null)

          switch (id) {
            case 0:
              setY0(screenHeight + hauteurReponse * 1.5)
              break;
            case 1:
              setY1(screenHeight + hauteurReponse * 1.5)
              break;
            case 2:
              setY2(screenHeight + hauteurReponse * 1.5)
              break;
            case 3:
              setY3(screenHeight + hauteurReponse * 1.5)
              break;
            case 4:
              setY4(screenHeight + hauteurReponse * 1.5)
              break;
          }

          if (facteur > 0) { // gauche
            if (!reponsesG.includes(reponses[id])) {
              fausseReponse()
            } else {
              bonneReponse(libLeft.length + 1, libRight.length)
            }


          } else {
            if (!reponsesD.includes(reponses[id])) {
              fausseReponse()
            } else {
              bonneReponse(libLeft.length, libRight.length + 1)
            }
          }
          setCartonsDisabled(false)
          console.log("Terminé")
        })

    }, 1500)





  }

  useEffect(() => {

    if (moving != null) {
      setCartonsDisabled(true)
      animation(moving)
    }



  }, [moving])

  const initialize = () => {
    setCartonsDisabled(true)
    const positionDepart = hauteurTouchableArea - hauteurReponse
    // const positionDepart = 180 - hauteurReponse-largeurReponse * 1.2 * 173/500+rapportPerspective*hauteurReponse/2
     setX0(0)
      setY0(positionDepart)
      setX1(Math.min(550,screenWidth* 0.9) /2 - largeurReponse / 2)
      setY1(yGauche)
      setY1(positionDepart)
      setX2(Math.min(550,screenWidth*0.9 ) - largeurReponse)
      setY2(positionDepart)
      setX3(Math.min(550,screenWidth*0.9) * 1 / 3  - largeurReponse / 2)
      setY3(positionDepart - hauteurReponse + rapportPerspective * hauteurReponse)
      setX4(Math.min(550,screenWidth*0.9) * 2 / 3  - largeurReponse / 2)
      setY4(positionDepart - hauteurReponse + rapportPerspective * hauteurReponse)


    setYGauche(new Animated.Value(hauteurReponse))
    setYDroite(new Animated.Value(hauteurReponse))
    setRotation(new Animated.Value(0))
    setTranslateXCartonG1(new Animated.Value(0))
    setTtranslateXCartonG2(new Animated.Value(0))
    setTranslateXCartonD1(new Animated.Value(0))
    setTtranslateXCartonD2(new Animated.Value(0))
    setTranslateYCartonG1(new Animated.Value(0))
    setTtranslateYCartonG2(new Animated.Value(0))
    setTranslateYCartonD1(new Animated.Value(0))
    setTtranslateYCartonD2(new Animated.Value(0))
    setRotationPlateauG(new Animated.Value(0))
    setRotationPlateauD(new Animated.Value(0))
    setLeftBarre(new Animated.Value(largeurReponse * 0.6))
    setLongueurBarre(new Animated.Value((screenWidth*0.9<550 ? screenWidth * 0.8 : 550) - largeurReponse * 1.2))
    setMoving(null)
    setDraggrableOpacities([1, 1, 1, 1, 1, 1])

    setLibLeft([])
    setLibRight([])
    // setCartonsDisabled(false)
  }

  useEffect(() => {
    if (vies <= 0) {
      play.current = false
      setBlur(152)
    }
  }, [vies])

  useEffect(() => {
    setVies(5 - niveau)
  }, [niveau])

  useEffect(() => {
    if (blur > 0) {
      setCartonsDisabled(true)
    } else {
      setCartonsDisabled(false)
    }
  }, [blur])


  const launchGame = (niveau) => {
    console.log("Launch game, niveau : " + niveau)
    play.current = true
    setIdQuestion(0)

    setScore(0)
    setVies(5 - niveau)
    setQuestions(sortQuestions(niveau))
    if (sourceAlice.uri === sourceAlice2.uri) {
      playSon("Son_Sonnette")
      setBlur(0)
      setCartonsDisabled(false)
      play.current = true
    } else {
      setSourceAlice(sourceAlice2)
      playSon("Son_Sonnette")

      setTimeout(() => {
        setBlur(0)
        setCartonsDisabled(false)
        play.current = true
        playMusique("Musique4")

      }, 1000)

    }
  }

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
      numJeu: 4,
      score: score
    }

    if (idUser >= 0) {
      const connManager = new ConnexionManager()

      if(connManager.getStatus()){
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
      }else{
        
        Alert.alert("Absence de connexion","Veuillez activer votre connexion internet pour continuer.")
        console.log("Pas d'enregistrement BDD")
      }




    } else {
      console.log("Pas d'enregistrement BDD")
    }

    if (score > bestScore) {
      AsyncStorage.setItem("bestScore4", JSON.stringify(score))
      setBestScore(score)
    }
  }

  const newQuestion = () => {
    console.log("new question")
    if (vies > 0 && play.current) {
      if (idQuestion < questions.length - 1) {

        setIdQuestion(idQuestion => idQuestion + 1)

        // setCartonsDisabled(false)
      } else {
        setIdQuestion(-1)
        play.current = false
        setCartonsDisabled(true)
        setBlur(151)

        console.log("Plus de question diponible pour le niveau | nb questions : " + questions.length + " id question : " + idQuestion)
      }
    }




  }

  const resetBalance = (duree) => {
    console.log("Reset Balance")
    Animated.parallel([

      Animated.timing(yGauche, {
        toValue:  hauteurReponse,
        duration: duree,
        useNativeDriver: false,
        easing: Easing.linear

      }),

      Animated.timing(yDroite, {
        toValue:  hauteurReponse,
        duration: duree,
        useNativeDriver: false,
        easing: Easing.linear

      }),
      Animated.timing(longueurBarre, {
        toValue: getLongueurBarre( hauteurReponse,  hauteurReponse),
        duration: duree * 0.95,
        useNativeDriver: false,
        easing: Easing.linear

      }),
      Animated.timing(rotation, {
        toValue: 0,
        duration: duree,
        useNativeDriver: false,
        easing: Easing.linear

      }),
      Animated.timing(leftBarre, {
        toValue: largeurReponse * 0.6,
        duration: duree,
        useNativeDriver: false,
        easing: Easing.linear
      }),
    ]).start(() => {
      setTimeout(() => {
        play.current = true
        setVies(vies => vies - 1)
        newQuestion()
      }, duree);

    }

    )

  }

  const bonneReponse = (countLeft, countRight) => {

    if (countLeft == reponsesG.length && countRight == reponsesD.length) {
      setCartonsDisabled(true)
      renderCoeurs()
      console.log("Bonne réponse")
      setScore(score => score + 1)
      playSon("Son_Correct")
    }
  }


  const fausseReponse = () => {
    playSon("Son_Faux")
    setCartonsDisabled(true)
    play.current = false
    const duree = 1000
    const angle = 55
    const ejectionX = largeurReponse * 1.5 + screenWidth * 0.1
    const ejectionY = hauteurReponse / 5
    setTimeout(() => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(rotationPlateauG, {
            toValue: -angle,
            duration: duree,
            useNativeDriver: false,
            easing: Easing.quad
          }),
          Animated.timing(rotationPlateauD, {
            toValue: angle,
            duration: duree,
            useNativeDriver: false,
            easing: Easing.quad
          }),
          Animated.timing(translateXCartonG1, {
            toValue: -ejectionX,
            duration: duree,
            useNativeDriver: false,
            easing: Easing.quad
          }),
          Animated.timing(translateXCartonG2, {
            toValue: -ejectionX * 1.5,
            duration: duree,
            useNativeDriver: false,
            easing: Easing.quad
          }),
          Animated.timing(translateXCartonD1, {
            toValue: ejectionX,
            duration: duree,
            useNativeDriver: false,
            easing: Easing.quad
          }),
          Animated.timing(translateXCartonD2, {
            toValue: ejectionX * 1.5,
            duration: duree,
            useNativeDriver: false,
            easing: Easing.quad
          }),
          Animated.timing(translateYCartonG1, {
            toValue: -ejectionY,
            duration: duree,
            useNativeDriver: false,
            easing: Easing.quad
          }),
          Animated.timing(translateYCartonG2, {
            toValue: -ejectionY * 6,
            duration: duree,
            useNativeDriver: false,
            easing: Easing.quad
          }),
          Animated.timing(translateYCartonD1, {
            toValue: -ejectionY,
            duration: duree,
            useNativeDriver: false,
            easing: Easing.quad
          }),
          Animated.timing(translateYCartonD2, {
            toValue: -ejectionY * 6,
            duration: duree,
            useNativeDriver: false,
            easing: Easing.quad
          })

        ]),
        Animated.parallel([
          Animated.timing(rotationPlateauG, {
            toValue: 0,
            duration: duree / 2,
            useNativeDriver: false,
            easing: Easing.linear
          }),
          Animated.timing(rotationPlateauD, {
            toValue: 0,
            duration: duree / 2,
            useNativeDriver: false,
            easing: Easing.linear
          }),

        ])
      ]).start(() => {

        resetBalance(duree)

      })
    }, 1000)

    console.log("Réponse Fausse")
  }
  const durationCoeur = 800


  const [anim1, setAnim1] = useState([0, 0])
  const [anim2, setAnim2] = useState([0, 0])
  const [anim3, setAnim3] = useState([0, 0])
  const [anim4, setAnim4] = useState([0, 0])

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
          if (delay == durationCoeur * 3 / 4) {
            setTimeout(() => {
              newQuestion()
            }, durationCoeur);


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
    setTimeout(() => {
      setAnim1(useAnimCoeur(0))
      setAnim2(useAnimCoeur(durationCoeur / 4))
      setAnim3(useAnimCoeur(durationCoeur * 2 / 4))
      setAnim4(useAnimCoeur(durationCoeur * 3 / 4))
      // setTimeout(()=>{
      //   newQuestion()
      // },durationCoeur*2)

    }, durationCoeur / 2)

  }








  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    fond: {
      position: "absolute",
      width: screenWidth,
      height: screenHeight,
      resizeMode: "cover"
    }
  })



  const handleDrag = (gestureState, id) => {
    // const libRight=[""]
    // const libLeft=[""]
    const reponsesG=[" "," "]
    // const reponsesD=[" "," "]
    if (moving == null && play.current) {
      if (gestureState.dy < - hauteurReponse * 1.5) {
        var choice = null
        const xG = largeurReponse * 0.1 + (screenWidth * 0.9<550 ? screenWidth*0.05 : 0)
        const yG=Number.parseFloat(JSON.stringify(yGauche))+hauteurReponse*(1-libLeft.length)+ rapportPerspective * hauteurReponse * (libLeft.length)
        const xD = (screenWidth * 0.9<550 ? screenWidth * 0.85 : 550)  - largeurReponse * 1.1
        const yD = Number.parseFloat(JSON.stringify(yDroite))+hauteurReponse*(1-libRight.length)+ rapportPerspective * hauteurReponse * (libRight.length)
        switch (id) {
          case 0:
            if (gestureState.dx < Math.min(550,screenWidth*0.9) /2 - largeurReponse / 2 && libLeft.length < reponsesG.length) {
              setX0(xG)
              setY0(yG)
              setMoving(id)
            } else if (gestureState.dx >  Math.min(550,screenWidth*0.9) /2 - largeurReponse / 2 && libRight.length < reponsesD.length) {
              setX0(xD)
              setY0(yD)
              setMoving(id)
            }
            break;
          case 1:
            if (gestureState.dx < screenWidth / 8 && libLeft.length < reponsesG.length) {
              setX1(xG)
              setY1(yG)
              setMoving(id)
            } else if (gestureState.dx > screenWidth / 8 && libRight.length < reponsesD.length) {

              setX1(xD)
              setY1(yD)
              setMoving(id)
            }
            break;
          case 2:
            if (gestureState.dx < - Math.min(550,screenWidth*0.9) /2  + largeurReponse / 2 && libLeft.length < reponsesG.length) {
              setX2(xG)
              setY2(yD)
              setMoving(id)
            } else if (gestureState.dx > - Math.min(550,screenWidth*0.9) /2  + largeurReponse / 2 && libRight.length < reponsesD.length) {

              setX2(xD)
              setY2(yD)
              setMoving(id)
            }
            break;
          case 3:
            if (gestureState.dx <  Math.min(550,screenWidth*0.9) /2  - Math.min(550,screenWidth*0.9) * 1 / 3 - largeurReponse / 4 && libLeft.length < reponsesG.length) {
              setX3(xG)
              setY3(yG)
              setMoving(id)
            } else if (gestureState.dx >  Math.min(550,screenWidth*0.9) /2  -  Math.min(550,screenWidth*0.9)  * 1 / 3 + largeurReponse / 4 && libRight.length < reponsesD.length) {
              setX3(xD)
              setY3(yD)
              setMoving(id)
            }
            break;
          case 4:

            if (gestureState.dx < -( Math.min(550,screenWidth*0.9) /2  -  Math.min(550,screenWidth*0.9) * 1 / 3 + largeurReponse / 4) && libLeft.length < reponsesG.length) {
              setX4(xG)
              setY4(yG)
              setMoving(id)
              // console.log("Gauche " + gestureState.dx)
            } else if (gestureState.dx > -( Math.min(550,screenWidth*0.9) /2  -  Math.min(550,screenWidth*0.9) * 1 / 3 - largeurReponse / 4) && libRight.length < reponsesD.length) {

              setX4(xD)
              setY4(yD)
              setMoving(id)
              // console.log("Droite " + gestureState.dx)

            }
            break;
        }
      }
    }
  }

  useEffect(() => {
    setReponses(["", "", "", "", "", ""])

    initialize()
    if (idQuestion >= 0) {
      setCartonsDisabled(false)
    }
    console.log(questions[idQuestion])
  }, [idQuestion])

  useEffect(() => {
    // console.log(reponses)
    if (reponses.length > 5 && idQuestion >= 0) {
      // console.log("chargt repo")
      setReponsesG([questions[idQuestion].reponseGauche1, questions[idQuestion].reponseGauche2].filter((val) => val != ""))
      setReponsesD([questions[idQuestion].reponseDroite1, questions[idQuestion].reponseDroite2].filter((val) => val != ""))
      var libelles = [questions[idQuestion].reponseGauche1, questions[idQuestion].reponseGauche2, questions[idQuestion].reponseDroite1, questions[idQuestion].reponseDroite2, questions[idQuestion].reponseFausse1, questions[idQuestion].reponseFausse2]
      libelles = libelles.sort((val1, val2) => val1.length < val2.length).filter((value, index) => index < 5).sort(() => Math.random() - 0.5)

      setReponses(libelles)
    }
  }, [reponses])


  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [countImagesLoaded, setCountImagesLoaded] = useState(0)

  useEffect(() => {
    if (countImagesLoaded == 3) {
      setIsImageLoaded(true)
    }
  }, [countImagesLoaded])

  useEffect(() => {
    console.log("disabled  " + cartonsDisabled)
    console.log("play " + play.current)
  }, [cartonsDisabled])

 
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
          style={styles.fond}
          source={sourceFond}
        />
       
        <Balance
          screenWidth={screenWidth}
          yGauche={yGauche}
          yDroite={yDroite}
          largeurReponse={largeurReponse}
          hauteurReponse={hauteurReponse}
          libLeft={libLeft}
          libRight={libRight}
          longueurBarre={longueurBarre}
          rotation={calculRotation(rotation)}
          leftBarre={leftBarre}
          rapportPerspective={rapportPerspective}
          rotationPlateauG={calculRotationPlateau(rotationPlateauG)}
          rotationPlateauD={calculRotationPlateau(rotationPlateauD)}
          translateXCartonG1={translateXCartonG1}
          translateXCartonG2={translateXCartonG2}
          translateXCartonD1={translateXCartonD1}
          translateXCartonD2={translateXCartonD2}
          translateYCartonG1={translateYCartonG1}
          translateYCartonG2={translateYCartonG2}
          translateYCartonD1={translateYCartonD1}
          translateYCartonD2={translateYCartonD2}
          screenHeight={screenHeight}
        />
        <View style={{
          position: "absolute",
          top: "20%",
          width: "90%",
          maxWidth:550,
          height: hauteurTouchableArea,
          // pointerEvents="none",
          // backgroundColor:"orange",
          zIndex: cartonsDisabled ? 0 : 21,
        }}>

          {reponses[0] != "" ?
            <Carton
              id={0}
              x={x0}
              y={y0}
              handleDrag={handleDrag}
              largeurReponse={largeurReponse}
              hauteurReponse={hauteurReponse}
              rapportPerspective={rapportPerspective}
              opacity={draggableOpacities[0]}
              reponse={reponses[0]}
              cartonsDisabled={cartonsDisabled}
            />
            : null}
          {reponses[1] != "" ?
            <Carton
              id={1}
              x={x1}
              y={y1}
              screenWidth={screenWidth}
              handleDrag={handleDrag}
              largeurReponse={largeurReponse}
              hauteurReponse={hauteurReponse}
              rapportPerspective={rapportPerspective}
              opacity={draggableOpacities[1]}
              reponse={reponses[1]}
              cartonsDisabled={cartonsDisabled}
            />
            : null}
          {reponses[2] != "" ?
            <Carton
              id={2}
              x={x2}
              y={y2}
              screenWidth={screenWidth}
              handleDrag={handleDrag}
              largeurReponse={largeurReponse}
              hauteurReponse={hauteurReponse}
              rapportPerspective={rapportPerspective}
              opacity={draggableOpacities[2]}
              reponse={reponses[2]}
              cartonsDisabled={cartonsDisabled}
            />
            : null}
          {reponses[3] != "" ?
            <Carton
              id={3}
              x={x3}
              y={y3}
              screenWidth={screenWidth}
              handleDrag={handleDrag}
              largeurReponse={largeurReponse}
              hauteurReponse={hauteurReponse}
              rapportPerspective={rapportPerspective}
              opacity={draggableOpacities[3]}
              reponse={reponses[3]}
              cartonsDisabled={cartonsDisabled}
            />
            : null}
          {reponses[4] != "" ?
            <Carton
              id={4}
              x={x4}
              y={y4}
              screenWidth={screenWidth}
              handleDrag={handleDrag}
              largeurReponse={largeurReponse}
              hauteurReponse={hauteurReponse}
              rapportPerspective={rapportPerspective}
              opacity={draggableOpacities[4]}
              reponse={reponses[4]}
              cartonsDisabled={cartonsDisabled}
            />
            : null}

        </View>



        <Coeurs
          anim1={anim1}
          anim2={anim2}
          anim3={anim3}
          anim4={anim4}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
        />

        {blur == 150 ? // ENTREE
          <TouchableWithoutFeedback
            onPress={() => { 
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
              zIndex: 22,

            }}>
            <BlurView
              intensity={blur}
              style={{
                position: "absolute",
                justifyContent: 'center',
                alignItems: "center",
                width: "100%",
                height: "100%",
                opacity: blur > 0 ? 1 : 0,
                zIndex: 20,
              }}
            >
              <Image
                onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  width: screenWidth,
                  resizeMode: "contain",
                  height:"80%",

                }}
                source={sourceAlice} />
              <View
                style={{
                  position: 'absolute',
                  width: "60%",
                  height: "13%",
                  alignItems: 'center',
                  top: "20%",
                  left: "30%",
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
                top: "0%",
                width: "90%",
                height: "90%",
                resizeMode: "contain"
              }}
              source={sourceGagneRond} />
            <Image
              fadeDuration={0}
              style={{
                position: 'absolute',
                top: "20%",
                width: "50%",
                height: "50%",
                resizeMode: "contain"
              }}
              source={niveau == 4 ? sourceGagneMedaille : sourceGagneCoupe} />

            {/* {niveau == 4 ?

              <Image
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  top: "35%",
                  left: "49%",
                  width: "15%",
                  height: "15%",
                  resizeMode: "contain"
                }}
                source={sourceGagneMedaille} />
              : null} */}
            <Image
              fadeDuration={0}
              style={{
                position: 'absolute',
                width: screenWidth,
                height: screenHeight,
                resizeMode: "contain"

              }}
              source={sourceGagneAlice} />

            <TouchableOpacity
              onPress={() => {
                saveData()
                if (!play.current) launchGame(niveau)
              }}
              style={{
                position: "absolute",
                width: "80%",
                height: screenHeight,
                flex: 1,
                flexDirection: "row",
                height: "10%",
                alignItems: "center",
                top: "60%",
                right: "-10%"
              }}

            >
              <Image
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  width: "20%",
                  height: "80%",
                  resizeMode: "contain"

                }}
                source={sourceGagneRejouer} />

              <Text style={[GlobalStyle.titre, {position:"absolute",lineHeight:null, textAlign: "left", left: "25%", color: "#2685A4", shadowColor: "#024373" }]}>Rejouer</Text>
            </TouchableOpacity>

            {niveau < 4 ?
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
                  width: "80%",
                  height: screenHeight,
                  flex: 1,
                  flexDirection: "row",
                  height: "10%",
                  alignItems: "center",
                  top: "70%",
                  right: "-10%"
                }}

              >
                <Image
                  fadeDuration={0}
                  style={{
                    position: 'absolute',
                    width: "20%",
                    height: "80%",
                    resizeMode: "contain",

                  }}
                  source={sourceGagneContinuer} />

                <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%", color: "#2685A4", shadowColor: "#024373" }]}>Continuer</Text>
              </TouchableOpacity>
              : null}

            <TouchableOpacity
              onPress={async () => {
                setIsImageLoaded(false)
                await saveData()
                await stopSounds()
                await ScreenOrientation.unlockAsync()
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)

                navigation.navigate('JeuxCompta')
                


              }}
              style={{
                position: "absolute",
                width: "80%",
                height: screenHeight,
                flex: 1,
                flexDirection: "row",
                height: "10%",
                alignItems: "center",
                top: "80%",
                right: "-10%",
                elevation: 100,
                zIndex: 100
              }}

            >
              <Image
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  width: "20%",
                  height: "80%",
                  resizeMode: "contain",


                }}
                source={sourceGagneQuitter} />

              <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%", color: "#2685A4", shadowColor: "#024373" }]}>Quitter</Text>
            </TouchableOpacity>

          </BlurView>



          : null}

        {blur == 152 ? // PERDU


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
              zIndex: 23
            }}
          >
            <Image
              fadeDuration={0}
              style={{
                position: 'absolute',
                top: "0%",
                width: "80%",
                height: "80%",
                resizeMode: "contain"
              }}
              source={sourcePerduSplash} />
            <Image
              fadeDuration={0}
              style={{
                position: 'absolute',
                width: screenWidth,
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
                width: "80%",
                height: screenHeight,
                flex: 1,
                flexDirection: "row",
                height: "10%",
                alignItems: "center",
                top: "60%"
              }}

            >
              <Image
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  width: "20%",
                  height: "80%",
                  resizeMode: "contain"

                }}
                source={sourcePerduRejouer} />

              <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%" }]}>Rejouer</Text>
            </TouchableOpacity>

            {niveau < 4 ?
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
                  width: "80%",
                  height: screenHeight,
                  flex: 1,
                  flexDirection: "row",
                  height: "10%",
                  alignItems: "center",
                  top: "70%"
                }}

              >
                <Image
                  fadeDuration={0}
                  style={{
                    position: 'absolute',
                    width: "20%",
                    height: "80%",
                    resizeMode: "contain",

                  }}
                  source={sourcePerduContinuer} />

                <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%" }]}>Continuer</Text>
              </TouchableOpacity>
              : null}

            <TouchableOpacity
              onPress={async () => {
                setIsImageLoaded(false)
                await saveData()
                await stopSounds()
                await ScreenOrientation.unlockAsync()
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)

                navigation.navigate('JeuxCompta')
              }}
              style={{
                position: "absolute",
                width: "80%",
                height: screenHeight,
                flex: 1,
                flexDirection: "row",
                height: "10%",
                alignItems: "center",
                top: "80%",
                zIndex: 1500,
                elevation: 1000
              }}

            >
              <Image
                fadeDuration={0}
                style={{
                  position: 'absolute',
                  width: "20%",
                  height: "80%",
                  resizeMode: "contain",

                }}
                source={sourcePerduQuitter} />

              <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%" }]}>Quitter</Text>
            </TouchableOpacity>
          </BlurView>


          : null}

<BandeauTop

question={idQuestion >= 0 ? questions[idQuestion].libelle : ""}
score={score}
bandeauTopHeight={bandeauTopHeight}
viesRestantes={vies}
niveau={niveau}
screenWidth={screenWidth}
/>

      </View>
    </>
  );


}
