export interface Song {
  id: string;
  title: string;
  album: string;
  duration: string;
  coverUrl: string;
  src: string;
  lyricsFile: string;
}

export interface Album {
  id: string;
  title: string;
  year: number;
  songsCount: number;
  coverUrl: string;
  songs: string[];
}

export interface Clip {
  id: string;
  title: string;
  album: string;
  platform: 'youtube' | 'facebook';
  thumbnailUrl: string;
  url: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  description: string;
  span?: 'normal' | 'wide' | 'tall';
}

export const songs: Song[] = [
  {
    id: '1',
    title: 'Ifonako',
    album: 'EMIFI',
    duration: '0:00',
    coverUrl: '/assets/images/bg.jpg',
    src: '/assets/song/ifonako.mp3',
    lyricsFile: 'ifonako.txt',
  },
  {
    id: '2',
    title: 'Tsara Loatra',
    album: 'EMIFI',
    duration: '0:00',
    coverUrl: '/assets/images/bg.jpg',
    src: '/assets/song/tsara loatra.mp3',
    lyricsFile: 'tsara_loatra.txt',
  }, {
    id: '1',
    title: 'Ifonako',
    album: 'EMIFI',
    duration: '0:00',
    coverUrl: '/assets/images/bg.jpg',
    src: '/assets/song/ifonako.mp3',
    lyricsFile: 'ifonako.txt',
  },
  {
    id: '2',
    title: 'Tsara Loatra',
    album: 'EMIFI',
    duration: '0:00',
    coverUrl: '/assets/images/bg.jpg',
    src: '/assets/song/tsara loatra.mp3',
    lyricsFile: 'tsara_loatra.txt',
  }, {
    id: '1',
    title: 'Ifonako',
    album: 'EMIFI',
    duration: '0:00',
    coverUrl: '/assets/images/bg.jpg',
    src: '/assets/song/ifonako.mp3',
    lyricsFile: 'ifonako.txt',
  },
  {
    id: '2',
    title: 'Tsara Loatra',
    album: 'EMIFI',
    duration: '0:00',
    coverUrl: '/assets/images/bg.jpg',
    src: '/assets/song/tsara loatra.mp3',
    lyricsFile: 'tsara_loatra.txt',
  },
];

export const albums: Album[] = [
  {
    id: '1',
    title: 'Voalohany',
    year: 2019,
    songsCount: 8,
    coverUrl: '/assets/images/bg.jpg',
    songs: [
      'Fiderana ho An\'ny Tompo',
      'Misaotra Anao Jesoa',
      'Harendrina',
      'Ny Tompo no Anjarako',
      'Masina Masina',
      'Fihirana Vaovao',
      'Ianao no Fiainako',
      'Tsitoha Ianao',
    ],
  },
  {
    id: '2',
    title: 'Fanantenana',
    year: 2021,
    songsCount: 10,
    coverUrl: '/assets/images/bg.jpg',
    songs: [
      'Mitsangàna ry Firenena',
      'Teny Fitiavana',
      'Dera sy Voninahitra',
      'Andriamanitra Mahery',
      'Ny Famonjena',
      'Misaotra Noho ny Fahasoavana',
      'Manantena Anao',
      'Ho Anao Foana',
      'Fahasoavana Mandrakizay',
      'Fanantenana Vaovao',
    ],
  },
  {
    id: '3',
    title: 'Feon\'ny Fiainana',
    year: 2023,
    songsCount: 9,
    coverUrl: '/assets/images/bg.jpg',
    songs: [
      'Ifonako',
      'Tsara Loatra',
      'Anio sy Mandrakizay',
      'Tompo Masina',
      'Midera Anao',
      'Fihirana Fiderana',
      'Tsara Ianao Tompo',
      'Nofy sy Fanantenana',
      'EMIFI Forever',
    ],
  },
];

export const clips: Clip[] = [
  {
    id: '1',
    title: 'Fiderana ho An\'ny Tompo',
    album: 'Voalohany',
    platform: 'youtube',
    thumbnailUrl: '/assets/images/bg.jpg',
    url: 'https://www.youtube.com',
  },
  {
    id: '2',
    title: 'Mitsangàna ry Firenena',
    album: 'Fanantenana',
    platform: 'facebook',
    thumbnailUrl: '/assets/images/bg.jpg',
    url: 'https://www.facebook.com',
  },
  {
    id: '3',
    title: 'Feon\'ny Fiainana',
    album: 'Feon\'ny Fiainana',
    platform: 'youtube',
    thumbnailUrl: '/assets/images/bg.jpg',
    url: 'https://www.youtube.com',
  },
];

export const galleryImages: GalleryImage[] = [
  { id: '1', src: '/assets/images/bg.jpg', alt: 'EMIFI Chorale officielle', description: 'Photo officielle de la chorale EMIFI', span: 'wide' },
  { id: '2', src: '/assets/images/bg.jpg', alt: 'EMIFI en prestation', description: 'Prestation scénique au KSLMD', span: 'tall' },
  { id: '3', src: '/assets/images/bg.jpg', alt: 'EMIFI Festival Harendrina', description: 'Festival Harendrina 2018', span: 'normal' },
  { id: '4', src: '/assets/images/bg.jpg', alt: 'EMIFI membres', description: 'Les membres actifs', span: 'wide' },
  { id: '5', src: '/assets/images/bg.jpg', alt: 'EMIFI campus EMIT', description: 'Devant le campus EMIT', span: 'normal' },
  { id: '6', src: '/assets/images/bg.jpg', alt: 'EMIFI répétition', description: 'Session de répétition', span: 'tall' },
  { id: '7', src: '/assets/images/bg.jpg', alt: 'EMIFI concert', description: 'Grand concert annuel', span: 'normal' },
  { id: '8', src: '/assets/images/bg.jpg', alt: 'EMIFI Fianarantsoa', description: 'Université de Fianarantsoa', span: 'wide' },
  { id: '9', src: '/assets/images/bg.jpg', alt: 'EMIFI jeunesse', description: 'La jeunesse EMIFI', span: 'normal' },
  { id: '10', src: '/assets/images/bg.jpg', alt: 'EMIFI réunion', description: 'Réunion des membres', span: 'normal' },
];
