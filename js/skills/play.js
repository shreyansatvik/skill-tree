/* ==================================================================
   Games & Play — the part of life that is not for anything, and the
   skills that make it better.
================================================================== */

addSkills({ cat: 'play', group: 'Playing at All' }, [
  { id:'playfulness', name:'Playfulness', tier:1,
    desc:'Do something for no reason, badly, and enjoy it — harder than it sounds as an adult.' },
  { id:'game-rules', name:'Learning a Game', tier:1,
    desc:'Read a rulebook, or be taught, and get playing inside ten minutes.' },
  { id:'good-sport', name:'Winning & Losing Well', tier:2, req:['game-rules','emotion-regulation'],
    desc:'Be someone people want to play with regardless of the result.' },
  { id:'teaching-games', name:'Teaching a Game', tier:3, req:['game-rules','explaining'],
    desc:'Explain rules in the order a new player needs them and start them playing early.' },
  { id:'hosting-games', name:'Running a Games Night', tier:3, req:['teaching-games','hosting'],
    desc:'Pick for the group, manage length, and get everyone into the second game.' },
]);

addSkills({ cat: 'play', group: 'Board & Card Games' }, [
  { id:'card-games', name:'Card Games', tier:2, req:['game-rules'],
    desc:'A repertoire of classics, plus shuffling and dealing that does not slow the table.' },
  { id:'chess-basics', name:'Chess Fundamentals', tier:3, req:['game-rules','pattern-recognition'],
    desc:'Openings, tactics and endgames enough to have a real game.' },
  { id:'chess-advanced', name:'Serious Chess', tier:5, req:['chess-basics','deliberate-practice'],
    desc:'Study, analysis and playing rated games against people better than you.' },
  { id:'strategy-games', name:'Strategy Board Games', tier:4, req:['card-games','forecasting'],
    desc:'Engine building, tempo and reading opponents across modern designer games.' },
  { id:'bidding-games', name:'Trick-Taking & Bidding', tier:4, req:['card-games','probabilistic-thinking'],
    desc:'Bridge, whist or skat — inference, signalling and partnership discipline.' },
  { id:'poker', name:'Poker', tier:5, req:['bidding-games','probabilistic-thinking','emotion-regulation'],
    desc:'Ranges, position, pot odds and bankroll — playing the long run, not the hand.' },
  { id:'go', name:'Go', tier:5, req:['pattern-recognition','strategy-games'],
    desc:'Shape, influence and life-and-death on a board that never really simplifies.' },
  { id:'tabletop-rpg', name:'Tabletop Roleplaying', tier:4, req:['improv','storytelling'],
    desc:'Play a character, or run a game, so five people build a story together.' },
  { id:'game-mastering', name:'Game Mastering', tier:5, req:['tabletop-rpg','facilitation','worldbuilding'],
    desc:'Prepare situations rather than plots, and keep five improvisers pointed the same way.' },
]);

addSkills({ cat: 'play', group: 'Puzzles & Mental Games' }, [
  { id:'pattern-recognition', name:'Pattern Recognition', tier:2, req:['observation'],
    desc:'See the structure in a sequence, a grid or a position faster than by search.' },
  { id:'logic-puzzles', name:'Logic Puzzles', tier:3, req:['pattern-recognition','logic-basics'],
    desc:'Deduction grids, sudoku and constraint problems solved without guessing.' },
  { id:'crosswords', name:'Crosswords', tier:4, req:['vocabulary','wordplay'],
    desc:'Cryptic conventions and the sideways reading that makes the clue click.' },
  { id:'quizzing', name:'Quizzing & General Knowledge', tier:3, req:['memory-technique','geography-literacy'],
    desc:'Broad recall, and a team that plays its knowledge rather than its loudest member.' },
  { id:'mental-calculation', name:'Mental Calculation Tricks', tier:3, req:['mental-maths','memory-technique'],
    desc:'Shortcuts, checks and the party trick that is also genuinely useful.' },
  { id:'puzzle-design', name:'Designing Puzzles', tier:5, req:['logic-puzzles','game-design'],
    desc:'Build a puzzle with one clean solution and a satisfying moment of realisation.' },
  { id:'escape-rooms', name:'Escape Rooms & Team Puzzling', tier:3, req:['logic-puzzles','collaboration'],
    desc:'Search, communicate, and stop three people working on the same lock.' },
]);

addSkills({ cat: 'play', group: 'Video Games & Digital Play' }, [
  { id:'gaming-basics', name:'Video Game Fluency', tier:2, req:['computer-literacy','coordination'],
    desc:'Controls, conventions and genre literacy that make any new game legible.' },
  { id:'competitive-gaming', name:'Competitive Gaming', tier:4, req:['gaming-basics','deliberate-practice'],
    desc:'Mechanics, macro decisions and reviewing your own replays honestly.' },
  { id:'speedrunning', name:'Speedrunning & Optimisation', tier:5, req:['competitive-gaming','skill-decomposition'],
    desc:'Route, frame-level execution and grinding a run for a two-second improvement.' },
  { id:'game-streaming', name:'Streaming & Content', tier:4, req:['gaming-basics','camera-presence','video-editing'],
    desc:'Play and talk simultaneously, and build an audience that comes back.' },
  { id:'modding', name:'Modding', tier:4, req:['gaming-basics','programming-basics'],
    desc:'Change a game you love, and publish it so other people can use it.' },
]);

addSkills({ cat: 'play', group: 'Tricks & Pastimes' }, [
  { id:'juggling', name:'Juggling', tier:3, req:['hand-eye','coordination'],
    desc:'Three-ball cascade, then everything else that builds on it.' },
  { id:'card-tricks', name:'Sleight of Hand', tier:4, req:['fine-motor','misdirection'],
    desc:'Palms, controls and forces practised until they survive being watched closely.' },
  { id:'misdirection', name:'Misdirection & Presentation', tier:3, req:['body-language','reading-the-room'],
    desc:'Control attention — the actual skill of which the moves are only the excuse.' },
  { id:'magic-performance', name:'Performing Magic', tier:5, req:['card-tricks','misdirection','improv'],
    desc:'A routine with a shape, patter and an ending people talk about afterwards.' },
  { id:'collecting', name:'Collecting', tier:3, req:['pattern-recognition','record-keeping'],
    desc:'Build a coherent collection, learn a market, and know when to stop.' },
  { id:'birdwatching-hobby', name:'Keeping a Hobby Alive', tier:4, req:['consistency','playfulness'],
    desc:'Protect time and attention for something that will never be productive.' },
  { id:'leisure-design', name:'Designing Your Free Time', tier:5, req:['birdwatching-hobby','purpose','rest-taking'],
    desc:'Choose leisure that actually restores and delights you rather than defaults.' },
]);

addSkills({ cat: 'play', group: 'Sport & Physical Play' }, [
  { id:'pub-games', name:'Pub & Bar Games', tier:2, req:['darts-precision','card-games'],
    desc:'Darts, pool and dominoes played well enough to enjoy losing at.' },
  { id:'pool-snooker', name:'Cue Sports', tier:4, req:['darts-precision','geometry'],
    desc:'Angles, cue ball control and thinking two shots ahead.' },
  { id:'lawn-games', name:'Garden & Lawn Games', tier:2, req:['coordination','playfulness'],
    desc:'Croquet, boules, badminton and the rules everyone argues about.' },
  { id:'playground-games', name:'Games With Children', tier:2, req:['play-with-children','game-rules'],
    desc:'A stock of games needing no equipment, for a queue, a car or a wet afternoon.' },
  { id:'party-games', name:'Party Games', tier:3, req:['hosting-games','humour'],
    desc:'Pick and run games that work for a mixed group of adults who barely know each other.' },
]);

addSkills({ cat: 'play', group: 'Making Play' }, [
  { id:'game-modification', name:'House Rules & Variants', tier:4, req:['game-rules','game-design'],
    desc:'Tune a game for your group without breaking what made it work.' },
  { id:'running-tournaments', name:'Running a Tournament', tier:4, req:['hosting-games','project-planning'],
    desc:'Formats, seeding, scheduling and finishing before everyone has to go home.' },
  { id:'treasure-hunts', name:'Designing Hunts & Trails', tier:5, req:['puzzle-design','wayfinding'],
    desc:'A route, clues at the right difficulty, and a finish worth reaching.' },
  { id:'improv-games', name:'Improv & Party Performance', tier:3, req:['improv','party-games'],
    desc:'Short-form games that make a room of non-performers funny.' },
  { id:'play-for-adults', name:'Reclaiming Play', tier:5, req:['playfulness','leisure-design'],
    desc:'Build genuinely unproductive fun back into an adult week, on purpose.' },
]);

addSkills({ cat: 'play', group: 'Fandom & Culture' }, [
  { id:'following-a-sport', name:'Following a Sport', tier:3, req:['game-rules','general-knowledge'],
    desc:'Understand the tactics, the season and the history well enough to enjoy it properly.' },
  { id:'fandom', name:'Being a Fan', tier:3, req:['playfulness','online-community'],
    desc:'Belong to something you did not make, and know where the line is.' },
  { id:'conventions', name:'Conventions & Meetups', tier:3, req:['fandom','joining-a-group'],
    desc:'Plan, pace and actually meet people rather than queueing alone all weekend.' },
  { id:'cosplay', name:'Cosplay & Dressing Up', tier:5, req:['costume','conventions'],
    desc:'Build it, wear it all day, and pose for photographs without overheating.' },
  { id:'trivia-hosting', name:'Hosting a Quiz', tier:4, req:['quizzing','running-meetings','humour'],
    desc:'Write balanced rounds, keep the pace, and settle disputes with authority.' },
]);

addSkills({ cat: 'play', group: 'Games of Chance & Skill' }, [
  { id:'dice-games', name:'Dice & Chance Games', tier:2, req:['game-rules','numeracy'],
    desc:'Backgammon, yahtzee and the intuition for odds they quietly build.' },
  { id:'gambling-literacy', name:'Gambling Literacy', tier:4, req:['probabilistic-thinking','addiction-literacy'],
    desc:'House edge, variance and the design of machines built to keep you playing.' },
  { id:'bluffing', name:'Bluffing & Deception Games', tier:5, req:['poker','reading-the-room'],
    desc:'Werewolf, poker, diplomacy — playing people rather than the board.' },
  { id:'word-games', name:'Word Games', tier:3, req:['vocabulary','pattern-recognition'],
    desc:'Scrabble, anagrams and the letter patterns that make them tractable.' },
  { id:'memory-games', name:'Memory & Attention Games', tier:3, req:['memory-technique','pattern-recognition'],
    desc:'Concentration, kim’s game and card counting as trainable attention.' },
]);
