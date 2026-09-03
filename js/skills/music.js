/* ==================================================================
   Music & Performance — the ear, the instrument, the room, and
   everything else done in front of an audience.
================================================================== */

addSkills({ cat: 'music', group: 'The Ear' }, [
  { id:'rhythm', name:'Rhythm & Pitch', tier:1,
    desc:'Keep time, clap a beat, match a note — the ear’s starting kit.' },
  { id:'listening-music', name:'Listening Actively', tier:1,
    desc:'Hear the bass line, the arrangement and the production, not just the tune.' },
  { id:'interval-recognition', name:'Interval Recognition', tier:2, req:['rhythm'],
    desc:'Name the distance between two notes by ear, reliably and fast.' },
  { id:'ear-training', name:'Ear Training', tier:3, req:['interval-recognition','listening-music'],
    desc:'Transcribe a melody, identify a chord quality, and hear a key change coming.' },
  { id:'relative-pitch', name:'Relative Pitch', tier:4, req:['ear-training','music-theory'],
    desc:'Work out any part of a piece by ear, in any key, without an instrument.' },
  { id:'transcription', name:'Transcribing Music', tier:4, req:['ear-training','notation'],
    desc:'Write down what you hear accurately enough for someone else to play it.' },
]);

addSkills({ cat: 'music', group: 'Voice' }, [
  { id:'singing-basics', name:'Singing in Tune', tier:2, req:['rhythm','breathing'],
    desc:'Support, pitch and confidence enough to sing in front of people.' },
  { id:'vocal-technique', name:'Vocal Technique', tier:3, req:['singing-basics','voice-care'],
    desc:'Range, registers, resonance and not damaging your voice over a long set.' },
  { id:'harmony-singing', name:'Singing Harmony', tier:4, req:['vocal-technique','ear-training'],
    desc:'Hold your line against three others without being pulled onto the tune.' },
  { id:'choral', name:'Choral Singing', tier:4, req:['harmony-singing','sight-reading'],
    desc:'Blend, follow a conductor, and be one voice in a section of twenty.' },
  { id:'vocal-performance', name:'Vocal Performance', tier:5, req:['vocal-technique','stage-presence'],
    desc:'Deliver a song with interpretation and control in front of a paying room.' },
]);

addSkills({ cat: 'music', group: 'Instruments' }, [
  { id:'instrument', name:'Instrument Basics', tier:2, req:['rhythm'],
    desc:'Play simple pieces on one instrument with correct technique.' },
  { id:'notation', name:'Reading Music', tier:2, req:['rhythm'],
    desc:'Staff, rhythm, key signatures — turning dots into sound.' },
  { id:'sight-reading', name:'Sight-Reading', tier:3, req:['notation','instrument'],
    desc:'Play something acceptable the first time you see it, without stopping.' },
  { id:'technique-practice', name:'Instrumental Technique', tier:3, req:['instrument','drilling'],
    desc:'Scales, arpeggios and the mechanics that stop technique limiting expression.' },
  { id:'keyboard', name:'Piano & Keyboard', tier:3, req:['instrument','notation'],
    desc:'Two hands independently, and the instrument that makes theory visible.' },
  { id:'guitar', name:'Guitar', tier:3, req:['instrument'],
    desc:'Chords, barre, fingerpicking and enough theory to play with other people.' },
  { id:'strings', name:'Bowed Strings', tier:4, req:['instrument','ear-training'],
    desc:'Intonation without frets, bow control, and vibrato that is not a wobble.' },
  { id:'wind-brass', name:'Wind & Brass', tier:3, req:['instrument','breathing'],
    desc:'Embouchure, breath support and tuning an instrument that drifts with temperature.' },
  { id:'drums', name:'Drums & Percussion', tier:3, req:['rhythm','coordination'],
    desc:'Limb independence, groove and being the person everyone else relies on.' },
  { id:'bass', name:'Bass', tier:3, req:['instrument','rhythm'],
    desc:'Lock with the drums and hold a band’s floor without playing too much.' },
  { id:'second-instrument', name:'A Second Instrument', tier:4, req:['technique-practice','learning-how-to-learn'],
    desc:'Get functional on another instrument in months rather than years.' },
  { id:'virtuosity', name:'Virtuosity', tier:5, req:['technique-practice','deliberate-practice','musical-interpretation'],
    desc:'Technical command so complete it stops being visible in the performance.' },
]);

addSkills({ cat: 'music', group: 'Theory & Composition' }, [
  { id:'music-theory', name:'Music Theory', tier:3, req:['instrument','rhythm'],
    desc:'Scales, harmony and structure — understanding why music works.' },
  { id:'harmony-advanced', name:'Advanced Harmony', tier:4, req:['music-theory','ear-training'],
    desc:'Voice leading, modulation, extensions and substitutions used deliberately.' },
  { id:'improvisation', name:'Improvisation', tier:4, req:['music-theory','relative-pitch'],
    desc:'Make something up over changes that says something and lands on the one.' },
  { id:'songwriting', name:'Songwriting', tier:4, req:['music-theory','creative-writing'],
    desc:'Marry melody, harmony and lyric into a complete song.' },
  { id:'arranging', name:'Arranging', tier:5, req:['harmony-advanced','notation'],
    desc:'Distribute a piece across voices and instruments so each earns its place.' },
  { id:'composition-music', name:'Composition', tier:5, req:['arranging','improvisation'],
    desc:'Write original extended work with structure, development and an argument.' },
  { id:'musical-interpretation', name:'Interpretation', tier:4, req:['music-theory','art-critique'],
    desc:'Make deliberate choices about phrasing, tempo and dynamics, and defend them.' },
]);

addSkills({ cat: 'music', group: 'Playing Together' }, [
  { id:'jamming', name:'Playing With Others', tier:3, req:['instrument','listening-music'],
    desc:'Lock in, leave space, and follow someone else’s change without a chart.' },
  { id:'ensemble', name:'Ensemble Playing', tier:4, req:['jamming','sight-reading'],
    desc:'Blend, balance and count rests in a group where every part is exposed.' },
  { id:'band-leading', name:'Leading a Band', tier:5, req:['ensemble','leadership','arranging'],
    desc:'Set the material, run rehearsals, and manage five people’s egos and diaries.' },
  { id:'conducting', name:'Conducting', tier:5, req:['ensemble','arranging','stage-presence'],
    desc:'Communicate tempo, dynamic and intent to fifty players with your hands.' },
  { id:'accompanying', name:'Accompanying', tier:4, req:['ensemble','musical-interpretation'],
    desc:'Support a soloist and follow them, including when they are wrong.' },
]);

addSkills({ cat: 'music', group: 'Recording & Production' }, [
  { id:'daw-basics', name:'Recording at Home', tier:3, req:['computer-literacy','listening-music'],
    desc:'Interface, levels and a DAW — capturing a clean take in a bedroom.' },
  { id:'mixing', name:'Mixing', tier:4, req:['daw-basics','ear-training'],
    desc:'Balance, EQ, compression and space so every part is audible and nothing fights.' },
  { id:'mastering', name:'Mastering', tier:5, req:['mixing','hearing-care'],
    desc:'Final tone and level so a record translates across every playback system.' },
  { id:'sound-design', name:'Sound Design', tier:4, req:['daw-basics','waves-optics'],
    desc:'Synthesis and sampling to build a sound that did not previously exist.' },
  { id:'live-sound', name:'Live Sound Engineering', tier:5, req:['mixing','sound-recording'],
    desc:'Ring out a room, manage feedback, and mix a band live with no second take.' },
  { id:'dj-skills', name:'DJing', tier:4, req:['rhythm','listening-music'],
    desc:'Beatmatch, read a floor and build a set with an arc over two hours.' },
  { id:'music-release', name:'Releasing Music', tier:5, req:['mastering','social-media-marketing'],
    desc:'Distribution, rights, royalties and getting a record actually heard.' },
]);

addSkills({ cat: 'music', group: 'Stage & Performance' }, [
  { id:'performing-nerves', name:'Performance Nerves', tier:3, req:['breathing','emotion-regulation'],
    desc:'Convert adrenaline into energy instead of shaking hands and a dry mouth.' },
  { id:'acting-basics', name:'Acting Basics', tier:3, req:['body-language','emotion-naming'],
    desc:'Objective, obstacle and truthful reaction — playing intention, not emotion.' },
  { id:'improv', name:'Improvisation & Comedy', tier:3, req:['acting-basics','humour'],
    desc:'Yes-and, listening at speed, and being funny by committing rather than joking.' },
  { id:'stand-up', name:'Stand-Up Comedy', tier:5, req:['improv','stage-presence','writing-practice'],
    desc:'Write, test and rewrite material, and hold a room alone for twenty minutes.' },
  { id:'theatre-acting', name:'Stage Acting', tier:5, req:['acting-basics','vocal-technique','stage-presence'],
    desc:'Sustain a character across two hours and reach the back row every night.' },
  { id:'screen-acting', name:'Screen Acting', tier:5, req:['acting-basics','camera-presence'],
    desc:'Scale everything down for a lens and repeat it identically for six takes.' },
  { id:'busking', name:'Busking & Open Mics', tier:4, req:['performing-nerves','instrument'],
    desc:'Play for people who did not come to see you, and hold some of them.' },
  { id:'gigging', name:'Gigging', tier:5, req:['busking','band-leading','invoicing'],
    desc:'Book, load in, sound check, play, get paid, and do it again on Thursday.' },
]);

addSkills({ cat: 'music', group: 'Musical Culture' }, [
  { id:'music-history', name:'Music History', tier:3, req:['listening-music','historical-context'],
    desc:'Trace where a genre came from and what it was reacting against.' },
  { id:'genre-literacy', name:'Genre Literacy', tier:2, req:['listening-music'],
    desc:'Hear what makes a style itself — instrumentation, groove and production.' },
  { id:'world-music', name:'Non-Western Musical Systems', tier:5, req:['music-theory','cultural-awareness'],
    desc:'Modes, microtones and rhythmic cycles that Western notation cannot hold.' },
  { id:'music-criticism', name:'Writing About Music', tier:4, req:['genre-literacy','prose-style'],
    desc:'Describe sound in words that tell a reader something they could not hear alone.' },
  { id:'record-collecting', name:'Building a Music Library', tier:3, req:['genre-literacy','collecting'],
    desc:'Formats, provenance and a collection organised so you actually listen to it.' },
]);

addSkills({ cat: 'music', group: 'Music as Work' }, [
  { id:'music-teaching', name:'Teaching an Instrument', tier:5, req:['technique-practice','tutoring'],
    desc:'Diagnose a technical fault by ear and design the exercise that fixes it.' },
  { id:'session-work', name:'Session Playing', tier:5, req:['sight-reading','ensemble','professional-ethics'],
    desc:'Turn up, read it down, play what is asked, and be booked again.' },
  { id:'music-rights', name:'Music Rights & Royalties', tier:5, req:['ip-law','music-release'],
    desc:'Publishing, mechanicals, sync and who gets paid when your song is used.' },
  { id:'composing-to-picture', name:'Scoring to Picture', tier:5, req:['composition-music','video-editing'],
    desc:'Write music that hits the cut and serves a scene rather than competing with it.' },
  { id:'music-therapy-literacy', name:'Music for Wellbeing', tier:4, req:['musical-interpretation','mental-health-literacy'],
    desc:'Use music deliberately for regulation, memory and connection with other people.' },
]);

addSkills({ cat: 'music', group: 'Getting Started' }, [
  { id:'singing-along', name:'Singing Along', tier:1,
    desc:'Sing in a car or a room without minding whether it is any good.' },
  { id:'clapping-time', name:'Keeping Time With Others', tier:1,
    desc:'Clap, tap or count with a group and stay with them.' },
  { id:'first-instrument-choice', name:'Choosing an Instrument', tier:2, req:['listening-music','clapping-time'],
    desc:'Match instrument to your ear, hands, budget and the music you actually like.' },
  { id:'practice-habit', name:'A Practice Habit', tier:2, req:['instrument','habits'],
    desc:'Twenty minutes most days beats three hours on Sunday, permanently.' },
  { id:'playing-by-ear', name:'Playing by Ear', tier:3, req:['interval-recognition','instrument'],
    desc:'Work out a tune from a recording without anyone writing it down for you.' },
  { id:'busk-repertoire', name:'Building a Repertoire', tier:3, req:['practice-habit','memory-technique'],
    desc:'Twenty pieces you can play from memory when someone asks.' },
  { id:'instrument-care', name:'Instrument Maintenance', tier:2, req:['instrument','fine-motor'],
    desc:'Strings, reeds, valves, tuning and humidity — keeping it playable.' },
]);

addSkills({ cat: 'music', group: 'Music in a Life' }, [
  { id:'listening-widely', name:'Listening Beyond Your Taste', tier:2, req:['genre-literacy','playfulness'],
    desc:'Deliberately spend time with music you do not yet like.' },
  { id:'concert-going', name:'Going to Live Music', tier:2, req:['listening-music'],
    desc:'Find gigs, back small venues, and listen rather than film it.' },
  { id:'family-music', name:'Music at Home', tier:3, req:['singing-along','play-with-children'],
    desc:'Sing and play with children long before anyone talks about lessons.' },
  { id:'community-music', name:'Playing in a Community Group', tier:4, req:['ensemble','club-participation'],
    desc:'Choirs, bands and orchestras that will take you at whatever level you are.' },
  { id:'lifelong-instrument', name:'Playing for Life', tier:5, req:['practice-habit','consistency','lifelong-learning'],
    desc:'Keep an instrument in your life through decades where nobody is making you.' },
]);
