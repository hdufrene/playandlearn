import React ,{useState,useEffect,useCallback} from 'react';
import { StyleSheet, Text, View ,ActivityIndicator} from 'react-native';
  import Navigator from './routes/homeStack'
import {useFonts} from 'expo-font'
import * as SplashScreen from 'expo-splash-screen';
import GlobalStyle from './styles/globalStyle'

//import AppLoading from 'expo-app-loading'

SplashScreen.preventAutoHideAsync();

export default function App() {

 //const [fontLoaded, setFontLoaded] = useState(false);


    const [fontsLoaded,setFontLoaded]=  useFonts({
        'HELVETICACOMP': require('./assets/fonts/Helvetica-ExtraCompressed.ttf'),
     })

     



     const onLayoutRootView = useCallback(async () => {
        await SplashScreen.hideAsync()
      }, [fontsLoaded]);
  
    if (!fontsLoaded) {
      return <View style={{flex:1}} ><ActivityIndicator size="large" color="#541E06" style={[GlobalStyle.container, { display:"flex", zIndex: 0 }]} /></View>
    }else{
      // return <View style={{flex:1,justifyContent:"center",alignItems:"center"}} ><ActivityIndicator size="large" color="#541E06" style={[GlobalStyle.container, { display:"flex", zIndex: 0 }]} /></View>
  
        return  <View style={{flex:1}} ><Navigator /><View onLayout={onLayoutRootView}></View></View>
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
