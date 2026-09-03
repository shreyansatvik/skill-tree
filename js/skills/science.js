/* ==================================================================
   Science & Engineering — how the physical world works and how to
   build things that exploit it.
================================================================== */

addSkills({ cat: 'science', group: 'Scientific Literacy' }, [
  { id:'observation', name:'Careful Observation', tier:1,
    desc:'Record what is actually there, separately from what you expected to see.' },
  { id:'measurement', name:'Measurement', tier:1,
    desc:'Length, mass, volume, time and temperature — units, tools and sensible precision.' },
  { id:'science-basics', name:'How Science Works', tier:2, req:['questioning','observation'],
    desc:'Hypothesis, evidence, consensus and revision — why science is a process, not a list.' },
  { id:'unit-conversion', name:'Units & Dimensional Analysis', tier:2, req:['measurement','numeracy'],
    desc:'Convert between systems and catch an error by checking the dimensions.' },
  { id:'uncertainty', name:'Error & Uncertainty', tier:3, req:['measurement','statistics'],
    desc:'Significant figures, error bars and knowing how much of your result is noise.' },
  { id:'lab-technique', name:'Laboratory Technique', tier:3, req:['measurement','observation'],
    desc:'Clean work, controls, labelling and a notebook someone else could follow.' },
  { id:'lab-safety', name:'Laboratory Safety', tier:2, req:['measurement'],
    desc:'Hazard symbols, PPE, fume hoods, waste and what to do when something spills.' },
  { id:'instrument-calibration', name:'Calibration', tier:4, req:['uncertainty','lab-technique'],
    desc:'Establish that an instrument is telling the truth before you believe it.' },
]);

addSkills({ cat: 'science', group: 'Physics' }, [
  { id:'mechanics', name:'Mechanics', tier:3, req:['algebra','measurement'],
    desc:'Force, momentum and energy — predicting how objects will actually move.' },
  { id:'thermodynamics', name:'Heat & Thermodynamics', tier:4, req:['mechanics','calculus'],
    desc:'Energy, entropy and efficiency; why engines and fridges have hard limits.' },
  { id:'electromagnetism', name:'Electricity & Magnetism', tier:4, req:['mechanics','calculus'],
    desc:'Charge, fields, circuits and induction — the physics behind almost every device.' },
  { id:'waves-optics', name:'Waves & Optics', tier:4, req:['mechanics','geometry'],
    desc:'Interference, resonance and lenses; how sound, light and radio actually behave.' },
  { id:'quantum-literacy', name:'Quantum & Relativity Literacy', tier:5, req:['electromagnetism','applied-modelling'],
    desc:'Enough of the real formalism to tell the physics from the pop-science metaphor.' },
  { id:'astronomy', name:'Practical Astronomy', tier:3, req:['geometry','observation'],
    desc:'Find constellations and planets, use a telescope, and predict what is up tonight.' },
  { id:'astrophysics', name:'Astrophysics', tier:5, req:['astronomy','quantum-literacy'],
    desc:'Stellar life cycles, cosmology and how we know any of it from photons alone.' },
]);

addSkills({ cat: 'science', group: 'Chemistry' }, [
  { id:'chemistry-basics', name:'Chemistry Basics', tier:3, req:['science-basics','algebra'],
    desc:'Atoms, bonds, reactions and the periodic table as a working tool.' },
  { id:'stoichiometry', name:'Stoichiometry', tier:3, req:['chemistry-basics','unit-conversion'],
    desc:'Balance equations and calculate what actually comes out of a reaction.' },
  { id:'household-chemistry', name:'Everyday Chemistry', tier:2, req:['measurement'],
    desc:'Acids, bases, solvents and surfactants — why cleaning products work and must not mix.' },
  { id:'organic-chemistry', name:'Organic Chemistry', tier:4, req:['stoichiometry','lab-technique'],
    desc:'Functional groups, mechanisms and synthesis — the chemistry of carbon and life.' },
  { id:'biochemistry', name:'Biochemistry', tier:5, req:['organic-chemistry','cell-biology'],
    desc:'Proteins, enzymes and metabolism — chemistry as the machinery of a cell.' },
  { id:'materials-science', name:'Materials Science', tier:4, req:['chemistry-basics','mechanics'],
    desc:'Why metals bend, ceramics shatter and polymers creep — choosing the right stuff.' },
]);

addSkills({ cat: 'science', group: 'Life Sciences' }, [
  { id:'biology-basics', name:'Biology Basics', tier:2, req:['science-basics'],
    desc:'Cells, evolution, inheritance and the tree of life as an organising frame.' },
  { id:'cell-biology', name:'Cell & Molecular Biology', tier:4, req:['biology-basics','chemistry-basics'],
    desc:'DNA, transcription, membranes and how a cell actually gets anything done.' },
  { id:'genetics', name:'Genetics', tier:4, req:['cell-biology','statistics'],
    desc:'Inheritance, variation, heritability and reading a genomic claim critically.' },
  { id:'evolution', name:'Evolutionary Thinking', tier:3, req:['biology-basics','statistics'],
    desc:'Selection, drift and trade-offs as a lens on bodies, behaviour and disease.' },
  { id:'ecology', name:'Ecology', tier:3, req:['biology-basics','observation'],
    desc:'Populations, niches and energy flow through an ecosystem.' },
  { id:'microbiology', name:'Microbiology', tier:4, req:['cell-biology','lab-technique'],
    desc:'Bacteria, viruses and fungi — culture, contamination and resistance.' },
  { id:'physiology', name:'Human Physiology', tier:4, req:['anatomy-basics','cell-biology'],
    desc:'How organ systems regulate themselves, and what happens when the loop breaks.' },
  { id:'neuroscience', name:'Neuroscience', tier:5, req:['physiology','statistics'],
    desc:'Neurons, circuits and behaviour — plus healthy scepticism about brain-scan stories.' },
  { id:'epidemiology', name:'Epidemiology', tier:5, req:['statistics','research-design','microbiology'],
    desc:'Incidence, confounding and transmission models that inform real decisions.' },
]);

addSkills({ cat: 'science', group: 'Earth & Space' }, [
  { id:'weather-reading', name:'Reading the Weather', tier:2, req:['observation'],
    desc:'Clouds, pressure, wind shift — forecast the next six hours without a phone.' },
  { id:'meteorology', name:'Meteorology', tier:4, req:['weather-reading','thermodynamics'],
    desc:'Fronts, models and forecast uncertainty; reading a synoptic chart properly.' },
  { id:'geology', name:'Geology', tier:3, req:['observation','science-basics'],
    desc:'Read a landscape for its rock, its faults and the last few million years.' },
  { id:'hydrology', name:'Water & Rivers', tier:4, req:['geology','ecology'],
    desc:'Catchments, aquifers and flooding — where water comes from and where it will go.' },
  { id:'climate-science', name:'Climate Science', tier:5, req:['meteorology','applied-modelling','ecology'],
    desc:'Forcings, feedbacks and projections, and what the uncertainty ranges mean.' },
  { id:'soil-science', name:'Soil Science', tier:3, req:['chemistry-basics','ecology'],
    desc:'Texture, pH, organic matter and biology — the difference between soil and dirt.' },
]);

addSkills({ cat: 'science', group: 'Engineering' }, [
  { id:'electricity-basics', name:'Household Electricity', tier:2, req:['measurement'],
    desc:'Volts, amps, fuses and earth — enough to be safe and to reset the right thing.' },
  { id:'electronics', name:'Electronics', tier:3, req:['electricity-basics','algebra'],
    desc:'Read a schematic, build a circuit, and measure it with a multimeter.' },
  { id:'soldering', name:'Soldering', tier:2, req:['fine-motor','lab-safety'],
    desc:'Clean joints on through-hole and surface-mount work without lifting a pad.' },
  { id:'cad', name:'CAD & Technical Drawing', tier:3, req:['geometry','computer-literacy'],
    desc:'Model a part with real dimensions and tolerances someone could manufacture.' },
  { id:'mechanisms', name:'Mechanisms & Machines', tier:3, req:['mechanics','cad'],
    desc:'Gears, linkages, bearings and leverage — making motion do what you want.' },
  { id:'structures', name:'Structures & Loads', tier:4, req:['mechanics','materials-science'],
    desc:'Beams, tension, compression and safety factors — will it hold, and by how much.' },
  { id:'fluid-power', name:'Fluids, Pumps & Plumbing Theory', tier:4, req:['mechanics','thermodynamics'],
    desc:'Pressure, flow and head loss — why the pump is wrong for the pipe.' },
  { id:'control-systems', name:'Control Systems', tier:5, req:['calculus','electronics','systems-thinking'],
    desc:'Feedback, PID and stability — making a system hold a setpoint without oscillating.' },
  { id:'robotics', name:'Robotics', tier:5, req:['control-systems','microcontrollers','mechanisms'],
    desc:'Sense, plan and actuate — a machine that does something useful in the real world.' },
  { id:'design-for-manufacture', name:'Design for Manufacture', tier:5, req:['cad','materials-science','structures'],
    desc:'Design a part that can actually be made, at quantity, for a sane price.' },
  { id:'prototyping', name:'Prototyping', tier:4, req:['cad','threed-printing'],
    desc:'Get to a rough working version fast, and learn the one thing it was built to test.' },
  { id:'reverse-engineering', name:'Reverse Engineering', tier:5, req:['mechanisms','electronics','debugging'],
    desc:'Take a thing apart and work out why every decision in it was made.' },
]);

addSkills({ cat: 'science', group: 'Applied Engineering' }, [
  { id:'civil-basics', name:'Civil Engineering Literacy', tier:5, req:['structures','hydrology'],
    desc:'Roads, bridges, drainage and foundations — why infrastructure is shaped as it is.' },
  { id:'hvac', name:'Heating & Cooling Systems', tier:5, req:['thermodynamics','fluid-power'],
    desc:'Heat pumps, refrigeration and ventilation sized for a real building.' },
  { id:'renewables', name:'Renewable Energy Systems', tier:5, req:['electromagnetism','energy-literacy'],
    desc:'Solar, wind, storage and grid constraints, with the numbers rather than the slogans.' },
  { id:'acoustics', name:'Acoustics', tier:4, req:['waves-optics','measurement'],
    desc:'Reverberation, isolation and treatment — making a room sound the way you need.' },
  { id:'optics-practical', name:'Practical Optics', tier:4, req:['waves-optics','measurement'],
    desc:'Lenses, telescopes and microscopes chosen and aligned for the job at hand.' },
  { id:'signal-processing', name:'Signal Processing', tier:5, req:['calculus','waves-optics'],
    desc:'Sampling, filtering and Fourier transforms applied to real noisy data.' },
  { id:'systems-safety', name:'Safety Engineering', tier:5, req:['control-systems','risk-assessment'],
    desc:'Failure modes, redundancy and designing for the day something breaks.' },
]);

addSkills({ cat: 'science', group: 'Data & Modelling in Science' }, [
  { id:'scientific-computing', name:'Scientific Computing', tier:5, req:['python','applied-modelling'],
    desc:'Numerical methods, stability and getting an answer you can trust from a computer.' },
  { id:'lab-automation', name:'Instrumentation & Automation', tier:5, req:['microcontrollers','instrument-calibration'],
    desc:'Log a measurement continuously instead of standing there with a clipboard.' },
  { id:'field-methods', name:'Field Research Methods', tier:4, req:['lab-technique','observation'],
    desc:'Sampling design, kit that works in rain, and data recorded so it survives the trip.' },
  { id:'scientific-illustration', name:'Scientific Illustration', tier:4, req:['observation-drawing','close-reading'],
    desc:'Draw a specimen or a mechanism so it teaches rather than decorates.' },
]);

addSkills({ cat: 'science', group: 'Further Life Sciences' }, [
  { id:'botany', name:'Botany', tier:4, req:['biology-basics','plant-id'],
    desc:'Structure, physiology and reproduction — why plants do what they do.' },
  { id:'zoology', name:'Zoology & Animal Behaviour', tier:4, req:['biology-basics','wildlife-id'],
    desc:'Behaviour as an adaptive strategy, observed and recorded systematically.' },
  { id:'pharmacology', name:'Pharmacology Basics', tier:5, req:['biochemistry','medication-management'],
    desc:'Absorption, half-life, receptors and why interactions and doses matter so much.' },
  { id:'immunology', name:'Immunology', tier:5, req:['cell-biology','immune-literacy'],
    desc:'How the immune system distinguishes self from other, and what happens when it fails.' },
  { id:'palaeontology', name:'Deep Time & Palaeontology', tier:4, req:['geology','evolution'],
    desc:'Read the fossil and stratigraphic record and reason across millions of years.' },
  { id:'conservation-science', name:'Conservation Biology', tier:5, req:['ecology','statistics','genetics'],
    desc:'Population viability, corridors and triage when you cannot save everything.' },
]);

addSkills({ cat: 'science', group: 'Everyday Science' }, [
  { id:'kitchen-science', name:'Science in the Kitchen', tier:3, req:['household-chemistry','heat-control'],
    desc:'Heat transfer, emulsions and pH explaining what a recipe cannot.' },
  { id:'diy-physics', name:'Physics Around the House', tier:3, req:['mechanics','electricity-basics'],
    desc:'Levers, insulation, condensation and why the door slams in a draught.' },
  { id:'science-scepticism', name:'Evaluating Scientific Claims', tier:4, req:['science-basics','misinformation','statistics'],
    desc:'Check the study, the funding and the effect size before repeating anything.' },
  { id:'home-experiment', name:'Running a Home Experiment', tier:3, req:['scientific-method','measurement'],
    desc:'Test something about your own life with controls and enough data to matter.' },
  { id:'citizen-astronomy', name:'Observing the Sky', tier:2, req:['observation','nature-noticing'],
    desc:'Moon phases, planets, the ISS and a meteor shower without any equipment.' },
  { id:'microscopy', name:'Microscopy', tier:4, req:['optics-practical','lab-technique'],
    desc:'Prepare a slide, focus properly, and see what is actually in pond water.' },
]);

addSkills({ cat: 'science', group: 'Engineering Judgement' }, [
  { id:'tolerances', name:'Tolerances & Fit', tier:4, req:['measurement','cad'],
    desc:'Specify how precise a dimension needs to be, and no more than that.' },
  { id:'failure-analysis', name:'Failure Analysis', tier:5, req:['materials-science','reverse-engineering'],
    desc:'Work out from the broken part why it broke, and what to change.' },
  { id:'standards', name:'Standards & Specifications', tier:4, req:['compliance','technical-writing'],
    desc:'Find, read and apply the standard that governs what you are building.' },
  { id:'cost-engineering', name:'Designing to a Cost', tier:5, req:['design-for-manufacture','unit-economics'],
    desc:'Hit a price by choosing where the money goes, not by cutting everything equally.' },
  { id:'lifecycle-thinking', name:'Whole-Life Design', tier:5, req:['cost-engineering','circular-economy'],
    desc:'Design for maintenance, repair and disposal, not just for the day it ships.' },
]);

addSkills({ cat: 'science', group: 'Getting Into Science' }, [
  { id:'asking-why', name:'Asking Why Things Work', tier:1,
    desc:'Look at an everyday object and want to know what is actually happening inside it.' },
  { id:'reading-popular-science', name:'Reading Popular Science', tier:2, req:['read-fluency','asking-why'],
    desc:'Enjoy it while keeping track of where the analogy stops being true.' },
  { id:'science-documentaries', name:'Using Documentaries & Talks', tier:2, req:['reading-popular-science','info-filtering'],
    desc:'Watch for the mechanism rather than the imagery, and check the claims.' },
  { id:'kitchen-experiments', name:'Experiments With Children', tier:3, req:['home-experiment','play-with-children'],
    desc:'Simple demonstrations that produce a real question rather than just a mess.' },
  { id:'science-clubs', name:'Amateur Science', tier:4, req:['home-experiment','nature-recording'],
    desc:'Astronomy societies, weather stations and recording schemes doing real work.' },
]);
