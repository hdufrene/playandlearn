<?php
  require_once('Manager.php');
  http_response_code(200);

  $json = file_get_contents('php://input');
  $post = json_decode($json);

  $manager = new Manager();
  
  if(isset($post->type) && isset($post->data)){
      echo $manager->api($post->type,$post->data);
  }else{
    echo $manager->api($post->type,'');
  }

  //echo var_dump($manager->api("test","")['bestScore']);
 ?>