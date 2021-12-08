function details() {
  return {
    id: 'Tdarr_Plugin_x7ac_Remove_Closed_Captions',
    Stage: 'Pre-processing',
    Name: 'Remove burned closed captions',
    Type: 'Video',
    Operation: 'Remux',
    Description:
      '[Contains built-in filter] If detected, closed captions (XDS,608,708) will be removed from streams.',
    Version: '1.01',
    Link:
      'https://github.com/HaveAGitGat/Tdarr_Plugins/blob/master/Community/Tdarr_Plugin_x7ac_Remove_Closed_Captions.js',
    Tags: 'pre-processing,ffmpeg,subtitle only',
  };
}

function plugin(file) {
  const response = {
    processFile: false,
    preset: `,-map 0 -codec copy -bsf:v 'filter_units=remove_types=6'`,
    container: '.${file.container}',
    handBrakeMode: false,
    FFmpegMode: true,
    reQueueAfter: true,
    infoLog: '',
  };
  if (file.fileMedium !== 'video') {
    response.infoLog += '☒File is not video \n';
    return response;
  }
  // Check if Closed Captions are set at file level
  if (file.hasClosedCaptions) {
    response.processFile = true;
    response.infoLog += '☒This file has closed captions \n';
    return response;
  }
  // If not, check for Closed Captions in the streams
  const streams = file.ffProbeData.streams;
  for (const stream in streams) {
    if (stream.closed_captions) {
      response.processFile = true;
      break;
    }
  }
  response.infoLog += response.processFile ? '☒This file has burnt closed captions \n' :
  '☑Closed captions have not been detected on this file \n';
  return response;
}
module.exports.details = details;
module.exports.plugin = plugin;
