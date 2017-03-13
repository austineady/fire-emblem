<!doctype html>
<html lang="en">

<head>

	<title>title</title>
	<meta charset="utf-8"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="description" content="description">

	<?php
		// Set Environment

		// CSS
		if($development) {
			echo '<link rel="stylesheet" href="assets/build/css/compiled.css">';
		} elseif($production) {
			echo '<link rel="stylesheet" href="assets/dist/css/compiled.css">';
		}

		// Live Reload
		if($development) { ?>
			<script>
				document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')
			</script>
		<? }
	?>

	<script src="https://code.createjs.com/easeljs-0.8.2.min.js"></script>

</head>

<!--[if lt IE 8]><body class="ie8"><![!endif]-->
<!--[if lt IE 9]><body class="ie9"><![!endif]-->
<!--[if (gt IE 9)|!(IE)]><!--><body><!--[!endif]-->
