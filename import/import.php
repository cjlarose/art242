<?php

require_once 'parse_blog.php';

function rrmdir($dir) {
   if (is_dir($dir)) {
     $objects = scandir($dir);
     foreach ($objects as $object) {
       if ($object != "." && $object != "..") {
         if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); else unlink($dir."/".$object);
       }
     }
     reset($objects);
     rmdir($dir);
   }
 }

$user = $_GET['q'];

$blog_data = parse_blog($user);

define('UPLOAD_DIR', dirname(__FILE__) . '/uploads');

$user_dir = UPLOAD_DIR . '/' . $user;
if (file_exists($user_dir)) 
	rrmdir($user_dir);
mkdir($user_dir);


$blog_data = array_reverse($blog_data);
foreach ($blog_data as $i => $post) {	
	$save_dir = UPLOAD_DIR . '/' . $user . '/' . $i;	
	mkdir($save_dir);
	foreach ($post->images as $image_url) {
		$url_parts = parse_url($image_url);
		$save_location = $save_dir . '/' . basename($url_parts['path']);
		save_image($image_url, $save_location);
	}
}


echo "<pre>";
echo json_encode($blog_data);
echo "</pre>";
