<?php

$conn = mysqli_connect('localhost', 'root', 'root', 'peluqueriapp');

if(!$conn){
    echo 'Error en la conexión';
    exit;
}
// echo 'Conexión Correcta!';