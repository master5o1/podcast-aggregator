#!/bin/bash

id="4xGjiR0Zhy"
host="https://podcasts.home.js.org.nz/files/"
stream="https://stream-ice.radionz.co.nz/national.mp3"
length=30
name="rnz-nights-sonic-tonic"

mkdir $id
ffmpeg -i $stream -codec copy -f segment -segment_list "${id}_info.txt" -segment_list_type flat -segment_time $length -t $length -strftime 1 $id/$name-%Y-%m-%d-%H-%M.mp3

filename=`cat "${id}_info.txt"`
output=`echo $filename | sed -e s/\.mp3$/.xml/`

echo $filename
echo $output
echo "$host$id/$filename"

# curl -XPUT -H "Content-type: application/json" -d "{
# 	\"title\": \"$title\",
# 	\"description\": \"$description\",
# 	\"published\": \"$date\",
# 	\"categories\": [],
# 	\"enclosure": {
# 		\"filesize\": $size,
# 		\"type\": \"audio/mp3\",
# 		\"url\": \"$host$id/$filename\"
# 	}
# }" 'https://podcasts.home.js.org.nz/podcast/4xGjiR0Zhy/episodes'