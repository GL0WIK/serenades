<?php
$servername = "192.168.10.4"; // Nom du service dans docker-compose.yml
$username = "angais";
$password = "angaispassword";
$dbname = "serenades";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
