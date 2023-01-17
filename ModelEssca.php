<?php

abstract class ModelEssca
{
    private static $_bdd;
    private static $_host = 'playandadmin.mysql.db';
    private static $_dbname = 'playandadmin';
    private static $_charset="utf8";
    private static $_username="playandadmin";
    private static $_password="7WViBT7H";
    private static $_port="20184";
   

    private static function setBDD(){ // CONNEXION BDD
        self::$_bdd = new PDO('mysql:host='.self::$_host.'; dbname='.self::$_dbname.';charset='.self::$_charset,self::$_username,self::$_password);
        self::$_bdd->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_WARNING);
    }

    protected function getBDD(){ // RECUPERATION BDD
        if(self::$_bdd==null){
            $this->setBDD();
        }
        return self::$_bdd;
    }



    protected function getAttribute($table,$cond,$attribute){
        $var = [];
        $bdd=$this->getBDD();
        $req = $bdd->prepare("SELECT ".$attribute." FROM ".$table.' '.$cond);
        $req->execute();

        while($data = $req->fetch(PDO::FETCH_ASSOC)){
            return $this->hydrate($data);
        }

        $req->closeCursor();

        return $var;


    }

    protected function getAll($table,$cond){ //RECUPERER TOUS LES ELEMENTS DE LA TABLE $table, EN OBJET $obj
        $var = [];
        $bdd=$this->getBDD();
        $req = $bdd->prepare("SELECT * FROM ".$table.' '.$cond);
        $req->execute();

        $array=[];

        while($data = $req->fetch(PDO::FETCH_ASSOC)){
            array_push($array, $this->hydrate($data));
        }

        $req->closeCursor();
        return $array;

    }


    protected function createObjet($table,array $data,array $items){


        $bdd=$this->getBDD();


        $req_attributes= "(".implode(",", $items).")";
        $req_data="('".implode("','", $data)."')";
        $req_mysql="INSERT INTO ".$table." ".$req_attributes." VALUES ".$req_data;
        $req_mysql = str_replace("''",'NULL',$req_mysql) ;
        $req = $bdd->prepare($req_mysql);
        $req->execute();
        return $req;
    }


    protected function updateObjet($table,$condId,$condAttribute){ //RECUPERER TOUS LES ELEMENTS DE LA TABLE $table, EN OBJET $obj

        $bdd=$this->getBDD();
        $req = $bdd->prepare("UPDATE ".$table." SET ".$condAttribute.' '.$condId);
        $req->execute();

        return $this->getAll($table,$condId);
    }

    protected function deleteObjet($table,$cond){
        $bdd=$this->getBDD();
        $req = $bdd->prepare("DELETE FROM ".$table.' '.$cond);
        $req->execute();
        return $req;
    }

    protected function hydrate($data){
      $hydrated = [];
      foreach ($data as $key => $value) {
        if(is_numeric($value)){
          $hydrated[$key]=intval($value);
        }else{
          $hydrated[$key]=$value;
        }
      }
      return $hydrated;
    }
}

?>
