import React,{useState,useEffect} from 'react';
import { Image, Animated } from 'react-native';

const FlammeLancee = ({
  hauteurFlamme,
  topFlammeLancee,
  numeroFlammeLancee,
  opacityFlammeLancee
}) =>{
  const [sourceFlamme,setSourceFlamme]=useState(null)
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }

  useEffect(()=>{
    if(sourceFlamme==null){
      setSourceFlamme(getImage("Jeu1/J01_Flamme_01"))
    }
  },[])

  return(
    <Animated.View
      style={{
        flex:1,
        flexDirection:"column",
        position:'absolute',
        top:topFlammeLancee,
        width:"90%",
        height:hauteurFlamme,
        alignItems:"flex-start",
        opacity:opacityFlammeLancee
      }}
    >

        <Image
          style={{
            flex:1,
            width:"25%",
            resizeMode:"contain",
            height:"100%",
            left:25*(numeroFlammeLancee)+"%"
          }}
          source = {sourceFlamme}
        />
    </Animated.View>

  )


}




export default FlammeLancee
