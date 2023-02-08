import React, { useState, useEffect,useRef } from 'react';
import { StyleSheet, Text, View, Image,TouchableWithoutFeedback,Animated} from 'react-native';

export default function Case({
  type,
  i,
  j,
  handleClicCase,
  clicked,
  opacityCase,
  disabled,
  yCase,
  rotAssiettes,
  anglais

}) {

  const [groupe,setGroupe]=useState(null)
  const [infoType,setInfoType]=useState(null)
  const [libelle,setLibelle]=useState("")
  const [dataType,setDataType]=useState("")
  const [source,setSource]=useState(null)
  const getImage = (name) => {
    return { uri: 'https://playandlearn.ovh/Assets/Images/' + name + '.png' }
  }
  const [sourceCoeur, setSourceCoeur] = useState(null)
  const [sources,setSources] = useState(null)
  const [sourceAssiette,setSourceAssiette] = useState(null)

  const dtype = ["donnee", "information", "connaissance"]

  useEffect(() => {
      if (sourceCoeur == null) {
          setSourceCoeur(getImage("Coeur"))
      }
      if(sources==null){
          setSources([getImage('Jeu9/Oeuf'), getImage('Jeu9/Beurre'), getImage('Jeu9/Chocolat')])
      }
      if(sourceAssiette==null){
        setSourceAssiette(getImage('Jeu9/Assiette'))
      }
  }, [])
  
  useEffect(()=>{
    if(type!=null && type[0]!=null && sources!=null && (groupe==null || infoType==null || libelle!="")){
      setGroupe(type[0])
      setInfoType(type[1])
      setLibelle(anglais ? type[0][type[1]+"Eng"]+"" : type[0][type[1]]+"")
      const dtype=["donnee","information","connaissance"]
      const colors = ["red","blue", "yellow" ]
      // setColor(colors[dataType.indexOf(type[1])])
      setDataType(type[1])
      setSource(sources[dtype.indexOf(type[1])])

    }
  })

  useEffect(()=>
  console.log(type)
  ,[libelle])


  
  return (
   
    <TouchableWithoutFeedback
    disabled={disabled}
    onPress={()=>handleClicCase(i,j)}
    >
    <Animated.View
      style={[styles.case, {
        opacity:clicked || disabled ? opacityCase : 1,
        top:disabled ? yCase : null,
        margin:disabled ? 70/4/3/2+"%" : null,
        transform:[{
          rotate:disabled ? rotAssiettes : "0deg"
        }]
      }]}
    >
      {source!=null && type!=null ?
      <View style={styles.assiette}>
        <Image
          source={sourceAssiette}
          style={styles.imageAssiette}
          />
      <Image
      source={source}
      style={[styles.imageCase,{
        width: dataType == "donnee" ? "60%" : "70%",
      }]}

      />
    
      
      
        {/* <Animated.View
        style={{
          opacity:clicked ? opacityCase : 1
        }}> */}
        {groupe!=null && groupe[infoType] != null ?
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          style={[styles.libelle,{
            color : dataType=="connaissance" ? "white" : "black",
            textShadowColor:  dataType=="connaissance" ? "black" : "white",

          }]}
        >
          {libelle}
        </Text>
        : null
      }

      </View>
       : null} 
        {/* </Animated.View> */}
      
    </Animated.View>
    </TouchableWithoutFeedback>

  );
}

const styles = StyleSheet.create({
  case: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent:"center",
    alignItems:"center"
  },
  libelle: {
    fontSize: 24,
    width:"55%",
    fontFamily:'HELVETICACOMP',
    textAlign:"center",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4
  },
  imageAssiette:{
    position:"absolute",
    width:"100%",
    height:"100%",
    resizeMode:"contain"
  },
  imageCase:{
    position:"absolute",
    width:"80%",
    height:"100%",
    resizeMode:"contain",
  },
  assiette:{
    position:"absolute",
    width:"100%",
    height:"100%",
    justifyContent:"center",
    alignItems:"center",
  }
})
