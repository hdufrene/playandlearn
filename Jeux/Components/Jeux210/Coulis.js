import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const Coulis = ({
  question,
  score,
  vies,
  niveau,
  colorCoulis,
  anglais
}) => {
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
const [sourceCoeur,setSourceCoeur]=useState(null)
const [sourcesCoulis,setSourcesCoulis]=useState([
  null,
  null,
  null,
  null,
  null,
  null
])

useEffect(()=>{
    if(sourceCoeur==null || sourcesCoulis[0]==null){
        setSourceCoeur(getImage('Coeur'))
        setSourcesCoulis([
          getImage('Jeux210/CoulisJaune'),
          getImage('Jeux210/CoulisOrange'),
          getImage('Jeux210/CoulisRose'),
          getImage('Jeux210/CoulisRouge'),
          getImage('Jeux210/CoulisVert'),
          getImage('Jeux210/CoulisViolet')
        ])
    }
},[])
  const renderCoulis = () => {
    var components = []
    sourcesCoulis.forEach((source, index) => {
      components.push(
        <Image
          key={index}
          style={[styles.imageCoulis, {
            opacity: colorCoulis == index ? 1 : 0
          }]}
          source={source}
        />
      )
    });
    return components
  }

  const renderVies = () => {
    var components = []
    for (let i = 1; i < 5; i++) {
      var opacity = 1
      if (5 - i > vies) {
        opacity = 0
      }
      components.push(
        <Image
          key={i}
          style={[styles.coeur, { opacity: opacity }]}
          source={sourceCoeur} />
      )
    }
    return(
      <View
        style={[styles.coeurContainer,styles.box]}      
      >
        {components}
      </View>
    )
  }


  return (
    <View
      style={styles.coulisContainer}
    >

      {renderCoulis()}
      <View
        style={styles.infoContainer}
      >
        <Text
          numberOfLines={2}
          adjustsFontSizeToFit
          style={styles.question}
        >
          {question!==null ? anglais ?  question.libelleEng : question.libelle : ""}

        </Text>
        <View
        style={[{
          position:"absolute", 
          bottom: "10%",
        left: "55%",
        width: "20%",
      },styles.box]}
        >
        <Text style={[styles.info]}>
          Score : {score}
        </Text>
        <Text style={[styles.info]}>
          {anglais ? 'Level ' : "Niv. " } : {niveau}
        </Text>
        </View>
       
        {renderVies()}
      </View>
    </View>

  )
}



const styles = StyleSheet.create({
  coulisContainer: {
    position: "absolute",
    // backgroundColor:"red",
    width: "110%",
    height: "70%",
    top: "-10%",
    left: "-10%",
    justifyContent: "flex-end"
  },
  imageCoulis: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    // backgroundColor:"purple"
  },
  infoContainer: {
    position: 'absolute',
    bottom: "10%",
    left: "10%",
    width: "80%",
    height: "80%",
    // backgroundColor: "yellow",
    // opacity: 0.5,
  },


  question: {
    position: 'absolute',
    top: "20%",
    left: "3%",
    fontSize: 30,
    color: 'white',
    width: "90%",
    height:"30%",
    textAlign: 'left',
    maxWidth: "90%",
    textShadowColor :"black",
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 3,
      fontFamily:"HELVETICACOMP",
      // backgroundColor:"red"

  },
  info: {
    position: 'relative',
    
    fontSize: 24,
    color: 'white',
    fontWeight: "normal",
    textAlign: 'center',
    textShadowColor :"black",
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    fontFamily:"HELVETICACOMP"

  },
  coeur:{
    flexDirection:"row",
    resizeMode:"contain",
    height:"100%",
    flex:1,
    // width:"100%",
  },
  coeurContainer:{
    position:"absolute",
    width:"22%",
    height:"20%",
    bottom:"10%",
    flexDirection:"row",
    left:"25%",
    padding:"5%",
  },
  box:{
    backgroundColor:"#1B1B1B",
    color: 'white',

    borderRadius:10,
    borderWidth:2,
    borderColor:"white"
  }
});
export default Coulis
