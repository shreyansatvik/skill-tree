/* ==================================================================
   Craft & Making — hands, tools and materials; producing physical
   objects that did not exist yesterday.
================================================================== */

addSkills({ cat: 'craft', group: 'Hand Skills' }, [
  { id:'fine-motor', name:'Fine Motor Control', tier:1,
    desc:'Steady, precise, repeatable hand movement — the base of every craft.' },
  { id:'tool-handling', name:'Basic Tool Use', tier:1,
    desc:'Hammer, screwdriver, pliers, tape — using each correctly and not rounding things off.' },
  { id:'knots', name:'Knots & Lashings', tier:2, req:['fine-motor'],
    desc:'A dozen knots tied correctly, in the dark, that hold and then come undone.' },
  { id:'measuring-marking', name:'Measuring & Marking Out', tier:2, req:['tool-handling','measurement'],
    desc:'Square, level, plumb and twice-measured — where most amateur work goes wrong.' },
  { id:'cutting', name:'Cutting & Sawing', tier:2, req:['measuring-marking'],
    desc:'Straight, square cuts by hand and by machine, safely, in several materials.' },
  { id:'sharpening', name:'Sharpening', tier:3, req:['tool-handling','fine-motor'],
    desc:'Put a real edge on knives, chisels and scissors, and maintain it.' },
  { id:'adhesives', name:'Glues & Fixings', tier:2, req:['tool-handling'],
    desc:'Which adhesive, screw or fastening actually suits this joint and this load.' },
  { id:'finishing', name:'Finishing & Surface', tier:3, req:['cutting','adhesives'],
    desc:'Sanding, sealing, painting and polishing — the ninety percent nobody photographs.' },
  { id:'workshop-safety', name:'Workshop Safety', tier:2, req:['tool-handling'],
    desc:'Guards, PPE, dust, kickback and never reaching across a running blade.' },
  { id:'workshop-setup', name:'Setting Up a Workspace', tier:3, req:['workshop-safety','file-org'],
    desc:'Bench, light, storage and power arranged so the work is pleasant to do.' },
]);

addSkills({ cat: 'craft', group: 'Textiles' }, [
  { id:'hand-sewing', name:'Hand Sewing', tier:1,
    desc:'Thread a needle, sew a seam, replace a button and mend a hem invisibly.' },
  { id:'machine-sewing', name:'Machine Sewing', tier:2, req:['hand-sewing'],
    desc:'Thread, tension, seams and zips on a machine you can also troubleshoot.' },
  { id:'pattern-cutting', name:'Pattern Cutting', tier:4, req:['machine-sewing','measuring-marking'],
    desc:'Draft or adapt a pattern to a real body rather than a standard size.' },
  { id:'garment-making', name:'Making Clothes', tier:4, req:['pattern-cutting','fit'],
    desc:'Cut, construct and finish a garment you would actually wear out.' },
  { id:'clothing-repair', name:'Mending & Alteration', tier:3, req:['hand-sewing','garment-care'],
    desc:'Darn, patch, take in and let out — doubling the life of what you own.' },
  { id:'knitting', name:'Knitting & Crochet', tier:2, req:['fine-motor'],
    desc:'Cast on, the basic stitches, gauge and reading a pattern.' },
  { id:'knitting-advanced', name:'Complex Knitting', tier:4, req:['knitting','pattern-cutting'],
    desc:'Cables, colourwork and shaping a fitted garment from measurements.' },
  { id:'weaving', name:'Weaving', tier:4, req:['fine-motor','measuring-marking'],
    desc:'Warp a loom and hold consistent tension and selvedge across a whole length.' },
  { id:'embroidery', name:'Embroidery & Needlework', tier:3, req:['hand-sewing','drawing'],
    desc:'Stitch vocabulary and the patience to put a drawing onto cloth.' },
  { id:'dyeing', name:'Dyeing & Printing Fabric', tier:4, req:['household-chemistry','printmaking'],
    desc:'Mordants, resist and colourfastness — putting colour into cloth that stays.' },
  { id:'upholstery', name:'Upholstery', tier:5, req:['machine-sewing','furniture-making'],
    desc:'Strip, re-web, stuff and cover a chair so it outlives you.' },
]);

addSkills({ cat: 'craft', group: 'Wood' }, [
  { id:'woodwork-basics', name:'Basic Woodwork', tier:2, req:['cutting','adhesives'],
    desc:'Cut, drill, screw and assemble something square that does not wobble.' },
  { id:'hand-tools-wood', name:'Hand Tool Woodworking', tier:3, req:['woodwork-basics','sharpening'],
    desc:'Plane, chisel and handsaw work to a line, quietly and without dust extraction.' },
  { id:'power-tools', name:'Power Tools', tier:3, req:['woodwork-basics','workshop-safety'],
    desc:'Circular saw, router, planer and sander used accurately and with all fingers.' },
  { id:'joinery', name:'Joinery', tier:4, req:['hand-tools-wood','measuring-marking'],
    desc:'Mortise and tenon, dovetails and housings that hold without fasteners.' },
  { id:'furniture-making', name:'Furniture Making', tier:5, req:['joinery','finishing','cad'],
    desc:'Design and build a piece with structural integrity and a finish worth keeping.' },
  { id:'wood-turning', name:'Wood Turning', tier:4, req:['power-tools','sharpening'],
    desc:'Bowls and spindles on a lathe, with tool control and grain awareness.' },
  { id:'carving', name:'Carving', tier:4, req:['hand-tools-wood','sculpture'],
    desc:'Take material away in the right order to leave the shape you intended.' },
  { id:'timber-knowledge', name:'Knowing Timber', tier:3, req:['woodwork-basics','observation'],
    desc:'Species, grain, movement and moisture — why the panel cracked a year later.' },
  { id:'green-woodworking', name:'Green Woodworking', tier:5, req:['carving','timber-knowledge','axe-work'],
    desc:'Work unseasoned wood from log to chair with hand tools and a shave horse.' },
]);

addSkills({ cat: 'craft', group: 'Metal & Fire' }, [
  { id:'metalwork-basics', name:'Basic Metalwork', tier:3, req:['cutting','measuring-marking'],
    desc:'Cut, file, drill and tap metal to a tolerance you can measure.' },
  { id:'welding', name:'Welding', tier:4, req:['metalwork-basics','workshop-safety'],
    desc:'MIG or stick welds that penetrate, hold, and look like you meant them.' },
  { id:'machining', name:'Machining', tier:5, req:['metalwork-basics','cad'],
    desc:'Lathe and mill work to a thousandth, with feeds, speeds and the right tooling.' },
  { id:'blacksmithing', name:'Blacksmithing', tier:5, req:['metalwork-basics','fire-craft'],
    desc:'Heat, draw, upset and forge-weld steel into a tool that works.' },
  { id:'casting', name:'Casting', tier:5, req:['metalwork-basics','sculpture','materials-science'],
    desc:'Pattern, mould and pour — turning a shape into metal, resin or plaster.' },
  { id:'jewellery', name:'Jewellery Making', tier:4, req:['soldering','fine-motor'],
    desc:'Saw, solder, set and polish at a scale where a millimetre is a lot.' },
]);

addSkills({ cat: 'craft', group: 'Earth & Fire' }, [
  { id:'pottery-hand', name:'Hand-Built Pottery', tier:2, req:['fine-motor'],
    desc:'Pinch, coil and slab — clay bodies, joining, and drying without cracks.' },
  { id:'wheel-throwing', name:'Throwing on the Wheel', tier:4, req:['pottery-hand','proprioception'],
    desc:'Centre, open, pull and trim a form that is even the whole way up.' },
  { id:'glazing', name:'Glazing & Firing', tier:4, req:['pottery-hand','chemistry-basics'],
    desc:'Glaze chemistry, application and kiln schedules that produce what you intended.' },
  { id:'glasswork', name:'Glasswork', tier:5, req:['fire-craft','fine-motor','workshop-safety'],
    desc:'Stained, fused or blown — working a material that punishes hesitation.' },
  { id:'candle-soap', name:'Candles & Soap', tier:3, req:['household-chemistry','measurement'],
    desc:'Saponification, fragrance load and cure times — chemistry you can give away.' },
]);

addSkills({ cat: 'craft', group: 'Paper & Letters' }, [
  { id:'calligraphy', name:'Calligraphy', tier:3, req:['handwriting','fine-motor'],
    desc:'Nib, angle and rhythm producing consistent letterforms in a real hand.' },
  { id:'lettering', name:'Hand Lettering & Signwriting', tier:4, req:['calligraphy','typography'],
    desc:'Draw letters rather than write them, at a size people see from across a road.' },
  { id:'bookbinding', name:'Bookbinding', tier:4, req:['adhesives','measuring-marking','fine-motor'],
    desc:'Fold, sew and case a book that opens flat and stays together.' },
  { id:'papercraft', name:'Paper Craft & Origami', tier:2, req:['fine-motor'],
    desc:'Precise folding, scoring and cutting — geometry you can hold.' },
  { id:'framing', name:'Framing & Mounting', tier:3, req:['measuring-marking','cutting'],
    desc:'Mount, mat and frame work archivally and square.' },
  { id:'zines', name:'Making Zines & Small Press', tier:4, req:['bookbinding','layout'],
    desc:'Write, lay out, print and staple something and put it in people’s hands.' },
]);

addSkills({ cat: 'craft', group: 'Repair & Craft as Work' }, [
  { id:'restoration', name:'Restoring Old Things', tier:5, req:['finishing','timber-knowledge','patience-craft'],
    desc:'Judge what to conserve and what to replace, and reverse someone else’s bad repair.' },
  { id:'patience-craft', name:'Working Slowly', tier:3, req:['discipline','fine-motor'],
    desc:'Accept that the finish takes five coats and none of them can be rushed.' },
  { id:'craft-pricing', name:'Pricing Handmade Work', tier:5, req:['pricing','unit-economics'],
    desc:'Cost your hours honestly and charge accordingly instead of subsidising strangers.' },
  { id:'craft-selling', name:'Selling Your Craft', tier:5, req:['craft-pricing','photo-basics','social-media-marketing'],
    desc:'Markets, listings and photographs that make a handmade object sell itself.' },
  { id:'teaching-craft', name:'Teaching a Craft', tier:5, req:['demonstrating','workshop-running','workshop-safety'],
    desc:'Run a class where beginners leave with a finished thing and all their fingers.' },
]);

addSkills({ cat: 'craft', group: 'Digital Fabrication' }, [
  { id:'laser-cutting', name:'Laser Cutting', tier:4, req:['cad','workshop-safety'],
    desc:'Vector prep, kerf and material choice for parts that fit together first time.' },
  { id:'cnc', name:'CNC Machining', tier:5, req:['cad','machining'],
    desc:'Toolpaths, workholding and feeds that cut the part rather than the fixture.' },
  { id:'scanning', name:'3D Scanning & Photogrammetry', tier:4, req:['threed-modelling','photo-basics'],
    desc:'Capture a real object accurately enough to modify and remake it.' },
  { id:'pcb-design', name:'PCB Design', tier:5, req:['electronics','cad'],
    desc:'Schematic capture, layout and getting a board back from a fab that works.' },
  { id:'fabrication-planning', name:'Planning a Build', tier:4, req:['cad','estimating-work'],
    desc:'Cut lists, order of operations and the jig you should make before the part.' },
]);

addSkills({ cat: 'craft', group: 'Home & Decorative Craft' }, [
  { id:'floristry', name:'Floristry', tier:3, req:['colour-theory','plant-id'],
    desc:'Conditioning, proportion and mechanics that hold an arrangement up for a week.' },
  { id:'interior-styling', name:'Interior Styling', tier:4, req:['colour-theory','design'],
    desc:'Light, scale and layering — a room that works rather than one that matches.' },
  { id:'macrame-basketry', name:'Basketry & Cordage Craft', tier:3, req:['knots','fine-motor'],
    desc:'Weave, coil and knot fibre into structures that hold their shape and a load.' },
  { id:'model-making', name:'Model Making', tier:4, req:['fine-motor','finishing','painting'],
    desc:'Scale, materials and paint effects that read as real at the intended distance.' },
  { id:'toy-making', name:'Making Toys & Games', tier:4, req:['woodwork-basics','game-design'],
    desc:'Design and build something safe, durable and actually fun to play with.' },
  { id:'costume', name:'Costume & Prop Making', tier:5, req:['garment-making','model-making'],
    desc:'Build something wearable and photographable that survives being worn all day.' },
]);

addSkills({ cat: 'craft', group: 'Tools & Materials' }, [
  { id:'material-selection', name:'Choosing Materials', tier:4, req:['materials-science','fabrication-planning'],
    desc:'Match strength, workability, cost and finish to what the object must survive.' },
  { id:'tool-buying', name:'Buying Tools', tier:3, req:['tool-handling','comparison-shopping'],
    desc:'Which to buy well, which to buy cheap, and which to hire for one afternoon.' },
  { id:'tool-restoration', name:'Restoring Old Tools', tier:4, req:['sharpening','repair-electronics'],
    desc:'De-rust, rehandle and tune a hundred-year-old tool into a better one than new.' },
  { id:'jigs-fixtures', name:'Making Jigs', tier:4, req:['measuring-marking','woodwork-basics'],
    desc:'Build the thing that makes the repeatable cut repeatable and safe.' },
  { id:'salvage', name:'Salvage & Reclaimed Materials', tier:4, req:['material-selection','ethical-consumption'],
    desc:'Source, assess and process second-hand material, nails and all.' },
]);

addSkills({ cat: 'craft', group: 'Getting Handy' }, [
  { id:'following-instructions', name:'Following a Plan', tier:1,
    desc:'Read the whole thing, lay out the parts, and resist starting at step four.' },
  { id:'taking-apart', name:'Taking Things Apart', tier:2, req:['tool-handling','following-instructions'],
    desc:'Photograph, label and bag as you go so it can go back together.' },
  { id:'first-project', name:'Finishing a First Project', tier:2, req:['following-instructions','tool-handling'],
    desc:'Complete something small and imperfect rather than planning something perfect.' },
  { id:'improvising-repair', name:'Improvised Repairs', tier:3, req:['taking-apart','adhesives'],
    desc:'Tape, wire, epoxy and a zip tie applied with judgement about what is temporary.' },
  { id:'craft-patience', name:'Redoing It Properly', tier:3, req:['first-project','patience-craft'],
    desc:'Undo the bit you rushed rather than building on top of it.' },
  { id:'craft-vocabulary', name:'Naming Parts & Tools', tier:2, req:['tool-handling','vocabulary'],
    desc:'Know what things are called so you can buy the right one and search for it.' },
]);

addSkills({ cat: 'craft', group: 'Craft With Others' }, [
  { id:'craft-community', name:'Joining a Maker Community', tier:3, req:['joining-a-group','workshop-safety'],
    desc:'Makerspaces, guilds and men’s sheds — tools and knowledge you cannot own alone.' },
  { id:'collaborative-build', name:'Building With Other People', tier:4, req:['fabrication-planning','collaboration'],
    desc:'Split a build, agree tolerances, and have the parts fit when they come together.' },
  { id:'craft-with-children', name:'Making Things With Children', tier:3, req:['fine-motor','play-with-children'],
    desc:'Real tools, real materials, supervised — and letting the result be theirs.' },
  { id:'gift-making', name:'Making Gifts', tier:3, req:['first-project','gift-giving'],
    desc:'Something handmade, finished on time, that the recipient actually wants.' },
  { id:'craft-documentation', name:'Documenting a Build', tier:4, req:['photo-basics','technical-writing'],
    desc:'Photos, dimensions and notes so you or someone else can make it again.' },
]);
