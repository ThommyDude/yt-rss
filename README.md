# YT-RSS Editor
## "_Wow Thomas, you made a new thing! ....What is it?_"
This little project gives a very crude way to update old OPML files that Youtube **_USED TO_** let you download.

## "_How does that work?_"
Well, in it's current form it requires you to have youtube-dl ([Homepage](https://youtube-dl.org) / [Github](https://github.com/ytdl-org/youtube-dl)).
Then you can input a link to a video into the text input field. This will then reload the page to allow youtube-dl to extract the uploader and channel_id from the video.
Once the page is loaded it should show the name of the channel that has been found.
At this point you can upload the old rss file (if you've never changed it's name it'll be called `subscription_manager.xml`) and then click the "Add to file" button.
once you've done that you can click the "Save" button to download the updated file. (by default it'll be called `subscription_manager_updated.xml` for simplicity)

## "_But what if I don't have any old RSS files?_"
Then this project is useless to you, and I'm not even sure why you're here...

## "_Fine, any plans to update this **ever**?_"
Honestly? Yes.\
My plan was originally to have a full textarea in which you could also manually edit/add/remove subscriptions, but I wanted to have a working version first.\
So my plans are as follows

- [ ] Make youtube-dl call dynamic by implementing AJAX.
- [ ] Ability to remove subscriptions.
- [ ] Ability to edit existing subscriptions. (Although I'm unsure why this would be needed, so maybe I wont do this one 🤔)
- [ ] Security features? (Doubtfull, as this project isn't made to be hosted on a server and should always be run locally anyway 🤷🏻‍♂️😬)
  - [X] I at least added `escapeshellarg()` for the absolute minimum of security.
- [ ] Making it look nice? (Insert JJJ gif laughing before asking if you're serious GIF here.)

## "_Anything else before we leave?_"
Right. Should probably mention that this project includes a release of vkbeautify ([Homepage](http://www.eslinstructor.net/vkbeautify/) / [Github](https://github.com/vkiryukhin/vkBeautify)), but I honestly couldn't find any info about if they want me to credit them or something in a easyily findable way, but I'll atleast mention it here.\
Also, don't forget to run `npm i` before running this, as it does have a thing to download beforehand.\
Then just do a `php -S localhost:8080` or something to run it.