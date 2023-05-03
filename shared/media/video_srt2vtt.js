// Adapted from: https://github.com/silviapfeiffer/silviapfeiffer.github.io/blob/master/index.html
// License: https://github.com/silviapfeiffer/silviapfeiffer.github.io/blob/master/LICENSE
function srt2webvtt(raw) {
  const data = typeof raw === 'string'
    ? raw
    : Array.isArray(raw)
      ? raw.length === 0 ? '' : raw.toString()
      : raw.toString()

  // remove dos newlines
  let srt = data.replace(/\r+/g, '');
  // trim white space start and end
  srt = srt.replace(/^\s+|\s+$/g, '');

  // get cues
  const cuelist = srt.split('\n\n');
  let result = "";

  if (cuelist.length > 0) {
    result += "WEBVTT\n\n";
    for (let i = 0; i < cuelist.length; i=i+1) {
      result += convertSrtCue(cuelist[i]);
    }
  }
  return result;
}

function convertSrtCue(caption) {
  // remove all html tags for security reasons
  //srt = srt.replace(/<[a-zA-Z\/][^>]*>/g, '');

  let cue = "";
  let s = caption.split(/\n/);

  // concatenate muilt-line string separated in array into one
  while (s.length > 3) {
    for (let i = 3; i < s.length; i++) {
      s[2] += "\n" + s[i]
    }
    s.splice(3, s.length - 3);
  }

  let line = 0;

  // detect identifier
  if (!s[0].match(/\d+:\d+:\d+/) && s[1].match(/\d+:\d+:\d+/)) {
    cue += s[0].match(/\w+/) + "\n";
    line += 1;
  }

  // get time strings
  if (s[line].match(/\d+:\d+:\d+/)) {
    // convert time string
    const m = s[1].match(/(\d+):(\d+):(\d+)(?:,(\d+))?\s*--?>\s*(\d+):(\d+):(\d+)(?:,(\d+))?/);
    if (m) {
      cue += m[1]+":"+m[2]+":"+m[3]+"."+m[4]+" --> "
        +m[5]+":"+m[6]+":"+m[7]+"."+m[8]+"\n";
      line += 1;
    } else {
      // Unrecognized timestring
      return "";
    }
  } else {
    // file format error or comment lines
    return "";
  }

  // get cue text
  if (s[line]) {
    cue += s[line] + "\n\n";
  }
  return cue;
}

export { srt2webvtt }
