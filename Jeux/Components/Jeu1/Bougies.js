import React,{useState,useEffect} from 'react';
import { Image, View,StyleSheet,TouchableWithoutFeedback,Animated,Text } from 'react-native';

const Bougies = ({
  screenWidth,
  screenHeight,
  handleClick,
  bottomBougies,
  hauteurBougie,
  hauteurFlamme,
  opacityFlammes
}) =>{
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  const [sourcesBougies,setSourceBougies]=  useState([null,null,null,null])

  useEffect(()=>{
    if(sourcesBougies[0]==null){
      setSourceBougies([
        getImage('Jeu1/Bougie1'),
        getImage('Jeu1/Bougie2'),
        getImage('Jeu1/Bougie3'),
        getImage('Jeu1/Bougie4')
      ])
    }
  },[])

  
  const largeurBougie = 10

  const largeurFlamme=16/30*hauteurFlamme

  const sourceFlamme =  getImage('Jeu1/J01_Flamme_01')

  const handleClicBougie= async(numero)=>{
    handleClick(numero)
  }

  return(
    <View
      style={{
        flex:1,
        flexDirection:"column",
        position:'absolute',
        top:screenHeight-hauteurBougie-bottomBougies,
        width:"90%",
        height:hauteurBougie,
        elevation:1,
        zIndex:1
      }}
    >
      <View
        style={{
          flex:1,
          flexDirection:"row",
          position:'absolute',
          width:"100%",
          height:hauteurBougie,

        }}
      >
      <TouchableWithoutFeedback onPress={()=>handleClicBougie(0)} >
        <View style={styles.containerBougies}>
        <Image
          style={styles.bougie}
          source = {sourcesBougies[0]}
        />
        <Text style={styles.proposition}>Actif</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={()=>handleClicBougie(1)}>
      <View style={styles.containerBougies}>
        <Image
          style={styles.bougie}
          source = {sourcesBougies[1]}
        />
          <Text style={styles.proposition}>Passif</Text>
      </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={()=>handleClicBougie(2)}>
        <View  style={styles.containerBougies}>
        <Image
          style={styles.bougie}
          source = {sourcesBougies[2]}
        />

        <Text style={styles.proposition}>Charges</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={()=>handleClicBougie(3)}>
        <View  style={styles.containerBougies}>
        <Image
          style={styles.bougie}
          source = {sourcesBougies[3]}
  />
          <Text style={styles.proposition}>Produits</Text>
</View>
      </TouchableWithoutFeedback>

        </View>
        <Animated.View
          style={{
            flex:1,
            flexDirection:"row",
            position:'absolute',
            width:"100%",
            height:hauteurFlamme,
            top:-hauteurFlamme,
            opacity:opacityFlammes
          }}

        >

        <Image
          style={styles.flamme}
          source = {sourceFlamme}
        />
        <Image
          style={styles.flamme}
          source = {sourceFlamme}
        />
        <Image
          style={styles.flamme}
          source = {sourceFlamme}
        />
        <Image
          style={styles.flamme}
          source = {sourceFlamme}
        />

        </Animated.View>
    </View>

  )
 }



const styles = StyleSheet.create({
  bougie: {
    flex:1,
    resizeMode:"contain",
    width:"100%",
    height:"100%",
    minWidth:"100%"
  },
  flamme:{
    flex:1,
    position:"relative",
    resizeMode:"contain",
    height:"100%",
    width:"10%"
  },
  proposition: {
    flex:1,
    fontSize:30,
    position:"relative",
    textAlign:"center",
    bottom:0,
    color:"white",
    fontFamily:'HELVETICACOMP',
    textShadowColor :"black",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    width:"100%"
  },
  containerBougies:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  }
});

export default Bougies
