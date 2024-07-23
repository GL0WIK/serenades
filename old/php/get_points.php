<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include 'db.php';

$sql = "SELECT * FROM points";
$result = $conn->query($sql);

$points = array();

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $points[] = $row;
    }
}

echo json_encode($points);

$conn->close();
?>
