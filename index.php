<?php
    if(isset($_POST["video-link"])) {
        $outputJSON = false;
        exec('youtube-dl --ignore-config -s -j ' . $_POST["video-link"] . ' 2>&1', $output, $return_var);
        //var_dump($output[0]);
        if(strpos($output[0], 'ERROR:') === 0) {
            echo '<div class="error">Something went very wrong!<br>' . $output[0] . '</div>';
        }
        else {
            $outputJSON = json_decode($output[0]);
        }
    }

?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Youtube RSS Test</title>
        <link rel="stylesheet" href="./style/main.css">
        <script type="text/javascript" src="./node_modules/x2js/x2js.js"></script>
        <script type="text/javascript" src="./vkbeautify/vkbeautify.0.99.00.beta.js"></script>
        <script type="text/javascript" src="./script/main.js"></script>
    </head>
    <body>
        <div>
            <input type="file" id="fileInput" name="fileInput">
            <button type="button" id="fileOutput">Save</button>
        </div>
        
        <div class="form-holder">
            <form action="#" method="POST">
                <span>Input video url to find the channel</span><br/>
                <input type="text" name="video-link"><br/>
                <input type="submit">
            </form>
        </div>

        <?php
            if(isset($outputJSON)) {
                echo '<input type="hidden" id="ytdlUploader" value="' . $outputJSON->uploader . '">';
                echo '<input type="hidden" id="ytdlChannelID" value="' . $outputJSON->channel_id . '">';
                echo "<p>Found channel: <strong>" . $outputJSON->uploader . "</strong></p>";
                echo '<button type="button" id="addToFile">Add to file</button>';
            }
        ?>

        <div class="data-holder"></div>

        <div class="x2js-holder">
            <button id="convertToJSON">XML => JSON</button>
            <button id="convertToXML">XML <= JSON</button>
            <div class="x2js-textarea-holder">
                <div>
                    <h4>XML:</h4>

                    <textarea id="xmlArea" cols="100" rows="45" readonly></textarea>
                </div>
                <div>
                    <h4>JSON:</h4>

                    <textarea id="jsonArea" cols="100" rows="45"></textarea>
                </div>
            </div>
        </div>
    </body>
</html>