/* ==================================================================
   Outdoors & Wilderness — being comfortable, competent and safe a
   long way from a plug socket.
================================================================== */

addSkills({ cat: 'outdoors', group: 'Being Outside' }, [
  { id:'dressing-for-weather', name:'Dressing for Weather', tier:1,
    desc:'Layers, materials and the fact that cotton is the wrong answer when it is wet.' },
  { id:'walking-outdoors', name:'Walking in the Countryside', tier:1,
    desc:'Footwear, pace, rights of way and leaving gates as you found them.' },
  { id:'day-pack', name:'Packing a Day Pack', tier:2, req:['dressing-for-weather','walking-outdoors'],
    desc:'Water, food, layers, light and the things you will only need once.' },
  { id:'leave-no-trace', name:'Leave No Trace', tier:2, req:['walking-outdoors','waste-recycling'],
    desc:'Waste, fire, toilets and staying on the path — leaving a place as you found it.' },
  { id:'hiking', name:'Hiking', tier:3, req:['day-pack','walking-fitness','map-reading'],
    desc:'Twenty kilometres over hills with a pack, arriving in one piece.' },
  { id:'hill-safety', name:'Mountain Safety', tier:4, req:['hiking','navigation','weather-reading'],
    desc:'Route cards, escape routes, turning back, and telling someone your plan.' },
  { id:'scrambling', name:'Scrambling', tier:4, req:['hill-safety','balance'],
    desc:'Move over exposed rock using hands, and know when it has become climbing.' },
  { id:'night-outdoors', name:'Moving at Night', tier:4, req:['hiking','navigation'],
    desc:'Head torch discipline, dark adaptation and navigating with no visual references.' },
]);

addSkills({ cat: 'outdoors', group: 'Camp Craft' }, [
  { id:'camping', name:'Camping', tier:2, req:['dressing-for-weather'],
    desc:'Pitch, sleep warm, cook and pack down without losing anything.' },
  { id:'shelter-building', name:'Shelter', tier:3, req:['camping','knots'],
    desc:'Tarp, bivvy or natural shelter that keeps wind and rain off you all night.' },
  { id:'fire-craft', name:'Fire Craft', tier:3, req:['camping','workshop-safety'],
    desc:'Lay, light and control a fire in poor conditions, and put it fully out.' },
  { id:'camp-cooking', name:'Cooking Outdoors', tier:3, req:['camping','heat-control'],
    desc:'Stoves, embers and one pot — real food a long way from a kitchen.' },
  { id:'axe-work', name:'Axe & Saw Work', tier:3, req:['fire-craft','workshop-safety'],
    desc:'Fell small, split and process wood safely with a sharp edge and a clear zone.' },
  { id:'rope-work', name:'Rope Work', tier:3, req:['knots','fine-motor'],
    desc:'Anchors, tensioning and hauling with rope you can trust with a load.' },
  { id:'wild-camping', name:'Wild Camping', tier:4, req:['shelter-building','leave-no-trace','water-purification'],
    desc:'Sleep somewhere with no facilities, legally and invisibly.' },
  { id:'winter-camping', name:'Winter & Snow Camping', tier:5, req:['wild-camping','cold-injury','fire-craft'],
    desc:'Sleep out below freezing without losing fingers or morale.' },
  { id:'expedition-planning', name:'Expedition Planning', tier:5, req:['wild-camping','project-planning','risk-assessment'],
    desc:'Food, fuel, weight, resupply and contingency for a multi-week trip.' },
]);

addSkills({ cat: 'outdoors', group: 'Water & Food' }, [
  { id:'water-finding', name:'Finding Water', tier:3, req:['map-reading','geology'],
    desc:'Read terrain for where water collects, and judge whether a source is worth using.' },
  { id:'water-purification', name:'Purifying Water', tier:2, req:['camping','kitchen-hygiene'],
    desc:'Filter, boil or treat, and know which pathogens each method actually removes.' },
  { id:'foraging', name:'Foraging', tier:4, req:['plant-id','fungi-id'],
    desc:'Harvest wild food sustainably, and never eat anything you are not certain of.' },
  { id:'fishing', name:'Fishing', tier:3, req:['knots','patience-craft'],
    desc:'Tackle, reading water, casting and dispatching a fish humanely.' },
  { id:'fly-fishing', name:'Fly Fishing', tier:5, req:['fishing','entomology','proprioception'],
    desc:'Match the hatch, present a fly, and read a river as a set of holding lies.' },
  { id:'hunting', name:'Hunting', tier:5, req:['archery-shooting','tracking','field-dressing'],
    desc:'Legal, ethical pursuit with clean kills and full use of the animal.' },
  { id:'field-dressing', name:'Butchering in the Field', tier:4, req:['knife-skills','anatomy-basics'],
    desc:'Gut, skin and cool an animal hygienically where it fell.' },
  { id:'tracking', name:'Tracking & Signs', tier:4, req:['observation','wildlife-id'],
    desc:'Read prints, scat and disturbance to know what passed and how long ago.' },
]);

addSkills({ cat: 'outdoors', group: 'Wilderness Judgement' }, [
  { id:'wilderness-first-aid', name:'Wilderness First Aid', tier:4, req:['first-aid','hill-safety'],
    desc:'Improvise, stabilise and manage a casualty for hours before help arrives.' },
  { id:'cold-injury', name:'Cold & Heat Injury', tier:3, req:['dressing-for-weather','first-aid'],
    desc:'Recognise and treat hypothermia, frostbite, heat exhaustion and heat stroke.' },
  { id:'self-rescue', name:'Self-Rescue', tier:5, req:['wilderness-first-aid','rope-work','navigation'],
    desc:'Get yourself and a partner out when the plan and the phone have both failed.' },
  { id:'group-leadership-outdoors', name:'Leading a Group Outdoors', tier:5, req:['hill-safety','leadership','risk-assessment'],
    desc:'Take eight people up a hill and bring eight people back down.' },
  { id:'avalanche', name:'Avalanche Awareness', tier:5, req:['skiing','weather-reading','risk-assessment'],
    desc:'Read terrain, snowpack and forecast, and carry and use rescue kit.' },
  { id:'mountaineering', name:'Mountaineering', tier:5, req:['scrambling','winter-camping','rope-work'],
    desc:'Rope, axe and crampons on a real mountain in genuine conditions.' },
  { id:'caving', name:'Caving', tier:5, req:['rope-work','navigation','risk-assessment'],
    desc:'Move safely underground, with light discipline, rigging and no way to be rescued fast.' },
]);

addSkills({ cat: 'outdoors', group: 'Bushcraft' }, [
  { id:'survival-priorities', name:'Survival Priorities', tier:3, req:['fire-craft','water-purification'],
    desc:'Shelter, water, fire, food, signal — in that order, and why panic kills first.' },
  { id:'signalling', name:'Signalling for Help', tier:3, req:['survival-priorities'],
    desc:'Whistle, mirror, ground signs, PLB and phone — being findable on purpose.' },
  { id:'primitive-fire', name:'Fire Without Matches', tier:5, req:['fire-craft','axe-work','patience-craft'],
    desc:'Friction, ferro rod and char cloth — fire when the lighter is at the bottom of a river.' },
  { id:'cordage', name:'Making Cordage & Tools', tier:5, req:['rope-work','carving','plant-id'],
    desc:'Twist usable rope from plants and make the tools you forgot to bring.' },
  { id:'trapping', name:'Trapping & Snares', tier:5, req:['tracking','cordage','ethical-framework'],
    desc:'Legal and ethical constraints first, then the small handful of traps that work.' },
  { id:'bushcraft-mastery', name:'Bushcraft', tier:5, req:['primitive-fire','cordage','foraging'],
    desc:'Live comfortably in woodland for a week with what you can carry and find.' },
]);

addSkills({ cat: 'outdoors', group: 'Reading the Land' }, [
  { id:'terrain-reading', name:'Reading Terrain', tier:3, req:['map-reading','geology'],
    desc:'Predict ground, drainage and difficulty from contours before you walk it.' },
  { id:'route-planning', name:'Route Planning', tier:3, req:['terrain-reading','estimation'],
    desc:'Distance, ascent and Naismith’s rule turned into a realistic day.' },
  { id:'access-rights', name:'Access & Land Rights', tier:2, req:['walking-outdoors','legal-literacy'],
    desc:'Rights of way, wild camping law and where you may actually go.' },
  { id:'seasonal-outdoors', name:'Seasonal Awareness', tier:3, req:['weather-reading','nature-noticing'],
    desc:'Daylight, ground conditions, nesting and rut — what the year does to a landscape.' },
  { id:'tide-tables', name:'Tides & Coastal Safety', tier:3, req:['weather-reading','water-safety'],
    desc:'Read a tide table and avoid being cut off, which is how it usually happens.' },
]);

addSkills({ cat: 'outdoors', group: 'Outdoor Living' }, [
  { id:'kit-selection', name:'Choosing Outdoor Kit', tier:3, req:['dressing-for-weather','comparison-shopping'],
    desc:'Weight, warmth, durability and what is actually worth the money.' },
  { id:'pack-weight', name:'Managing Pack Weight', tier:4, req:['kit-selection','day-pack'],
    desc:'Cut kilos systematically without cutting the things that keep you alive.' },
  { id:'outdoor-hygiene', name:'Hygiene Outdoors', tier:3, req:['camping','leave-no-trace'],
    desc:'Washing, toilets and food handling that keep a group healthy for a fortnight.' },
  { id:'kit-repair', name:'Field Repairs', tier:4, req:['kit-selection','clothing-repair'],
    desc:'Fix a tent pole, a boot sole or a stove with what is in your pack.' },
  { id:'foul-weather', name:'Living in Bad Weather', tier:4, req:['shelter-building','cold-injury'],
    desc:'Stay dry, warm and cheerful through three days of rain in a small tent.' },
  { id:'group-camp', name:'Camping With a Group', tier:4, req:['camping','facilitation','outdoor-hygiene'],
    desc:'Kit, food, jobs and morale organised for eight people and a week.' },
]);

addSkills({ cat: 'outdoors', group: 'Getting Started Outside' }, [
  { id:'local-walks', name:'Walking Locally', tier:1,
    desc:'Find and repeat routes from your own front door in all weather.' },
  { id:'picnicking', name:'Eating Outside', tier:1,
    desc:'Pack, carry and eat a decent meal in a field without a table.' },
  { id:'outdoor-with-children', name:'Outdoors With Children', tier:3, req:['camping','play-with-children'],
    desc:'Kit, pace and expectations so it is fun rather than a forced march.' },
  { id:'dawn-dusk', name:'Being Out at Dawn and Dusk', tier:2, req:['local-walks','nature-noticing'],
    desc:'The two hours when everything is happening and almost nobody is there.' },
  { id:'swimming-outdoors', name:'Wild Swimming', tier:4, req:['open-water','cold-injury','tide-tables'],
    desc:'Entry, acclimatisation, exit plan and never doing it alone.' },
  { id:'stargazing', name:'Stargazing', tier:2, req:['citizen-astronomy','dressing-for-weather'],
    desc:'Dark sites, dark adaptation and knowing what is up tonight.' },
]);

addSkills({ cat: 'outdoors', group: 'Skills for the Hills' }, [
  { id:'pacing-outdoors', name:'Pacing Yourself', tier:3, req:['hiking','fatigue-management'],
    desc:'Move at a speed you can hold for eight hours rather than one.' },
  { id:'group-pace', name:'Walking at a Group’s Pace', tier:5, req:['pacing-outdoors','group-leadership-outdoors'],
    desc:'Set a speed the slowest person can sustain and manage the fastest one’s impatience.' },
  { id:'river-crossing', name:'Crossing Water', tier:5, req:['hill-safety','rope-work','water-safety'],
    desc:'Judge, site and execute a crossing — or decide clearly not to.' },
  { id:'bothy-hut', name:'Huts, Bothies & Refuges', tier:4, req:['wild-camping','leave-no-trace'],
    desc:'Etiquette, fuel, water and sharing a small dark room with strangers.' },
  { id:'outdoor-photography', name:'Photographing the Outdoors', tier:4, req:['landscape-photo','hiking'],
    desc:'Carry the kit, be there at the right hour, and keep it dry.' },
  { id:'trip-reporting', name:'Recording & Sharing Routes', tier:3, req:['route-planning','nature-journal'],
    desc:'Log what you did accurately enough for someone else to repeat or avoid it.' },
]);

addSkills({ cat: 'outdoors', group: 'Water & Coast' }, [
  { id:'beachcombing', name:'Coast & Shoreline', tier:3, req:['nature-noticing','tide-tables'],
    desc:'Read a beach, a rock pool and a strandline for what lives and washes up there.' },
  { id:'coastal-walking', name:'Coastal Walking', tier:3, req:['hiking','tide-tables'],
    desc:'Cliffs, tides and exposure on paths that look easier than they are.' },
  { id:'boat-handling', name:'Small Boat Handling', tier:4, req:['paddling','tide-tables','knots'],
    desc:'Launch, land, moor and handle a small craft in tide and wind.' },
  { id:'river-craft', name:'Rivers & Canals', tier:4, req:['paddling','hydrology'],
    desc:'Read flow, hazards and locks, and know what a rising river means.' },
  { id:'shore-foraging', name:'Foraging the Shore', tier:4, req:['foraging','tide-tables','food-poisoning'],
    desc:'Shellfish, seaweed and the water quality and toxin rules that govern them.' },
]);
