import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import {StatusBar, AppState,Alert, Animated, StyleSheet, Text, View, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Component, Image, Easing, BackHandler, ActivityIndicator } from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage'

import DesignElements from './Components/Jeu3/DesignElements'
import Cupcake from './Components/Jeu3/Cupcake'
import * as ScreenOrientation from 'expo-screen-orientation';
import { BlurView } from 'expo-blur';
import ConnexionManager from '../connexion/ConnexionManager'


import { Audio } from 'expo-av'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();



const poubelleWidth = 70
const poubelleHeight = poubelleWidth / 0.8
const cupcakeWidth = 60
const cupcakeHeight = cupcakeWidth

export default function Jeu3({ navigation }) {
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  const getSound=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Sounds/'+name+'.mp3'}
  }
  
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('screen').width)
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('screen').height)
  const [niveau, setNiveau] = useState(1)
  const sortQuestions = (niveau) => {
    const array = [...navigation.getParam('questions')].filter((value) => value.presence == 1 && value.niveau == niveau)
    return array.sort(() => Math.random() - 0.5)
  }
  const idGame = useRef(0)
  const longueurTapis = screenWidth*0.75
  const posPoubelle = screenWidth*0.05

  const [bestScore, setBestScore] = useState(navigation.getParam('bestScore'))


  const [blur, setBlur] = useState(150)
  const sourceConsigne = getImage('Jeu3/Bulle')


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


  // const [play,setPlay]=useState(false)
  const play = useRef(false)

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

  const sourceMusic = getSound('Musique2')
  const sourceVrai = getSound('Son_Correct')
  const sourceFaux = getSound('Son_Faux')
  const sourceSonnette = getSound('Son_Sonnette')

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
      numJeu: 3,
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
      AsyncStorage.setItem("bestScore3", JSON.stringify(score))
      setBestScore(score)
    }

  }


  const positionDepartTapis = Math.round(screenWidth * 0.11)



  const delayDepart = 2000


  const calculRotation = (rotate) => {
    return rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '150deg'],
    })
  }






  const sourcePoubelle = getImage('Jeu3/J03_Poubelle_01')
  const sourcePoubelleRouge = getImage('Jeu3/J03_Poubelle_Rouge')

  const [poubelleRouge, setPoubelleRouge] = useState(false)


  const [score, setScore] = useState(0)
  const [vies, setVies] = useState(5 - niveau)
  const [questions, setQuestions] = useState([{ libelle: "BIENVENUE", reponse: -1 }])
  const [idQuestion, setIdQuestion] = useState(0)
  const [question, setQuestion] = useState(questions[0])


  const [animations, setAnimations] = useState([])

  const duration = 16000
  const nbCupcakesTapis = 5

  const [cupcakes, setCupcakes] = useState([])
  const [componentsCupcakes, setComponentsCupcakes] = useState([])


  const gestionChute = (count, id, idJeu) => {
    // console.log("play : "+idJeu+" - "+idGame.current  )
    if (ref1 != null && play.current && idJeu == idGame.current) {
      if (ref1.current[id] != null && ref1.current[id].getNumero() == cupcakes[(count) * nbCupcakesTapis + id]) {
        const faux = ref1.current[id].getPoubelleRouge()
        if (faux) {
          setPoubelleRouge(true)
          setVies(vies => vies - 1)
          nouvelleQuestion()
        } else {
          setPoubelleRouge(false)
        }
        ref1.current[id].initialize(cupcakes[(count + 1) * nbCupcakesTapis + id], questions[count + 1].reponse)

      }

    }
  }
  const useAnim = (id = 0, delay = 0) => {
    //console.log("Use anim : "+id)
    var valueSca = (new Animated.Value(0))
    var valueOpa = (new Animated.Value(0))
    var valueX = (new Animated.Value(positionDepartTapis))
    var valueRot = (new Animated.Value(0))
    var valueY = (new Animated.Value((cupcakeHeight + 5) / 2))
    var reponseT = question.reponse

    const arrivee = duration / 15
    const chute = duration * (posPoubelle) / longueurTapis
    const repositionnement = duration / 15

    const animationDefault = (count, idJeu) => {
      reponseT = question.reponse
      Animated.sequence([
        Animated.parallel([
          Animated.timing(valueSca, { // ROTATION
            toValue: 1,
            duration: arrivee,
            useNativeDriver: false
          }),
          Animated.timing(valueOpa, {
            toValue: 1,
            duration: arrivee,
            useNativeDriver: false
          }),
          Animated.timing(valueY, {
            toValue: 5,
            duration: arrivee,
            useNativeDriver: false
          })
        ]),

        Animated.timing(valueX,
          {
            toValue: longueurTapis,
            useNativeDriver: false,
            duration: duration - arrivee - chute - repositionnement,
            easing: Easing.linear
          }),

        Animated.parallel([

          Animated.timing(valueRot, { // ROTATION
            toValue: 1,
            duration: chute,
            useNativeDriver: false,
            easing: Easing.linear
          }),
          Animated.timing(valueX, {
            toValue: longueurTapis + posPoubelle - cupcakeWidth / 4,
            duration: chute,
            useNativeDriver: false,
            easing: Easing.linear
          }),
          Animated.timing(valueY, {
            toValue: screenHeight/2.5-poubelleHeight/2,
            duration: chute,
            useNativeDriver: false,
            easing: Easing.ease

          }),
          Animated.timing(valueOpa, {
            toValue: 0,
            duration: chute,
            useNativeDriver: false,
            easing: Easing.ease

          }),

        ]),
        Animated.parallel([
          Animated.timing(valueX, {
            toValue: positionDepartTapis,
            duration: repositionnement,
            useNativeDriver: false

          }),
          Animated.timing(valueY, {
            toValue: (cupcakeHeight + 5) / 2,
            duration: repositionnement,
            useNativeDriver: false

          }),
          Animated.timing(valueRot, {
            toValue: 0,
            duration: repositionnement,
            useNativeDriver: false

          }),
          Animated.timing(valueSca, {
            toValue: 0,
            duration: repositionnement,
            useNativeDriver: false

          }),

        ])




      ]).start(() => {


        gestionChute(count, id, idJeu)



        clearTimeout(timer1)


        if (play.current && idGame.current == idJeu) {
          //console.log(idGame.current +" : "+idJeu)
          animationDefault(count + 1, idJeu)
        }



      }
      )

    }

    let timer1 = setTimeout(() => animationDefault(0, idGame.current), delay / nbCupcakesTapis + delayDepart)
    return [id, valueSca, valueOpa, valueX, valueRot, valueY]
  }


  const renderCupcakes = () => {
    console.log('render : ' + play.current)
    var listComponents = []
    if (play.current) {
      for (let i = 0; i < nbCupcakesTapis; i++) {
        const anim = useAnim(i, i * duration + i * 500 / nbCupcakesTapis)
        listComponents.push(<Cupcake
          key={i}
          id={i}
          ref={ins => ref1.current[i] = ins}
          scale={anim[1]}
          opacity={anim[2]}
          translateX={anim[3]}
          rotate={calculRotation(anim[4])}
          translateY={(anim[5])}
          reponseI={question.reponse}
          cupcakeWidth={cupcakeWidth}
          cupcakeHeight={cupcakeHeight}
          handleClick={handleClick}
          positionDepartTapis={positionDepartTapis}
          initialNum={cupcakes[i]}
          longueurTapis={longueurTapis}
        />)

      }
    }

    return (
      <View style={{
        flex: 1,
        position: "absolute",
        top: screenHeight / 2 - cupcakeHeight
      }}>
        {listComponents}
      </View>
    )
  }



  var ref1 = useRef([])







  useEffect(() => {
    if (vies <= 0) {
      play.current = false
    }
  }, [vies])






  const pickNumber = (forbidden) => {
    var number = questions[0].reponse

    while (forbidden.includes(number)) {
      number = questions[Math.floor(Math.random() * questions.length)].reponse
    }
    return number
  }

  const shuffleCupcakes = (inputArray) => {
    // console.log("Shuffle cupcakes : "+inputArray)
    var array = []
    for (let i = 0; i < questions.length; i++) {
      var sousarray = []
      for (let j = 0; j < nbCupcakesTapis; j++) {
        sousarray.push(inputArray[i * nbCupcakesTapis + j])
      }
      sousarray = sousarray.sort(() => Math.random() - 0.5)
      for (let j = 0; j < sousarray.length; j++) {
        array.push(sousarray[j])
      }
    }
    return array
  }

  const createCupcakes = () => {
    console.log("Create Cupcakes")
    var listeNumeros = []

    for (let i = 0; i < questions.length; i++) {
      var r1 = questions[i].reponse
      if (i + 1 < questions.length) {

        if (i > 0) {
          var forbidden = [questions[i - 1].reponse, r1, questions[i + 1].reponse]
        } else {
          var forbidden = [r1, questions[i + 1].reponse]
        }

      } else { // 3
        var r2 = 0 // A CHECKER
        var forbidden = [questions[i].reponse]
      }



      if (i > 0) {
        for (let j = 1; j < nbCupcakesTapis; j++) {
          forbidden.push(listeNumeros[j + (i - 1) * nbCupcakesTapis])
        }
      }
      listeNumeros.push(r1)
      for (let j = 1; j < nbCupcakesTapis; j++) {
        var num = pickNumber(forbidden)
        forbidden.push(num)
        listeNumeros.push(num)
      }


    }
    listeNumeros = shuffleCupcakes(listeNumeros)
    setCupcakes(listeNumeros)
    //  setCupcakes(shuffleArray(array))
    //setCupcakes(listeNumeros)
    console.log("Cupcakes set")
    for (let i = 0; i < questions.length; i++) {
      console.log(listeNumeros[i * nbCupcakesTapis], listeNumeros[i * nbCupcakesTapis + 1], listeNumeros[i * nbCupcakesTapis + 2], listeNumeros[i * nbCupcakesTapis + 3], listeNumeros[i * nbCupcakesTapis + 4])
    }

  }

  useEffect(() => {
    if (questions.length > 1) {
      setQuestion(questions[0])
      createCupcakes()
    }

  }, [questions])


  useEffect(() => {
    if (cupcakes.length > 0) {
      const components = renderCupcakes()
      setComponentsCupcakes(components)
    }

  }, [cupcakes])



  const nouvelleQuestion = () => {
    console.log('Nouvelle question')
    console.log("id question : " + idQuestion)

    if (idQuestion < questions.length && play.current) {

      console.log("Il reste " + (questions.length - idQuestion) + " disponibles")
      setIdQuestion(idQuestion => idQuestion + 1)

    } else {
      console.log("Plus de question disponible")
    }

    // }else{
    //   console.log("Question de base déjà choisie")
    // }

  }
  useEffect(() => {
    console.log("Nouvelle Question")
    //  console.log("Niveau : "+niveau)

    if (idQuestion < questions.length) {
      var newQuestion = questions[idQuestion]
      console.log('Question choisie : ' + newQuestion.libelle + " , reponse : " + newQuestion.reponse)
      setQuestion(newQuestion)

    } else {
      if (vies > 0) {
        setBlur(151)
        play.current = (false)
      } else {
        setBlur(152)
        play.current = (false)
      }
      console.log("Plus de question disponible : Fin du niveau")
    }
  }, [idQuestion])

  const handleClick = (bonneReponse) => {
    //  console.log("PARENT : Clic parent : "+bonneReponse)


    if (bonneReponse) {
      playSon("Son_Correct")
      setScore(score => score + 1)
      nouvelleQuestion()

    } else {
      playSon("Son_Faux")

      setVies(vies => vies - 1)

    }

  };



  useEffect(() => {
    console.log("Nouveau niveau : " + niveau)
    setComponentsCupcakes([])
    setCupcakes([])
    setQuestions(sortQuestions(niveau))
    setIdQuestion(0)
    setVies(5 - niveau)
  }, [niveau, blur])


  const launchGame = () => {
    console.log("Launch Game")
    console.log("ID USER : " + navigation.getParam("idUser"))
    ref1.current = []
    play.current = (true)

    //  setComponentsCupcakes([])
    //  setCupcakes([])
    //  setIdQuestion(0)
    //setQuestions(sortQuestions(niveau))
    setPoubelleRouge(false)
    idGame.current = idGame.current + 1



    setScore(0)
    if (sourceAlice.uri === sourceAlice2.uri) {
      playSon("Son_Sonnette")

      setBlur(0)
    } else {
      setSourceAlice(sourceAlice2)
      playSon("Son_Sonnette")




      setTimeout(() => {
        setBlur(0)
        playMusique("Musique2")

      }, 1000)
    }

  }



  useEffect(() => {
    var viesAux = vies


    if (viesAux <= 0) {

      console.log("Game Over")
      setBlur(152)
      play.current = (false)
    }



  }, [vies])


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


      <View style={[GlobalStyle.container, {
        opacity: isImageLoaded ? 1 : 0,
        alignItems: "flex-start"
      }]}>
        <DesignElements
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          libelle={question.libelle}
          score={score}
          viesRestantes={vies}
          niveau={niveau}
          longueurTapis={longueurTapis-cupcakeWidth}
          positionDepartTapis={positionDepartTapis}
          
        />
        <View style={{
          flex: 1,
          position: 'absolute',
          width: poubelleWidth,
          height: poubelleHeight,
          bottom:screenHeight/4-poubelleHeight,
          // bottom: screenHeight/10,
          left: longueurTapis + posPoubelle - 10,
          zIndex: 3,
          // elevation: 10,
        }}>

          <Image
            fadeDuration={0}
            onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}

            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              opacity: poubelleRouge ? 0 : 1
            }}

            source={sourcePoubelle}

          />
          <Image
            fadeDuration={0}
            onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}

            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              opacity: poubelleRouge ? 1 : 0
            }}

            source={sourcePoubelleRouge}

          />
        </View>

        {componentsCupcakes}


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

              <Text style={[GlobalStyle.titre, { position: 'absolute',lineHeight:null,textAlign: "left", left: "35%", color: "#2685A4", shadowColor: "#024373"}]}>{"Rejouer"}</Text>
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

                  <Text style={[GlobalStyle.titre, {  position: 'absolute',lineHeight:null,textAlign: "left", left: "35%", color: "#2685A4", shadowColor: "#024373" }]}>{"Continuer"}</Text>
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

                  <Text style={[GlobalStyle.titre, { position: 'absolute',lineHeight:null,textAlign: "left", left: "35%"}]}>{"Continuer"}</Text>
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


  // }



}
