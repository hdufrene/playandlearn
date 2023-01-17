
import React, { useRef, useEffect, useState } from 'react';
import { AppState, BackHandler,Alert, ActivityIndicator, StatusBar, TouchableOpacity, StyleSheet, Text, View, Dimensions, Animated, Easing, Image, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage  from '@react-native-async-storage/async-storage'


import Fond from "./Components/Jeu8/Fond"
import Train from "./Components/Jeu8/Train"
import Sac from "./Components/Jeu8/Sac"
import Tableau from "./Components/Jeu8/Tableau"
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av'
import * as ScreenOrientation from 'expo-screen-orientation';
import ConnexionManager from '../connexion/ConnexionManager'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['%s: ...']);
LogBox.ignoreAllLogs();

export default function Jeu8({ navigation }) {
  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height
  const anglais = navigation.getParam("anglais")

  const sortQuestions = (niv) => {
    const array = [...navigation.getParam('questions')].filter((value) => value.presence == 1 && value.niveau == niv)
    return array.sort((a, b) => a.numEtape - b.numEtape)
  }
  const [questions, setQuestions] = useState(sortQuestions(1))

  // console.log(questions)
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

  const draggableOpacities = useRef(
    [new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)],
  ).current
  const draggableScale = useRef(
    [new Animated.Value(1), new Animated.Value(1), new Animated.Value(1)],
  ).current

  const [draggablesOpacity, setDraggablesOpacity] = useState(new Animated.Value(1))

  // console.log(questions)

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



  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(navigation.getParam('bestScore'))

  const [niveau, setNiveau] = useState(1)
  const [vies, setVies] = useState(5 - niveau)


  const opacitiesFond = useRef(
    [new Animated.Value(1), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)],
  ).current

  const largeurSac = screenWidth / 4


  const [sacDisabled, setSacDisabled] = useState(false)
  const [x0, setX0] = useState(0)
  const [y0, setY0] = useState(screenHeight*0.83)
  const [x1, setX1] = useState(screenWidth / 2 * 0.9 - largeurSac * 0.8 / 0.9 / 2 - 25)
  const [y1, setY1] = useState(screenHeight*0.83)
  const [x2, setX2] = useState(screenWidth * 0.9 - largeurSac * 0.8 / 0.9 - 50)
  const [y2, setY2] = useState(screenHeight*0.83)
  const [sacRouges, setSacRouge] = useState([false, false, false])


  const [blur, setBlur] = useState(150)
  const play = useRef(false)
  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }
  const getSound = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Sounds/' + name + '.mp3' }
  }
  const sourceAlice1 = getImage('DebutAlice1')
  const sourceAlice2 = getImage('DebutAlice2')
  const sourceConsigne = anglais ? getImage('Jeu8/BulleEng') : getImage('Jeu8/Bulle')
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
      numJeu: 8,
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
      AsyncStorage.setItem("bestScore8", JSON.stringify(score))
      setBestScore(score)
    }
  }




  const calculDecalage = (left) => {
    return left.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '1%'],
    })
  }

  const [wagons, setWagons] = useState([questions[0], null])
  const nbWagons = useRef(2)
  const [left, setLeft] = useState(new Animated.Value(
    screenWidth*1.5
  ))


  const animateDraggable = (value) => {

    const duration = 500

    Animated.timing(draggablesOpacity, {
      toValue: value,
      duration: duration,
      useNativeDriver: false,
      Easing: Easing.linear
    }).start(() => {
      // console.log("Animated : " + value)
      if (value == 0) {
        setReponses(getPropositions(questions))
      }
    })
  }

  const getPropositions = (questions) => {
    // console.log("propositions")
    if (nbWagons.current < questions.length) {
      var propositions = [questions[nbWagons.current - 1]]
      while (propositions.length < 3) {
        var dejaPresent = false
        const prop = questions[Math.floor(Math.random() * questions.length)]
        propositions.forEach((element) => {
          if (element.idEtape == prop.idEtape) dejaPresent = true
        })

        if (!dejaPresent && prop.numEtape > 0 && prop.numEtape < questions.length - 1) {
          propositions.push(prop)
        }
      }

      return propositions.sort(() => Math.random() - 0.5)
    } else {
      return [null, null, null]
    }
  }

  const [reponses, setReponses] = useState(getPropositions(questions))


  const initializeSacs = () => {
    setSacRouge([false, false, false])
    setX0(0)
    setY0(screenHeight*0.83)    
    setX1(screenWidth / 2 * 0.9 - largeurSac * 0.8 / 0.9 / 2 - 25)
    setY1(screenHeight*0.83)
    setX2(screenWidth * 0.9 - largeurSac * 0.8 / 0.9 - 50)
    setY2(screenHeight*0.83)
    animateDraggable(1)


  }

  const changeFond = () => {
    const num = Math.max(0, Math.min(4, nbWagons.current - 2))
    const duration = 1200

    if (num > 0) {
      Animated.parallel([
        Animated.timing(opacitiesFond[num], {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: false,
          Easing: Easing.cubic
        }),
        Animated.timing(opacitiesFond[num - 1], {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
          Easing: Easing.cubic
        })
      ]).start(() => {
        // console.log("Changement de fond")
        initializeSacs()
      })
    } else {
      Animated.parallel([
        Animated.timing(opacitiesFond[0], {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: false,
          Easing: Easing.cubic
        }),
        Animated.timing(opacitiesFond[1], {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
          Easing: Easing.cubic
        }),
        Animated.timing(opacitiesFond[2], {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
          Easing: Easing.cubic
        }),
        Animated.timing(opacitiesFond[3], {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
          Easing: Easing.cubic
        }),
        Animated.timing(opacitiesFond[4], {
          toValue: 0,
          duration: duration,
          useNativeDriver: false,
          Easing: Easing.cubic
        })
      ]).start(() => {
        // console.log("Changement de fond")
        initializeSacs()
      })
    }
  }

  const updateWagon = (num, question) => {
    var wag = [...wagons]

    if (num == wag.length) {
      wag.push(question)
    } else {
      wag[num] = question
    }
    setWagons(wag)
  }

  const animateArrivee = () => {

    const duration = 3000 + 500 * (nbWagons.current - 1)

    Animated.timing(left, { // Arrivée
      toValue: screenWidth/2-screenWidth/4/2*(nbWagons.current *2-1),
      duration: duration,
      useNativeDriver: false,
      Easing: Easing.out(Easing.cubic)
    }).start(
      () => {
        setSacDisabled(false)
        if (nbWagons.current == questions.length) {
          play.current = false
          setSacDisabled(true)
          setTimeout(() => {
            playSon("Son_Loco")
            animateDepart()
          }, 1000);
        }
      }
    )
  }

  const animateDepart = () => {

    setTimeout(() => {
      const duration = 3000 + 500 * (nbWagons.current - 1)
      Animated.timing(left, { // Départ
        toValue:-screenWidth/2-screenWidth/4/2*(nbWagons.current*2 -1),
        duration: duration,
        useNativeDriver: false,
        Easing: Easing.quad
      }).start(
        () => {
          Animated.timing(left, { // Arrivée
            toValue: screenWidth*1.5,
            duration: 0,
            useNativeDriver: false
          }).start()

          if (play.current) {
            changeFond()

            setTimeout(() => {

              animateArrivee()
            }, 1000);
          } else {
            setBlur(151)
          }

        }
      )
    }, 1000);

  }



  useEffect(() => {
    // console.log(wagons)
    if (play.current && wagons[wagons.length - 1] != null && wagons[wagons.length - 1].numEtape < questions.length - 1) {
      var wag = [...wagons]
      var wagon = null
      if (wag.length == questions.length - 1) wagon = questions[questions.length - 1]
      wag.push(wagon)
      nbWagons.current = nbWagons.current + 1
      setTimeout(() => {
        setWagons(wag)
      }, 3000 * 2);

    }
  }, [wagons])



  useEffect(() => {
    if (vies <= 0) {
      play.current = false
      setSacDisabled(false)
      setBlur(152)
      animateDepart()
    }

  }, [vies])

  useEffect(() => {
    setVies(4 - niveau)
  }, [niveau])

  const launchGame = (niveau) => {
    console.log("Launch game, niveau : " + niveau)
    nbWagons.current = 2
    initializeSacs()
    const quest = sortQuestions(niveau)
    setQuestions(quest)
    setScore(0)
    setVies(4 - niveau)

    changeFond()

    setReponses(getPropositions(quest))

    if (!play.current) {
      play.current = true
      setWagons([quest[0], null])

        if (sourceAlice.uri == sourceAlice2.uri) {
          playSon("Son_Sonnette")
          setBlur(0)
          animateArrivee()
        } else {
          setSourceAlice(sourceAlice2)
          playSon("Son_Sonnette")
          setTimeout(() => {
            setBlur(0)
            animateArrivee()
            playMusique("Musique1")
          }, 1000)
        }

    }
  }


  const sacRouge = (num) => {
    var r = [...sacRouges]
    r[num] = true
    setSacRouge(r)
  }

  const handleDrag = (gestureState, id) => {
   
    const duration = 600
    const bonneReponse = reponses[id].numEtape == nbWagons.current - 1

    if (gestureState.dy < - largeurSac * 0.8 * 183 / 512 * 2 / 3) {
      switch (id) {
        case 0:
          if (gestureState.dx > screenWidth * 0.45 - largeurSac) {

            if (bonneReponse) {
              setScore(score => score + 1)
              playSon("Son_Correct")
              setY0(screenHeight/2-(781/2-556)*screenWidth/1000-screenWidth*190/300/4/2-56/190*screenWidth*190/300/4+6)    
              setX0( largeurSac* 0.8/2-4+screenWidth/4)
              setTimeout(() => {
                animateDraggable(0)
              }, 300);

              Animated.timing(draggableOpacities[0], {
                toValue: 0.8,
                duration: duration / 2,
                useNativeDriver: false,
              }).start(() => {
                updateWagon(nbWagons.current - 1, reponses[0])
                Animated.timing(draggableOpacities[0], {
                  toValue: 0,
                  duration: duration / 2,
                  useNativeDriver: false,
                }).start(() => {
                  playSon("Son_Loco")
                  animateDepart()
                  setSacDisabled(true)
                })
              })
            } else {
              setVies(vies => vies - 1)
              sacRouge(0)
              playSon("Son_Faux")
            }


          }
          break;
        case 1:
          if (bonneReponse) {
            setScore(score => score + 1)
            playSon("Son_Correct")
            setY1(screenHeight/2-(781/2-556)*screenWidth/1000-screenWidth*190/300/4/2-56/190*screenWidth*190/300/4+6)    
            setX1( largeurSac* 0.8/2-4+screenWidth/4)  
            animateDraggable(0)
            Animated.timing(draggableOpacities[1], {
              toValue: 0.8,
              duration: duration / 2,
              useNativeDriver: false,
            }).start(() => {
              updateWagon(nbWagons.current - 1, reponses[1])
              Animated.timing(draggableOpacities[1], {
                toValue: 0,
                duration: duration / 2,
                useNativeDriver: false,
              }).start(() => {
                playSon("Son_Loco")
                animateDepart()
                setSacDisabled(true)
              })
            })
          } else {
            setVies(vies => vies - 1)
            sacRouge(1)
            playSon("Son_Faux")
          }


          break;
        case 2:
          if (gestureState.dx < -screenWidth * 0.45 + largeurSac) {
            if (bonneReponse) {
              setScore(score => score + 1)
              playSon("Son_Correct")
              setY2(screenHeight/2-(781/2-556)*screenWidth/1000-screenWidth*190/300/4/2-56/190*screenWidth*190/300/4+6)    
              setX2( largeurSac* 0.8/2-4+screenWidth/4) 
              animateDraggable(0)
              Animated.timing(draggableOpacities[2], {
                toValue: 0.8,
                duration: duration / 2,
                useNativeDriver: false,
              }).start(() => {
                updateWagon(nbWagons.current - 1, reponses[2])
                Animated.timing(draggableOpacities[2], {
                  toValue: 0,
                  duration: duration / 2,
                  useNativeDriver: false,
                }).start(() => {
                  playSon("Son_Loco")
                  animateDepart()
                  setSacDisabled(true)
                })
              })
            } else {
              setVies(vies => vies - 1)
              sacRouge(2)
              playSon("Son_Faux")
            }
          }
          break;
      }
    }
    // }
  }

  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [countImagesLoaded, setCountImagesLoaded] = useState(0)

  useEffect(() => {
    if (countImagesLoaded == 2) {
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
        opacity: isImageLoaded ? 1 : 0
      }]}>



        <Fond
          onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
          num={Math.max(0, Math.min(4, nbWagons.current - 2))}
          opacities={opacitiesFond}
        />

        <Train
          wagons={wagons}
          left={left}
          maxNum={questions.length - 1}
          anglais={anglais}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          largeurSac={largeurSac}
        />

        <Animated.View style={{
          position: "absolute",
          flexDirection: 'row',
          width: "90%",
          height: "100%",
          top:0,
          opacity: draggablesOpacity,
          // opacity:0.4,
          // backgroundColor:"red"
        }}>
          <Sac
            onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
            id={0}
            x={x0}
            y={y0}
            handleDrag={handleDrag}
            largeurSac={largeurSac}
            opacity={draggableOpacities[0]}
            reponse={reponses[0] != null ? (anglais ? reponses[0].libelleEtapeEng : reponses[0].libelleEtape) : null}
            sacDisabled={sacDisabled}
            scale={draggableScale[0]}
            rouge={sacRouges[0]}
          />
          <Sac
            onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
            id={1}
            x={x1}
            y={y1}
            screenWidth={screenWidth}
            handleDrag={handleDrag}
            largeurSac={largeurSac}
            opacity={draggableOpacities[1]}
            reponse={reponses[1] != null ? (anglais ? reponses[1].libelleEtapeEng : reponses[1].libelleEtape) : null}
            sacDisabled={sacDisabled}
            scale={draggableScale[1]}
            rouge={sacRouges[1]}
          />

          <Sac
            onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
            id={2}
            x={x2}
            y={y2}
            screenWidth={screenWidth}
            handleDrag={handleDrag}
            largeurSac={largeurSac}
            opacity={draggableOpacities[2]}
            reponse={reponses[2] != null ? (anglais ? reponses[2].libelleEtapeEng : reponses[2].libelleEtape) : null}
            sacDisabled={sacDisabled}
            scale={draggableScale[2]}
            rouge={sacRouges[2]}
          />


        </Animated.View>

        <Tableau
          score={score}
          vies={vies}
          niveau={niveau}
          question={anglais ? questions[0].libelleProcessusEng : questions[0].libelleProcessus}
          anglais={anglais}
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
