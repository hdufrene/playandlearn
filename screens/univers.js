import React,{useEffect,useState} from 'react';
import { StatusBar,StyleSheet, Text, View, Button,TouchableOpacity,Image,ActivityIndicator,Dimensions,Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import GlobalStyle from '../styles/globalStyle'
import * as ScreenOrientation from 'expo-screen-orientation';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();


export default function Univers({navigation}) {
  const [screenWidth,setScreenWidth] = useState(Dimensions.get('screen').width)
  const [screenHeight,setScreenHeight] = useState(Dimensions.get('screen').height)
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }



  


  const sourceCoulis =getImage('Accueil/Coulis')
  const sourceAlice =getImage('Accueil/PremierePage_Alice_010')
  const sourceFond =getImage('Accueil/PremierePage_FondGaufrette_010')
  const sourceCompta = getImage('Accueil/GateauCompta')
  const sourceSI = getImage('Accueil/GateauSI')
  const sourceEssca = getImage('Accueil/Essca')

  const pressHandler=async(type)=>{
    console.log('UNIVERS : idUser : '+navigation.getParam("idUser"))
    navigation.navigate(type,{idUser:navigation.getParam("idUser")})
  }


  useEffect(()=>{

      const orientation=async()=>{
        //ScreenOrientation.unlockAsync()
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP  )
        await setScreenWidth(Dimensions.get('screen').width)
        await setScreenHeight(Dimensions.get('screen').height)
      }
      orientation()

  },[])


  const [isImageLoaded,setIsImageLoaded]=useState(false)
  const [countImagesLoaded,setCountImagesLoaded]=useState(0)

  useEffect(()=>{
    if(countImagesLoaded>=5){
      setIsImageLoaded(true)
    }
  },[countImagesLoaded])

  return (
    <>
    <StatusBar hidden/>
    <ActivityIndicator
     size="large" color="#541E06"
    style={[GlobalStyle.container,{display: isImageLoaded ? "none" : "flex",zIndex:0}]}/>
    <View style={[GlobalStyle.container,{opacity: isImageLoaded ? 1 : 0}]}>

    <Image
      onLoad={() => setCountImagesLoaded(countImagesLoaded=>countImagesLoaded+1)}
      fadeDuration={0}
      style={[GlobalStyle.fond]}
      source={sourceFond}
      />
    <Image
    onLoad={() => setCountImagesLoaded(countImagesLoaded=>countImagesLoaded+1)}
    fadeDuration={0}
      style={GlobalStyle.coulis}
      source={sourceCoulis}
      />
    <Image
    onLoad={() => setCountImagesLoaded(countImagesLoaded=>countImagesLoaded+1)}
    fadeDuration={0}
      style={[GlobalStyle.fond,{
        top:"15%",
        height:"80%",
        // backgroundColor:"red",
        resizeMode:"contain"
      }]}
      source={sourceAlice}
      />
      <View
      style={{
          position:"absolute",
          top:"5%",
          width:"100%",
          justifyContent:"center",
          alignItems:"center",
          flexDirection:"column",
      }}>

      
      <Text
      adjustsFontSizeToFit={true}
      allowFontScaling={true}
      numberOfLines={1}
      ellipsizeMode="clip"
        style={GlobalStyle.titre}
      >{"Compta et Système d'info,"}</Text>
      <Text
      adjustsFontSizeToFit={true}
      allowFontScaling={true}
      // numberOfLines={1}
      ellipsizeMode="middle"
        style={[GlobalStyle.titre,{
          fontSize:35,
          // fontStyle:"italic"
        }]}
      >{"c'est du gateau !"}</Text>
      </View>
      <TouchableOpacity
        onPress={()=>pressHandler("JeuxCompta")}
          style={[styles.gateau,{
            right:"58%",
            top:"29%"}]}>
        <Image
        onLoad={() => setCountImagesLoaded(countImagesLoaded=>countImagesLoaded+1)}
        fadeDuration={0}
          style={{
          flex:1,
          width:"100%",
          height:"100%",
          resizeMode:"contain"
        }}
          source={sourceCompta}
        />
       </TouchableOpacity>


       <TouchableOpacity
         onPress={()=>pressHandler("JeuxSI")}
           style={[styles.gateau,{
           left:"58%",
           top:"27%"}]}>
         <Image
         onLoad={() => setCountImagesLoaded(countImagesLoaded=>countImagesLoaded+1)}
         fadeDuration={0}
           style={{
           flex:1,
           width:"100%",
           height:"100%",
           resizeMode:"contain"
         }}
           source={sourceSI}
         />
        </TouchableOpacity>
        <TouchableOpacity title="" onPress={ ()=>{ Linking.openURL('https://www.essca.fr/')}} style={{
      position:"absolute",
      bottom:"3%",
      right:"5%",
      width:"20%",
      height:"15%",
      maxWidth:120,

    }}>
      <Image
        source={sourceEssca}
        style={{
          position:"absolute",
          width:"100%",
          height:"100%",
          resizeMode:"contain",
          // backgroundColor:"yellow",
          
        }}
      />
    </TouchableOpacity>
    </View>
    
    </>
  );
}

const styles=StyleSheet.create({
  gateau:{
    position:"absolute",
    width:"40%",
    maxWidth:200,
    height:"30%",
    // opacity:0.5
  }


})
