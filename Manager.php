<?php
require_once("ModelEssca.php");

class Manager extends ModelEssca{
  public function skip_accents( $str, $charset='utf-8' ) {

    $str = htmlentities( $str, ENT_NOQUOTES, $charset );

    $str = preg_replace( '#&([A-za-z])(?:acute|cedil|caron|circ|grave|orn|ring|slash|th|tilde|uml);#', '\1', $str );
    $str = preg_replace( '#&([A-za-z]{2})(?:lig);#', '\1', $str );
    $str = preg_replace( '#&[^;]+;#', '', $str );

    return $str;
}

public function formatage($str){
  return strtoupper($this->skip_accents(trim ( $str)));
}


  public function api($action,$data){
    switch ($action) {

      case 'getContenusJeux':// DATA : numJeu,idUser
        // GET QUESTIONS
        $contenus = [];
        $contenus['questions']=$this->getAll("questionsjeu".sprintf("%02d",$data->numJeu),'');
        if($data->idUser>=0){
          $contenus['bestScore']=$this->getAttribute("scores",'WHERE idUser ="'.$data->idUser.'"',"scoreJeu".$data->numJeu)["scoreJeu".$data->numJeu];
        }

        echo json_encode($contenus);

        break;

      case 'partieJouee': // DATA : idUser, numJeu
        if($this->getAll("parties",'WHERE idUser = "'.$data->idUser.'"')==null){
          $this->createObjet("parties",
            array(
              'idUser'=>$data->idUser
            ),
            array(
              'idUser'
            )
          );
        }
        $nbParties = $this->getAttribute("parties",'WHERE idUser = "'.$data->idUser.'"',"nbPartiesJeu".$data->numJeu)["nbPartiesJeu".$data->numJeu];
        echo  json_encode($this->updateObjet("parties",'WHERE idUser = "'.$data->idUser.'"',"nbPartiesJeu".$data->numJeu.' = "'.($nbParties+1).'"')[0]);
        break;

      case 'saveScore': // DATA : idUser, numJeu, score
        if($this->getAll("scores",'WHERE idUser = "'.$data->idUser.'"')==null){
          $this->createObjet("scores",
            array(
              'idUser'=>$data->idUser
            ),
            array(
              'idUser'
            )
          );
        }
        echo  json_encode($this->updateObjet("scores",'WHERE idUser = "'.$data->idUser.'"',"scoreJeu".$data->numJeu.' = "'.$data->score.'"')[0]);
        break;

      case 'getScores': // DATA : idUser
        if($this->getAll("scores",'WHERE idUser = "'.$data->idUser.'"')==null){
          $this->createObjet("scores",
            array(
              'idUser'=>$data->idUser
            ),
            array(
              'idUser'
            )
          );
        }
        echo  json_encode($this->getAll("scores",'WHERE idUser = "'.$data->idUser.'"')[0]);
        break;
      
      case 'groupes':

        echo  json_encode($this->getAll("groupes",''));

        break;

      case 'test':
           // GET QUESTIONS
        $contenus = [];
        // $contenus['questions']=$this->getAll("questionsjeu".sprintf("%02d",'01'),'');

        $contenus['bestScore']=$this->getAttribute("scores",'WHERE idUser ="1"',"scoreJeu1")[0];
        
        
        echo json_encode($contenus);

        break;


      case 'login': // DATA : nom prenom email campus groupe
        $user = $this->getAll("etudiants",'WHERE email ="'.$data->email.'"');

        if(empty($user)){
          $donnees = [];
          $donnees['etudiant']=[];
          $donnees['connectionApprouvee']=false;
          echo json_encode($donnees);
        }else{

          // if(empty($user)){
          //   $this->createObjet("etudiants",
          //     array(
          //       'nom'=>$data['nom'],
          //       'prenom'=>$data['prenom'],
          //       'email'=>$data->email,
          //       'campus'=>$data['campus'],
          //       'groupe'=>$data['groupe']
          //     ),
          //     array(
          //       'nom',
          //       'prenom',
          //       'email',
          //       'campus',
          //       'groupe'
          //     )
          //   );
          // }
          // $user = $this->getAll("etudiants",'WHERE email ="'.$data->email.'"')[0];
          $user=$user[0];
          $count=0;

          foreach($user as $key=>$info){
            if($this->formatage( $info)==$this->formatage($data->$key))
            {
              $count=$count+1;
            }
          }

          $donnees = [];
          $donnees['etudiant']=$user;
          $donnees['connectionApprouvee']=$count>3;

          echo json_encode(  $donnees);
        }

        break;



      default:
        break;
    }

  }
}

 ?>
