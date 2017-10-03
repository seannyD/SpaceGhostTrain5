
#crop parameters = width : heigth : start x-axis : start y-axis

rm ../video_crop/*.mp3

ffmpeg -i ../video/final.mp4 -vf crop=iw/3:ih/3:0:0 -acodec copy ../video_crop/1.mp4
ffmpeg -i ../video/final.mp4 -vf crop=iw/3:ih/3:iw/3:0 -acodec copy ../video_crop/2.mp4
ffmpeg -i ../video/final.mp4 -vf crop=iw/3:ih/3:iw*2/3:0 -acodec copy ../video_crop/3.mp4

ffmpeg -i ../video/final.mp4 -vf crop=iw/3:ih/3:0:ih/3 -acodec copy ../video_crop/4.mp4
ffmpeg -i ../video/final.mp4 -vf crop=iw/3:ih/3:iw/3:ih/3 -acodec copy ../video_crop/5.mp4
ffmpeg -i ../video/final.mp4 -vf crop=iw/3:ih/3:iw*2/3*2:ih/3 -acodec copy ../video_crop/6.mp4

ffmpeg -i ../video/final.mp4 -vf crop=iw/3:ih/3:0:iw*2/3 -acodec copy ../video_crop/7.mp4
ffmpeg -i ../video/final.mp4 -vf crop=iw/3:ih/3:iw/3:iw*2/3 -acodec copy ../video_crop/8.mp4
ffmpeg -i ../video/final.mp4 -vf crop=iw/3:ih/3:iw*2/3*2:iw*2/3 -acodec copy ../video_crop/9.mp4



# ffmpeg -i ~/Downloads/in.mov -vcodec copy -af "volume=enable='between(t,0,3)':volume=0" ~/Downloads/out2.mov

