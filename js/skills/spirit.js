/* ==================================================================
   Meaning & Spirituality — the questions that do not have empirical
   answers, and the practices people build around them.
================================================================== */

addSkills({ cat: 'spirit', group: 'Wonder & Attention' }, [
  { id:'awe', name:'Capacity for Awe', tier:1,
    desc:'Let something vast — a sky, a piece of music, a scale — actually stop you.' },
  { id:'ritual', name:'Personal Ritual', tier:1,
    desc:'A repeated, deliberate act that marks time and means something to you.' },
  { id:'solitude', name:'Comfort in Solitude', tier:2, req:['boredom-tolerance','stillness'],
    desc:'Spend a day alone with yourself and find it nourishing rather than frightening.' },
  { id:'silence', name:'Keeping Silence', tier:3, req:['solitude','stillness'],
    desc:'Hold a deliberate silence long enough that what is underneath it surfaces.' },
  { id:'presence', name:'Presence', tier:4, req:['mindful-daily','silence'],
    desc:'Be entirely where you are — with a person, a task or a landscape.' },
  { id:'reverence', name:'Reverence', tier:4, req:['awe','presence'],
    desc:'Treat some things as not merely useful — a place, a practice, a life.' },
]);

addSkills({ cat: 'spirit', group: 'Meaning-Making' }, [
  { id:'big-questions', name:'Sitting With Big Questions', tier:2, req:['questioning'],
    desc:'Hold death, meaning and freedom as live questions rather than closing them off.' },
  { id:'life-story', name:'Telling Your Own Story', tier:3, req:['journaling','self-honesty'],
    desc:'Make coherent narrative sense of where you have been without flattering it.' },
  { id:'mortality', name:'Mortality Awareness', tier:4, req:['big-questions','grief'],
    desc:'Let the fact of dying inform how you spend a Tuesday, without morbidity.' },
  { id:'suffering', name:'Making Sense of Suffering', tier:4, req:['mortality','adversity'],
    desc:'Find a frame for pain that neither denies it nor makes it the whole story.' },
  { id:'meaning-construction', name:'Constructing Meaning', tier:5, req:['suffering','purpose','life-story'],
    desc:'Build a working answer to what your life is for, and revise it honestly.' },
]);

addSkills({ cat: 'spirit', group: 'Traditions & Texts' }, [
  { id:'religious-literacy', name:'Religious Literacy', tier:2, req:['read-fluency'],
    desc:'Know the basic beliefs, texts and practices of the world’s major traditions.' },
  { id:'sacred-text', name:'Reading a Sacred Text', tier:3, req:['religious-literacy','comprehension'],
    desc:'Read scripture on its own terms — genre, context, and centuries of commentary.' },
  { id:'philosophy-of-life', name:'Practical Philosophy', tier:3, req:['big-questions','critical-reading'],
    desc:'Stoicism, existentialism, Buddhism and the rest as things to live rather than quote.' },
  { id:'interfaith', name:'Interfaith Understanding', tier:4, req:['religious-literacy','cultural-awareness','empathy'],
    desc:'Engage seriously with a tradition you do not share without flattening it.' },
  { id:'theology', name:'Theological Depth', tier:5, req:['sacred-text','logic','interfaith'],
    desc:'Work with a tradition’s hardest internal arguments rather than its slogans.' },
  { id:'ethical-framework', name:'A Worked Ethical Framework', tier:5, req:['philosophy-of-life','logic','integrity'],
    desc:'Reasons for your moral positions that survive contact with hard cases.' },
]);

addSkills({ cat: 'spirit', group: 'Practice & Community' }, [
  { id:'prayer', name:'Prayer or Devotional Practice', tier:2, req:['ritual','stillness'],
    desc:'A sustained practice of address, petition or thanks, held over years.' },
  { id:'fasting', name:'Fasting & Abstinence', tier:3, req:['ritual','delayed-gratification'],
    desc:'Give something up deliberately, long enough to learn what it was doing for you.' },
  { id:'pilgrimage', name:'Pilgrimage', tier:4, req:['ritual','long-distance-travel','solitude'],
    desc:'Travel where the going is the point — Camino, Hajj, Kumbh, a long walk with intent.' },
  { id:'spiritual-community', name:'Belonging to a Congregation', tier:3, req:['prayer','community-participation'],
    desc:'Show up week after week and take a turn holding the thing up.' },
  { id:'service', name:'Service to Others', tier:3, req:['empathy','volunteering'],
    desc:'Give time and effort where it will never be repaid or noticed.' },
  { id:'forgiveness', name:'Forgiveness', tier:4, req:['grief','empathy','anger-work'],
    desc:'Genuinely release a resentment, without pretending the harm did not happen.' },
  { id:'spiritual-direction', name:'Guiding Others', tier:5, req:['forgiveness','mentoring','meaning-construction'],
    desc:'Accompany someone through their own hard questions without answering them for them.' },
  { id:'legacy', name:'Legacy', tier:5, req:['meaning-construction','mortality','mentoring'],
    desc:'Deliberately build what outlasts you — people, institutions, work, a way of being.' },
]);

addSkills({ cat: 'spirit', group: 'Attention to Life' }, [
  { id:'savouring', name:'Savouring', tier:2, req:['gratitude','stillness'],
    desc:'Extend a good moment deliberately instead of letting it pass unnoticed.' },
  { id:'simplicity', name:'Voluntary Simplicity', tier:4, req:['decluttering','frugality','value-naming'],
    desc:'Own, want and commit to less, and find that the remainder is better.' },
  { id:'sabbath', name:'Keeping a Day Apart', tier:4, req:['restorative-practice','saying-no'],
    desc:'One day a week with no work, no commerce and no optimisation of anything.' },
  { id:'nature-connection', name:'Connection to Place', tier:3, req:['nature-noticing','awe'],
    desc:'Know one landscape well enough that it becomes part of how you think.' },
  { id:'beauty-attention', name:'Attention to Beauty', tier:3, req:['awe','museum-looking'],
    desc:'Seek out and make room for the beautiful as a normal part of a week.' },
]);

addSkills({ cat: 'spirit', group: 'Living It Out' }, [
  { id:'moral-formation', name:'Forming Character Deliberately', tier:5, req:['ethical-framework','discipline','self-mastery'],
    desc:'Practise virtues as trainable habits rather than treating them as personality.' },
  { id:'hospitality', name:'Radical Hospitality', tier:4, req:['hosting','generosity','service'],
    desc:'Make room for the person who has nowhere else to be.' },
  { id:'vocation', name:'Vocation', tier:5, req:['purpose','meaningful-work','meaning-construction'],
    desc:'A sense that this particular work is yours to do, tested against reality.' },
  { id:'spiritual-doubt', name:'Living With Doubt', tier:5, req:['big-questions','uncertainty-tolerance','humility'],
    desc:'Hold a practice honestly while genuinely not knowing whether it is true.' },
  { id:'consolation', name:'Consoling the Dying & Bereaved', tier:5, req:['palliative','forgiveness','comforting'],
    desc:'Sit with someone at the end and offer presence rather than explanation.' },
]);

addSkills({ cat: 'spirit', group: 'Practices to Try' }, [
  { id:'walking-meditation', name:'Walking as Practice', tier:2, req:['walking-outdoors','stillness'],
    desc:'Walk without music, phone or destination, and let the mind settle by itself.' },
  { id:'lectio', name:'Slow Reading of Meaningful Texts', tier:3, req:['sacred-text','close-reading'],
    desc:'Read a short passage repeatedly over days rather than a book in an evening.' },
  { id:'examen', name:'Reviewing the Day', tier:2, req:['reflection','gratitude'],
    desc:'A structured look back at where the day went well and where it did not.' },
  { id:'retreat-planning', name:'Making Your Own Retreat', tier:4, req:['solitude','restorative-practice'],
    desc:'A weekend alone with no input, planned so it is restorative rather than restless.' },
  { id:'community-of-practice', name:'Practising With Others', tier:4, req:['spiritual-community','ritual'],
    desc:'Do it alongside people who will notice when you stop turning up.' },
]);

addSkills({ cat: 'spirit', group: 'Time & Attention' }, [
  { id:'slowness', name:'Doing Things Slowly', tier:3, req:['stillness','patience-craft'],
    desc:'Choose the slower version on purpose and notice what speed was costing.' },
  { id:'unplugging', name:'Going Without a Phone', tier:3, req:['digital-minimalism','boredom-tolerance'],
    desc:'A day, then a week, with no device — and finding out what fills the gap.' },
  { id:'seasons-of-life', name:'Living in Seasons', tier:4, req:['seasonality','life-story'],
    desc:'Accept that different years are for different things rather than optimising all of them.' },
  { id:'enough', name:'Knowing What Is Enough', tier:5, req:['simplicity','value-naming','financial-independence'],
    desc:'Define a number and a life that count as sufficient, and then stop.' },
  { id:'inner-life', name:'Maintaining an Inner Life', tier:4, req:['journaling','solitude','reflection'],
    desc:'A private world of thought and attention that is not performed for anyone.' },
  { id:'sacred-ordinary', name:'Finding Depth in the Ordinary', tier:5, req:['presence','savouring','ritual'],
    desc:'Treat washing up, walking and waiting as the practice rather than the interruption.' },
]);
