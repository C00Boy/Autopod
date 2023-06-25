const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath('./ffmpeg'); 
const audioPath = './shady.m4a'; // Path to the input file (audiovisual file)
// const outputFilePath = './output.mp3'; // Path to the output file (audio file)

// ffmpeg()
//   .input(inputFilePath)
//   .output(outputFilePath)
//   .noVideo() // Remove video stream
//   .on('end', () => {
//     console.log('Video converted to audio successfully!');
//   })
//   .on('error', (err) => {
//     console.error('Error removing video:', err);
//   })
//   .run();
// ./ffmpeg -i  ./shady.m4a -af silencedetect=noise=0.05:d=2 -f null -


const clipData = {
  noise: '-50dB', // Specify the desired noise threshold
  minDuration: '5' // Specify the desired minimum silent duration
};

const silenceRanges = []
ffmpeg()
  .input(audioPath)
  .noVideo()
  .audioFilters(`silencedetect=noise=${clipData.noise}:d=${clipData.minDuration}`)
  .on('start', (command) => {
    console.log('FFmpeg process started:', command);
  })
  // .on('progress', (progress) => {
  //   console.log(progress.percent);
  // })
  .on('stderr', (data) => {
    const output = data.toString();
    const regex = /silence_(start|end):\s([\d\.]+)\s/g;
    let match;
    let silenceRange = {};
    let matchCount = 0;
    console.log(output);
    // console.log(regex.exec(output));
    while ((match = regex.exec(output)) !== null) {
      const [, type, value] = match;
      if (type === 'start') {
        silenceRange.start = parseFloat(value);
        matchCount++;
      } else if (type === 'end' && matchCount > 0) {
        silenceRange.end = parseFloat(value);
        silenceRanges.push(silenceRange);
        silenceRange = {};
        matchCount--;
      }
    }
  })

  .on('error', (error) => {
    console.error('Error executing FFmpeg:', error);
  })
  .on('end', () => {
    console.log('Silent parts analysis complete');
    console.log('Silence ranges:', silenceRanges);
  })
  .output('./deleteDeteciton.mp3')
  // .output(process.platform === 'win32' ? 'NUL' : '/dev/null') // Output to null device
  .run();


// ffmpeg(inputFilePath)
//   .audioFilters(['volume=0.5', 'silencedetect=n=-50dB:d=5'])
//   .on('data', (data) => {
//     console.log('2');
//     console.log(data);
//   })
//   .on('end', () => {
//     console.log('Silent parts analysis complete');
//     // console.log('Silence ranges:', silenceRanges);
//   })
//   .on('error', (err) => {
//             console.error('Error analyzing audio:', err);
//           })

// ffmpeg.ffprobe(inputFilePath, (err, metadata) => {
//   if (err) {
//     console.error('Error reading file metadata:', err);
//     return;
//   }

//   const audioStream = metadata.streams.find(stream => stream.codec_type === 'audio');

//   if (audioStream) {
//     const duration = parseFloat(audioStream.duration); // Duration of the audio stream in seconds
//     const silenceThreshold = -40; // Adjust this threshold based on your requirements
//     const silenceRanges = []; // Array to store silence ranges

//     ffmpeg(inputFilePath)
//       .audioFilters(`silencedetect=n=${silenceThreshold}dB:d=0.5`)
//       .format('null')
//       .output('-')
//       .on('error', (err) => {
//         console.error('Error analyzing audio:', err);
//       })
//       .on('end', () => {
//         console.log('Silent parts analysis complete');
//         console.log('Silence ranges:', silenceRanges);
//       })
//       .on('data', (data) => {
//         const output = data.toString();
//         const silenceRegex = /silence_(start|end): (\d+(?:\.\d+)?)/g;
//         let match;

//         while ((match = silenceRegex.exec(output)) !== null) {
//           const type = match[1];
//           const time = parseFloat(match[2]);

//           if (type === 'start') {
//             silenceRanges.push({ start: time });
//           } else if (type === 'end') {
//             const lastRange = silenceRanges[silenceRanges.length - 1];
//             lastRange.end = time;
//           }
//         }
//       })
//       .run();
//   } else {
//     console.error('No audio stream found in the input file.');
//   }
// });


// let args = [
//     '-i',
//     audioPath,
//     '-af',
//     `silencedetect=noise=${clipData.noise}:d=${minDuration}`,
//     '-f',
//     'null',
//     '-'
//   ];

// let ffmpeg = spawn(ffmpegPath, args);

// let silenceStarted = false;
// let silenceStart = 0;
// let lines = []
// const promise = new Promise((resolve, reject) => {
//   ffmpeg.stderr.on('data', (data) => {
//     const output = data.toString();
//     const regex = /silence_(start|end):\s([\d\.]+)\s|\s+silence_duration:\s([\d\.]+)/g;
//     let match;
//     while ((match = regex.exec(output)) !== null) {
//       const [, type, value1, value2] = match;
//       if (type === 'start') {
//         silenceStarted = true;
//         silenceStart = parseFloat(value1);
//       } else if (type === 'end') {
//         silenceStarted = false;
//         const silenceEnd = parseFloat(value1);
//         const silenceDuration = parseFloat((silenceEnd - silenceStart).toFixed(3))
//         lines.push({silence_start: silenceStart, silence_end: silenceEnd})
//         // lines.push({silence_start: silenceStart, silence_end: silenceEnd, silence_duration: silenceDuration})
//       }
//     }
//   });
//   ffmpeg.on('close', (code) => {
//     audios.push({trackIndex: clipData.audioTrackIndex, silenceRanges: lines})
//     resolve()
//   });
//   ffmpeg.on('error', (err) => {
//     alert(err)
//     reject(err)
//   })
// })
// promises.push(promise)
// });




