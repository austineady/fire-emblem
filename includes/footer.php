
	<?php
		// Set Environment

		if($development) {
			echo '<script src="assets/build/js/vendor.min.js"/></script>';
			echo '<script src="assets/build/js/project.min.js"/></script>';
		} elseif($production) {
			echo '<script src="assets/dist/js/vendor.min.js"/></script>';
			echo '<script src="assets/dist/js/project.min.js"/></script>';
		}
	?>

	</body>
</html>
