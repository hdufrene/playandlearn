import React, { useState, useEffect } from 'react';
import { StyleSheet, Text,Animated, View, Image } from 'react-native';
import Case from './Case'

export default function Grille({
  carte,
  handleClicCase,
  casesCliquees,
  opacityCase,
  opacityGrille,
  anglais
}) {

  const renderLigne = (i) => {
    var ligne = []
    for (let j = 0; j < carte[i].length; j++) {
      // console.log(j)
      let clicked = false

      casesCliquees.forEach(val => {
        if(val[0]==i && val[1]==j) {
          clicked=true
        }
      });
      ligne.push(
        <Case
          key={i + "," + j}
          i={i}
          j={j}
          type={carte[i][j]}
          handleClicCase={handleClicCase}
          clicked={clicked}
          opacityCase={opacityCase}
          disabled={false}
          yCase={0}
          rotAssiettes={"0deg"}
          anglais={anglais}
        />
      )
    }
    return (
      <View
        key={i}
        style={styles.ligneGrille}
      >
        {ligne}
      </View>
    )
  }

  const renderMap = () => {
    var componentsCases = []
    for (let i = 0; i < carte.length; i++) {
      componentsCases.push(renderLigne(i))
    }
    return (componentsCases)
  }


  return (
    <Animated.View 
    style={[styles.grille,{
      opacity:opacityGrille
    }]}>
      {renderMap()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grille: {
    alignItems: 'center',
    justifyContent: 'center',
    width: "70%",
    height: "78%"
  },
  ligneGrille: {
    flex: 1,
    width: "100%",
    height: "30%",
    flexDirection: "row"
  }
});
