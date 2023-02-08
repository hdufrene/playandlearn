import React, { useEffect, useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';

import ConnexionManager from '../connexion/ConnexionManager'

import GlobalStyle from '../styles/globalStyle'
import * as ScreenOrientation from 'expo-screen-orientation';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

export default function Connexion({ navigation }) {
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('screen').width)
  const [screenHeight, setScreenHeight] = useState(Dimensions.get('screen').height)
  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }
  const sourceCoulis = getImage('Accueil/Coulis')

  const sourceFond = getImage('Accueil/PremierePage_FondGaufrette_010')
  const [json, setJson] = useState('Cliquer')

  const [groupes, setGroupes] = useState([])
  const connManager = new ConnexionManager()

  useEffect(() => {

    const orientation = async () => {
      //ScreenOrientation.unlockAsync()
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
      await setScreenWidth(Dimensions.get('screen').width)
      await setScreenHeight(Dimensions.get('screen').height)
    }
    orientation()

  }, [])
  const [nom, setNom] = useState("")
  const [prenom, setPrenom] = useState("")
  const [email, setEmail] = useState("")
  const [campusSelected, setCampusSelected] = useState('')
  const [groupeSelected, setGroupeSelected] = useState('')

  const [alerte, setAlerte] = useState("")

  const getLocalData = async () => {
    try {
      const user = await AsyncStorage.getItem('user')
      console.log("USER LOCAL : " + user)


      // if(user!=null){
      //   const infos = JSON.parse(user)
      //   setNom(infos.nom)
      //   setPrenom(infos.prenom)
      //   setCampusSelected(infos.campus)
      //   setGroupeSelected(infos.groupe)
      // }


      return user


    } catch (error) {
      console.log(error)
      return null
    }
  }

  useEffect(() => {
    const redirection = async () => {
      const user = await getLocalData()
      console.log(user)
      if (user != null && JSON.parse(user).idUser >= 0) {
        console.log('Données locales récupérées')
        navigation.navigate('Univers', { idUser: JSON.parse(user).idUser })
      } else {
        console.log('Absence de données locales')
      }
    }
    redirection()
  }, [])


  useEffect(() => {

    const getGroupes = async () => {
      try {

        if (connManager.getStatus()) {
          const data = {
          }

          const response = await connManager.postData(

            {
              type: 'groupes',
              data: data
            }

          )
          const json = await response.json()
          const grps = await []
          await json.forEach(elt => grps.push([elt.idGroupe, elt.campus, elt.groupe]));
          await setGroupes(grps)
          console.log("Groupes chargés")

        } else {

          Alert.alert("Absence de connexion", "Veuillez activer votre connexion internet pour continuer.")
          console.log("Pas d'enregistrement BDD")
        }


      } catch (e) {

        console.log(e);
      }
    }

    getGroupes()

  }, [])

  const saveData = async (data) => {
    await AsyncStorage.setItem('user', JSON.stringify(data))
    console.log("User saved")
    //console.log(await AsyncStorage.getItem('user'))
  }


  const clic = async () => {

    try {
      const data = {
        nom: nom,
        prenom: prenom,
        email: email,
        campus: campusSelected,
        groupe: groupeSelected
      }
      if (connManager.getStatus()) {
        setIsImageLoaded(false)
        const response = await connManager.postData(

          {
            type: 'login',
            data: data
          }

        )
        const json = await response.json()
        setIsImageLoaded(true)
        if (json.connectionApprouvee) {
          console.log("Connexion approuvée")
          await saveData(json.etudiant)
          await navigation.navigate("Univers", {
            idUser: json.etudiant.idUser
          })
          setAlerte("")
        } else {
          Alert.alert("Connexion", "Erreur d'authentification, veuillez réessayer")
        }
      } else {

        Alert.alert("Absence de connexion", "Veuillez activer votre connexion internet pour continuer.")
      }


    } catch (e) {

      console.log(e);
    }


  }


  const renderItemsPicker = (type, groupes) => {
    var index
    if (type == "campus") {
      index = 1
    } else {
      index = 2
    }
    var liste = groupes.map(elt => {
      if (index == 2) {

        if (elt[1] == campusSelected) {

          return (elt[index])
        } else {
          return ('')
        }

      } else {
        return elt[index]
      }

    })

    liste = liste.filter(function (elem, pos) {
      return liste.indexOf(elem) == pos && elem != '';
    });

    liste = liste.sort()
    const items = liste.map(item => {
      return (
        <Picker.Item  color="black"  key={item} label={item} value={item} />
      )
    }
    )
    return (
      items
    )
  }

  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [countImagesLoaded, setCountImagesLoaded] = useState(0)

  useEffect(() => {
    if (countImagesLoaded >= 2) {
      setIsImageLoaded(true)
    }
  }, [countImagesLoaded])

  return (
    <>
      <ActivityIndicator
        size="large" color="#541E06"
        style={[GlobalStyle.container, { display: isImageLoaded ? "none" : "flex", zIndex: 0 }]} />
      <View style={[GlobalStyle.container, { opacity: isImageLoaded ? 1 : 0 }]}>

        <Image
          onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
          fadeDuration={0}
          style={[GlobalStyle.fond, { width: screenWidth, height: screenHeight }]}
          source={sourceFond}
        />
        <Image
          onLoad={() => setCountImagesLoaded(countImagesLoaded => countImagesLoaded + 1)}
          fadeDuration={0}
          style={GlobalStyle.coulis}
          source={sourceCoulis}
        />

        <View
          style={{
            position: 'absolute',
            top: "30%",
            flex: 1,
            flexDirection: 'row',
            width: "90%"
          }}>
          <TextInput
            style={[GlobalStyle.champConnexion, { marginRight: 10, flex: 1 }]}
            underlineColorAndroid="transparent"
            placeholder="Nom"
            placeholderTextColor="gray"
            autoCapitalize="none"
            onChangeText={value => setNom(value)}
            value={nom}
          />
          <TextInput
            style={[GlobalStyle.champConnexion, { marginLeft: 10, flex: 1 }]}
            underlineColorAndroid="transparent"
            placeholder="Prénom"
            placeholderTextColor="gray"
            autoCapitalize="none"
            value={prenom}
            onChangeText={value => setPrenom(value)}
          />
        </View>

        <TextInput
          style={[GlobalStyle.champConnexion, {
            position: 'absolute',
            top: "50%",
            flexDirection: 'row',
            width: "90%",
            height: 60
          }]}
          underlineColorAndroid="transparent"
          placeholder="Email ESSCA"
          placeholderTextColor="gray"
          autoCapitalize="none"
          value={email}
          placeholderStyle={{ color: "red" }}
          onChangeText={value => setEmail(value)}

        />

        <View
          style={{
            position: 'absolute',
            top: "70%",
            flexDirection: 'row',
            width: "90%",
            height: 60
          }}>
          <View
            style={[GlobalStyle.champConnexion, { marginRight: 10, flex: 1 }]}
          >
            <Picker
              selectedValue={campusSelected}
              mode={'dropdown'}
              style={{ 
                height: 50, 
                width: 150,
                justifyContent:"center",
                overflow:"hidden"
            }}
              
              onValueChange={(value) => setCampusSelected(value)}
            >
              <Picker.Item key={'Campus'} color="gray" label={'Campus'} value={'Campus'} />
              {renderItemsPicker('campus', groupes)}
            </Picker>
          </View>

          <View
            style={[GlobalStyle.champConnexion, { marginLeft: 10, flex: 1 }]}
          >
            <Picker
              mode={'dropdown'}
              selectedValue={groupeSelected}
              enabled={true}
              style={{ height: 50, 
                width: 150,
                justifyContent:"center",
                overflow:"hidden" }}
              // itemStyle={{ color: 'black' }}
              onValueChange={(value) => setGroupeSelected(value)}
            >
              <Picker.Item key={'Groupe'} color="gray" label={'Groupe'} value={'Groupe'} /> 
              {renderItemsPicker('groupes', groupes)}
            </Picker>
          </View>

        </View>
        <TouchableOpacity
          onPress={() => clic()}
          style={[GlobalStyle.champConnexion,
          {
            position: "absolute",
            top: "85%",
            width: "50%",
            alignItems: 'center',
            justifyContent: 'center'
          }]}
        >

          <Text style={GlobalStyle.btn}>Se connecter</Text>
        </TouchableOpacity>
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
        numberOfLines={1}
        ellipsizeMode="middle"
          style={GlobalStyle.titre}
        >Connexion</Text>
        </View>
      </View>
    </>
  );
}
