export interface Song {
  id: string;
  title: string;
  album: string;
  duration: string;
  coverUrl: string;
  src: string;
  lyrics: string;
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
    lyrics: `Ifonako ny Tompo Masina
Ifonako ny Fanahy Masina
Ho Anao aho mihono
Eto am-piainanako

Tsy misy hafa ankoatranao
Ianao no Mpamonjy ahy
Ny Fitiavanao no mahavonjy
Misaotra Anao Jesoa

[Refrain]
Ifonako Ianao
Ao am-poko mandrakizay
Ifonako Ianao
Ny Tompo sy Mpamonjy

Ny Fitiavanao tsy misy farany
Maharitra mandrakizay
Ny Teninao no hazavana
Amin'ny lalako iainanako

Ianao no mahafoy ahy
Tsy manadino Ianao
Ny Firahalahiavina Aminao
No antony hifaliko

[Refrain]
Ifonako Ianao
Ao am-poko mandrakizay
Ifonako Ianao
Ny Tompo sy Mpamonjy

Alleluia, Alleluia
Ho anao ny voninahitra
Alleluia, Alleluia
Jesoa Kristy Tompo`,
  },
  {
    id: '2',
    title: 'Tsara Loatra',
    album: 'EMIFI',
    duration: '0:00',
    coverUrl: '/assets/images/bg.jpg',
    src: '/assets/song/tsara loatra.mp3',
    lyrics: `Tsara loatra ny fitiavanao
Tsara loatra ny fahasoavanao
Isan'andro sy isan-alina
Misaotra Anao Tompo

Na dia misy aza ny fanahiahy
Manantena foana aho Aminao
Fa Ianao no Andriamaniko
Tsy mivadika Ianao

[Refrain]
Tsara loatra ho ahy
Ny Tomponay Jesoa Kristy
Tsara loatra ho ahy
Ny famonjena nataonao

Ny Teninao no hery amiko
Rehefa reraka ny foko
Ny fitiavanao no mamelona
Ny ainy ao anatiko

Tsy maintsy hidera Anao aho
Amin'ny foko manontolo
Ny voninahitrao manjaka
Amin'ny fiainako

[Refrain]
Tsara loatra ho ahy
Ny Tomponay Jesoa Kristy
Tsara loatra ho ahy
Ny famonjena nataonao

Ho anao ny dera sy voninahitra
Ho anao ny fiderana mandrakizay
Tsara loatra Ianao Tompo
Tsara loatra Ianao`,
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
