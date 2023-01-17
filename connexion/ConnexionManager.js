import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";
export default class ConnexionManager {


  constructor() {

    this.state = {
      url: 'https://playandlearn.ovh/Request.php',
      method: 'post',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      isConnected: false
    }
  }

  async getStatus () {
    let type
    
    let isConnected
    await NetInfo.fetch().then(state => {
      // console.log("Connection type", state.type);
      type = state.type
      // console.log("Is connected?", state.isConnected);
      isConnected = state.isConnected
      
    });
    return isConnected
    
  }


  async postData(props) {
    const connected = this.getStatus()
    if (connected) {
      const response = await fetch(this.state.url, {
        method: this.state.method,
        mode: this.state.mode,
        headers: this.state.headers,
        body: JSON.stringify({
          type: props.type,
          data: props.data
        })
      })
      return response
    } else {
      Alert.alert("Absence de connexion","Veuillez activer votre connexion internet pour continuer.")
      return null
    }

  }


}
