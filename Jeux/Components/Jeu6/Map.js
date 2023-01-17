import React ,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import Case from './Case'

export default function Map({
  carte,
  screenWidth,
  screenHeight,
  lignes,
  colonnes,
  dimCase,
  offset,
  revealed,
  reponses
}) {
  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
  const [sourceMap,setSourceMap]=useState(null)
  useEffect(()=>{
    if(sourceMap==null){
      setSourceMap(getImage('Jeu6/Map'))
    }
  },[])
  



    //PACMAN 0
    // Case reponse 4
    // MUR 5
    // SOL 6
    // VIDE 7
//

    const renderMap=()=>{

      var componentsCases=[]



      for(let i=0;i<lignes;i++){
        for (let j=0;j<colonnes;j++){
          if(![5,7,8].includes(carte[i][j])){
            componentsCases.push(
              <Case
                key={i+","+j}
                type={carte[i][j]}
                x={j}
                y={i}
                offset={offset}
                dimCase={dimCase}
                revealed={revealed}
                reponses={reponses}
                />
            )
          }


        }
      }

      return (componentsCases)
    }


  return (
    <View style={{
      position:"absolute",
      width:screenWidth,
      height:lignes*dimCase,
      alignItems:"center",
      justifyContent:"center",
      // backgroundColor:"red"
    }}>
      <Image
     fadeDuration={0}
       source={sourceMap}
       style={{
         width:"100%",
        height:"100%",
         resizeMode:"contain"
       }}
   />
     
    {renderMap()}
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    alignItems: 'center',
    justifyContent: 'center',
  },
});
