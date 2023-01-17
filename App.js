import React ,{useState,useEffect,useCallback} from 'react';
import { StyleSheet, Text, View } from 'react-native';
  import Navigator from './routes/homeStack'
import {useFonts} from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';
// import * as Font  from "expo-font";

//import AppLoading from 'expo-app-loading'

SplashScreen.preventAutoHideAsync();
export default function App() {

 //const [fontLoaded, setFontLoaded] = useState(false);


    const [fontsLoaded]=  useFonts({
        'HELVETICACOMP': require('./assets/fonts/Helvetica-ExtraCompressed.ttf'),
     })

     const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      }, [fontsLoaded]);
  
    if (!fontsLoaded) {
      return null;
    }else{
         return  <><View  onLayout={onLayoutRootView}></View><Navigator /></>
    }
 

    // const [fontsLoaded] = useFonts({
    //   'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
    // });
  
    // const onLayoutRootView = useCallback(async () => {
    //   if (fontsLoaded) {
    //     await SplashScreen.hideAsync();
    //   }
    // }, [fontsLoaded]);
  
    // if (!fontsLoaded) {
    //   return null;
    // }
  
    // return (
    //   <View  onLayout={onLayoutRootView}>
    //     <Text style={{ fontFamily: 'HELVETICACOMP', fontSize: 30 }}>Inter Black</Text>
    //     <Text style={{ fontSize: 30 }}>Platform Default</Text>
    //   </View>
    // );
}
