<?php
header('Content-Type: application/json');
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
