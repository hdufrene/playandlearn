import React, { useState, useEffect, useRef } from 'react';
import { AppState, BackHandler, Alert, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator, StatusBar, StyleSheet, Text, View, Dimensions, Button, Image, Animated, Easing } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage'


import Grille from './Components/Jeu9/Grille';
import BandeauTop from './Components/Jeu9/BandeauTop';
import Case from './Components/Jeu9/Case'
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation';
import ConnexionManager from '../connexion/ConnexionManager'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['%s: ...']);
LogBox.ignoreAllLogs();


export default function Jeu9({ navigation }) {
  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(navigation.getParam('bestScore'))
  const [anglais, setAnglais] = useState(navigation.getParam("anglais"))

  const [blur, setBlur] = useState(150)
  const play = useRef(false)
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
  const [niveau, setNiveau] = useState(1)
  const [vies, setVies] = useState(5 - niveau)
  const getSound = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Sounds/' + name + '.mp3' }
  }
  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }



  const sourceAlice1 = getImage('DebutAlice1')
  const sourceAlice2 = getImage('DebutAlice2')
  const sourceConsigne = anglais ? getImage('Jeu9/BulleEng') : getImage('Jeu9/Bulle')
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



  const [son, setSon] = useState(null)
  const [musique, setMusique] = useState(null)
  async function playMusique(name) {
    const connManager = new ConnexionManager()
    if (connManager.getStatus()) {
      console.log('Loading Musique');
      const { sound } = await Audio.Sound.createAsync(
        getSound(name), {
        isLooping: true,
        volume: 0.3
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
    return () => backHandler.remove();
  });

  const saveData = async () => {
    const idUser = navigation.getParam('idUser')
    console.log("ENREGISTREMENT DES DONNEES : id User : " + idUser)

    const data = {
      idUser: navigation.getParam('idUser'),
      numJeu: 9,
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
      AsyncStorage.setItem("bestScore9", JSON.stringify(score))
      setBestScore(score)
    }
  }

  const sourceFond = getImage('Jeu9/Fond')
  const sourceCookie = getImage('Jeu9/Cookie')
  const sourceCookieRouge = getImage('Jeu9/CookieRouge')

  const sourceAssiette = getImage('Jeu9/Assiette')
  const [opaCookie, setOpaCookie] = useState(0)

  let opacityGrille = useRef(new Animated.Value(1)).current
  let opacityCase = useRef(new Animated.Value(1)).current

  let yAssiettes = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current

  let wAssiettes = useRef(
    new Animated.Value(1)
  ).current

  let rotAssiettes = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current

  let opaAssiettes = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current



  // const [bonneReponse,setBonneReponse]=useState(true)
  const [bonneReponse, setBonneReponse] = useState(null)


  const [casesCliquees, setCasesCliquees] = useState([])
  const nbClics = useRef(0)
  // const [casesCliquees, setCasesCliquees] = useState([
  //   [0,0],
  //   [1,0],
  //   [2,0]
  // ])







  useEffect(() => {
    if (vies <= 0) {
      play.current = false
      setBlur(152)
    }
  }, [vies])

  useEffect(() => {
    setVies(5 - niveau)
  }, [niveau])




  const sortQuestions = (niv) => {
    const array = [...navigation.getParam('questions')].filter((value) => value.presence == 1 && value.niveau == niv)
    return array.sort(() => Math.random() - 0.5)
  }

  const [questions, setQuestions] = useState(sortQuestions(niveau))
  const [idProchain, setIdProchain] = useState(4)
  const getNullCoords = (carte) => {
    let indexI
    let indexJ
    for (let i = 0; i < carte.length; i++) {
      for (let j = 0; j < carte[i].length; j++) {
        if (carte[i][j] == null) {
          indexI = i
          indexJ = j
        }
      }
    }
    return [indexI, indexJ]
  }
  const generateCarte = () => {
    var c = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ]
    const dataType = ["donnee", "information", "connaissance"]

    for (let i = 0; i < c[0].length; i++) {
      for (let j = 0; j < dataType.length; j++) {
        let indexI = Math.floor(Math.random() * c.length)
        let indexJ = Math.floor(Math.random() * c[0].length)
        while (c[indexI][indexJ] != null) {
          indexI = Math.floor(Math.random() * c.length)
          indexJ = Math.floor(Math.random() * c[0].length)
        }
        c[indexI][indexJ] = [questions[i], dataType[j]]
      }
    }
    return c
  }
  const [carte, setCarte] = useState(generateCarte())

  const allNullInCarte = (carte) => {
    let allNull = true
    for (let i = 0; i < carte.length; i++) {
      for (let j = 0; j < carte[i].length; j++) {
        if (carte[i][j] != null) {
          allNull = false
        }
      }
    }
    return allNull
  }



  const getProchainsElements = (idProchain, prochains) => {
    var elts = []
    if (idProchain < questions.length - 2) {
      for (let i = idProchain; i < idProchain + 3; i++) {
        elts.push([questions[i], "donnee"])
        elts.push([questions[i], "information"])
        elts.push([questions[i], "connaissance"])
      }
      setIdProchain(idProchain => idProchain + 3)
      return elts.sort(() => Math.random() - 0.5)
    } else {
      if (play.current && carte.length>0) {
        if (allNullInCarte(carte)) {
          play.current = false
          if (vies > 0) {
            console.log("Gagné !")
            setBlur(151)
          } else {
            console.log("Perdu !")
            setBlur(152)
          }
        }
        return []
      }

    }
  }
  const [prochains, setProchains] = useState(getProchainsElements(idProchain, []))

  useEffect(() => {
    setIdProchain(4)
    setProchains(getProchainsElements(4, []))
    setCarte(generateCarte())
  }, [questions])


  const launchGame = (niveau) => {
    console.log("Launch game, niveau : " + niveau)
    setCarte([])
    setQuestions(sortQuestions(niveau))
    setScore(0)
    setVies(5 - niveau)
    setCasesCliquees([])
    setBonneReponse(null)
    setOpaCookie(0)

    if (!play.current) {
      play.current = true

      if (sourceAlice.uri === sourceAlice2.uri) {
        playSon("Son_Sonnette")
        setBlur(0)
      } else {
        setSourceAlice(sourceAlice2)
        playSon("Son_Sonnette")
        setTimeout(() => {
          setBlur(0)
          playMusique("Musique1")
        }, 1000)
      }

    }
  }





  const remove3Elements = (casesCliquees) => {
    var c = [...carte]
    c[casesCliquees[0][0]][casesCliquees[0][1]] = null
    c[casesCliquees[1][0]][casesCliquees[1][1]] = null
    c[casesCliquees[2][0]][casesCliquees[2][1]] = null

    add3Elements(c)
  }

  const add3Elements = (c) => {
    var pro = [...prochains]
    if (pro.length == 0) {
      pro = getProchainsElements(idProchain, pro)
    }
    if (pro.length >= 3) {
      for (let i = 0; i < 3; i++) {
        const coords = getNullCoords(c)
        c[coords[0]][coords[1]] = pro[i]
      }
      pro.splice(0, 3)
      setProchains(pro)
    }
    setCarte(c)
  }

  // useEffect(()=>{
  //   console.log(prochains)
  // },[prochains])

  useEffect(() => {
    // if (carte[0][0] == null) {
    // console.log(carte)
    // }
  }, [carte])




  const checkReponse = (casesCliquees) => {
    const idGroupe = carte[casesCliquees[0][0]][casesCliquees[0][1]][0].idGroupe
    let correct = true
    casesCliquees.forEach(coords => {
      if (carte[coords[0]][coords[1]][0].idGroupe != idGroupe) correct = false
    });
    return correct
  }

  const handleClicCase = (i, j) => {
    if (nbClics.current < 3) {
      const checkInClicked = (i, j) => {
        var c = [...casesCliquees]
        let index = 0
        let inArray = false
        while (c.length > 0 && index < c.length) {
          if (c[index][0] == i && c[index][1] == j) {
            c.splice(index, 1)
            index = 0
            inArray = true
            nbClics.current=Math.max(0,nbClics.current-1)
          } else {
            index += 1
          }
        }
        return [c, inArray]
      }
      var c = checkInClicked(i, j)[0]
      const checked = checkInClicked(i, j)[1]
      if (!checked) {
        c.push([i, j])
        nbClics.current=nbClics.current+1
      }
      if (c.length < 3) {
        setCasesCliquees(c)
      } else {
        if (c.length == 3) {
          setCasesCliquees(c)
          setBonneReponse(checkReponse(c))
        } else {
          setCasesCliquees([])
        }
      }
    }
  }

  useEffect(()=>{
    if(casesCliquees.length==0){
      nbClics.current=0
    }
  },[casesCliquees])

  const animateClicked = Animated.loop(
    Animated.sequence([
      Animated.timing(opacityCase, {
        toValue: 0.5,
        duration: 700,
        useNativeDriver: false,
      }),
      Animated.timing(opacityCase, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false
      }),
    ])
  )

  useEffect(() => {
    if (bonneReponse != null) {
      try {
        animateClicked.stop()
      } catch (error) { }

      Animated.timing(opacityGrille, {
        duration: 300,
        toValue: 0,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false

      }).start(() => {
        animateArrivee(0)
        animateArrivee(1)
        animateArrivee(2)
      })
    }

  }, [bonneReponse])

  useEffect(() => {
    if (casesCliquees.length > 0 && casesCliquees.length < 3) {
      animateClicked.start()
    } else {
      animateClicked.stop()
    }

  }, [casesCliquees])

  const calculRotation = (rotate) => {
    return rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '720deg'],
    })
  }
  const calculTop = (top) => {
    return top.interpolate({
      inputRange: [0, 1],
      outputRange: ['100%', '0%'],
    })
  }

  const calculW = (w) => {
    return w.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '70%'],
    })
  }

  const animateArrivee = (num) => {
    const duration = 600
    const delay = duration / 3 * num

    setTimeout(() => {
      Animated.sequence([

        Animated.parallel([
          Animated.timing(opaAssiettes[num], {
            duration: duration / 3,
            toValue: 1,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false

          }),
          Animated.timing(rotAssiettes[num], {
            duration: duration,
            toValue: 1,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false

          }),
          Animated.timing(yAssiettes[num], {
            duration: duration,
            toValue: 1,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false
          })
        ])
      ])
        .start(() => {
          if (num == 2) {
            setTimeout(() => {
              animateFusion()
            }, 500);
          }
        })
    }, delay);
  }
  const animateFusion = () => {
    Animated.timing(wAssiettes, {
      duration: 300,
      toValue: 0,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start(() => {
      Animated.parallel([
        Animated.timing(rotAssiettes[0], {
          duration: 100,
          toValue: 0,
          useNativeDriver: false
        }),
        Animated.timing(opaAssiettes[0], {
          duration: 100,
          toValue: 0,
          useNativeDriver: false
        }),
        Animated.timing(yAssiettes[0], {
          duration: 100,
          toValue: 0,
          useNativeDriver: false
        }),
        Animated.timing(rotAssiettes[1], {
          duration: 100,
          toValue: 0,
          useNativeDriver: false
        }),
        Animated.timing(opaAssiettes[1], {
          duration: 100,
          toValue: 0,
          useNativeDriver: false
        }),
        Animated.timing(yAssiettes[1], {
          duration: 100,
          toValue: 0,
          useNativeDriver: false
        }),
        Animated.timing(rotAssiettes[2], {
          duration: 100,
          toValue: 0,
          useNativeDriver: false
        }),
        Animated.timing(opaAssiettes[2], {
          duration: 100,
          toValue: 0,
          useNativeDriver: false
        }),
        Animated.timing(yAssiettes[2], {
          duration: 100,
          toValue: 0,
          useNativeDriver: false
        })
      ]).start(() => {

        if (bonneReponse) {
          if (play.current) {
            remove3Elements(casesCliquees)

          }
          playSon("Son_Correct")
          setScore(score => score + 1)
        } else {
          playSon("Son_Faux")
          setVies(vies => vies - 1)
        }
        setOpaCookie(1)
        Animated.timing(wAssiettes, {
          duration: 300,
          toValue: 1,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false
        }).start(() => {

          setTimeout(() => {
            Animated.timing(wAssiettes, {
              duration: 300,
              toValue: 0,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: false
            }).start(() => {
              setOpaCookie(false)
              Animated.timing(opacityGrille, {
                duration: 300,
                toValue: 1,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: false
              }).start(() => {
                setCasesCliquees([])
                setBonneReponse(null)
                setOpaCookie(0)
                Animated.timing(wAssiettes, {
                  duration: 300,
                  toValue: 1,
                  useNativeDriver: false
                }).start()

              })
            })
          }, 800);


        })
      })
    })
  }

  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [countImagesLoaded, setCountImagesLoaded] = useState(0)

  useEffect(() => {
    // console.log(countImagesLoaded)
    if (countImagesLoaded == 2) {
      setIsImageLoaded(true)
    }
  }, [countImagesLoaded])

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: screenWidth,
      height: "100%",
      alignItems: 'center',
      flexDirection: "column",
    },

    fond: {
      position: "absolute",
      marginTop: "4%",
      width: "100%",
      height: "100%",
      resizeMode: "cover"
    },
    casesContainer: {
      position: "absolute",
      flexDirection: "row",
      width: "70%",
      height: "30%",
      top: "35%",
      // backgroundColor:"red"
    },
    imageAssiette: {
      position: "absolute",
      width: "100%",
      height: "100%",
      resizeMode: "contain"
    },
    imageCase: {
      position: "absolute",
      width: "80%",
      height: "100%",
      resizeMode: "contain",
    },
    assiette: {
      position: "absolute",
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    }

  });

  return (
    <>
      <StatusBar hidden />
      <ActivityIndicator
        size="large" color="#541E06"
        style={[GlobalStyle.container, { display: isImageLoaded ? "none" : "flex", zIndex: 0 }]} />
      <View style={[styles.container, {
        opacity: isImageLoaded ? 1 : 0
      }]}>
        <StatusBar hidden />
        <Image
          onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
          source={sourceFond}
          style={styles.fond}
        />
        <BandeauTop
          score={score}
          niveau={niveau}
          vies={vies}
          anglais={anglais}
        />
        <Grille
          carte={carte}
          handleClicCase={handleClicCase}
          casesCliquees={casesCliquees}
          opacityCase={opacityCase}
          opacityGrille={opacityGrille}
          anglais={anglais}
        />

        {bonneReponse != null && casesCliquees[2] != undefined ?
          <Animated.View
            style={[styles.casesContainer, {
              width: calculW(wAssiettes)
            }]}>
            <Case

              key={1}
              i={-1}
              j={-1}
              type={carte[casesCliquees[0][0]][casesCliquees[0][1]]}
              handleClicCase={handleClicCase}
              clicked={false}
              opacityCase={opaAssiettes[0]}
              disabled={true}
              yCase={calculTop(yAssiettes[0])}
              rotAssiettes={calculRotation(rotAssiettes[0])}
              anglais={anglais}
            />
            <Case

              key={2}
              i={-1}
              j={-1}
              type={carte[casesCliquees[1][0]][casesCliquees[1][1]]}
              handleClicCase={handleClicCase}
              clicked={false}
              opacityCase={opaAssiettes[1]}
              disabled={true}
              yCase={calculTop(yAssiettes[1])}
              rotAssiettes={calculRotation(rotAssiettes[1])}
              anglais={anglais}
            />
            <Case
              key={3}
              i={-1}
              j={-1}
              type={carte[casesCliquees[2][0]][casesCliquees[2][1]]}
              handleClicCase={handleClicCase}
              clicked={false}
              opacityCase={opaAssiettes[2]}
              disabled={true}
              yCase={calculTop(yAssiettes[2])}
              rotAssiettes={calculRotation(rotAssiettes[2])}
              anglais={anglais}
            />



            <Animated.View style={[styles.assiette, {
              opacity: opaCookie
            }]}>
              <Image
                source={sourceAssiette}
                style={styles.imageAssiette}
              />
              <Image
                source={bonneReponse ? sourceCookie : sourceCookieRouge}
                style={[styles.imageCase]}

              />
            </Animated.View>
          </Animated.View>
          : null}
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
              source={ sourceGagneMedaille } />
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
              width: "100%",
              height: "100%",
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

