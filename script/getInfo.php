<?php
    $outputJSON = false;
    
    if(isset($_POST["video-link"])) {
        exec('youtube-dl --ignore-config -s -j ' . escapeshellarg($_POST["video-link"]) . ' 2>&1', $output, $return_var);
        if(strpos($output[0], 'ERROR:') === 0) {
            $outputJSON = json_encode($output[0]);
        }
        else {
            $outputJSON = $output[0];
        }
    }

    echo $outputJSON;
?>