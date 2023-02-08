import React from 'react';
import {Animated,View , Image,Text,TouchableOpacity,Easing,StyleSheet} from 'react-native';
import { useState, useEffect,useRef ,useImperativeHandle,forwardRef} from 'react'


const Cupcake = forwardRef(({
  // backgroundColor='#3cae6f',
  translateX=0,
  id=0,
  scale=1,
  opacity=1,
  rotate="0deg",
  translateY=0,
  reponseI=0,
  cupcakeWidth,
  cupcakeHeight,
  screenHeight,
  handleClick,
  positionDepartTapis,
  initialNum,
  longueurTapis
},ref) => {

  const getImage=(name)=>{
    return {uri:'https://playandlearn.ovh/Assets/Images/'+name+'.png'}
  }
    //validate will be available to parent component using ref
    useImperativeHandle(ref, () => ({
      initialize(numero,reponse) {
        console.log("initialize : "+numero)

        setClickedC(false)
        setAnim1([0,0])
        setAnim2([0,0])
        setAnim3([0,0])
        setSourceCupcake(sourcesCupcakes[Math.floor(Math.random() * sourcesCupcakes.length)])
        setNumero(numero)
        setReponse(reponse)
      },
      getPoubelleRouge(){
        return !clickedC && numero==reponse
      },
      getNumero(){
        return numero
      }
    }));

    

      const [numero,setNumero]=useState(initialNum)
      const [reponse,setReponse]=useState(reponseI)
      const [sourcesCupcakes,setSourcesCupcakes]= useState([
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ])

      useEffect(()=>{
        if(sourcesCupcakes[0]==null){
          setSourcesCupcakes([
            getImage('Jeu3/J03_CupCake_02a'),
            getImage('Jeu3/J03_CupCake_02b'),
            getImage('Jeu3/J03_CupCake_02c'),
            getImage('Jeu3/J03_CupCake_02d'),
            getImage('Jeu3/J03_CupCake_02e'),
            getImage('Jeu3/J03_CupCake_02f'),
            getImage('Jeu3/J03_CupCake_02g'),
            getImage('Jeu3/J03_CupCake_02h'),
            getImage('Jeu3/J03_CupCake_02i'),
            getImage('Jeu3/J03_CupCake_02j'),
            getImage('Jeu3/J03_CupCake_02k'),
            getImage('Jeu3/J03_CupCake_02l')
          ])
          
        }
      },[])
      const[ sourceCupcake,setSourceCupcake] = useState(sourcesCupcakes[id])

      useEffect(()=>{
        setSourceCupcake(sourcesCupcakes[id])
      }, [sourcesCupcakes])

      const [clickedC,setClickedC]=useState(false)
      const [anim1,setAnim1] = useState([0,0])
      const [anim2,setAnim2] = useState([0,0])
      const [anim3,setAnim3] = useState([0,0])

      const sourceCoeur = getImage('Coeur')
      const handleClick2=()=>{
        // console.log("CHILD : Clic sur cupcake : "+numero+" , reponse : "+reponse)
        // console.log(Number.parseInt(JSON.stringify(translateX))>positionDepartTapis)
        if(!clickedC && Number.parseInt(JSON.stringify(translateX))>positionDepartTapis ){
          setClickedC(true)
          if(numero==reponse){
            renderCoeurs()

          }else{
            setSourceCupcake(getImage('Jeu3/J03_CupCake_03Rouge'))
          }
          handleClick(numero==reponse)
        }


        // setTimeout(()=>{
        //   initialize()
        // },2000)

      }




      const durationCoeur=700

      const useAnimCoeur=(delay=0) =>{
          //console.log("Use anim coeur : "+delay)
          var valueSca =(new Animated.Value( 0))
          var valueOpa = (new Animated.Value( 0))
          // var valueX=(new Animated.Value( positionDepartTapis))
          // var valueRot=(new Animated.Value( 0))
          // var valueY=(new Animated.Value( cupcakeHeight/2+20))


          // const arrivee = duration/5
          // const chute =  duration*(posPoubelle)/longueurTapis
          // const repositionnement=duration/15

          const animationCoeur =()=>{
            Animated.sequence([

            Animated.parallel([
              Animated.timing(valueSca, { // ROTATION
                  toValue: 1,
                  duration: durationCoeur,
                  useNativeDriver: false,
                    easing:Easing.cubic
              }),
              Animated.timing(valueOpa, {
                  toValue: 1,
                  duration:  durationCoeur,
                  useNativeDriver: false,
                    easing:Easing.cubic
              }),

            ]),


            Animated.delay(300),
            Animated.timing(valueOpa, {
                toValue: 0,
                duration:   durationCoeur,
                useNativeDriver: false,
                easing:Easing.cubic

            }),

            Animated.timing(valueSca, {
                toValue: 0,
                duration:    durationCoeur,
                useNativeDriver: false

            })


          ]).start(

            ()=>{//deleteElement()
              //console.log("Fin coeurs")
           clearTimeout(timer1)

           }


       )
       }




          let timer1 = setTimeout(()=>animationCoeur(),delay)
          return [valueSca,valueOpa]
        }


    const renderCoeurs =() => {
        setAnim1(useAnimCoeur(0))
        setAnim2(useAnimCoeur(durationCoeur/3))
        setAnim3(useAnimCoeur(durationCoeur/3*1.5))
       }

      return(

      <Animated.View
        style={[
          {
            flex:1,
            position:"absolute",
            width:cupcakeWidth+30,
            height:cupcakeHeight+30,
            zIndex:10-id,
            opacity:opacity,
            alignItems:"center",
            justifyContent:"center",
            // backgroundColor:"pink",
            transform:[
              {
                translateX:translateX
              },
              {
                translateY:translateY
              },
              {
                  scale:scale
              },

              {
                rotate:rotate
              }
            ],
          },
        ]}
      >


      <Animated.View
         style={[styles.boiteCoeur,{
          width:"35%",
          height:"35%",
           left:"5%",
           top:"40%",
          opacity:anim1[0],
          transform:[
            {
                scale:anim1[1]
            },
          ]

        }]}>
         <Image
           fadeDuration={0}
         style={[styles.coeur,{

           transform:[
             {rotate:"-35deg"}
           ]

         }]}
         source={sourceCoeur}
         />
         </Animated.View>
         <Animated.View
            style={[styles.boiteCoeur,{
             width:"30%",
             height:"30%",
              right:"5%",
              top:"30%",
             opacity:anim2[0],
             transform:[
               {
                   scale:anim2[1]
               },
             ]

           }]}>
            <Image
              fadeDuration={0}
            style={[styles.coeur,{

              transform:[
                {rotate:"35deg"}
              ]

            }]}
            source={sourceCoeur}
            />
            </Animated.View>
            <Animated.View
               style={[styles.boiteCoeur,{
                width:"25%",
                height:"25%",
                left:"30%",
                 top:"0%",
                opacity:anim3[0],
                transform:[
                  {
                      scale:anim3[1]
                  },
                ]

              }]}>
               <Image
                 fadeDuration={0}
               style={[styles.coeur,{

                 transform:[
                   {rotate:"-15deg"}
                 ]

               }]}
               source={sourceCoeur}
               />
               </Animated.View>

        <TouchableOpacity onPress={()=>handleClick2()}>
        <Image
          fadeDuration={0}
            style={{
              flex:1,
               width:cupcakeWidth,
               height:cupcakeWidth,
               resizeMode:"contain"
            }}
            source={sourceCupcake}

          />
          <Text 
          adjustsFontSizeToFit={true}
          ellipsizeMode={"tail"}
          numberOfLines={1}
          style={[styles.label,{
          width:cupcakeWidth,}]}>
              {numero}
            </Text>
          </TouchableOpacity>
        </Animated.View>


      )
    }



)




const styles=StyleSheet.create({
  coeur:{
    width:"100%",
    height:"100%",

    resizeMode:"contain",
  },
  boiteCoeur:{
    flex:1,
     position:"absolute",



     zIndex:1,
     alignItems:"center",
     justifyContent:"center",
  },
  label:{
    flex:1,
    position:"absolute",
    fontSize:16,
    bottom:"16%",
    padding:0,
    color:'black',
    textAlign:"center",
    fontFamily:"HELVETICACOMP",

  }
})

export default Cupcake
