<?php
  $name   = trim($_POST["name"]);
  $dscore = trim($_POST["score"]);

  if (isset($score) && isset($name) && $score > 0)
  {
    try {
      include $_SERVER['DOCUMENT_ROOT']."/connections/remote.php";
      $db = new PDO('mysql:host='.$hostname_remote.';dbname='.$database_remote.';charset=utf8', $username_remote, $password_remote);
      $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

      $stmt = $db->prepare("CALL ScoreInc(:nam,:scr)");
      $stmt->bindParam(':nam', $name, PDO::PARAM_VARCHAR);
      $stmt->bindParam(':scr', $dscore, PDO::PARAM_INT);
      $stmt->execute();
      $stmt->closeCursor();
    } catch (PDOException $pe) {
      die("Error occurred:" . $pe->getMessage());
    }
  }
?>


