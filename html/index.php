<?php
// Free PHP File Directory Listing Script - Version 1.4
// HalGatewood.com

// ADD SPECIFIC FILES YOU WANT TO IGNORE HERE
$ignore_file_list = array(".", "..", "Thumbs.db", ".DS_Store", "index.php", "icons.png", '.htaccess', 'functions', 'blocks');

// ADD SPECIFIC FILE EXTENSIONS YOU WANT TO IGNORE HERE
$ignore_ext_list = array();

$title = cleanTitle(basename(dirname(__FILE__)));
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title><?php echo $title; ?></title>
	<style>
		body { font-family:sans-serif; padding: 0; margin: 0; background: #f5f5f5; }
		.wrap { width: 515px; margin: 1em auto; padding: 10px 0 0; background: white; border: solid 1px #ECE9E9;}
		h1 { margin: 0 22px 10px; font-size:120%; font-weight:normal; color: #666; }
		a { color: #399ae5; text-decoration: none; } a:hover { color: #206ba4; text-decoration: underline; }
		.note { padding:  0 5px 25px 0; font-size:80%; color: #666; line-height: 18px; }
		.media_block { position: relative; clear: both;  min-height: 50px; padding: 10px 15px; border-top: solid 1px #ECE9E9; }
		.media_block_image { width: 50px; height: 50px; float: left; margin-right: 10px; }
		.media_block_image a { width: 50px; height: 50px; line-height: 75px; display: block; background: transparent url(https://dl.dropbox.com/u/6771946/icons/icons.png) no-repeat 0 0; } .media_block_image a:hover { text-decoration: none; }
		.media_block_file a { display: block; width: 100%; }
		.media_block_date { margin-top: 4px; font-size: 70%; color: #666; }
		.jpg, .jpeg, .gif, .png { background-position: -50px 0 !important; } 
		.pdf { background-position: -100px 0 !important; }  
		.txt, .rtf { background-position: -150px 0 !important; }
		.xls, .xlsx { background-position: -200px 0 !important; } 
		.ppt, .pptx { background-position: -250px 0 !important; } 
		.doc, .docx { background-position: -300px 0 !important; }
		.zip, .rar, .tar, .gzip { background-position: -350px 0 !important; }
		.swf { background-position: -400px 0 !important; } 
		.fla { background-position: -450px 0 !important; }
		.mp3 { background-position: -500px 0 !important; }
		.wav { background-position: -550px 0 !important; }
		.mp4 { background-position: -600px 0 !important; }
		.mov, .aiff, .m2v, .avi, .pict, .qif { background-position: -650px 0 !important; }
		.wmv, .avi, .mpg { background-position: -700px 0 !important; }
		.flv, .f2v { background-position: -750px 0 !important; }
		.psd { background-position: -800px 0 !important; }
		.ai { background-position: -850px 0 !important; }
		.html, .xhtml, .dhtml, .php, .asp, .css, .js, .inc { background-position: -900px 0 !important; }
		.dir { background-position: -950px 0 !important; }

		@media (max-width:515px) {
			.wrap { width: 100%; border: none; }
		}
	</style>
	<meta name="ROBOTS" content="NOINDEX, NOFOLLOW" />
</head>
<body>
	<div class="wrap">
		<h1><?php echo $title ?></h1>
<?php

function cleanTitle($title)
{
	$title = str_replace("-", " ", $title);
	$title = str_replace("_", " ", $title);
	return ucwords($title);
}

function getFileExt($filename) 
{
	return substr(strrchr($filename,'.'),1);
}

function format_size($file) 
{
	$bytes = filesize($file);
	if ($bytes < 1024) return $bytes.'b';
	elseif ($bytes < 1048576) return round($bytes / 1024, 2).'kb';
	elseif ($bytes < 1073741824) return round($bytes / 1048576, 2).'mb';
	elseif ($bytes < 1099511627776) return round($bytes / 1073741824, 2).'gb';
	else return round($bytes / 1099511627776, 2).'tb';
}

// GET FILES AND PUT INTO AN ARRAY
$files = $directories = array();
$handle=opendir(dirname(__FILE__));
while (($file = readdir($handle))!==false) { $files[] = $file; }
closedir($handle);

sort($files);

// GET DIRECTORIES
foreach($files as $c => $file)
{
	if(!is_dir($file)) { continue; }
	if(in_array($file, $ignore_file_list)) { continue; }
	if(in_array($fileExt, $ignore_ext_list)) { continue; }
	
	echo "<div class=\"media_block\">";
	echo "	<div class=\"media_block_image\"><a href=\"$file\" class=\"dir\">&nbsp;</a></div>";
	echo "	<div class=\"media_block_name\">\n";
	echo "		<div class=\"media_block_file\"><a href=\"$file\">$file</a></div>\n";
	echo "		<div class=\"media_block_date\">Last modified: " .  date("D. F jS, Y - h:ma", filemtime($file)) . "</div>\n";
	echo "	</div>\n";
	echo "</div>";	
	
	unset($files[$c]);
}

// LOOP THE FILES
foreach($files as $file)
{
	$fileExt = getFileExt($file);
	if(in_array($file, $ignore_file_list)) { continue; }
	if(in_array($fileExt, $ignore_ext_list)) { continue; }
	if(is_dir($file)) { $fileExt = "dir"; }

	echo "<div class=\"media_block\">";
	echo "	<div class=\"media_block_image\"><a href=\"$file\" class=\"$fileExt\">&nbsp;</a></div>";
	echo "	<div class=\"media_block_name\">\n";
	echo "		<div class=\"media_block_file\"><a href=\"$file\">$file</a></div>\n";
	echo "		<div class=\"media_block_date\">Size: " . format_size($file) . "<br />Last modified: " .  date("D. F jS, Y - h:ma", filemtime($file)) . "</div>\n";
	echo "	</div>\n";
	echo "</div>";
}


?>
	</div>
</body>
</html>