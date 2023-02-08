import React, { useRef, useEffect, useState } from 'react';
import {AppState, StatusBar,StyleSheet,Alert, Text, View, Dimensions, Animated, Easing, TouchableWithoutFeedback, Image, TouchableOpacity, BackHandler, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import BandeauTop from "./Components/Jeu1/BandeauTop"
import Bougies from "./Components/Jeu1/Bougies"
import Cupcakes from "./Components/Jeu1/Cupcakes"
import FlammeLancee from "./Components/Jeu1/FlammeLancee"
import { BlurView } from 'expo-blur';
import { Audio } from 'expo-av'
import ConnexionManager from '../connexion/ConnexionManager'
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
import * as ScreenOrientation from 'expo-screen-orientation';

export default function Jeu1({ navigation }) {

  const screenWidth = Dimensions.get('screen').width
  const screenHeight = Dimensions.get('screen').height

  const sortQuestions = (niv) => {
    const array = [...navigation.getParam('questions')].filter((value) => value.presence == 1 && value.niveau == niv)
    return array.sort(() => Math.random() - 0.5)
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

 
  const [score, setScore] = useState(-1)

  
  const [niveau, setNiveau] = useState(1)
  const [vies, setVies] = useState(4 - niveau)

  const [bestScore, setBestScore] = useState(navigation.getParam('bestScore'))
  const questionsDepart = sortQuestions(1)
  const [questions, setQuestions] = useState(questionsDepart)
  //const [questionsVues,setQuestionsVues]= useState([questions.pop(Math.floor(Math.random() * navigation.getParam('questions').length))])
  const [questionsVues, setQuestionsVues] = useState([])

  const getSound=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Sounds/'+name+'.mp3'}
  }
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  


  const sourcesCupcake1 = [
    getImage('Jeu1/J01_CupCake_02a'), 
    getImage('Jeu1/J01_CupCakeAllume_01a'), 
    getImage('Jeu1/J01_CupCakeGrille_02a')
  ]
  const sourcesCupcake2 = [getImage('Jeu1/J01_CupCake_02b'), getImage('Jeu1/J01_CupCakeAllume_01b'), getImage('Jeu1/J01_CupCakeGrille_02b')]
  const sourcesCupcake3 = [getImage('Jeu1/J01_CupCake_02c'), getImage('Jeu1/J01_CupCakeAllume_01c'), getImage('Jeu1/J01_CupCakeGrille_02c')]
  const sourcesCupcake4 = [getImage('Jeu1/J01_CupCake_02d'), getImage('Jeu1/J01_CupCakeAllume_01d'), getImage('Jeu1/J01_CupCakeGrille_02d')]
  
  
  
  const sourceFond = getImage('Jeu1/J01_Fond_02')
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



  const [blur, setBlur] = useState(150)
  const sourceConsigne = getImage('Jeu1/Bulle')


  let retryTimeout
  const launchGame = (niveau) => {
    console.log("ID USER : " + navigation.getParam("idUser"))
    if (Number.parseInt(JSON.stringify(topCupcake)) > bandeauTopHeight) {
      clearTimeout(retryTimeout)

      retryTimeout = setTimeout(() => {
        launchGame(niveau)
      }, 800)
    } else {
      if (!play.current && !launcherGame) {
        setNiveau(niveau)
        setQuestionsVues([])
        setQuestions(sortQuestions(niveau))
        play.current = true

        setScore(-1)
        setVies(4 - niveau)
        //console.log(sourceAlice.uri,sourceAlice2.uri)
        if (sourceAlice.uri === sourceAlice2.uri) {
          playSon("Son_Sonnette")

          setBlur(0)
          setLauncherGame(true)

        } else {
          setSourceAlice(sourceAlice2)
          playSon("Son_Sonnette")
          setTimeout(() => {
            setBlur(0)
            setLauncherGame(true)
            playMusique("Musique4")
          }, 1000)
        }
      }



    }

  }

  const play = useRef(false)

  const bandeauTopHeight = 120
  const bottomBougies = 40
  const hauteurBougie = 130
  const hauteurFlamme = 30
  const hauteurCupcake = 70

  const [topCupcake, setTopCupcake] = useState(new Animated.Value(bandeauTopHeight))
  const [dateCupcakesLaunched, setDateCupcakesLaunched] = useState(new Date())
  const [cookiesLaunched, setCookiesLaunched] = useState(false)
  const [launcherGame, setLauncherGame] = useState(false)

  const [topFlammeLancee, setTopFlammeLancee] = useState(new Animated.Value(screenHeight - hauteurBougie - bottomBougies - hauteurFlamme))
  const [opacityCupcake, setOpacityCupcake] = useState(new Animated.Value(0))

  const [opacityFlammes, setOpacityFlammes] = useState(new Animated.Value(1))
  const [opacityFlammeLancee, setOpacityFlammeLancee] = useState(new Animated.Value(0))
  const [numeroFlammeLancee, setNumeroFlammeLancee] = useState(-1)
  const [flammeLaunched, setFlammeLaunched] = useState(false)



  const [etatsCupcakes, setEtatsCupcakes] = useState([0, 0, 0, 0])
  const distanceFranchissable = screenHeight - hauteurBougie - bottomBougies - hauteurFlamme
  const dureeDescente = 8000 // MSEC
  const vitesse = distanceFranchissable / dureeDescente

  useEffect(() => {

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      async () => {
        if(isImageLoaded){
          setIsImageLoaded(false)
          await stopSounds()
          try {
            animationDescente.stop()
          } catch (error) {
            
          }
          try {
            animationOpacite.stop()
          } catch (error) {
            
          }
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
      numJeu: 1,
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
      AsyncStorage.setItem("bestScore1", JSON.stringify(score))
      setBestScore(score)
    }

  }


  const newQuestion = (questions) => {
    console.log("Nouvelle Question")
    console.log("Niveau : " + niveau)

    if (questions.length > 0) {


      if (play.current) {
        var array = [...questionsVues]
        //const quest = questions.pop(Math.floor(Math.random() * questions.length))
        // console.log(questions)
        // console.log(niveau)
        if (questions[0].niveau == niveau) {
          array.push(questions.pop(Math.floor(Math.random() * questions.length)))
          setQuestionsVues(array)
          console.log(array)
          console.log("Il reste " + questions.length + " questions disponibles")
        }
        setEtatsCupcakes([0, 0, 0, 0])
        animCookies()

        setDateCupcakesLaunched(new Date())
        setCookiesLaunched(true)
        setNumeroFlammeLancee(-1)
        setFlammeLaunched(true)
      }





    } else {
      console.log("Test play current")
      if (vies > 0) {
        setBlur(151)
        play.current = false
        setLauncherGame(false)
      } else {
        setBlur(152)
        play.current = false
        setLauncherGame(false)

      }
      console.log("Plus de question disponible : Fin du niveau")
    }

  }

  useEffect(() => {
    if (vies <= 0) {
      setBlur(152)
      play.current = false
      setLauncherGame(false)
    }
  }, [vies])



  useEffect(() => {
    var viesAux = vies
    if (!cookiesLaunched && play.current && score >= 0) {
      var zeros = true
      for (let i = 0; i < 4; i++) {
        if (etatsCupcakes[i] > 0) {
          zeros = false
        }
      }
      if (zeros) {
        console.log("vies avant : " + vies)
        setVies(vies => vies - 1)
        viesAux = viesAux - 1
        console.log("vies après : " + viesAux)
      }
    }

    if (score < 0) {
      setScore(0)
    }

    if (!cookiesLaunched && play.current && viesAux > 0) {

      try {
        newQuestion(questions)





      } catch (error) {
        console.log(error)
        console.log("Test play current3")

        play.current = (false)
      }


    }


  }, [cookiesLaunched, launcherGame])

  const [animationDescente, setAnimationDescente] = useState(Animated.sequence([
    Animated.timing(topCupcake, { // DESCENTE
      toValue: distanceFranchissable - hauteurCupcake - 2 * hauteurFlamme,
      duration: dureeDescente - dureeDescente / 10 * 2 - 2 * hauteurFlamme / vitesse,
      useNativeDriver: false,
      easing: Easing.linear
    }),

    Animated.parallel([
      Animated.timing(topCupcake, { // DESCENTE
        toValue: distanceFranchissable - hauteurCupcake,
        duration: 2 * hauteurFlamme / vitesse,
        useNativeDriver: false,
        easing: Easing.linear
      }),
      Animated.timing(opacityCupcake, { // OPACITY
        toValue: 0,
        duration: 2 * hauteurFlamme / vitesse,
        useNativeDriver: false,
        easing: Easing.cubic
      }),

      Animated.timing(opacityFlammes, { // EXTINCTION DES FLAMMES
        toValue: 0,
        duration: 2 * hauteurFlamme / vitesse,
        useNativeDriver: false,
        easing: Easing.cubic
      })

    ]),

    Animated.timing(topCupcake, { // REPOSITIONNEMENT
      toValue: bandeauTopHeight,
      duration: dureeDescente / 1000,
      useNativeDriver: false,
      easing: Easing.cubic
    })
  ]))
  const [animationOpacite, setAnimationOpacite] = useState(
    Animated.parallel([
      Animated.timing(opacityFlammes, { // OPACITY
        toValue: 1,
        duration: dureeDescente / 20,
        useNativeDriver: false,
        easing: Easing.cubic
      }),
      Animated.timing(opacityCupcake, { // OPACITY
        toValue: 1,
        duration: dureeDescente / 10,
        useNativeDriver: false,
        easing: Easing.cubic
      })
    ])
  )

  const animCookies = () => {

    try {
      setAnimationOpacite(
        Animated.parallel([
          Animated.timing(opacityFlammes, { // OPACITY
            toValue: 1,
            duration: dureeDescente / 20,
            useNativeDriver: false,
            easing: Easing.cubic
          }),
          Animated.timing(opacityCupcake, { // OPACITY
            toValue: 1,
            duration: dureeDescente / 10,
            useNativeDriver: false,
            easing: Easing.cubic
          })
        ])
      )
      animationOpacite.start(
        () => {
          setFlammeLaunched(false)
          setAnimationDescente(Animated.sequence([
            Animated.timing(topCupcake, { // DESCENTE
              toValue: distanceFranchissable - hauteurCupcake - 2 * hauteurFlamme,
              duration: dureeDescente - dureeDescente / 10 * 2 - 2 * hauteurFlamme / vitesse,
              useNativeDriver: false,
              easing: Easing.linear
            }),

            Animated.parallel([
              Animated.timing(topCupcake, { // DESCENTE
                toValue: distanceFranchissable - hauteurCupcake,
                duration: 2 * hauteurFlamme / vitesse,
                useNativeDriver: false,
                easing: Easing.linear
              }),
              Animated.timing(opacityCupcake, { // OPACITY
                toValue: 0,
                duration: 2 * hauteurFlamme / vitesse,
                useNativeDriver: false,
                easing: Easing.cubic
              }),

              Animated.timing(opacityFlammes, { // EXTINCTION DES FLAMMES
                toValue: 0,
                duration: 2 * hauteurFlamme / vitesse,
                useNativeDriver: false,
                easing: Easing.cubic
              })

            ]),

            Animated.timing(topCupcake, { // REPOSITIONNEMENT
              toValue: bandeauTopHeight,
              duration: dureeDescente / 1000,
              useNativeDriver: false,
              easing: Easing.cubic
            })
          ]))
          animationDescente.start(
            () => {
              setTimeout(() => {
                setCookiesLaunched(false)
                console.log("Termine Cupcakes")
              }, 1000)
            })

        }

      )

    } catch (error) {
      console.log(error)
    }

  }

  const launchFlamme = (name, currentTop) => {
    if (flammeLaunched) {
      console.log("Flamme déjà lancée")
    } else {
      try {
        var durationFlamme = 800

        var distImpact = durationFlamme * vitesse
        var limiteBasse = 2 * hauteurFlamme + vitesse * (durationFlamme) * 1.05 + hauteurCupcake / 2

        if (distanceFranchissable - currentTop - distImpact - hauteurCupcake <= limiteBasse) {
          durationFlamme = durationFlamme / 2
          distImpact = durationFlamme * vitesse
          limiteBasse = 2 * hauteurFlamme + vitesse * (durationFlamme) * 1.2 + hauteurCupcake
        }



        if (distanceFranchissable - currentTop - distImpact - hauteurCupcake > limiteBasse) {
          setFlammeLaunched(true)
          const animation = Animated.sequence([

            Animated.parallel([
              Animated.timing(opacityFlammeLancee, { // Affichage flamme lancée DES FLAMMES
                toValue: 1,
                duration: durationFlamme / 100,
                useNativeDriver: false,
                easing: Easing.linear
              }),
              Animated.timing(opacityFlammes, { // EXTINCTION DES FLAMMES
                toValue: 0,
                duration: durationFlamme / 100,
                useNativeDriver: false,
                easing: Easing.cubic
              }),
            ]),

            Animated.timing(topFlammeLancee, { // ENVOI DE LA FLAMME
              toValue: currentTop + hauteurCupcake + distImpact + hauteurFlamme,
              duration: durationFlamme - durationFlamme / 100 - durationFlamme / 5,
              useNativeDriver: false,
              easing: Easing.cubic
            })]).start(
              () => {

                revealCupcake(name)
                setOpacityFlammeLancee(new Animated.Value(0))
                setTopFlammeLancee(new Animated.Value(distanceFranchissable))


                Animated.parallel([
                  Animated.timing(opacityFlammeLancee, { // EXTINCTION DE LA FLAMME LANCEE
                    toValue: 0,
                    duration: durationFlamme / 5,
                    useNativeDriver: false,
                    easing: Easing.linear
                  }),
                  Animated.timing(topFlammeLancee, { // EXTINCTION DE LA FLAMME LANCEE
                    toValue: distanceFranchissable,
                    duration: durationFlamme / 15,
                    useNativeDriver: false,
                    easing: Easing.cubic
                  }),
                  Animated.timing(opacityFlammes, { // ALLUMAGE DES FLAMMES
                    toValue: 1,
                    duration: durationFlamme / 5,
                    useNativeDriver: false,
                    easing: Easing.cubic
                  })

                ]).start(
                  () => {
                    setFlammeLaunched(false)

                    console.log("Fin de la séquence de lancement")
                    // console.log(topFlammeLancee)

                  }

                )

              }
            )


          console.log("Animation flamme lancée")
        } else {
          setFlammeLaunched(false)
          console.log("Les cupcakes sont trop bas. : " + distImpact)
        }
      } catch (error) {
        console.log(error)
      }



    }


  }

  const handleClick = async (name) => {
    try {
      if (!flammeLaunched) {
        setNumeroFlammeLancee(name)
      }
      //newQuestion()
      const currentTop = (distanceFranchissable) * (new Date() - dateCupcakesLaunched) / screenHeight * vitesse
      if (play.current) {
        launchFlamme(name, currentTop)
      }


      return [topFlammeLancee, opacityFlammeLancee, numeroFlammeLancee]
    } catch (error) {
      concole.log(error)
    }

  };



  const revealCupcake = (id) => {
    var etats = [...etatsCupcakes]
    if (etats[id] == 0) {
      etats[id] = getResult(id)
    }
    setEtatsCupcakes(etats)
  }

  const getResult = (id) => {
    const reponses = ['ACTIF', 'PASSIF', 'CHARGES', 'PRODUITS']
    if (questionsVues[questionsVues.length - 1].reponse.toUpperCase() == reponses[id]) {
      playSon("Son_Sonnette")
      setScore(score => score + 1)
      return 1
    } else {
      playSon("Son_Feu")
      setVies(vies => vies - 1)
      return 2
    }
  }

  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [countImagesLoaded, setCountImagesLoaded] = useState(0)

  useEffect(() => {
    if (countImagesLoaded == 3) {
      setIsImageLoaded(true)
    }
  }, [countImagesLoaded])
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:screenWidth,
      height:screenHeight,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  
  return (

    <>
    <StatusBar hidden/>
      <ActivityIndicator
        size="large" color="#541E06"
        style={[styles.container, { display: isImageLoaded ? "none" : "flex", zIndex: 0 }]} />
      <View style={[styles.container, { opacity: isImageLoaded ? 1 : 0 }]}>

        <Image
          onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
          fadeDuration={0}
          style={{
            width: screenWidth,
            height: screenHeight,
            resizeMode: 'cover',

          }}
          source={sourceFond}

        />
        <BandeauTop
          questionsVues={questionsVues}
          score={score}
          bandeauTopHeight={bandeauTopHeight}
          viesRestantes={vies}
          niveau={niveau}
        />


        <Cupcakes
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          topCupcake={topCupcake}
          hauteurCupcake={hauteurCupcake}
          sourceCupcake1={sourcesCupcake1[etatsCupcakes[0]]}
          sourceCupcake2={sourcesCupcake2[etatsCupcakes[1]]}
          sourceCupcake3={sourcesCupcake3[etatsCupcakes[2]]}
          sourceCupcake4={sourcesCupcake4[etatsCupcakes[3]]}
          opacityCupcake={opacityCupcake}
        />
        <FlammeLancee
          hauteurFlamme={hauteurFlamme}
          topFlammeLancee={topFlammeLancee}
          numeroFlammeLancee={numeroFlammeLancee}
          opacityFlammeLancee={opacityFlammeLancee}
        />

        <Bougies
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          handleClick={handleClick}
          bottomBougies={bottomBougies}
          hauteurBougie={hauteurBougie}
          hauteurFlamme={hauteurFlamme}
          opacityFlammes={opacityFlammes}

        />
        {blur == 150 ? // ENTREE
          <TouchableWithoutFeedback
            onPress={() => {
              if (!play.current) launchGame(niveau)
            }}
            style={{
              position: "absolute",
              alignItems: "center",
              
              zIndex: 20,


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

            {niveau < 3 ?

              <TouchableOpacity
                onPress={() => {
                  if (niveau < 3) {
                    if (!play.current) launchGame(niveau+1)
                  } else {
                    if (!play.current) launchGame(niveau)
                  }

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
                await stopSounds()
                await saveData()
                try {
                  animationDescente.stop()
                } catch (error) {
                  
                }
                try {
                  animationOpacite.stop()
                } catch (error) {
                  
                }
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

            {niveau < 3 ?
              <TouchableOpacity
                onPress={() => {
                  if (niveau < 3) {
                    if (!play.current) launchGame(niveau+1)
                  } else {
                    if (!play.current) launchGame(niveau)
                  }


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
                try {
                  animationDescente.stop()
                } catch (error) {
                  
                }
                try {
                  animationOpacite.stop()
                } catch (error) {
                  
                }
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


      </View>
    </>
  );
}

