declare module 'virtual:emifi-assets' {
  interface AssetSong {
    id: string;
    name: string;
    src: string;
    lyricsFile: string | null;
  }
  interface AssetLyrics {
    id: string;
    name: string;
    file: string;
  }
  interface AssetManifest {
    songs: AssetSong[];
    lyrics: AssetLyrics[];
  }
  const manifest: AssetManifest;
  export default manifest;
}
