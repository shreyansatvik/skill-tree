/* ==================================================================
   Safety & Emergency — noticing danger early, and being the useful
   person when something has already gone wrong.
================================================================== */

addSkills({ cat: 'safety', group: 'Awareness & Risk' }, [
  { id:'situational-awareness', name:'Situational Awareness', tier:2, req:['observation','body-language'],
    desc:'Notice exits, people and changes in a space without becoming paranoid about it.' },
  { id:'risk-assessment', name:'Risk Assessment', tier:3, req:['situational-awareness','estimation'],
    desc:'Likelihood times consequence, honestly, instead of by how frightening it feels.' },
  { id:'fatigue-management', name:'Fatigue Management', tier:2, req:['sleep','self-awareness'],
    desc:'Recognise impairment in yourself and stop — the cause of most avoidable accidents.' },
  { id:'personal-safety', name:'Personal Safety', tier:3, req:['situational-awareness','assertive'],
    desc:'Route choice, trusting instinct, and leaving a situation before it develops.' },
  { id:'safeguarding', name:'Safeguarding', tier:4, req:['personal-safety','crisis-support'],
    desc:'Recognise abuse or neglect of a child or vulnerable adult, and report it properly.' },
  { id:'harassment-response', name:'Responding to Harassment', tier:4, req:['personal-safety','de-escalation','record-keeping'],
    desc:'Document, refuse, report and support someone else who is being targeted.' },
]);

addSkills({ cat: 'safety', group: 'First Aid' }, [
  { id:'emergency-call', name:'Calling for Help', tier:1,
    desc:'What to say, in what order, and staying on the line and answering questions.' },
  { id:'first-aid', name:'First Aid', tier:2, req:['routine'],
    desc:'CPR, bleeding, choking, burns — the interventions that buy time.' },
  { id:'cpr', name:'CPR & Defibrillation', tier:3, req:['first-aid','emergency-call'],
    desc:'Compressions at depth and rate, and using an AED without hesitating.' },
  { id:'bleeding-control', name:'Catastrophic Bleeding', tier:3, req:['first-aid'],
    desc:'Direct pressure, packing and tourniquets applied fast enough to matter.' },
  { id:'choking', name:'Choking & Airway', tier:2, req:['first-aid'],
    desc:'Back blows, thrusts, and the different technique for a baby.' },
  { id:'anaphylaxis', name:'Anaphylaxis & Auto-Injectors', tier:3, req:['first-aid','allergy-management'],
    desc:'Recognise it in seconds and use the pen without waiting to be sure.' },
  { id:'seizure-response', name:'Seizures & Collapse', tier:3, req:['first-aid'],
    desc:'Protect the head, time it, recovery position, and when it becomes an emergency.' },
  { id:'mental-health-first-aid', name:'Mental Health First Aid', tier:4, req:['crisis-support','de-escalation'],
    desc:'Approach, listen, assess risk and get someone in crisis to the right help.' },
  { id:'first-responder', name:'First Responder Competence', tier:5, req:['cpr','bleeding-control','wilderness-first-aid'],
    desc:'Take charge of a scene, triage, and hand over cleanly to the ambulance crew.' },
]);

addSkills({ cat: 'safety', group: 'Home & Fire' }, [
  { id:'fire-safety', name:'Fire Safety', tier:2, req:['home-systems'],
    desc:'Alarms tested, escape route agreed, and doors closed at night.' },
  { id:'extinguishers', name:'Using an Extinguisher', tier:3, req:['fire-safety'],
    desc:'Which class for which fire, and the point at which you leave instead.' },
  { id:'gas-electric-safety', name:'Gas & Electrical Safety', tier:3, req:['electrical-basics','home-systems'],
    desc:'Carbon monoxide, smells, RCDs and isolating supply in a hurry.' },
  { id:'water-emergency', name:'Leaks & Flooding', tier:3, req:['plumbing-basics','home-systems'],
    desc:'Stop the water, kill the power, protect what matters and document for insurance.' },
  { id:'child-proofing', name:'Making a Home Safe for Children', tier:4, req:['fire-safety','parenting-basics'],
    desc:'Stairs, chemicals, blind cords, water and the things toddlers actually do.' },
  { id:'older-adult-safety', name:'Fall Prevention', tier:4, req:['elder-care','home-systems'],
    desc:'Lighting, rails, rugs and footwear — the changes that prevent a hip fracture.' },
  { id:'food-poisoning', name:'Food Safety Incidents', tier:3, req:['kitchen-hygiene','symptom-literacy'],
    desc:'Recognise, treat, hydrate and know when it needs medical attention.' },
]);

addSkills({ cat: 'safety', group: 'Emergencies & Disasters' }, [
  { id:'emergency-plan', name:'A Household Emergency Plan', tier:3, req:['fire-safety','emergency-call'],
    desc:'Where you meet, who you call, and where the documents and torch are kept.' },
  { id:'emergency-kit', name:'Emergency Supplies', tier:3, req:['emergency-plan','food-storage'],
    desc:'Water, light, warmth, power and medication for three days without services.' },
  { id:'emergency', name:'Emergency Preparedness', tier:4, req:['first-aid','repair'],
    desc:'Plan, supplies and calm response for outages, injuries and disasters.' },
  { id:'power-outage', name:'Losing Power, Heat or Water', tier:3, req:['emergency-kit','home-systems'],
    desc:'Keep warm, keep food safe, and keep a phone charged for days.' },
  { id:'natural-disaster', name:'Flood, Storm & Quake Response', tier:4, req:['emergency','weather-reading'],
    desc:'Know the local hazard, the warning signs, and whether to leave or stay put.' },
  { id:'evacuation', name:'Evacuating', tier:4, req:['emergency-kit','emergency-plan'],
    desc:'Go bag, route, documents and animals — leaving in fifteen minutes.' },
  { id:'crisis-leadership', name:'Taking Charge in a Crisis', tier:5, req:['first-responder','leadership','emotion-regulation'],
    desc:'Assign roles, communicate clearly and make decisions on incomplete information.' },
  { id:'community-resilience', name:'Community Emergency Planning', tier:5, req:['crisis-leadership','mutual-aid','governance'],
    desc:'Get a street, school or village ready before anything happens.' },
]);

addSkills({ cat: 'safety', group: 'Specific Hazards' }, [
  { id:'road-accident', name:'At a Road Accident', tier:4, req:['first-aid','situational-awareness'],
    desc:'Make the scene safe, call it in properly, and help without creating a second incident.' },
  { id:'water-safety', name:'Water Safety', tier:2, req:['swim-basics'],
    desc:'Cold shock, rip currents, tides and reaching rather than swimming to someone.' },
  { id:'ice-safety', name:'Ice & Cold Water', tier:4, req:['water-safety','cold-injury'],
    desc:'Recognise unsafe ice and survive an immersion long enough to be pulled out.' },
  { id:'chemical-safety', name:'Chemical Safety at Home', tier:2, req:['household-chemistry','lab-safety'],
    desc:'Storage, ventilation, the combinations that make chlorine gas, and what to do if.' },
  { id:'lone-working', name:'Working Alone Safely', tier:3, req:['risk-assessment','signalling'],
    desc:'Check-in systems, communication and never doing the risky bit unobserved.' },
  { id:'violence-avoidance', name:'Avoiding Violence', tier:4, req:['de-escalation','personal-safety'],
    desc:'Read escalation, exit early, and treat leaving as the successful outcome.' },
]);

addSkills({ cat: 'safety', group: 'Safety Culture' }, [
  { id:'safety-briefing', name:'Briefing Others on Safety', tier:3, req:['explaining','risk-assessment'],
    desc:'Say the three things that matter so people actually remember them.' },
  { id:'near-miss', name:'Learning From Near Misses', tier:4, req:['risk-assessment','failure-processing'],
    desc:'Treat the thing that almost happened as free information about the system.' },
  { id:'ppe', name:'Personal Protective Equipment', tier:2, req:['workshop-safety'],
    desc:'Eyes, ears, lungs and hands — what to wear, fitted properly, every time.' },
  { id:'manual-handling', name:'Lifting & Carrying Safely', tier:2, req:['posture','core-strength'],
    desc:'Assess, plan, get help, and use the hinge rather than the spine.' },
  { id:'permit-work', name:'High-Risk Work Controls', tier:5, req:['systems-safety','safety-briefing','lone-working'],
    desc:'Confined space, hot work and isolation — controls that assume people make mistakes.' },
]);

addSkills({ cat: 'safety', group: 'Protecting Others' }, [
  { id:'supervising-children', name:'Supervising Children Safely', tier:4, req:['child-proofing','situational-awareness'],
    desc:'Water, roads, strangers and heights — where attention actually needs to be.' },
  { id:'first-aid-children', name:'Paediatric First Aid', tier:4, req:['first-aid','child-illness'],
    desc:'Different ratios, different airways and the specific emergencies of small bodies.' },
  { id:'suicide-awareness', name:'Suicide Awareness', tier:5, req:['mental-health-first-aid','crisis-support'],
    desc:'Ask directly, stay, reduce access to means, and get professional help involved.' },
  { id:'domestic-abuse-awareness', name:'Recognising Domestic Abuse', tier:5, req:['financial-abuse','safeguarding','manipulation-defence'],
    desc:'Coercive control, isolation and how to offer help without increasing danger.' },
  { id:'online-child-safety', name:'Children’s Online Safety', tier:4, req:['screen-rules','privacy-management','safeguarding'],
    desc:'Grooming, sextortion and settings — plus keeping the conversation open.' },
]);

addSkills({ cat: 'safety', group: 'Security & Conflict' }, [
  { id:'travel-security', name:'Security When Travelling', tier:4, req:['street-smarts','opsec'],
    desc:'Documents, valuables, transport and a plan for the day it goes wrong.' },
  { id:'crowd-safety', name:'Crowds & Events', tier:4, req:['situational-awareness','risk-assessment'],
    desc:'Density, exits and pressure — how crowd disasters develop and how to leave early.' },
  { id:'active-threat', name:'Responding to an Active Threat', tier:5, req:['crowd-safety','crisis-leadership'],
    desc:'Run, hide, tell — decided in advance rather than in the moment.' },
  { id:'stalking-response', name:'Responding to Stalking', tier:5, req:['harassment-response','opsec','police-encounter'],
    desc:'Evidence log, digital hygiene, legal remedies and a safety plan.' },
  { id:'conflict-zones', name:'Awareness in Unstable Places', tier:5, req:['travel-security','travel-risk','consular'],
    desc:'Recognise deterioration early and leave before everyone else decides to.' },
]);

addSkills({ cat: 'safety', group: 'Basic Safety Sense' }, [
  { id:'emergency-numbers', name:'Knowing Who to Call', tier:1,
    desc:'Emergency, non-emergency, poison line and out-of-hours, stored and memorised.' },
  { id:'kitchen-safety', name:'Kitchen Safety', tier:1,
    desc:'Knives, oil, hot pans and the fire blanket you know the location of.' },
  { id:'electrical-awareness', name:'Everyday Electrical Sense', tier:1,
    desc:'Overloaded sockets, damaged leads, water and bathrooms.' },
  { id:'medicine-safety', name:'Storing Medicines Safely', tier:2, req:['medicine-cabinet','kitchen-safety'],
    desc:'Locked, labelled, in date and out of reach of children and confused adults.' },
  { id:'stranger-safety', name:'Teaching Children About Safety', tier:5, req:['supervising-children','talking-hard-topics'],
    desc:'Strangers, secrets, roads and water, taught without making them frightened.' },
  { id:'accident-reporting', name:'Recording an Incident', tier:3, req:['record-keeping','emergency-call'],
    desc:'Photos, times, witnesses and a written account made the same day.' },
]);
