---
title: Android中音视频合成方案分析
date: 2018-2-11
categories: Android
tags:
   - Android
   - 音视频
---

转自:[Android中音视频合成方案分析](http://www.zwdroid.top/2017/03/11/Android%E4%B8%AD%E9%9F%B3%E8%A7%86%E9%A2%91%E5%90%88%E6%88%90%E6%96%B9%E6%A1%88%E5%88%86%E6%9E%90/)

Android下音视频合成，在当前调研方案中主要有三大类方法：MediaMux硬解码，mp4parser，FFmepg。三种方法均可实现，但是也有不同的局限和问题，先将实现和问题记录于此，便于之后的总结学习。

<!-- more -->

## 方法一（Fail）

利用MediaMux实现音视频的合成。
效果：可以实现音视频的合并，利用Android原生的VideoView和SurfaceView播放正常，大部分的播放器也播放正常，但是，但是，在上传Youtube就会出现问题：音频不连续，分析主要是上传Youtube时会被再次的压缩，可能在压缩的过程中出现音频的帧率出现问题。
分析：在MediaCodec.BufferInfo的处理中，时间戳presentationTimeUs出现问题，导致Youtube的压缩造成音频的紊乱。

```
public static void muxVideoAndAudio(String videoPath, String audioPath, String muxPath) {
       try {
           MediaExtractor videoExtractor = new MediaExtractor();
           videoExtractor.setDataSource(videoPath);
           MediaFormat videoFormat = null;
           int videoTrackIndex = -1;
           int videoTrackCount = videoExtractor.getTrackCount();
           for (int i = 0; i < videoTrackCount; i++) {
               videoFormat = videoExtractor.getTrackFormat(i);
               String mimeType = videoFormat.getString(MediaFormat.KEY_MIME);
               if (mimeType.startsWith("video/")) {
                   videoTrackIndex = i;
                   break;
               }
           }

           MediaExtractor audioExtractor = new MediaExtractor();
           audioExtractor.setDataSource(audioPath);
           MediaFormat audioFormat = null;
           int audioTrackIndex = -1;
           int audioTrackCount = audioExtractor.getTrackCount();
           for (int i = 0; i < audioTrackCount; i++) {
               audioFormat = audioExtractor.getTrackFormat(i);
               String mimeType = audioFormat.getString(MediaFormat.KEY_MIME);
               if (mimeType.startsWith("audio/")) {
                   audioTrackIndex = i;
                   break;
               }
           }

           videoExtractor.selectTrack(videoTrackIndex);
           audioExtractor.selectTrack(audioTrackIndex);

           MediaCodec.BufferInfo videoBufferInfo = new MediaCodec.BufferInfo();
           MediaCodec.BufferInfo audioBufferInfo = new MediaCodec.BufferInfo();

           MediaMuxer mediaMuxer = new MediaMuxer(muxPath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4);
           int writeVideoTrackIndex = mediaMuxer.addTrack(videoFormat);
           int writeAudioTrackIndex = mediaMuxer.addTrack(audioFormat);
           mediaMuxer.start();

           ByteBuffer byteBuffer = ByteBuffer.allocate(500 * 1024);
           long sampleTime = 0;
           {
               videoExtractor.readSampleData(byteBuffer, 0);
               if (videoExtractor.getSampleFlags() == MediaExtractor.SAMPLE_FLAG_SYNC) {
                   videoExtractor.advance();
               }
               videoExtractor.readSampleData(byteBuffer, 0);
               long secondTime = videoExtractor.getSampleTime();
               videoExtractor.advance();
               long thirdTime = videoExtractor.getSampleTime();
               sampleTime = Math.abs(thirdTime - secondTime);
           }
           videoExtractor.unselectTrack(videoTrackIndex);
           videoExtractor.selectTrack(videoTrackIndex);

           while (true) {
               int readVideoSampleSize = videoExtractor.readSampleData(byteBuffer, 0);
               if (readVideoSampleSize < 0) {
                   break;
               }
               videoBufferInfo.size = readVideoSampleSize;
               videoBufferInfo.presentationTimeUs += sampleTime;
               videoBufferInfo.offset = 0;
               //noinspection WrongConstant
               videoBufferInfo.flags = MediaCodec.BUFFER_FLAG_SYNC_FRAME;//videoExtractor.getSampleFlags()
               mediaMuxer.writeSampleData(writeVideoTrackIndex, byteBuffer, videoBufferInfo);
               videoExtractor.advance();
           }

           while (true) {
               int readAudioSampleSize = audioExtractor.readSampleData(byteBuffer, 0);
               if (readAudioSampleSize < 0) {
                   break;
               }

               audioBufferInfo.size = readAudioSampleSize;
               audioBufferInfo.presentationTimeUs += sampleTime;
               audioBufferInfo.offset = 0;
               //noinspection WrongConstant
               audioBufferInfo.flags = MediaCodec.BUFFER_FLAG_SYNC_FRAME;// videoExtractor.getSampleFlags()
               mediaMuxer.writeSampleData(writeAudioTrackIndex, byteBuffer, audioBufferInfo);
               audioExtractor.advance();
           }

           mediaMuxer.stop();
           mediaMuxer.release();
           videoExtractor.release();
           audioExtractor.release();
       } catch (IOException e) {
           e.printStackTrace();
       }
   }
```

## 方法二（Success）

```
public static void muxVideoAudio(String videoFilePath, String audioFilePath, String outputFile) {

        try {

            MediaExtractor videoExtractor = new MediaExtractor();
            videoExtractor.setDataSource(videoFilePath);

            MediaExtractor audioExtractor = new MediaExtractor();
            audioExtractor.setDataSource(audioFilePath);

            MediaMuxer muxer = new MediaMuxer(outputFile, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4);

            videoExtractor.selectTrack(0);
            MediaFormat videoFormat = videoExtractor.getTrackFormat(0);
            int videoTrack = muxer.addTrack(videoFormat);

            audioExtractor.selectTrack(0);
            MediaFormat audioFormat = audioExtractor.getTrackFormat(0);
            int audioTrack = muxer.addTrack(audioFormat);

            LogUtil.d(TAG, "Video Format " + videoFormat.toString());
            LogUtil.d(TAG, "Audio Format " + audioFormat.toString());

            boolean sawEOS = false;
            int frameCount = 0;
            int offset = 100;
            int sampleSize = 256 * 1024;

            ByteBuffer videoBuf = ByteBuffer.allocate(sampleSize);
            ByteBuffer audioBuf = ByteBuffer.allocate(sampleSize);

            MediaCodec.BufferInfo videoBufferInfo = new MediaCodec.BufferInfo();
            MediaCodec.BufferInfo audioBufferInfo = new MediaCodec.BufferInfo();


            videoExtractor.seekTo(0, MediaExtractor.SEEK_TO_CLOSEST_SYNC);
            audioExtractor.seekTo(0, MediaExtractor.SEEK_TO_CLOSEST_SYNC);

            muxer.start();

            while (!sawEOS) {
                videoBufferInfo.offset = offset;
                videoBufferInfo.size = videoExtractor.readSampleData(videoBuf, offset);

                if (videoBufferInfo.size < 0 || audioBufferInfo.size < 0) {
                    sawEOS = true;
                    videoBufferInfo.size = 0;

                } else {
                    videoBufferInfo.presentationTimeUs = videoExtractor.getSampleTime();
                    //noinspection WrongConstant
                    videoBufferInfo.flags = videoExtractor.getSampleFlags();
                    muxer.writeSampleData(videoTrack, videoBuf, videoBufferInfo);
                    videoExtractor.advance();

                    frameCount++;

                }
            }
            
            boolean sawEOS2 = false;
            int frameCount2 = 0;
            while (!sawEOS2) {
                frameCount2++;
                audioBufferInfo.offset = offset;
                audioBufferInfo.size = audioExtractor.readSampleData(audioBuf, offset);

                if (videoBufferInfo.size < 0 || audioBufferInfo.size < 0) {
                    sawEOS2 = true;
                    audioBufferInfo.size = 0;
                } else {
                    audioBufferInfo.presentationTimeUs = audioExtractor.getSampleTime();
                    //noinspection WrongConstant
                    audioBufferInfo.flags = audioExtractor.getSampleFlags();
                    muxer.writeSampleData(audioTrack, audioBuf, audioBufferInfo);
                    audioExtractor.advance();
                }
            }

            muxer.stop();
            muxer.release();
            LogUtil.d(TAG,"Output: "+outputFile);
        } catch (IOException e) {
            LogUtil.d(TAG, "Mixer Error 1 " + e.getMessage());
        } catch (Exception e) {
            LogUtil.d(TAG, "Mixer Error 2 " + e.getMessage());
        }
    }
```

## 方法三

利用**mp4parser**实现

> compile “com.googlecode.mp4parser:isoparser:1.1.21”

问题：上传Youtube压缩后，视频数据丢失严重，大部分就只剩下一秒钟的时长，相当于把视频变成图片了，囧

```
 public boolean mux(String videoFile, String audioFile, final String outputFile) {
        if (isStopMux) {
            return false;
        }
        Movie video;
        try {
            video = MovieCreator.build(videoFile);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return false;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }

        Movie audio;
        try {
            audio = MovieCreator.build(audioFile);
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        } catch (NullPointerException e) {
            e.printStackTrace();
            return false;
        }

        Track audioTrack = audio.getTracks().get(0);
        video.addTrack(audioTrack);

        Container out = new DefaultMp4Builder().build(video);

        FileOutputStream fos;
        try {
            fos = new FileOutputStream(outputFile);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
            return false;
        }
        BufferedWritableFileByteChannel byteBufferByteChannel = new
                BufferedWritableFileByteChannel(fos);
        try {
            out.writeContainer(byteBufferByteChannel);
            byteBufferByteChannel.close();
            fos.close();
            if (isStopMux) {
                return false;
            }
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    mCustomeProgressDialog.setProgress(100);
                    goShareActivity(outputFile);
//                    FileUtils.insertMediaDB(AddAudiosActivity.this,outputFile);//
                }
            });

        } catch (IOException e) {
            e.printStackTrace();
            if (mCustomeProgressDialog.isShowing()) {
                mCustomeProgressDialog.dismiss();
            }
            ToastUtil.showShort(getString(R.string.process_failed));
            return false;
        }
        return true;
    }

    private static class BufferedWritableFileByteChannel implements WritableByteChannel {
        private static final int BUFFER_CAPACITY = 2000000;

        private boolean isOpen = true;
        private final OutputStream outputStream;
        private final ByteBuffer byteBuffer;
        private final byte[] rawBuffer = new byte[BUFFER_CAPACITY];

        private BufferedWritableFileByteChannel(OutputStream outputStream) {
            this.outputStream = outputStream;
            this.byteBuffer = ByteBuffer.wrap(rawBuffer);
        }

        @Override
        public int write(ByteBuffer inputBuffer) throws IOException {
            int inputBytes = inputBuffer.remaining();

            if (inputBytes > byteBuffer.remaining()) {
                dumpToFile();
                byteBuffer.clear();

                if (inputBytes > byteBuffer.remaining()) {
                    throw new BufferOverflowException();
                }
            }

            byteBuffer.put(inputBuffer);

            return inputBytes;
        }

        @Override
        public boolean isOpen() {
            return isOpen;
        }

        @Override
        public void close() throws IOException {
            dumpToFile();
            isOpen = false;
        }

        private void dumpToFile() {
            try {
                outputStream.write(rawBuffer, 0, byteBuffer.position());
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
```

## 方法四

> 利用FFmpeg大法

[Merge Video /Audio and retain both audios](http://stackoverflow.com/questions/24804928/singler-line-ffmpeg-cmd-to-merge-video-audio-and-retain-both-audios)

可以实现，兼容性强，但由于是软解码，合并速度很慢，忍受不了，而相应的FFmpeg优化还不太了解，囧…….

**以上，谢谢阅读。**
