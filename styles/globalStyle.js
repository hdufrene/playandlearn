import { StyleSheet,Dimensions } from 'react-native';

const marronSombre = "#541E06"
const marronClair = "#FDEBE3"

export default GlobalStyle=StyleSheet.create({


  container: {
    flex:1,
    width:"100%",
    height:"100%",
    position:"absolute",
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:marronClair
  },
  champConnexion:{
    width:"90%",
    height:60,
    backgroundColor:marronClair,
    shadowColor: marronSombre,
    shadowOffset: {
    	width: 1,
    	height: 2,
    },
    shadowOpacity: 0.5,
    elevation:10,
    shadowRadius: 5,
    borderRadius:10,
    borderWidth:3,
    borderColor:marronSombre,
    textAlign:'center',
    fontSize:16
  },
  btn:{
    fontSize:20,
    textAlign:'center'
  },

  fond:{
    position:"absolute",
    resizeMode:"cover",
    width:"100%",
    height:"100%",
  },
  coulis:{
    position:"absolute",
    resizeMode:"contain",
    width:"90%",
    height:"100%",
    right:0
  },
  titre:{
    // flex:1,
    fontFamily:"HELVETICACOMP",
    // height:"50%",
    width:"90%",
    color:marronSombre,
    textAlign:"center",
    fontSize:45,
    lineHeight:45,
    textShadowColor :"#230A00",
    textShadowOffset: {width: 1, height: 3},
    textShadowRadius:1,
    paddingTop:0,
    margin:0
  }
});
