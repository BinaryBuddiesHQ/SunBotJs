import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import prism from 'prism-media';
import { createAudioResource, StreamType } from '@discordjs/voice';

const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// YouTube requires a PO (proof-of-origin) token for many official/label audio streams,
// which yt-dlp can't generate on its own. The bgutil-ytdlp-pot-provider plugin (in
// tools/yt-dlp-plugins) fetches one from a local companion server every call.
// `npm run dev` starts that server via docker-compose.yml (must be running whenever the bot is).
const pluginDir = path.join(srcDir, '..', 'tools', 'yt-dlp-plugins');

// A running Chromium browser holds an OS-level lock on its cookie DB, and Chromium's
// App-Bound Encryption blocks external tools from decrypting it even when closed, so
// prefer YOUTUBE_COOKIES_FILE (a Netscape-format cookies.txt export) over
// YOUTUBE_COOKIES_FROM_BROWSER when both are set. Neither is required for the PO
// token path above to work, but either can help if a specific video still gets blocked.
function cookieArgs() {
  const cookiesFile = process.env.YOUTUBE_COOKIES_FILE;
  if (cookiesFile) return ['--cookies', path.resolve(srcDir, cookiesFile)];

  const browser = process.env.YOUTUBE_COOKIES_FROM_BROWSER;
  return browser ? ['--cookies-from-browser', browser] : [];
}

function baseArgs() {
  return ['--plugin-dirs', pluginDir, ...cookieArgs()];
}

export function getVideoInfo(url) {
  return new Promise((resolve, reject) => {
    const proc = spawn('yt-dlp', [...baseArgs(), '-j', '--no-warnings', url]);

    let data = '';
    let stderr = '';
    proc.stdout.on('data', chunk => data += chunk);
    proc.stderr.on('data', chunk => stderr += chunk);

    proc.on('error', reject);
    proc.on('close', code => {
      if (code !== 0) {
        reject(new Error(`yt-dlp exited with code ${code}: ${stderr}`));
        return;
      }

      const info = JSON.parse(data);
      resolve({
        title: info.title,
        description: info.description?.substring(0, 250) ?? '',
        thumbnail: info.thumbnail,
        videoUrl: info.webpage_url,
      });
    });
  });
}

export function createAudioResourceFromUrl(url) {
  const ytdlp = spawn('yt-dlp', [...baseArgs(), url, '-f', 'bestaudio', '-o', '-', '--quiet', '--no-warnings'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stderr = '';
  ytdlp.stderr.on('data', chunk => stderr += chunk);
  ytdlp.on('close', code => {
    if (code !== 0) console.error(`yt-dlp exited with code ${code}: ${stderr}`);
  });

  const transcoder = new prism.FFmpeg({
    args: ['-analyzeduration', '0', '-loglevel', '0', '-f', 's16le', '-ar', '48000', '-ac', '2'],
  });

  const stream = ytdlp.stdout.pipe(transcoder);
  return createAudioResource(stream, { inputType: StreamType.Raw, inlineVolume: true });
}
