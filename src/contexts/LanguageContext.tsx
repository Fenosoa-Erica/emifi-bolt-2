import { createContext, useContext, useState } from 'react';

export type Lang = 'fr' | 'mg';

const T = {
  // NAV
  nav_accueil:       { fr: 'Accueil',       mg: 'Fandraisana' },
  nav_apropos:       { fr: 'À propos',       mg: 'Momba anay' },
  nav_realisations:  { fr: 'Réalisations',   mg: 'Asa vitanay' },
  nav_galerie:       { fr: 'Galerie',        mg: 'Tahiry sary' },
  nav_contact:       { fr: 'Contact',        mg: 'Fifandraisana' },
  
  // HERO
  hero_badge:         { fr: 'Chorale Université de Fianarantsoa',                             mg: "Antoko Mpihira Oniversiten'i Fianarantsoa" },
  hero_sub:           { fr: 'EMIT – Université de Fianarantsoa, Madagascar',                  mg: "EMIT – Oniversiten'i Fianarantsoa, Madagasikara" },
  hero_members:       { fr: 'Membres actuelle',                                               mg: "Mpikambana amperin'asa" },
  hero_alumni:        { fr: 'Anciens membres',                                                mg: 'Mpikambana taloha' },
  hero_cta:           { fr: 'Découvrir la chorale',                                           mg: 'Hamantatra ny antoko' },
  hero_discover:      { fr: 'Découvrir la chorale',                                           mg: 'Hamantatra ny antoko' },
  
  // ABOUT
  about_badge:        { fr: 'Notre histoire',                                                 mg: 'Ny tantaranay' },
  about_title:        { fr: 'propos',                                                         mg: 'anay' },
  about_title_pre:    { fr: 'À',                                                              mg: 'Momba' },
  about_sub:          { fr: "Une chorale universitaire de Fianarantsoa née de la passion des étudiants pour la musique.", mg: "Antoko mpihira eny amin'ny oniversite an'i Fianaratsoa, teraka avy amin'ny fitiavan'ny mpianatra ny tontolon'ny mozika." },
  about_who:          { fr: 'Qui sommes-nous ?',                                              mg: 'Iza moa izahay ?' },
  about_who_text:     { fr: "Nous sommes une chorale composée d'étudiants de l'EMIT (École de Management et d'Innovation Technologique) de l'Université de Fianarantsoa. Notre chorale rassemble des étudiants issus de différentes confessions chrétiennes, unis par une même foi et par l'amour de la musique. À travers le chant, nous partageons des valeurs de fraternité, de spiritualité et d'excellence, tout en mettant nos talents au service de Dieu et de notre communauté.",
                        mg: "Izahay dia antoko mpihira ahitana mpianatra avy ao amin'ny EMIT (École de Management et d'Innovation Technologique), ao amin'ny Oniversiten'i Fianarantsoa. Ny mpikamba ao aminay dia samy avy amin'ny fiangonana sy antokom-pinoana samihafa, ary ny fitiavana ny mozika no nampitambatra anay. Amin'ny alalan'ny hira no hanehoanay ny finoanay, hampiroboroboanay ny firaisankina sy ny fifankatiavana, ary hanompoanay an'Andriamanitra sy hitorianay ny filazantsara aminy fiarahamonina rehetra." 
                      },
  
  about_mission:      { fr: 'Notre mission',                                                  mg: 'Ny tanjonay' },
  
  about_mission1:     { fr: "La création de l'EMIFI a pour objectif de contribuer à l'épanouissement des jeunes tout au long de leur parcours universitaire, à travers la musique, la foi et les valeurs chrétiennes, dans le but de former des croyants engagés et des citoyens responsables.",
                        mg: "Ny EMIFI dia naorina mba hanampy amin'ny fanabeazana sy fampivelarana ny tanora mandritra ny fiainany eny amin'ny oniversite, amin'ny alalan'ny mozika, ny finoana ary ny soatoavina kristianina, mba hahatonga azy ireo ho olom-pinoana sy olom-pirenena vanona." 
                      },
  
  about_mission2:     { fr: "Au-delà d'être une chorale évangélique, l'EMIFI constitue également un espace où les étudiants peuvent développer leurs talents artistiques tout en poursuivant leurs études universitaires.",
                        mg: "Ankoatra ny maha-antoko mpihira evanjelika azy, ny EMIFI dia sehatra iray ahafahan'ny mpianatra mampivelatra ny talentany ara-zavakanto, sady manohy ny fianarany eny amin'ny oniversite." 
                      },
  about_history:      { fr: 'Historique',                                                     mg: 'Tantara' },
  about_menbre:       { fr: '+40 menbres',                                                    mg: '+40 mpikambana' },
  about_since:        { fr: 'Depuis 2018',                                                    mg: "Hatramin'ny 2018" },
  tl1_title:          { fr: "Fondation d'EMIFI",                                              mg: 'Fananganana ny EMIFI' },
  tl1_desc:           { fr: 'Création de la chorale par le Pr HAJALALAINA Aimé Richard et le Pr RAKOTONIRAINY Hasina.', mg: "Naorin'ny Pr HAJALALAINA Aimé Richard sy Pr RAKOTONIRAINY Hasina ny antoko mihira." },
  tl2_title:          { fr: 'Festival Harendrina',                                            mg: 'Fety ny Harendrina' },
  tl2_desc:           { fr: "Première apparition officielle lors du Festival Harendrina à l'E-tiala de l'Université de Fianarantsoa.",    
                        mg: "Fisehoana ofisialy voalohany nandritra ny Fety ny Harendrina tao amin'ny E-tiala ao amin'ny Oniversite Fianarantsoa." 
                      },
  tl3_title:          { fr: 'Première prestation',                                            mg: 'Fampisehoana voalohany' },
  tl3_desc:           { fr: 'Première prestation sur scène au KSLMD Université de Fianarantsoa.',           mg: "Fampisehoana an'tsehatra voalohany tao amin'ny KSLMD Oniversite Fianarantsoa." },
  
  // REALISATIONS
  real_badge:         { fr: 'Notre univers musical',                                          mg: 'Ny dianay ara-mozika' },
  real_title_pre:     { fr: 'Nos',                                                            mg: 'Ny' },
  real_title:         { fr: 'réalisations',                                                   mg: 'asa vitanay' },
  real_sub:           { fr: 'Albums enregistrés, clips officiels et prestations mémorables.', mg: 'Rakin-tsary, horonan-tsary ofisialy ary fampisehoana efa natao.' },
  real_albums:        { fr: 'Albums',                                                         mg: 'Rakin-tsary' },
  real_clips:         { fr: 'Clips officiels',                                                mg: 'Horonan-tsary ofisialy' },
  real_see_songs:     { fr: 'Voir les chansons',                                              mg: 'Hijery ireo hira' },
  real_watch:         { fr: 'Regarder',                                                       mg: 'Hijery' },
  real_songs_unit:    { fr: 'chansons',                                                       mg: 'hira' },
  // GALLERY
  gal_badge:          { fr: 'Galerie',                                                        mg: 'Tahirin-tsary' },
  gal_title_pre:      { fr: 'Nos',                                                            mg: 'Ny' },
  gal_title:          { fr: 'moments',                                                        mg: 'fotoana mamy' },
  gal_sub:            { fr: 'Prestations, répétitions et instants de partage capturés au fil des années.', mg: 'Fampisehoana, fameranan-kira ary fotoana niarahana voarakitra nandritry ny taona maro.' },
  gal_view:           { fr: 'Voir',                                                           mg: 'Jereo' },
  // CONTACT
  cont_badge:         { fr: 'Nous rejoindre',                                                 mg: 'Hiditra ao aminay' },
  cont_title_pre:     { fr: 'Nous',                                                           mg: 'Hifandray' },
  cont_title:         { fr: 'contacter',                                                      mg: 'aminay' },
  cont_sub:           { fr: "Une question, une collaboration ou envie de rejoindre EMIFI ? Écrivez-nous.", mg: "Fanontaniana, fiaraha-miasa na maniry ho mpikambana ao amin'ny EMIFI ? Manorata aminay ary." },
  cont_name:          { fr: 'Nom',                                                            mg: 'Anarana' },
  cont_name_ph:       { fr: 'Votre nom complet',                                              mg: 'Ny anaranao feno' },
  cont_phone:         { fr: 'Téléphone',                                                      mg: "Laran'ny findain'nao" },
  cont_email_hint:    { fr: '(ou email)',                                                      mg: '(na mailaka)' },
  cont_phone_hint:    { fr: '(ou tél.)',                                                       mg: "(na laran'ny findain'nao.)" },
  cont_subject:       { fr: 'Objet',                                                          mg: 'Anton-dresaka' },
  cont_subject_ph:    { fr: 'Sujet de votre message',                                         mg: 'Ny lohahevitry ny hafatrao' },
  cont_message:       { fr: 'Message',                                                        mg: 'Hafatrao' },
  cont_message_ph:    { fr: 'Votre message...',                                               mg: 'Ny hafatra halefanao...' },
  cont_send:          { fr: 'Envoyer le message',                                             mg: 'Handefa ny hafatrao' },
  cont_sending:       { fr: 'Envoi en cours...',                                              mg: 'Mandefa ny hafatrao...' },
  cont_ok_title:      { fr: 'Message envoyé !',                                               mg: 'Lasa ny hafatrao !' },
  cont_ok_text:       { fr: 'Nous vous répondrons dans les plus brefs délais.',               mg: "Hiezaka hamaly anao anatiny fotoana faran'izay haingana izahay." },
  cont_new:           { fr: 'Nouveau message',                                                mg: 'Hadefa hafatra vaovao' },
  cont_info:          { fr: 'Informations',                                                   mg: "Fampahalalana" },
  cont_tel_label:     { fr: 'Téléphone',                                                      mg: "Laharan'ny finday" },
  cont_addr_label:    { fr: 'Adresse',                                                        mg: 'Adiresy' },
  cont_addr_value:    { fr: 'EMIT – Université de Fianarantsoa, Madagascar',                  mg: "EMIT – Oniversite an'i Fianarantsoa, Madagasikara" },
  cont_fb_follow:     { fr: 'Suivez-nous',                                                    mg: 'Araho izahay' },
  cont_yt_label:      { fr: 'Clips & prestations',                                            mg: 'Horonan-tsary & fampisehoana' },
  err_name:           { fr: 'Le nom est requis.',                                             mg: 'Ilaina ny anaranao.' },
  err_subject:        { fr: "L'objet est requis.",                                            mg: 'Ilaina ny Anton-dresakao.' },
  err_message:        { fr: 'Le message est requis.',                                         mg: 'Ilaina ny hafatrao.' },
  err_contact_req:    { fr: 'Téléphone ou email requis.',                                     mg: "Ilaina ny Laran'ny findain'nao na mailaka." },
  
  // FOOTER
  foot_desc:          { fr: "La chorale universitaire de l'EMIT – Université de Fianarantsoa.", mg: "Antokom-pihira ao amin'ny EMIT – Oniversiten'i Fianarantsoa." },
  foot_nav:           { fr: 'Navigation',                                                     mg: 'Fitsirihana' },
  foot_rights:        { fr: 'Tous droits réservés.',                                          mg: 'Zo rehetra voatokana.' },
  // NAVBAR / SHARED
  theme_dark:         { fr: 'Mode sombre',                                                    mg: 'Modely maizina' },
  theme_light:        { fr: 'Mode clair',                                                     mg: 'Modely mazava' },
  search_ph:          { fr: 'Chercher une chanson...',                                        mg: 'Hikaroka hira...' },
  search_lyrics_label:{ fr: 'Rechercher les paroles',                                         mg: 'Hikaroka tonon-kira' },
  lyrics_label:       { fr: 'Paroles',                                                        mg: 'Tonon-kira' },
  lyrics_none:        { fr: 'Paroles non disponibles.',                                       mg: 'Tsy misy tonon-kira.' },
  results_none:       { fr: 'Aucun résultat pour',                                            mg: "Tsy misy vokatra hita ho an'i" },
  playlist_btn:       { fr: 'Liste',                                                          mg: 'Lisitra' },
  scroll_listen:      { fr: 'Écouter de la music',                                            mg: 'Andao hihaino hira' },
  search_in_list:     { fr: 'Chercher dans la liste...',                                      mg: 'Hikaroka...' },
} as const;

export type TranslationKey = keyof typeof T;

interface LanguageCtx {
  lang: Lang;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageCtx>({
  lang: 'fr',
  toggleLang: () => {},
  t: (key) => T[key].fr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('fr');
  const toggleLang = () => setLang(l => (l === 'fr' ? 'mg' : 'fr'));
  const t = (key: TranslationKey): string => T[key][lang];
  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
