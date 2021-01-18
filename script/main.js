window.addEventListener('load', main);

/* Globals */
var x2js = new X2JS();
var openFile;

/* Main */
function main() {
    createEvents();
}

/* Functions */
function createEvents() {
    if(document.querySelector('form')) {
        document.querySelector('form').addEventListener('submit', formSubmit);
    }

    if(document.querySelector('#convertToJSON') && document.querySelector('#convertToXML')) {
        document.querySelector('#convertToJSON').addEventListener('click', convertXML2JSON);
        document.querySelector('#convertToXML').addEventListener('click', convertJSON2XML);
    }

    if(document.querySelector('#fileInput')) {
        document.querySelector('#fileInput').addEventListener('change', getFile);
    }

    if(document.querySelector('#fileOutput')) {
        document.querySelector('#fileOutput').addEventListener('click', downloadFile);
    }

    if(document.querySelector('#xmlArea') && document.querySelector('#jsonArea')) {
        document.querySelector('#xmlArea').addEventListener('change', convertXML2JSON);
        document.querySelector('#jsonArea').addEventListener('change', convertJSON2XML);
    }

    if(document.querySelector('#addToFile')) {
        document.querySelector('#addToFile').addEventListener('click', addFoundToFile);
    }
}

function getFile() {
    if(this.files[0]) {
        var reader = new FileReader();
        reader.readAsText(this.files[0], "UTF-8");
        
        reader.onload = (e) => {
            openFile = e.currentTarget;
            document.querySelector('#xmlArea').value = vkbeautify.xml(e.currentTarget.result);
            convertXML2JSON();
            createList();
        }
        
        reader.onerror = (e) => {
            console.error(e);
        }
    }
    else {
        console.error('Error reading file!');
    }
}

function addFoundToFile() {
    if(document.querySelector('#jsonArea').value) {
        var ytdlUploader = document.querySelector('#ytdlUploader').value;
        var ytdlChannelID = document.querySelector('#ytdlChannelID').value;
        var double = false;
        var doubleIndex = false;
        
        var fileJson = JSON.parse(document.querySelector('#jsonArea').value);
        editJson = fileJson.opml.body.outline.outline;

        for (const [index, entry] of editJson.entries()) {
            if(entry._title == ytdlUploader) {
                double = 'double';
            }

            if(entry._xmlUrl.split('channel_id=')[1] == ytdlChannelID && entry._title !== ytdlUploader) {
                double = 'overwrite';
                doubleIndex = index;
            }
        }

        if(double === false) {
            editJson.push({
                "_text": ytdlUploader,
                "_title": ytdlUploader,
                "_type": "rss",
                "_xmlUrl": "https://www.youtube.com/feeds/videos.xml?channel_id=" + ytdlChannelID
            });
        }
        else if(double === 'double') {
            alert('Channel "' + ytdlUploader + '" already exists in this file!');
        }
        else if(double === 'overwrite') {
            fileJson.opml.body.outline.outline[doubleIndex]._title = ytdlUploader;
            fileJson.opml.body.outline.outline[doubleIndex]._text = ytdlUploader;
        }

        editJson.sort((a, b) => {
            a = a._title.toLowerCase();
            b = b._title.toLowerCase();
            
            if(a == b) {
                return 0;
            }
            
            if(a < b) {
                return -1;
            }
            
            if(a > b) {
                return 1;
            }
        });

        fileJson.opml.body.outline.outline = editJson;
        document.querySelector('#jsonArea').value = JSON.stringify(fileJson, undefined, 4);
        convertJSON2XML();
    }
    else {
        alert("JSON area is empty!");
    }
}

function downloadFile() {
    var text = document.querySelector('#xmlArea').value;
    text = text.replace(/\n/g, "\r\n");
    var blob = new Blob([text], { type: "text/xml" });
    var dlLink = document.createElement('a');
    dlLink.download = 'subscription_manager_updated.xml';
    dlLink.href = window.URL.createObjectURL(blob);
    dlLink.target = '_blank';
    dlLink.style.display = 'none';
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
}

function createList() {
    var data = JSON.parse(document.querySelector('#jsonArea').value);
    var subs = data.opml.body.outline.outline;

    var dataholder = document.querySelector('.data-holder');
    dataholder.innerHTML = '';

    var title = document.createElement('h2');
    title.textContent = data.opml.body.outline._title;
    dataholder.appendChild(title);

    var list = document.createElement('ul');

    for (const sub of subs) {
        var listItem = document.createElement('li');
        var subTitle = document.createElement('h3');
        subTitle.textContent = sub._title;

        var removeButton = document.createElement('button');
        removeButton.innerText = "Remove?";
        removeButton.addEventListener('click', () => {
            removeSub(sub);
        });

        listItem.appendChild(subTitle);
        listItem.appendChild(removeButton);
        list.appendChild(listItem);
    }

    dataholder.appendChild(list);
}

function removeSub(delSub) {
    var data = JSON.parse(document.querySelector('#jsonArea').value);
    var subs = data.opml.body.outline.outline;
    var targetIndex = false;
    
    for (const [index, sub] of subs.entries()) {
        if (sub._title == delSub._title && sub._text == delSub._text && sub._xmlUrl == delSub._xmlUrl) {
            targetIndex = index;
            break;
        }
    }

    //Add are you sure alert/popup?
    subs.splice(targetIndex, 1);

    data.opml.body.outline.outline = subs;

    document.querySelector('#jsonArea').value = JSON.stringify(data, undefined, 4);
    convertJSON2XML();
    createList();
}

function convertXML2JSON() {
    document.querySelector('#jsonArea').value = JSON.stringify(x2js.xml2js(document.querySelector('#xmlArea').value), undefined, 4);
    createList();
}

function convertJSON2XML() {
    document.querySelector('#xmlArea').value = vkbeautify.xml(x2js.js2xml(JSON.parse(document.querySelector('#jsonArea').value)));
    createList();
}

async function formSubmit() {
    var data = new FormData(document.querySelector('form'));

    var form = document.querySelector('form');
    var foundThings = document.querySelector('.foundThings');
    var loader = document.querySelector('.loader');

    
    form.classList.add('hidden');
    if(!foundThings.classList.contains('hidden')) {
        foundThings.classList.add('hidden');
    }
    loader.classList.remove('hidden');

    await fetch('/script/getInfo.php',
    {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(result => {
        updateFields(result);
        form.classList.remove('hidden');
        foundThings.classList.remove('hidden');
        loader.classList.add('hidden');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occured during fetch process. Check console for more information!');
    });
}

async function updateFields(response) {
    document.querySelector('#ytdlUploader').value = response.uploader;
    document.querySelector('#ytdlChannelID').value = response.channel_id;
    document.querySelector('.foundChannelName').innerText = response.uploader;
}