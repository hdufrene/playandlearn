import {createStackNavigator} from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'

import Home from '../screens/home'
import Connexion from '../screens/connexion'
import Univers from '../screens/univers'
import JeuxCompta from '../screens/jeuxCompta'
import JeuxSI from '../screens/jeuxSI'
import Jeu1 from '../Jeux/Jeu1'
import Jeu2 from '../Jeux/Jeu2'
import Jeu3 from '../Jeux/Jeu3'
import Jeu4 from '../Jeux/Jeu4'
import Jeu5 from '../Jeux/Jeu5'
import Jeu6 from '../Jeux/Jeu6'
import Jeu7 from '../Jeux/Jeu7'
import Jeu8 from '../Jeux/Jeu8'
import Jeu9 from '../Jeux/Jeu9'
import Jeu10 from '../Jeux/Jeu10'

const screens={
  Home:{
    screen:Home,
    navigationOptions:{
          headerLeft:()=>null
    }
  },
  Connexion:{
    screen:Connexion,
    navigationOptions:{
    }
  },

  Univers:{
    screen:Univers,
    navigationOptions:{
          headerLeft:()=>null
    }
  },
  JeuxCompta:{
    screen:JeuxCompta,
    navigationOptions:{
    }
  },
  JeuxSI:{
    screen:JeuxSI,
    navigationOptions:{
    }
  },

  Jeu1:{
    screen:Jeu1,
    navigationOptions:{   
      headerLeft:()=>null,      
    }
  },
  Jeu2:{
    screen:Jeu2,
    navigationOptions:{
        headerLeft:()=>null,
    }
  },
  Jeu3:{
    screen:Jeu3,
    navigationOptions:{
        headerLeft:()=>null,
    }
  },
  Jeu4:{
    screen:Jeu4,
    navigationOptions:{
        headerLeft:()=>null,
    }
  },
  Jeu5:{
    screen:Jeu5,
    navigationOptions:{
        headerLeft:()=>null,
    }
  },
  Jeu6:{
    screen:Jeu6,
    navigationOptions:{
        headerLeft:()=>null,
    }
  },
  Jeu7:{
    screen:Jeu7,
    navigationOptions:{
        headerLeft:()=>null,
    },
  },
  Jeu8:{
    screen:Jeu8,
    navigationOptions:{
        headerLeft:()=>null,
    },
  },
  Jeu9:{
    screen:Jeu9,
    navigationOptions:{
        headerLeft:()=>null,
    },
  },
  Jeu10:{
    screen:Jeu10,
    navigationOptions:{
        headerLeft:()=>null,
    },
  }
}

const HomeStack = createStackNavigator(
                    screens,
                  {  defaultNavigationOptions:{
                      title:null,
                      headerTransparent: true,
                       gestureEnabled: false,
                      //  headerShown: false
                    }}
            )

export default createAppContainer(HomeStack)
