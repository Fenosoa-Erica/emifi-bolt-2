import { Plugin, normalizePath } from 'vite';
import { readdirSync, statSync, readFileSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

const SONG_DIR = 'public/assets/song';
const LYRICS_DIR = 'public/assets/lyrics';
const SONG_BASE = '/assets/song/';
const LYRICS_BASE = '/assets/lyrics/';

interface AssetManifest {
  songs: Array<{ id: string; name: string; src: string; lyricsFile: string | null }>;
  lyrics: Array<{ id: string; name: string; file: string }>;
}

function listAudio(root: string): Array<{ name: string; src: string }> {
  let entries: string[] = [];
  try { entries = readdirSync(root); } catch { return []; }
  const audioExts = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
  return entries
    .filter(e => {
      const full = join(root, e);
      return statSync(full).isFile() && audioExts.includes(extname(e).toLowerCase());
    })
    .map(e => ({ name: basename(e, extname(e)), src: SONG_BASE + encodeURIComponent(e) }));
}

function listLyrics(root: string): Array<{ name: string; file: string }> {
  let entries: string[] = [];
  try { entries = readdirSync(root); } catch { return []; }
  return entries
    .filter(e => {
      const full = join(root, e);
      return statSync(full).isFile() && extname(e).toLowerCase() === '.txt';
    })
    .map(e => ({ name: basename(e, '.txt'), file: LYRICS_BASE + encodeURIComponent(e) }));
}

function buildManifest(projectRoot: string): AssetManifest {
  const songRoot = normalizePath(join(projectRoot, SONG_DIR));
  const lyricsRoot = normalizePath(join(projectRoot, LYRICS_DIR));
  const audio = listAudio(songRoot);
  const lyrics = listLyrics(lyricsRoot);

  const songs = audio.map((s, i) => {
    const match = lyrics.find(l => l.name.toLowerCase() === s.name.toLowerCase());
    return {
      id: `song-${i}`,
      name: s.name,
      src: s.src,
      lyricsFile: match ? match.file : null,
    };
  });

  const lyricsOut = lyrics.map((l, i) => ({ id: `lyrics-${i}`, name: l.name, file: l.file }));

  return { songs, lyrics: lyricsOut };
}

export function assetManifestPlugin(projectRoot: string): Plugin {
  const virtualId = 'virtual:emifi-assets';
  const resolvedVirtualId = '\0' + virtualId;

  let manifest: AssetManifest | null = null;

  return {
    name: 'emifi-asset-manifest',
    enforce: 'pre',
    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId;
    },
    load(id) {
      if (id !== resolvedVirtualId) return null;
      if (!manifest) manifest = buildManifest(projectRoot);
      return `export default ${JSON.stringify(manifest)};`;
    },
    configureServer(server) {
      const rebuild = () => {
        manifest = buildManifest(projectRoot);
        const mod = server.moduleGraph.getModuleById(resolvedVirtualId);
        if (mod) server.reloadModule(mod);
      };
      server.watcher.add([
        normalizePath(join(projectRoot, SONG_DIR)),
        normalizePath(join(projectRoot, LYRICS_DIR)),
      ]);
      server.watcher.on('add',    rebuild);
      server.watcher.on('unlink',  rebuild);
    },
  };
}
