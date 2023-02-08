import React, { useState, useEffect, useRef } from 'react';
import {AppState, StatusBar, StyleSheet, ActivityIndicator, Text, BackHandler, TouchableWithoutFeedback, TouchableOpacity, View, Dimensions, Button, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import Map from './Components/Jeu6/Map'
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation';
import ConnexionManager from '../connexion/ConnexionManager'

import CaseReponse from './Components/Jeu6/CaseReponse'
import Reponse from './Components/Jeu6/Reponse'
// const ModuleReact = require('react-native-axis-pad')
// const { AxisPad } = ModuleReact;
// import {AxisPad} from 'react-native-axis-pad';
// import RNGamePad from 'react-native-game-pad';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['%s: ...']);
LogBox.ignoreAllLogs();
// const AxisPad = require('react-native-axis-pad');


export default function Jeu6({ navigation }) {
  const screenWidth = Dimensions.get("screen").width
  const screenHeight = Dimensions.get("screen").height
  const [anglais,setAnglais]=useState(navigation.getParam("anglais"))

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

  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  const getSound=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Sounds/'+name+'.mp3'}
  }
  
  const sourceOuvert = getImage('Jeu6/CookieOuvert')
  const sourceFerme = getImage('Jeu6/CookieFerme')
  const sourceBtn = getImage('Jeu6/BoutonManette')

  const sourceAlice1 =getImage('DebutAlice1')
  const sourceAlice2 =getImage('DebutAlice2')

  // const manette = getImage('BoutonManette')

  const [sourceAlice, setSourceAlice] = useState(sourceAlice1)
  const [niveau, setNiveau] = useState(1)


  const [bestScore, setBestScore] = useState(navigation.getParam('bestScore'))

  const [refreshTime, setRefreshTime] = useState(151)

  const sourceGagneAlice =getImage('GagneAlice')
  const sourceGagneRond =getImage('GagneRond')
  const sourceGagneCoupe =getImage('GagneCoupe')
  const sourceGagneMedaille =getImage('MedailleOr')

  const sourceGagneContinuer =getImage('GagneContinuer')
  const sourceGagneQuitter =getImage('GagneQuitter')
  const sourceGagneRejouer =getImage('GagneRejouer')

  const sourcePerduAlice =getImage('PerduAlice')
  const sourcePerduContinuer =getImage('PerduContinuer')
  const sourcePerduQuitter =getImage('PerduQuitter')
  const sourcePerduRejouer =getImage('PerduRejouer')
  const sourcePerduSplash =anglais ? getImage('PerduSplashEng') : getImage('PerduSplash')

  
  
  const play = useRef(false)

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



  const getReponse = (vraie, libellesInterdits) => {
    const array = [...navigation.getParam('questions')].filter((value) => value.presence == 1)

    const reponsesFausses = array.filter((value) => value.reponse == 0).sort(() => Math.random() - 0.5)
    const reponsesVraies = array.filter((value) => value.reponse == 1).sort(() => Math.random() - 0.5)
    var libelle = libellesInterdits[0]

    while (libellesInterdits.includes(libelle)) {
      if (vraie) {
        var reponseProposee = reponsesVraies[Math.floor(Math.random() * reponsesVraies.length)]
      } else {
        var reponseProposee = reponsesFausses[Math.floor(Math.random() * reponsesFausses.length)]
      }
      libelle = anglais ? reponseProposee.libelleEng : reponseProposee.libelle
    }


    return reponseProposee
  }





  const moving = useRef(false)
  const moveCalled = useRef(null)

  const [blur, setBlur] = useState(150)
  const sourceConsigne = anglais ? getImage('Jeu6/BulleEng') : getImage('Jeu6/Bulle') 

  const questionsDepart = [...navigation.getParam('questions')].filter((value) => value.presence == 1).sort(() => Math.random() < 0.5)
  const [questions, setQuestions] = useState(questionsDepart)
  const [reponsesJustes, setReponsesJustes] = useState(true)

  useEffect(() => {
    console.log("NOUVEAU NIVEAU : " + niveau)
    // const newQuestions =  [...navigation.getParam('questions')].filter((value)=>value.presence==1).sort(()=>Math.random()<0.5)
    //setQuestions(newQuestions)
    // console.log(chrono)
    if (chrono == 0 || chrono == 60 + (3 - niveau + 1) * 30) {
      console.log("nouveau chrono")
      ///setChrono((3-niveau)*10)
      play.current = true
      setChrono(60 + (3 - niveau) * 30)
      setRefreshTime((3 - niveau + 2) * 50)

    }
  }, [niveau])

  const launchGame = () => {

    console.log("ID USER : " + navigation.getParam("idUser"))
    setPosition([10, 13])
    setQuestions([...navigation.getParam('questions')].filter((value) => value.presence == 1).sort(() => Math.random() < 0.5))
    setLibelles([
      anglais ? questions[0].libelleEng : questions[0].libelle, 
      anglais ? questions[1].libelleEng : questions[1].libelle, 
      anglais ? questions[2].libelleEng : questions[2].libelle, 
      anglais ? questions[3].libelleEng : questions[3].libelle, 
    ])
    setReponses([questions[0].reponse, questions[1].reponse, questions[2].reponse, questions[3].reponse])
    setRevealed([false, false, false, false])
    setTypePacman(0)
    setReponsesJustes(true)

    play.current = true
    moving.current=false
    moveCalled.current=null
    direction.current= [0,0]
    //setChrono((3-niveau)*10)
    setCarte([[4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4],
    [4, 2, 6, 6, 6, 2, 6, 6, 6, 2, 5, 2, 6, 6, 6, 2, 6, 6, 6, 2, 4],
    [4, 6, 4, 4, 4, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 4, 4, 4, 6, 4],
    [4, 6, 4, 4, 4, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 4, 4, 4, 6, 4],
    [4, 2, 6, 6, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 6, 6, 2, 4],
    [5, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 5],
    [5, 2, 6, 6, 6, 2, 5, 2, 6, 2, 5, 2, 6, 2, 5, 2, 6, 6, 6, 2, 5],
    [5, 5, 5, 5, 5, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 5, 5, 5, 5, 5],
    [8, 8, 8, 8, 5, 6, 5, 2, 6, 2, 6, 2, 6, 2, 5, 6, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 2, 6, 2, 5, 5, 5, 5, 5, 2, 6, 2, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 6, 5, 2, 6, 6, 7, 6, 6, 2, 5, 6, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 8, 8, 8, 8],
    [5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5],
    [5, 2, 6, 6, 6, 2, 6, 2, 6, 2, 5, 2, 6, 2, 6, 2, 6, 6, 6, 2, 5],
    [5, 6, 5, 5, 5, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 5, 5, 5, 6, 5],
    [5, 2, 6, 2, 5, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 5, 2, 6, 2, 5],
    [5, 5, 5, 6, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 6, 5, 5, 5],
    [4, 4, 4, 6, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 4, 6, 4, 4, 4],
    [4, 2, 6, 2, 6, 2, 5, 2, 6, 2, 6, 2, 6, 2, 5, 2, 6, 2, 6, 2, 4],
    [4, 6, 4, 4, 4, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 4, 4, 4, 6, 4],
    [4, 2, 6, 6, 6, 6, 6, 6, 6, 2, 5, 2, 6, 6, 6, 6, 6, 6, 6, 2, 4],
    [4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4]])

    setChrono(60 + (3 - niveau) * 30)
    // setChrono(20)
    setScore(0)
    if (sourceAlice.uri === sourceAlice2.uri) {
      playSon("Son_Sonnette")
      setBlur(0)
    } else {
      setSourceAlice(sourceAlice2)
      playSon("Son_Sonnette")
      setTimeout(() => {
        setBlur(0)
        playMusique("Musique5")
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
          navigation.navigate('JeuxSI')
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
      numJeu: 6,
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
      AsyncStorage.setItem("bestScore6", JSON.stringify(score))
      setBestScore(score)
    }

  }

  const limitesCases = [
    [5, 19]
    , [5, 15]
  ]

  const caseDansZone = (x, y) => {
    if (y < limitesCases[0][0] && x < limitesCases[1][0]) return 1
    if (y < limitesCases[0][0] && x > limitesCases[1][1]) return 2
    if (y > limitesCases[0][1] && x < limitesCases[1][0]) return 3
    if (y > limitesCases[0][1] && x > limitesCases[1][1]) return 4
    return 0

  }

  const direction = useRef([0, 0])

  const [carte, setCarte] = useState([
    [4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4],
    [4, 2, 6, 6, 6, 2, 6, 6, 6, 2, 5, 2, 6, 6, 6, 2, 6, 6, 6, 2, 4],
    [4, 6, 4, 4, 4, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 4, 4, 4, 6, 4],
    [4, 6, 4, 4, 4, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 4, 4, 4, 6, 4],
    [4, 2, 6, 6, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 6, 6, 2, 4],
    [5, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 5],
    [5, 2, 6, 6, 6, 2, 5, 2, 6, 2, 5, 2, 6, 2, 5, 2, 6, 6, 6, 2, 5],
    [5, 5, 5, 5, 5, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 5, 5, 5, 5, 5],
    [8, 8, 8, 8, 5, 6, 5, 2, 6, 2, 6, 2, 6, 2, 5, 6, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 2, 6, 2, 5, 5, 5, 5, 5, 2, 6, 2, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 6, 5, 2, 6, 6, 7, 6, 6, 2, 5, 6, 5, 8, 8, 8, 8],
    [8, 8, 8, 8, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 8, 8, 8, 8],
    [5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 5],
    [5, 2, 6, 6, 6, 2, 6, 2, 6, 2, 5, 2, 6, 2, 6, 2, 6, 6, 6, 2, 5],
    [5, 6, 5, 5, 5, 6, 5, 5, 5, 6, 5, 6, 5, 5, 5, 6, 5, 5, 5, 6, 5],
    [5, 2, 6, 2, 5, 2, 6, 2, 6, 2, 6, 2, 6, 2, 6, 2, 5, 2, 6, 2, 5],
    [5, 5, 5, 6, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 5, 6, 5, 5, 5],
    [4, 4, 4, 6, 5, 6, 5, 6, 5, 5, 5, 5, 5, 6, 5, 6, 4, 6, 4, 4, 4],
    [4, 2, 6, 2, 6, 2, 5, 2, 6, 2, 6, 2, 6, 2, 5, 2, 6, 2, 6, 2, 4],
    [4, 6, 4, 4, 4, 5, 5, 5, 5, 6, 5, 6, 5, 5, 5, 5, 4, 4, 4, 6, 4],
    [4, 2, 6, 6, 6, 6, 6, 6, 6, 2, 5, 2, 6, 6, 6, 6, 6, 6, 6, 2, 4],
    [4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 4, 4, 4, 4]
  ])

  const [position, setPosition] = useState([10, 13]) // X Y // J I

  const [libelles, setLibelles] = useState([
    anglais ? questions[0].libelleEng : questions[0].libelle, 
    anglais ? questions[1].libelleEng : questions[1].libelle, 
    anglais ? questions[2].libelleEng : questions[2].libelle, 
    anglais ? questions[3].libelleEng : questions[3].libelle, 
  ])
  const [reponses, setReponses] = useState([questions[0].reponse, questions[1].reponse, questions[2].reponse, questions[3].reponse])
  const [revealed, setRevealed] = useState([false, false, false, false])

  const lignes = carte.length
  const colonnes = carte[0].length
  //console.log(lignes)
  //console.log(colonnes)

  const marge = 0
  const dimCase = (screenHeight*0.54/lignes)-marge/colonnes//(screenWidth - marge) / colonnes
  const offset = Math.floor((screenWidth - colonnes * dimCase) / 2)

  const timingQuestions = 40 // sec
  const margeTiming = 15

  const sourceFond = getImage('Jeu6/Fond')






  const [typePacman, setTypePacman] = useState(0)
  const [ouvertPacman, setOuvertPacman] = useState(true)

  const [score, setScore] = useState(0)
  const scoreSmarties = 5
  const scoreBR = 50

  const [chrono, setChrono] = useState(0)

  const setValue = (pos, value) => {
    var copy = [...carte]

    copy[pos[1]][pos[0]] = value
    setCarte(copy)
  }



  const newResponses = (caseVisited) => {
    console.log("Nouvelles réponses : " + caseVisited)
    var rev = [...revealed]
    var rep = [...reponses]
    var lib = [...libelles]
    const rep1 = getReponse(true, [lib[caseVisited - 1]])
    const rep2 = getReponse(true, [lib[caseVisited - 1], anglais ?  rep1.libelleEng : rep1.libelle])
    var newReps = [
      rep1,
      rep2,
      getReponse(Math.random() < 0.5, [lib[caseVisited - 1], anglais ?  rep1.libelleEng : rep1.libelle,anglais ?  rep2.libelleEng : rep2.libelle])
    ].sort(() => Math.random() - 0.5)

    var index = 0
    for (let i = 0; i < 4; i++) {
      if (i != caseVisited - 1) {
        rev[i] = false
        rep[i] = newReps[index].reponse
        lib[i] = anglais ? newReps[index].libelleEng : newReps[index].libelle
        index += 1
      } else {
        rev[i] = true
      }
    }

    setRevealed(rev)
    setLibelles(lib)
    setReponses(rep)

  }

  useEffect(() => {
    const caseValeur = carte[position[1]][position[0]]

    if (caseValeur == 6) {
      setValue(position, 7)
      setScore(score => score + scoreSmarties)
    }
    if (caseValeur == 2) {
      setValue(position, 3)
      setScore(score => score + scoreSmarties)
    }

    setOuvertPacman(type => !type)
    const numCase = caseDansZone(position[0], position[1])

    if (numCase > 0 && !revealed[numCase - 1]) {
      if (reponses[numCase - 1]) {
        playSon("Son_Correct")
        setScore(score => score + scoreBR)
      } else {
        playSon("Son_Buzzer")
        setReponsesJustes(false)
      }
      console.log("Pacman dans case : " + numCase)
      newResponses(numCase)
    }
  }, [position])

  let gameTimer
  const move = (dir, position) => {
    if ((!moveCalled.current || moveCalled == null) && play.current) {
      moveCalled.current = true


      const criticals = [2, 3, 4, 5, 8]
      const forbidden = [4, 5, 8]
      const vx = dir[0]
      const vy = dir[1]
      var pos = position



      if (vx > 0) {
        setTypePacman(0.2)
      }
      if (vx < 0) {
        setTypePacman(0.4)
      }
      if (vy > 0) {
        setTypePacman(0.3)
      }
      if (vy < 0) {
        setTypePacman(0.1)
      }



      pos = [pos[0] + vx, pos[1] + vy]

      if (!criticals.includes(carte[pos[1]][pos[0]])) {
        //setValue([pos[0]-vx,pos[1]],6)
        setPosition(pos)

        clearTimeout(gameTimer)
        moveCalled.current = false
        gameTimer = setTimeout(() => {
          move(dir, pos)
        }, refreshTime)
        //direction.current=[0,0]




      } else {
        moveCalled.current = false
        if (forbidden.includes(carte[pos[1]][pos[0]])) {
          direction.current = [0, 0]
          moveCalled.current = null
        } else {
          setPosition(pos)
          clearTimeout(gameTimer)

          gameTimer = setTimeout(() => {
            move(direction.current, pos)
          }, refreshTime)


          //console.log("Critique : "+pos+" : "+direction.current)
        }

      }
    }

  }



  useEffect(() => {
    if (chrono <= 0 && play.current && blur == 0) {
      play.current = false
      console.log("Game Over")
      if (reponsesJustes && score>0) {
        setBlur(151)
      } else {
        setBlur(152)
      }
    }
  }, [chrono])




  useEffect(() => {
    ///console.log(play.current)
    if (play.current && blur == 0) {
      if (chrono > 0) {

        var chronoTimer = setInterval(() => {
          setChrono(chrono => chrono - 1)

        }, 1000)

      }
    }


    return () => {
      clearInterval(chronoTimer)
    }
  }, [chrono, blur])





  const pressLeft = () => {
    const dir = [-1, 0]
    console.log(moveCalled.current )
    if ((direction.current[0] == 0 || dir[0] == direction.current[0]) && moveCalled.current == null) {
      
      clearTimeout(gameTimer)
      //console.log("Move left ")
      move(dir, position)
    } else {
      console.log(direction.current)
    }
    direction.current = (dir)

  }

  const pressRight = () => {
    const dir = [1, 0]

    if ((direction.current[0] == 0 || dir[0] == direction.current[0]) && direction.current[1] == 0 && moveCalled.current == null) {
      clearTimeout(gameTimer)
      //console.log("Move Right ")
      move(dir, position)
    }
    direction.current = (dir)
  }

  const pressUp = () => {
    const dir = [0, -1]

    if (direction.current[0] == 0 && (dir[1] == direction.current[1] || direction.current[1] == 0) && moveCalled.current == null) {
      clearTimeout(gameTimer)
      //console.log("Move Up ")
      move(dir, position)
    }
    direction.current = (dir)
  }
  const pressDown = () => {

    const dir = [0, 1]

    if (direction.current[0] == 0 && (dir[1] == direction.current[1] || direction.current[1] == 0) && moveCalled.current == null) {
      clearTimeout(gameTimer)
      //console.log("Move Down ")
      move(dir, position)
    }
    direction.current = (dir)
  }

  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [countImagesLoaded, setCountImagesLoaded] = useState(0)

  useEffect(() => {
    if (countImagesLoaded == 5) {
      setIsImageLoaded(true)
    }
  }, [countImagesLoaded])



  const renderJoystick=()=>{
    return  (  
      <View style={{ 
        width:"50%",
        height:"18%",
      }}
      >



      <TouchableOpacity
      onPress={() => {
        console.log('gauche')
        if (!moving.current) {
            moving.current = true
            pressLeft()
            setTimeout(() => {
              moving.current = false
            }, refreshTime * 1.5);
          }
      }}
      style={{
        position: 'absolute',
        top:"33%",
        width: "50%",
        height:"33%",
        justifyContent:"center"
      }}

    >
      <Image
        fadeDuration={0}
        style={{
          width: "100%",
          height:"100%",
          resizeMode: "contain",
        }}
        source={sourceBtn} 
        />

    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        console.log('droite')
        if (!moving.current) {
            moving.current = true
            pressRight()
            setTimeout(() => {
              moving.current = false
            }, refreshTime * 1.5);
          }
      }}
      style={{
        position: 'absolute',
        width: "50%",
          height:"33%",
          top:"33%",
          right:0,
        justifyContent:"center"
      }}

    >
      <Image
        fadeDuration={0}
        style={{
          width: "100%",
        height:"100%",
          resizeMode: "contain",
          transform: [{ rotate: "180deg" }]
        }}
        source={sourceBtn} 
        />

    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        console.log('haut')
        if (!moving.current) {
            moving.current = true
            pressUp()
            setTimeout(() => {
              moving.current = false
            }, refreshTime * 1.5);
          }
      }}
      style={{
        position: 'absolute',
        width: "33%",
          height:"33%",
          top:0,
          left:"33%",
        justifyContent:"center",
      }}

    >
      <Image
        fadeDuration={0}
        style={{
          width: "100%",
        height:"100%",
          resizeMode: "contain",
          transform: [{ rotate: "90deg" }]
        }}
        source={sourceBtn} 
        />

    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => {
        console.log('bas')
        if (!moving.current) {
            moving.current = true
            pressDown()
            setTimeout(() => {
              moving.current = false
            }, refreshTime * 1.5);
          }
      }}
      style={{
        position: 'absolute',
        width: "33%",
          height:"33%",
          bottom:0,
          left:"33%",
        justifyContent:"center",
        // backgroundColor:"purple"
      }}

    >
      <Image
        fadeDuration={0}
        style={{
          // position: 'absolute',
          width: "100%",
        height:"100%",
          resizeMode: "contain",
          // top: 0,
          // backgroundColor:"yellow",
          transform: [{ rotate: "-90deg" }]
        }}
        source={sourceBtn} 
        />

    </TouchableOpacity>

      </View>
    // <AxisPad
    //   size={80}
    //   handlerSize={50}
    //   resetOnRelease={true}
    //   autoCenter={true}
    //   wrapperStyle={{
    //   }}
    //   handlerStyle={{
    //     backgroundColor: "#E6E6E6",
    //     opacity: 1,
    //   }}
    //   onValue={({ x, y }) => {
    //     if (!moving.current && Math.sqrt(x * x + y * y) > 0.5) {
    //       if (y < -Math.abs(x)) {
    //         moving.current = true
    //         pressUp()
    //         setTimeout(() => {
    //           moving.current = false
    //         }, refreshTime * 1.5);

    //       } else if (y > Math.abs(x)) {
    //         moving.current = true
    //         pressDown()
    //         setTimeout(() => {
    //           moving.current = false
    //         }, refreshTime * 1.5);
    //       } else {
    //         if (x > 0) {
    //           moving.current = true
    //           pressRight()
    //           setTimeout(() => {
    //             moving.current = false
    //           }, refreshTime * 1.5);
    //         } else {
    //           moving.current = true
    //           pressLeft()
              
    //           setTimeout(() => {
    //             moving.current = false
    //           }, refreshTime * 1.5);
    //         }
    //       }

    //     }


    //   }}>
    //   <Image
    //     onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}

    //     style={{
    //       resizeMode: "cover",
    //       width: "100%",
    //       height: "100%"
    //     }}
    //     fadeDuration={0}
    //     source={sourceBtn}
    //   />
    // </AxisPad> 
    )
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: screenWidth,
      height: screenHeight,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "#F8EBC8",
      flexDirection: "column",
    },
    map: {
      width: screenWidth,
      height: screenHeight
    },
    fond: {
      position: "absolute",
      width: screenWidth,
      height: screenHeight
    }
  
  });

  return (
    <>
      <StatusBar hidden />
      <ActivityIndicator
        size="large" color="#541E06"
        style={[GlobalStyle.container, { display: isImageLoaded ? "none" : "flex", zIndex: 0 }]} />

       <View style={[GlobalStyle.container, { opacity: isImageLoaded ? 1 : 0 ,justifyContent:"flex-start"}]}>

       <Image
          onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
          fadeDuration={0}
          style={styles.fond}
          source={sourceFond}
        />
        <View
          style={{
            position: "relative",
            top: 0,
            flexDirection: "row",
            width: '100%',
            height: "10%",
            justifyContent: 'center',
            alignItems: "center",
            zIndex: 2,
            backgroundColor: '#4D4D4D',
            shadowColor: "black",
            shadowOffset: {
              width: 3,
              height: 1,
            },
            shadowOpacity: 1,
            elevation: 10,
            shadowRadius: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >


          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              flex:1,
              // width: "32%",
              top: "1%",
              color: '#F0EAD9',
              fontWeight: "normal",
              textAlign: 'center',
              fontSize: 25,

              fontFamily: 'HELVETICACOMP',
              textShadowColor: "black",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 4
            }}>

            Score : {score.toString().padStart(3, "0")}
          </Text>


          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              flex:1,
              // width: "36%",
              top: "1%",
              color: '#F0EAD9',
              fontWeight: "normal",
              textAlign: 'center',
              fontSize: 25,
              fontFamily: 'HELVETICACOMP',
              textShadowColor: "black",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 4
            }}>

            {(Math.floor(chrono / 60)).toString().padStart(2, "0") + " : " + (chrono % 60).toString().padStart(2, "0")}
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{
              flex:1,
              // width: "32%",
              top: "1%",
              color: '#F0EAD9',
              fontWeight: "normal",
              textAlign: 'center',
              fontSize: 25,
              fontFamily: 'HELVETICACOMP',
              textShadowColor: "black",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 4
            }}>

            {anglais ? "Level" : "Niv."} {niveau}
          </Text>

        </View>

        <View
          style={{ flexDirection: "row", position: "relative", height: "7%", marginTop: "3%",width: "100%", zIndex: 5 }}
        >
          <Reponse
            libelle={libelles[0]}
            numero={1}
            revealed={revealed[0]}
            reponse={reponses[0]}
            dimCase={dimCase}
            screenHeight={screenHeight}
          />
          <Reponse
            libelle={libelles[1]}
            numero={2}
            revealed={revealed[1]}
            reponse={reponses[1]}
            dimCase={dimCase}
            screenHeight={screenHeight}

          />
        </View>



        <View style={{ position: "relative",width: "100%", top: "0%", height: lignes*dimCase}}>

          <CaseReponse
            numero={1}
            dimCase={dimCase}
            offset={offset}
            revealed={revealed}
            reponses={reponses}
          />

          <CaseReponse
            numero={2}
            dimCase={dimCase}
            offset={offset}
            revealed={revealed}
            reponses={reponses}
          />

          <CaseReponse
            numero={3}
            dimCase={dimCase}
            offset={offset}
            revealed={revealed}
            reponses={reponses}
          />

          <CaseReponse
            numero={4}
            dimCase={dimCase}
            offset={offset}
            revealed={revealed}
            reponses={reponses}
          />

          <Map
            carte={carte}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
            lignes={lignes}
            colonnes={colonnes}
            dimCase={dimCase}
            offset={offset}
            revealed={revealed}
            reponses={reponses}
          />

          <Image
            fadeDuration={0}
            onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}

            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              transform: [{
                rotate: 180 + (typePacman - 0.2) * 10 * (90) + "deg"
              }],
              position: "absolute",
              left: offset + position[0] * dimCase,
              top: position[1] * dimCase,
              width: dimCase,
              height: dimCase,
              zIndex: 1,
              resizeMode: "contain",
              opacity: ouvertPacman ? 1 : 0
            }
            }
            source={sourceOuvert}
          />
          <Image
            fadeDuration={0}
            onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}

            style={{
              width: "100%",
              height: "100%",
              resizeMode: "contain",
              transform: [{
                rotate: 180 + (typePacman - 0.2) * 10 * (90) + "deg"
              }],
              position: "absolute",
              left: offset + position[0] * dimCase,
              top: position[1] * dimCase,
              width: dimCase,
              height: dimCase,
              zIndex: 1,
              resizeMode: "contain",
              opacity: ouvertPacman ? 0 : 1
            }
            }
            source={sourceFerme}
          />
        </View>
        <View
          style={{ flexDirection: "row", position: "relative", height: "7%", width: "100%", zIndex: 5 }}
        >
          <Reponse
            libelle={libelles[2]}
            numero={3}
            revealed={revealed[2]}
            reponse={reponses[2]}
            dimCase={dimCase}
            screenHeight={screenHeight}

          />
          <Reponse
            libelle={libelles[3]}
            numero={4}
            revealed={revealed[3]}
            reponse={reponses[3]}
            dimCase={dimCase}
            screenHeight={screenHeight}

          />
        </View>



       

       {renderJoystick()}



        {blur == 150 ? // ENTREE
          <TouchableWithoutFeedback
            onPress={() => {
              launchGame()
            }}
            style={{
              position: "absolute",
              justifyContent: 'flex-start',
              alignItems: "center",
              flex: 1,
              width: screenWidth,
              height: screenHeight,
              elevation: 200,
              zIndex: 20

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
                zIndex: 200,
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
              // elevation: 200,
              zIndex:200
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
              source={niveau == 3 ? sourceGagneMedaille : sourceGagneCoupe} />
            <Image
              fadeDuration={0}
              style={{
                position: 'absolute',
                width: "100%",
                height: "100%",
                resizeMode: "contain"

              }}
              source={sourceGagneAlice} />
            
            <TouchableOpacity
              onPress={() => {
                saveData()
                launchGame()
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
                right: "-10%",
                // backgroundColor:"red"
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

              <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%", color: "#2685A4", shadowColor: "#024373" }]}>{anglais ? "Play again" : "Rejouer"}</Text>
            </TouchableOpacity>

            {niveau < 3 ?
              <TouchableOpacity
                onPress={() => {

                  if (niveau < 3) {
                    setNiveau(niveau => niveau + 1)
                  }
                  launchGame()
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
                  right: "-10%",
                  // backgroundColor:"red",
                  zIndex:10
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

                <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%", color: "#2685A4", shadowColor: "#024373" }]}>{anglais ? "Continue" : "Continuer"}</Text>
              </TouchableOpacity>
              : null}

            <TouchableOpacity
              onPress={async () => {
                setIsImageLoaded(false)
                await saveData()
                await stopSounds()
                navigation.navigate('JeuxSI')
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

              <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%", color: "#2685A4", shadowColor: "#024373" }]}>{anglais ? "Quit" : "Quitter"}</Text>
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
              zIndex: 5
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
                launchGame()
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

              <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%" }]}>{anglais ? "Play again" : "Rejouer"}</Text>
            </TouchableOpacity>

            {niveau < 3 ?
              <TouchableOpacity
                onPress={() => {

                  if (niveau < 3) {
                    setNiveau(niveau => niveau + 1)
                  }
                  launchGame()
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

                <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%" }]}>{anglais ? "Continue" : "Continuer"}</Text>
              </TouchableOpacity>
              : null}

            <TouchableOpacity
              onPress={async () => {
                setIsImageLoaded(false)
                await saveData()
                await stopSounds()
                navigation.navigate('JeuxSI')

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

              <Text style={[GlobalStyle.titre, { position:"absolute",lineHeight:null,textAlign: "left", left: "25%" }]}>{anglais ? "Quit" : "Quitter"}</Text>
            </TouchableOpacity>
          </BlurView>


          : null}

      </View>
    </>
  )

}


