/* ==================================================================
   Travel & Navigation — getting to the end of the road, and to the
   other side of the world.
================================================================== */

addSkills({ cat: 'travel', group: 'Getting Around' }, [
  { id:'wayfinding', name:'Wayfinding', tier:1,
    desc:'Hold a mental map of where you are and which way you are facing.' },
  { id:'public-transport', name:'Using Public Transport', tier:1,
    desc:'Tickets, changes, timetables and what to do when it is cancelled.' },
  { id:'road-safety', name:'Road Safety as a Pedestrian', tier:1,
    desc:'Crossing, visibility and cycling in traffic without relying on drivers seeing you.' },
  { id:'map-reading', name:'Map Reading', tier:2, req:['wayfinding','geography-literacy'],
    desc:'Scale, contours, symbols and orienting a paper map to the ground.' },
  { id:'navigation', name:'Navigation', tier:3, req:['map-reading','geometry'],
    desc:'Compass bearings, pacing and relocating yourself when the GPS is dead.' },
  { id:'urban-navigation', name:'Navigating a New City', tier:2, req:['wayfinding','public-transport'],
    desc:'Orient fast, find the transport logic, and walk out of the tourist ring.' },
  { id:'celestial-navigation', name:'Navigating by Sky & Land', tier:5, req:['navigation','astronomy'],
    desc:'Sun, stars and terrain as a position fix with no instruments at all.' },
]);

addSkills({ cat: 'travel', group: 'Driving' }, [
  { id:'driving', name:'Driving', tier:3, req:['coordination','time-awareness'],
    desc:'Licensed, defensive, comfortable on unfamiliar roads.' },
  { id:'defensive-driving', name:'Defensive Driving', tier:4, req:['driving','situational-awareness'],
    desc:'Anticipate other people’s mistakes and leave yourself somewhere to go.' },
  { id:'motorway-driving', name:'Motorway & Long-Distance Driving', tier:4, req:['driving','fatigue-management'],
    desc:'Lane discipline, overtaking, fatigue and driving four hundred miles safely.' },
  { id:'adverse-driving', name:'Driving in Bad Conditions', tier:4, req:['defensive-driving','weather-reading'],
    desc:'Ice, fog, standing water and night — slower, smoother, bigger gaps.' },
  { id:'towing', name:'Towing & Reversing', tier:4, req:['driving','proprioception'],
    desc:'Trailer, caravan or van reversed accurately without a spotter.' },
  { id:'motorcycling', name:'Motorcycling', tier:4, req:['balance','defensive-driving'],
    desc:'Counter-steering, road positioning and riding as though you are invisible.' },
  { id:'driving-abroad', name:'Driving Abroad', tier:4, req:['driving','local-customs'],
    desc:'Other side, other rules, other signage, hire agreements and the right paperwork.' },
  { id:'roadside-breakdown', name:'Roadside Breakdown', tier:3, req:['car-maintenance','road-safety'],
    desc:'Get safe, get seen, change a wheel and know when to call somebody.' },
]);

addSkills({ cat: 'travel', group: 'Planning a Trip' }, [
  { id:'travel', name:'Travel Planning', tier:3, req:['budgeting','time-management'],
    desc:'Plan and execute independent travel: logistics, documents, contingencies.' },
  { id:'trip-budgeting', name:'Travel Budgeting', tier:3, req:['budgeting','price-awareness'],
    desc:'Real total cost including the airport transfer nobody ever counts.' },
  { id:'booking', name:'Booking Flights & Rooms', tier:2, req:['web-search','comparison-shopping'],
    desc:'Timing, flexibility, cancellation terms and where the fees are hiding.' },
  { id:'packing', name:'Packing', tier:2, req:['estimation'],
    desc:'Two weeks in a carry-on, with what you actually use rather than what you fear.' },
  { id:'itinerary', name:'Building an Itinerary', tier:3, req:['travel','estimation'],
    desc:'Enough plan to not waste the trip and enough slack to enjoy it.' },
  { id:'travel-research', name:'Researching a Destination', tier:3, req:['web-search','geography-literacy'],
    desc:'Season, safety, costs and what is worth doing beyond the first search page.' },
  { id:'family-travel', name:'Travelling With Children', tier:4, req:['itinerary','parenting-basics'],
    desc:'Pace, snacks, naps and expectations set so it is a holiday for the adults too.' },
  { id:'accessible-travel', name:'Travelling With Additional Needs', tier:4, req:['itinerary','chronic-management'],
    desc:'Plan around mobility, medication and dietary needs, and confirm everything twice.' },
]);

addSkills({ cat: 'travel', group: 'Borders & Documents' }, [
  { id:'passport-visa', name:'Passports & Visas', tier:2, req:['identity-docs','form-filling'],
    desc:'Validity rules, visa types, lead times and entry requirements checked at source.' },
  { id:'airport', name:'Airports & Flying', tier:2, req:['public-transport','packing'],
    desc:'Check-in, security, connections and what to do when a flight is cancelled.' },
  { id:'border-crossing', name:'Border Crossings', tier:3, req:['passport-visa','emotion-regulation'],
    desc:'Customs, questioning and duty limits handled calmly and honestly.' },
  { id:'travel-insurance', name:'Travel Insurance', tier:3, req:['insurance','travel-research'],
    desc:'Cover that matches the activity you are actually doing, and how to claim.' },
  { id:'travel-money', name:'Money Abroad', tier:3, req:['payment-methods','price-awareness'],
    desc:'Cards, cash, exchange rates and never accepting conversion at the terminal.' },
  { id:'travel-health', name:'Travel Health', tier:3, req:['vaccination','medicine-cabinet'],
    desc:'Jabs, prophylaxis, water, and a kit for the illnesses that actually happen.' },
  { id:'consular', name:'When Things Go Wrong Abroad', tier:4, req:['travel-insurance','bureaucracy'],
    desc:'Lost passport, theft, hospital or arrest — who to call and in what order.' },
]);

addSkills({ cat: 'travel', group: 'Being There' }, [
  { id:'local-customs', name:'Local Customs', tier:3, req:['cultural-awareness','travel-research'],
    desc:'Dress, tipping, greetings and taboo — arriving already knowing the basics.' },
  { id:'travel-language', name:'Getting By in the Language', tier:2, req:['survival-phrases'],
    desc:'Fifty words, a translation app and the confidence to try the fifty words first.' },
  { id:'street-smarts', name:'Street Smarts Abroad', tier:3, req:['situational-awareness','local-customs'],
    desc:'Common scams, safe transport and blending in enough not to be the obvious target.' },
  { id:'haggling', name:'Bargaining', tier:3, req:['negotiating-price','local-customs'],
    desc:'Know the local norm, be cheerful, and be willing to walk away.' },
  { id:'travel-eating', name:'Eating Well Abroad', tier:3, req:['produce-selection','local-customs'],
    desc:'Find where locals eat, order confidently, and manage genuine food risk.' },
  { id:'solo-travel', name:'Solo Travel', tier:4, req:['street-smarts','solitude','itinerary'],
    desc:'Travel alone safely and sociably, and enjoy the days with nobody to consult.' },
  { id:'travel-photography', name:'Travel Photography', tier:4, req:['documentary-photo','local-customs'],
    desc:'Photograph a place and its people respectfully and come back with more than postcards.' },
  { id:'travel-writing', name:'Travel Writing', tier:5, req:['travel-photography','prose-style','observation'],
    desc:'Write about a place so a reader who has never been can smell it.' },
]);

addSkills({ cat: 'travel', group: 'Going Further' }, [
  { id:'budget-travel', name:'Travelling Cheaply', tier:4, req:['trip-budgeting','street-smarts'],
    desc:'Hostels, buses, overnight transport and months on what a fortnight usually costs.' },
  { id:'long-distance-travel', name:'Long-Haul & Overland Travel', tier:4, req:['airport','fatigue-management'],
    desc:'Jet lag, multi-day journeys and arriving functional rather than wrecked.' },
  { id:'road-trip', name:'Road Trips & Van Life', tier:4, req:['motorway-driving','camping'],
    desc:'Route, sleeping, water, waste and living out of a vehicle for weeks.' },
  { id:'expedition-travel', name:'Remote & Expedition Travel', tier:5, req:['navigation','wilderness-first-aid','risk-assessment'],
    desc:'Places with no infrastructure, no rescue and no phone signal, planned properly.' },
  { id:'living-abroad', name:'Living Abroad', tier:5, req:['l2-conversation','bureaucracy','local-customs'],
    desc:'Visas, housing, banking, healthcare and building a life in an unfamiliar system.' },
  { id:'digital-nomad', name:'Working While Travelling', tier:5, req:['living-abroad','remote-collaboration','freelance-finance'],
    desc:'Timezones, tax residency, connectivity and actually getting work done.' },
  { id:'repatriation', name:'Coming Home', tier:5, req:['living-abroad','life-story'],
    desc:'Handle reverse culture shock and rebuild a life where everyone moved on.' },
]);

addSkills({ cat: 'travel', group: 'Ways of Travelling' }, [
  { id:'train-travel', name:'Train Travel', tier:2, req:['public-transport','booking'],
    desc:'Split tickets, reservations, sleepers and crossing a continent by rail.' },
  { id:'bus-coach', name:'Bus & Coach Travel', tier:2, req:['public-transport'],
    desc:'Long-distance buses, informal networks and the routes no website lists.' },
  { id:'ferry-boat', name:'Ferries & Boats', tier:3, req:['public-transport','packing'],
    desc:'Crossings, vehicle decks, seasickness and timetables that depend on weather.' },
  { id:'cycle-touring', name:'Cycle Touring', tier:4, req:['cycling','bike-maintenance','camping'],
    desc:'Load a bike, plan daily distance, and fix what breaks in the middle of nowhere.' },
  { id:'hitchhiking', name:'Hitchhiking & Ride Sharing', tier:4, req:['street-smarts','small-talk'],
    desc:'Position, sign, judgement about who to get in with, and an exit plan.' },
  { id:'walking-holiday', name:'Long-Distance Walking', tier:4, req:['hiking','trip-budgeting'],
    desc:'Multi-day trails: feet, weight, accommodation and daily distance you can repeat.' },
  { id:'flight-optimisation', name:'Flying Better', tier:3, req:['airport','booking'],
    desc:'Seats, timing, loyalty schemes and the rights you have when it goes wrong.' },
]);

addSkills({ cat: 'travel', group: 'Travel Judgement' }, [
  { id:'travel-risk', name:'Assessing Travel Risk', tier:4, req:['risk-assessment','travel-research'],
    desc:'Read advisories critically and judge the actual risk where you are going.' },
  { id:'responsible-tourism', name:'Travelling Responsibly', tier:4, req:['local-customs','ethical-consumption'],
    desc:'Where the money goes, what your presence costs, and what to decline.' },
  { id:'travel-carbon', name:'Lower-Carbon Travel', tier:4, req:['carbon-literacy','train-travel'],
    desc:'Fewer, longer, slower trips and knowing which legs actually dominate the total.' },
  { id:'travel-with-purpose', name:'Purposeful Travel', tier:5, req:['responsible-tourism','purpose','solo-travel'],
    desc:'Go somewhere to learn, work or help, and be genuinely useful while you are there.' },
  { id:'travel-memory', name:'Recording a Journey', tier:3, req:['journaling','photo-basics'],
    desc:'Notes, photographs and objects that will still mean something in twenty years.' },
]);

addSkills({ cat: 'travel', group: 'Everyday Getting About' }, [
  { id:'reading-timetables', name:'Reading Timetables', tier:1,
    desc:'Connections, last services and the difference between weekday and Sunday.' },
  { id:'taxis-rideshare', name:'Taxis & Ride Hailing', tier:2, req:['public-transport','payment-methods'],
    desc:'Fares, safety checks and knowing when it is worth the money.' },
  { id:'commute-design', name:'Designing a Commute', tier:3, req:['reading-timetables','time-management'],
    desc:'Route, mode and timing chosen for cost, stress and hours of your life.' },
  { id:'travel-with-luggage', name:'Managing Luggage', tier:2, req:['packing','wayfinding'],
    desc:'Move heavy bags through stations and stairs without wrecking your back or your day.' },
  { id:'delays', name:'Handling Delays & Cancellations', tier:3, req:['taxis-rideshare','complaints'],
    desc:'Rebook fast, claim what you are owed, and keep the evening salvageable.' },
  { id:'airport-transfers', name:'Getting to and From Airports', tier:2, req:['booking','reading-timetables'],
    desc:'The leg that most often goes wrong, planned with a real margin.' },
]);

addSkills({ cat: 'travel', group: 'Travel Practicalities' }, [
  { id:'travel-documents', name:'Managing Travel Documents', tier:2, req:['passport-visa','record-keeping'],
    desc:'Copies, cloud backups and knowing what you need before you reach the desk.' },
  { id:'jetlag', name:'Beating Jet Lag', tier:4, req:['circadian','long-distance-travel'],
    desc:'Light, timing and meals adjusted before you leave, not after you arrive.' },
  { id:'travel-comfort', name:'Being Comfortable in Transit', tier:2, req:['packing','rest-taking'],
    desc:'Sleep, hydration, movement and the four items that make a long journey bearable.' },
  { id:'travel-with-pets', name:'Travelling With Animals', tier:4, req:['pet-care','travel-documents'],
    desc:'Carriers, paperwork, sedation questions and quarantine rules.' },
  { id:'group-travel', name:'Travelling in a Group', tier:4, req:['itinerary','group-decisions'],
    desc:'Agree money, pace and splitting up before you go, not on day three.' },
  { id:'travel-admin', name:'Sorting Out a Trip Afterwards', tier:3, req:['travel-money','expense-tracking'],
    desc:'Settle up, claim expenses and file the receipts while you still remember.' },
]);
