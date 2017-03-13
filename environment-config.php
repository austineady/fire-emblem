<?php
	
	// Set up global variables for production and development
	global $development, $production, $path;

	// Turn $development on for livereload and styles/scripts
	// from the build directory
	$development = true;

	// Turn on $production to test out production and deploy
	// to production servers
	$production = false;

	// Set up path for relative includes
	$path = $_SERVER['DOCUMENT_ROOT'];

	// Make sure development and production aren't ever set
	// at the same time, if so, alert
	if ($development && $production) {
		echo 'Development and Production environments are both set, please choose one environment to work in.';
		exit;
	} elseif (!$development && !$production) {
		echo 'Both Development and Production environments are set to false, please set one to work in.';
		exit;
	}

?>