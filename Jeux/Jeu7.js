import React, { useRef, useEffect, useState } from 'react';
import { StatusBar,AppState, TouchableOpacity,Alert, ActivityIndicator, StyleSheet, BackHandler, Text, View, Dimensions, Animated, Easing, Image, TouchableWithoutFeedback, ViewPagerAndroid } from 'react-native';

import  AsyncStorage  from '@react-native-async-storage/async-storage'

import Gateau from "./Components/Jeu7/Gateau"
import { BlurView } from 'expo-blur';
import ConnexionManager from '../connexion/ConnexionManager'
import * as ScreenOrientation from 'expo-screen-orientation';

import { Audio } from 'expo-av'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();



export default function Jeu7({ navigation }) {
  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height

  const anglais = navigation.getParam("anglais")
  const [appState,setAppState]=useState(AppState.currentState)
  const [bestScore, setBestScore] = useState(navigation.getParam('bestScore'))

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
  const rapportSocle = 193 / 1000
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      height: "100%",
      position: "absolute",
      // backgroundColor: "gray",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: 'center',
      // backgroundColor: "yellow"
    },
    fond: {
      // position:"absolute",
      flex: 1,
      // top:0,
      width: screenWidth,
      height: screenWidth * 2734 / 3500,
      resizeMode: "contain"
    },
    socle: {

      width: screenWidth / 6,
      height: screenWidth / 6 * rapportSocle,
      resizeMode: "contain",
      // backgroundColor:"pink",
      zIndex: 1,
      position: "absolute"
    },
    table: {
      position: "absolute",
      bottom: 0,
      height: 409 / 1750 * screenWidth ,
      width: "100%",
      // backgroundColor:"red",
      resizeMode: "contain",
      justifyContent: "center",
      alignItems: "center"
    },
    panneau: {
      position: "absolute",
      width: "20%",
      height: "30%",
      backgroundColor: "#2D2D2D",
      borderRadius: 10,
      elevation: 10,
      top: "30%",
      alignItems: "center",
      justifyContent: "center",

    },
    ecriturePanneau: {
      fontSize: 20,
      color: "white",
      textAlign: "center",
      textShadowColor: "black",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 4,
      fontFamily: 'HELVETICACOMP',
      // backgroundColor:"purple"
    }
  })


  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  const getSound=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Sounds/'+name+'.mp3'}
  }
  const sourceAlice1 = getImage('DebutAlice1')
  const sourceAlice2 = getImage('DebutAlice2')
  const sourceBulle = getImage('BulleDebut')
  const [sourceAlice, setSourceAlice] = useState(sourceAlice1)
  const [blur, setBlur] = useState(150)
  const sourceConsigne = anglais ? getImage('Jeu7/BulleEng') : getImage('Jeu7/Bulle')
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
      numJeu: 7,
      score: score
    }

    if (idUser >= 0) {
      const connManager = new ConnexionManager()

      if(connManager.getStatus()){
        if (score > bestScore) {
        //   const response = await connManager.postData(
        //     {
        //       type: 'saveScore',
        //       data: data
        //     }
        //   )
        //   const json = await response.text()
  
        //   await console.log("Score enregistré : ")
        //   await console.log(json)
  
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
      AsyncStorage.setItem("bestScore7", JSON.stringify(score))
      setBestScore(score)
    }

  }


  const sortTranches = (niv) => {
    var array = [...navigation.getParam('questions')].filter((value) => value.presence == 1 && value.niveau == niv)
    array = array.sort(() => Math.random() - 0.5)
    const item1 = array.filter((val)=>val.gateau==1).filter((val,index)=>index==0)[0]
    const item2 = array.filter((val)=>val.gateau==2).filter((val,index)=>index==0)[0]
    const item3 = array.filter((val)=>val.gateau==3).filter((val,index)=>index==0)[0]
    const item4 = array.filter((val)=>val.gateau==4).filter((val,index)=>index==0)[0]
    const itemsDepart = [item2,item1,item4,item3]
    //console.log(itemsDepart)

    array = array.filter((val)=>![item1.idQuestion,item2.idQuestion,item3.idQuestion,item4.idQuestion].includes(val.idQuestion))

    //console.log(array)
    //console.log(itemsDepart)
    var items = []

    for (let i = 0; i < 4; i++) {
      var sousItems = [itemsDepart[i]]
      for (let j = 1; j < 3; j++) {
        sousItems.push(array.pop())
      }
      items.push(sousItems.sort(() => Math.random() - 0.5))
    }
    return items
  }

  const [niveau, setNiveau] = useState(1)
  const [score, setScore] = useState(0)


  const sourceFond = getImage('Jeu7/Fond')
  const sourceTable = getImage('Jeu7/Table')

  const sourcesTitres = [
    anglais ?  getImage('Jeu7/ModuleRHEng') : getImage('Jeu7/ModuleRH'),
    anglais ? getImage('Jeu7/ModuleComptaEng') : getImage('Jeu7/ModuleCompta'),
    anglais ? getImage('Jeu7/ModuleVenteEng') : getImage('Jeu7/ModuleVente'),
    anglais ? getImage('Jeu7/ModuleProductionEng') : getImage('Jeu7/ModuleProduction')
  ]




  const [tranches, setTranches] = useState(
    sortTranches(niveau)
  )

  const clicked = useRef(null)
  const [opacities, setOpacities] = useState([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ])
  const [opacitiesTop, setOpacitiesTop] = useState([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ])

  const popItem = (num) => {
    var items = [...tranches]
    const item = items[num].pop()
    setTranches(items)
    appearTop(num, 0)
    return item
  }
  const disapearTop = (num, durationTop) => {
    Animated.timing(opacitiesTop[num], {
      toValue: 0,
      duration: durationTop,
      useNativeDriver: false,
      easing: Easing.cubic
    }).start(() => popItem(num))
  }


  const addItem = (num, durationTop, item) => {
    var items = [...tranches]
    items[num].push(item)
    setTranches(items)

    Animated.timing(opacitiesTop[num], {
      toValue: 0,
      duration: 0,
      useNativeDriver: false
    }).start(() => appearTop(num, durationTop, item))


  }
  const appearTop = (num, durationTop) => {
    Animated.timing(opacitiesTop[num], {
      toValue: 1,
      duration: durationTop,
      useNativeDriver: false,
      easing: Easing.cubic
    }).start()
  }

  const useAnim = (num, duration, first) => {

    Animated.timing(opacities[num], {
      toValue: 0.3,
      duration: duration,
      useNativeDriver: false,
      easing: Easing.linear
    }).start(
      () => {
        if (clicked.current != null) {
          Animated.timing(opacities[num], {
            toValue: 1,
            duration: duration,
            useNativeDriver: false,
            easing: Easing.linear
          }).start(
            () => {
              if (clicked.current == num && first) {
                useAnim(num, duration, first)
              } else {
                clicked.current = null
              }
            }
          )
        } else {
          Animated.timing(opacities[num], {
            toValue: 1,
            duration: 10,
            useNativeDriver: false,
            easing: Easing.linear
          }).start()
        }
      }

    )

  }

  const checkGateau = (num) => {
    var complet = tranches[num].length == 3
    tranches[num].forEach((tranche) => {
      if (tranche.gateau - 1 != num) complet = false
    })
    // console.log("complet : ",num,complet)
    return complet
  }

  const checkGateaux = () => {
    // console.log("check")
    var gagne = true

    tranches.forEach((gateau, index) => {
      if (!checkGateau(index)) gagne = false
    })
    // console.log(gagne)
    if (gagne) {
      play.current = false
      setBlur(151)
    }
  }



  const tryDeplacement = (from, to) => {
    if (tranches[from].length <= 0 || tranches[to].length > 3) return false
    const item = tranches[from][tranches[from].length - 1]

    const durationTop = 200
    disapearTop(from, durationTop)
    addItem(to, durationTop, item)
    return true

    // console.log("Essai de déplacement de " + from + " à " + to)
  }

  const handleClicGateau = (num) => {
    if (clicked.current == null) { // 1er clic
      if (tranches[num].length > 0) {
        clicked.current = num
        useAnim(num, 700, true)
      }


    } else { // 2eme clic
      if (num == clicked.current) { // clic sur même objet
        clicked.current = null

      } else { // clic sur un autre objet
        if (tranches[num].length < 4) {
          if (tryDeplacement(clicked.current, num)) {
            clicked.current = num
            useAnim(num, 20, false)



            if (checkGateau(num)) {
              playSon('Son_Correct')
            }
            setTimeout(() => {
              checkGateaux()

            }, 1000);

          }

        }
      }


    }

  }

  const renderGateaux = () => {
    const titres = ["ModuleRH", "ModuleCompta", "ModuleVente", "ModuleProduction"]
    return (

      <View style={{
        position: "absolute",
        flexDirection: "row",
        width: screenWidth * 0.8,
        bottom: (409 - 50/0.8) / 1750 * screenWidth,
        alignItems: "flex-end"
      }}>
        {tranches.map((gateau, index) => {

          var completed = gateau.length == 3
          gateau.map((tranche) => {
            if (tranche.gateau != index + 1) completed = false
          })

          return (
            <View key={"v" + index} style={{
              flex: 1,
              flexDirection: "column",
              // width:screenWidth/4,
              justifyContent: "flex-end",
              alignItems: "center",
              // backgroundColor:"green"

            }}>
              <Gateau
                key={index}
                numero={index}
                tranches={gateau}
                opacity={opacities[index]}
                opacityTop={opacitiesTop[index]}
                screenWidth={screenWidth}
                handleClicGateau={handleClicGateau}
                anglais={anglais}
              />
              <Image
                fadeDuration={0}
                style={styles.socle}
                key={"t" + index}
                source={sourcesTitres[index]}
              />
            </View>
          )
        }

        )}

      </View>
    )
  }

  // useEffect(()=>{
  //   console.log(tranches)
  // },[tranches])

  const [chrono, setChrono] = useState(60 * 3)
  const play = useRef(false)

  const launchGame = (niv) => {
    console.log("Launch Game")
    console.log("ID USER : " + navigation.getParam("idUser"))
    play.current = (true)
    setTranches(sortTranches(niv))
    if (sourceAlice.uri === sourceAlice2.uri) {
      playSon("Son_Sonnette")
      setBlur(0)
      setChrono(3 * 60 - 30 * (1 - niv))
    } else {
      setSourceAlice(sourceAlice2)
      playSon("Son_Sonnette")

      setTimeout(() => {
        setBlur(0)
        setChrono(3 * 60 - 30 * (1 - niv))
        playMusique("Musique2")
      }, 1000)
    }

  }

  useEffect(() => {
    if (chrono <= 0 && play.current && blur == 0) {
      play.current = false
      console.log("Game Over")
      setBlur(152)
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



  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [countImagesLoaded, setCountImagesLoaded] = useState(0)

  useEffect(() => {
    if (countImagesLoaded == 4) {
      setIsImageLoaded(true)
    }
  }, [countImagesLoaded])



  return (
    <>


      <ActivityIndicator
        size="large" color="#541E06"
        style={[styles.container, { display: isImageLoaded ? "none" : "flex", zIndex: 0 }]} />


      <View style={[styles.container, {
        opacity: isImageLoaded ? 1 : 0
      }]}>
        <StatusBar hidden />
        <Image
          fadeDuration={0}
          onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}

          style={
            styles.fond
          }
          source={sourceFond}
        />
        <View
          style={styles.table}
        >
          <Image
            fadeDuration={0}
            onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}

            style={{
              resizeMode: "contain",
              width: screenWidth,
              height: "100%"
            }}
            source={sourceTable}
          />
          <View
            style={styles.panneau}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.ecriturePanneau}>{(Math.floor(chrono / 60)).toString().padStart(2, "0") + " : " + (chrono % 60).toString().padStart(2, "0")}</Text>
          </View>

          <View

            style={[styles.panneau, { right: "10%", }]}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={styles.ecriturePanneau}>
                {anglais ? "Level" : "Niveau"} {niveau}
                </Text>
          </View>
        </View>

        {renderGateaux()}





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
              source={niveau == 3 ? sourceGagneMedaille : sourceGagneCoupe} />
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
              niveau < 3 ?
                <TouchableOpacity
                  onPress={() => {

                    if (niveau < 3) {
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
              niveau < 3 ?
                <TouchableOpacity
                  onPress={() => {

                    if (niveau < 3) {
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
  );


}


