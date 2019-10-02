<?php
    //comment these two lines when errors are resolved
    error_reporting(E_ALL);
    ini_set('display_errors',1);

    $json = json_decode(file_get_contents("php://input"));
    // $categories = $json->categories;

    // $json = json_decode($_POST["myData"]);
    print_r($json->categories);
    //
    // $info = json_encode($json);
    // print_r($info);
    // $file = fopen('test.json','w+') or die("File not found");
    // fwrite($file, $json);
    // fclose($file);exit;

    // if(isset($_POST['json'])) {
    //     $json = json_encode($_POST['json'],JSON_PRETTY_PRINT);
    //     $fp = fopen('results.json', 'w');
    //     fwrite($fp, $json);
    //     fclose($fp);
    // } else {
    //     echo "Object Not Received";
    // }
?>
