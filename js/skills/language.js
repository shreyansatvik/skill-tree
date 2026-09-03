/* ==================================================================
   Language & Linguistics — acquiring, using and understanding
   human language, your own and other people's.
================================================================== */

addSkills({ cat: 'language', group: 'Your Own Language' }, [
  { id:'articulation', name:'Speaking Clearly', tier:1,
    desc:'Be understood the first time, at volume, without mumbling or racing.' },
  { id:'grammar-sense', name:'Grammar Sense', tier:2, req:['read-fluency'],
    desc:'Know why a sentence is wrong, not just that it sounds wrong.' },
  { id:'spelling', name:'Spelling & Punctuation', tier:2, req:['read-fluency'],
    desc:'Get it right without a checker, including the marks that change meaning.' },
  { id:'register', name:'Register & Tone', tier:3, req:['grammar-sense','sentence-craft'],
    desc:'Shift between formal, neutral and casual on purpose and land in the right one.' },
  { id:'rhetoric', name:'Rhetoric', tier:4, req:['register','persuasive-writing'],
    desc:'Ethos, pathos, logos and the figures — the classical toolkit for moving people.' },
  { id:'wordplay', name:'Wordplay & Wit', tier:4, req:['vocabulary','register'],
    desc:'Puns, timing and the pleasure of a sentence that turns unexpectedly.' },
  { id:'etymology', name:'Etymology', tier:3, req:['vocabulary'],
    desc:'Trace a word’s history, and use roots to guess at ones you have never met.' },
]);

addSkills({ cat: 'language', group: 'Learning a Language' }, [
  { id:'phonetics-ear', name:'Hearing New Sounds', tier:1,
    desc:'Discriminate sounds your first language does not use, before trying to say them.' },
  { id:'survival-phrases', name:'Survival Phrases', tier:1,
    desc:'Greet, order, ask directions and apologise in a language you do not speak.' },
  { id:'l2-pronunciation', name:'Pronunciation', tier:2, req:['phonetics-ear','articulation'],
    desc:'Produce the sounds, stress and intonation of another language recognisably.' },
  { id:'l2-vocabulary', name:'Vocabulary Acquisition', tier:2, req:['survival-phrases','study-systems'],
    desc:'Build several thousand words with spaced repetition and real context.' },
  { id:'l2-grammar', name:'Second-Language Grammar', tier:3, req:['l2-vocabulary','grammar-sense'],
    desc:'Internalise a case, tense or aspect system until you stop translating in your head.' },
  { id:'l2-listening', name:'Listening Comprehension', tier:3, req:['l2-vocabulary','phonetics-ear'],
    desc:'Follow native-speed speech with accents, slang and people talking over each other.' },
  { id:'l2-conversation', name:'Holding a Conversation', tier:3, req:['l2-grammar','l2-pronunciation'],
    desc:'Sustain twenty minutes of real talk, repairing breakdowns as they happen.' },
  { id:'l2-reading', name:'Reading in Another Language', tier:3, req:['l2-grammar'],
    desc:'Read a newspaper and then a novel without a dictionary on every line.' },
  { id:'l2-writing', name:'Writing in Another Language', tier:4, req:['l2-reading','l2-grammar'],
    desc:'Write an email, a complaint and an essay that a native would not wince at.' },
  { id:'l2-idiom', name:'Idiom & Humour', tier:4, req:['l2-conversation','l2-reading'],
    desc:'Get the joke, and make one — the last thing to arrive in a second language.' },
  { id:'l2-fluency', name:'Fluency', tier:5, req:['l2-idiom','l2-writing','l2-listening'],
    desc:'Live, work and argue in the language without it being the hard part of your day.' },
  { id:'polyglot', name:'Multiple Languages', tier:5, req:['l2-fluency','metacognition'],
    desc:'A repeatable personal method for taking a third or fourth language to usable.' },
]);

addSkills({ cat: 'language', group: 'Scripts & Systems' }, [
  { id:'new-alphabet', name:'A New Alphabet', tier:2, req:['read-fluency'],
    desc:'Read Cyrillic, Greek, Arabic or Devanagari well enough to sound out a street sign.' },
  { id:'logographic', name:'Character-Based Scripts', tier:4, req:['new-alphabet','study-systems'],
    desc:'Hanzi or kanji: components, readings and the thousands of repetitions.' },
  { id:'calligraphy-script', name:'Handwriting Another Script', tier:3, req:['new-alphabet','fine-motor'],
    desc:'Stroke order and letterforms that a native reader can read comfortably.' },
  { id:'transliteration', name:'Transliteration', tier:3, req:['new-alphabet','phonetics-ear'],
    desc:'Move names and terms between scripts consistently and defensibly.' },
  { id:'ipa', name:'Phonetic Transcription', tier:4, req:['phonetics-ear','transliteration'],
    desc:'Read and write IPA — describe any human speech sound precisely.' },
]);

addSkills({ cat: 'language', group: 'Translation & Mediation' }, [
  { id:'gist-translation', name:'Getting the Gist Across', tier:3, req:['l2-conversation'],
    desc:'Convey what someone means between two languages, roughly but reliably.' },
  { id:'translation', name:'Written Translation', tier:4, req:['gist-translation','l2-writing','editing'],
    desc:'Produce a text that reads as if written in the target language and stays faithful.' },
  { id:'interpreting', name:'Consecutive Interpreting', tier:5, req:['gist-translation','l2-listening','memory-technique'],
    desc:'Hold a speaker’s minute and render it accurately, live, in front of everyone.' },
  { id:'simultaneous', name:'Simultaneous Interpreting', tier:5, req:['interpreting','context-switching'],
    desc:'Listen and speak at once for half an hour without dropping content.' },
  { id:'localisation', name:'Localisation', tier:5, req:['translation','cultural-awareness'],
    desc:'Adapt product, humour, units and imagery for a market, not just the words.' },
  { id:'sign-language', name:'Sign Language', tier:4, req:['body-language','l2-vocabulary'],
    desc:'Converse in a signed language, with its own grammar and spatial syntax.' },
]);

addSkills({ cat: 'language', group: 'Linguistics' }, [
  { id:'language-families', name:'Language Families', tier:3, req:['etymology','geography-literacy'],
    desc:'How the world’s languages relate, and why English is stranger than it looks.' },
  { id:'syntax-theory', name:'Syntax & Morphology', tier:4, req:['l2-grammar','logic-basics'],
    desc:'Analyse how any language builds words and sentences, formally.' },
  { id:'sociolinguistics', name:'Sociolinguistics', tier:4, req:['language-families','anthropology'],
    desc:'Dialect, prestige, code-switching and the politics of how people are allowed to talk.' },
  { id:'historical-linguistics', name:'Historical Linguistics', tier:5, req:['language-families','syntax-theory'],
    desc:'Reconstruct sound change and ancestry from the languages that survived.' },
  { id:'computational-linguistics', name:'Computational Linguistics', tier:5, req:['syntax-theory','ml'],
    desc:'Model language with data and code — parsing, embeddings, and where they break.' },
  { id:'endangered-language', name:'Documenting a Language', tier:5, req:['ipa','qualitative-methods','sociolinguistics'],
    desc:'Record, describe and archive a language with few speakers left, with its community.' },
]);

addSkills({ cat: 'language', group: 'Using a Language for Real' }, [
  { id:'l2-phone', name:'Phone Calls in Another Language', tier:4, req:['l2-listening','phone-calls'],
    desc:'No lips, no gestures, bad line — the hardest ordinary language task there is.' },
  { id:'l2-work', name:'Working in Another Language', tier:5, req:['l2-fluency','meetings'],
    desc:'Meetings, jargon and disagreement in a language that is not your first.' },
  { id:'l2-presenting', name:'Presenting in Another Language', tier:5, req:['l2-fluency','public-speaking'],
    desc:'Hold a room and handle questions with an accent and a smaller vocabulary.' },
  { id:'accent-work', name:'Accent Modification', tier:5, req:['l2-pronunciation','ipa'],
    desc:'Move deliberately toward a target accent, or defend the one you have.' },
  { id:'code-switching', name:'Code-Switching', tier:4, req:['register','cross-cultural'],
    desc:'Move between languages, dialects and registers as the room requires.' },
  { id:'heritage-language', name:'Reclaiming a Heritage Language', tier:5, req:['l2-conversation','genealogy'],
    desc:'Recover a family language from partial childhood exposure and adult effort.' },
  { id:'teaching-language', name:'Teaching a Language', tier:5, req:['l2-fluency','lesson-planning'],
    desc:'Sequence input, correct usefully, and get learners speaking from week one.' },
]);

addSkills({ cat: 'language', group: 'Language & Meaning' }, [
  { id:'semantics', name:'Meaning & Ambiguity', tier:4, req:['syntax-theory','logic-basics'],
    desc:'Sense, reference and the many ways a sentence can be read two ways.' },
  { id:'pragmatics', name:'Implicature & Politeness', tier:4, req:['register','reading-the-room'],
    desc:'What is meant but not said, and how politeness varies between languages.' },
  { id:'discourse-analysis', name:'Discourse Analysis', tier:5, req:['pragmatics','sociolinguistics'],
    desc:'Analyse how framing and word choice in real text do political work.' },
  { id:'plain-language', name:'Plain Language', tier:4, req:['editing','semantics'],
    desc:'Rewrite official or technical prose so an ordinary reader gets it first time.' },
  { id:'terminology', name:'Terminology & Glossaries', tier:4, req:['technical-writing','translation'],
    desc:'Define and control the vocabulary of a field so a team uses words the same way.' },
]);

addSkills({ cat: 'language', group: 'Getting Going' }, [
  { id:'listening-to-accents', name:'Understanding Accents', tier:2, req:['listening','phonetics-ear'],
    desc:'Tune into an unfamiliar accent quickly instead of asking them to repeat it.' },
  { id:'language-choice', name:'Choosing a Language to Learn', tier:1,
    desc:'Pick on the basis of use, contact and motivation rather than perceived difficulty.' },
  { id:'language-routine', name:'A Daily Language Habit', tier:2, req:['language-choice','habits'],
    desc:'Fifteen minutes every day beats three hours on Saturday, without exception.' },
  { id:'immersion', name:'Making Immersion at Home', tier:3, req:['language-routine','l2-listening'],
    desc:'Change your media diet so the language is around you without moving country.' },
  { id:'language-exchange', name:'Language Exchange', tier:3, req:['l2-conversation','small-talk'],
    desc:'Find a partner, split the time honestly, and correct each other usefully.' },
  { id:'talking-badly', name:'Speaking Before You Are Ready', tier:3, req:['survival-phrases','discomfort-tolerance-social'],
    desc:'Make mistakes out loud early; the alternative is never speaking at all.' },
]);
