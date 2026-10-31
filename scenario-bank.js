/* Original, bundled exam-style scenarios; none are attributed to past-paper years or providers. */
window.BRIGHTLANE_SCENARIOS = [
  {
    id: "fair-badges", subject: "maths", topicId: "fractions", type: "Multi-step number",
    title: "The school fair badge stall",
    prompt: "The stall makes 30 badges. In the morning it sells two fifths of them. In the afternoon it sells one third of the badges left. Each badge costs £1.20.",
    questions: [
      { q: "How many badges are left after the afternoon sales?", options: ["6", "12", "18", "24"], answer: 1, why: "Two fifths of 30 is 12, leaving 18. One third of 18 is 6, so 18 - 6 = 12 badges remain." },
      { q: "How much money do the badge sales raise altogether?", options: ["£14.40", "£18.00", "£21.60", "£36.00"], answer: 2, why: "The stall sells 12 + 6 = 18 badges. At £1.20 each, 18 × £1.20 = £21.60." }
    ]
  },
  {
    id: "club-drinks", subject: "maths", topicId: "ratio", type: "Ratio & proportion",
    title: "Drinks for the club picnic",
    prompt: "A picnic drink is mixed using squash and water in the ratio 3:2. The group wants to make 25 litres in total.",
    questions: [
      { q: "How many litres of water are needed?", options: ["5 litres", "10 litres", "12.5 litres", "15 litres"], answer: 1, why: "There are 3 + 2 = 5 equal parts. Each part is 25 ÷ 5 = 5 litres, so 2 parts of water are 10 litres." },
      { q: "If the group instead makes 15 litres with the same recipe, how much squash is needed?", options: ["6 litres", "9 litres", "10 litres", "12 litres"], answer: 1, why: "Squash is 3 of the 5 equal parts. One part is 15 ÷ 5 = 3 litres, so the squash is 3 × 3 = 9 litres." }
    ]
  },
  {
    id: "recipe-pasta", subject: "maths", topicId: "fractions", type: "Ratio & proportion",
    title: "Scaling a pasta recipe",
    prompt: "A recipe uses 300 g of pasta for 4 people. The cook wants to feed 10 people. Pasta is sold in 500 g packets.",
    questions: [
      { q: "How much pasta is needed for 10 people?", options: ["600 g", "700 g", "750 g", "900 g"], answer: 2, why: "Ten people is 10 ÷ 4 = 2.5 times the recipe. 300 g × 2.5 = 750 g." },
      { q: "What is the smallest number of packets to buy, and how much pasta will be left?", options: ["1 packet, 250 g left", "2 packets, 250 g left", "2 packets, 750 g left", "3 packets, 750 g left"], answer: 1, why: "One 500 g packet is not enough for 750 g. Two packets give 1,000 g, leaving 1,000 - 750 = 250 g." }
    ]
  },
  {
    id: "coat-sale", subject: "maths", topicId: "percentages", type: "Money & percentages",
    title: "Buying a coat in a sale",
    prompt: "A coat costs £48 before a sale. The shop reduces its price by 25%. A customer pays with a £50 note.",
    questions: [
      { q: "What is the sale price of the coat?", options: ["£12", "£24", "£36", "£40"], answer: 2, why: "A 25% reduction is one quarter. One quarter of £48 is £12, so £48 - £12 = £36." },
      { q: "How much change should the customer receive?", options: ["£4", "£12", "£14", "£24"], answer: 2, why: "The coat costs £36 after the reduction. £50 - £36 = £14 change." }
    ]
  },
  {
    id: "museum-visit", subject: "maths", topicId: "time-money", type: "Time & money",
    title: "A morning museum visit",
    prompt: "A minibus leaves at 09:35. The journey takes 1 hour 48 minutes. A guided visit lasts 75 minutes.",
    questions: [
      { q: "At what time does the minibus arrive?", options: ["10:23", "11:13", "11:23", "11:33"], answer: 2, why: "Add 1 hour to reach 10:35, then 48 minutes: 10:35 + 48 minutes = 11:23." },
      { q: "At what time does the guided visit finish?", options: ["12:08", "12:23", "12:38", "13:08"], answer: 2, why: "75 minutes is 1 hour 15 minutes. 11:23 + 1 hour 15 minutes = 12:38." }
    ]
  },
  {
    id: "cycle-route", subject: "maths", topicId: "units", type: "Measures & units",
    title: "The cycle route detour",
    prompt: "A cycle route is 2.4 km long. A temporary closure adds a 750 m detour to the route.",
    questions: [
      { q: "What is the new route length in kilometres?", options: ["2.475 km", "2.75 km", "3.15 km", "9.9 km"], answer: 2, why: "750 m is 0.75 km. Add 2.4 + 0.75 = 3.15 km for the full detoured route." },
      { q: "What is the new route length in metres?", options: ["315 m", "2,475 m", "3,150 m", "7,500 m"], answer: 2, why: "3.15 km × 1,000 = 3,150 m. Converting both lengths first gives 2,400 m + 750 m." }
    ]
  },
  {
    id: "garden-beds", subject: "maths", topicId: "area-volume", type: "Geometry & measures",
    title: "Planning a rectangular garden",
    prompt: "A rectangular garden is 8.5 m long and 6 m wide. A straight fence is needed around its outside edge.",
    questions: [
      { q: "What is the area of the garden?", options: ["14.5 m²", "29 m²", "51 m²", "102 m²"], answer: 2, why: "Area of a rectangle is length × width: 8.5 × 6 = 51 m²." },
      { q: "How many metres of fencing are needed around the garden?", options: ["14.5 m", "29 m", "51 m", "102 m"], answer: 1, why: "Perimeter is 2 × (length + width) = 2 × (8.5 + 6) = 29 m." }
    ]
  },
  {
    id: "classroom-tiles", subject: "maths", topicId: "area-volume", type: "Geometry & measures",
    title: "Tiling a classroom floor",
    prompt: "A rectangular floor measures 4.8 m by 3.6 m. Each square tile measures 0.6 m by 0.6 m. Tiles are laid in complete rows with no gaps.",
    questions: [
      { q: "What is the floor area?", options: ["8.4 m²", "17.28 m²", "20.16 m²", "34.56 m²"], answer: 1, why: "Multiply the side lengths: 4.8 × 3.6 = 17.28 m². Square metres are the correct units for area." },
      { q: "How many tiles cover the floor?", options: ["36", "48", "50", "52"], answer: 1, why: "There are 4.8 ÷ 0.6 = 8 tiles along the length and 3.6 ÷ 0.6 = 6 along the width. 8 × 6 = 48 tiles." }
    ]
  },
  {
    id: "sail-angles", subject: "maths", topicId: "angles", type: "Geometry & measures",
    title: "Checking a triangular sail",
    prompt: "A triangular model sail has two measured interior angles of 48° and 67°. A second angle in the drawing lies on a straight line beside a 128° angle.",
    questions: [
      { q: "What is the third angle in the triangular sail?", options: ["55°", "65°", "75°", "115°"], answer: 1, why: "Angles in a triangle total 180°. 180° - 48° - 67° = 65°." },
      { q: "What is the angle beside 128° on the straight line?", options: ["42°", "52°", "62°", "232°"], answer: 1, why: "Angles on a straight line total 180°, so the missing angle is 180° - 128° = 52°." }
    ]
  },
  {
    id: "sports-timings", subject: "maths", topicId: "data", type: "Data & averages",
    title: "Comparing four race timings",
    prompt: "Four runners complete a short course in 12, 15, 9 and 16 minutes. The organiser wants to report a typical time.",
    questions: [
      { q: "What is the mean time?", options: ["12 minutes", "13 minutes", "13.5 minutes", "15 minutes"], answer: 1, why: "The total is 12 + 15 + 9 + 16 = 52 minutes. 52 ÷ 4 = 13 minutes." },
      { q: "What is the median time?", options: ["12 minutes", "13 minutes", "13.5 minutes", "15 minutes"], answer: 2, why: "In order the times are 9, 12, 15, 16. With four values, average the middle pair: (12 + 15) ÷ 2 = 13.5." }
    ]
  },
  {
    id: "lost-property-draw", subject: "maths", topicId: "probability", type: "Data & probability",
    title: "The lost-property draw",
    prompt: "A box contains 5 red, 3 blue and 2 yellow counters. A counter is drawn at random without looking.",
    questions: [
      { q: "What is the probability of drawing a counter that is not blue?", options: ["3/10", "1/2", "7/10", "7/13"], answer: 2, why: "There are 10 counters altogether and 5 + 2 = 7 are not blue. The probability is 7/10." },
      { q: "How many red counters would need to be added to make the probability of red equal to 1/2?", options: ["0", "1", "3", "5"], answer: 0, why: "There are already 5 red counters out of 10, so the probability is 5/10 = 1/2. No counters need adding." }
    ]
  },
  {
    id: "pencil-order", subject: "maths", topicId: "word-problems", type: "Multi-step number",
    title: "Ordering pencils for teams",
    prompt: "A school orders 18 boxes of pencils. Each box holds 24 pencils. The pencils are shared equally between 10 teams.",
    questions: [
      { q: "How many pencils are ordered?", options: ["42", "240", "432", "480"], answer: 2, why: "There are 18 boxes with 24 pencils in each: 18 × 24 = 432 pencils." },
      { q: "How many pencils does each team receive, and how many are left?", options: ["42 each, none left", "43 each, 2 left", "44 each, none left", "40 each, 32 left"], answer: 1, why: "432 ÷ 10 = 43 remainder 2, so each team receives 43 and 2 are left." }
    ]
  },
  {
    id: "walking-trail", subject: "maths", topicId: "fractions", type: "Fractions & proportion",
    title: "Walking a marked trail",
    prompt: "A walking trail is 27 km long. A group has completed two thirds of it before a rest stop.",
    questions: [
      { q: "How many kilometres have they walked?", options: ["9 km", "15 km", "18 km", "21 km"], answer: 2, why: "One third of 27 km is 9 km, so two thirds is 2 × 9 = 18 km." },
      { q: "How far remains to the end of the trail?", options: ["6 km", "9 km", "18 km", "24 km"], answer: 1, why: "The unwalked fraction is one third. 27 ÷ 3 = 9 km remains." }
    ]
  },
  {
    id: "map-translation", subject: "maths", topicId: "coordinates", type: "Coordinates & patterns",
    title: "Moving a marker on a map",
    prompt: "On a coordinate map, a marker begins at (2, 3). The marker is moved 4 squares right and 2 squares down. Across is the x-coordinate; up is the y-coordinate.",
    questions: [
      { q: "What are the marker's new coordinates?", options: ["(6, 1)", "(6, 5)", "(-2, 1)", "(4, 6)"], answer: 0, why: "Moving right adds 4 to x and moving down subtracts 2 from y: (2 + 4, 3 - 2) = (6, 1)." },
      { q: "A second marker at (1, 4) is also moved 4 squares right and 2 squares down. Where does it move?", options: ["(5, 2)", "(5, 6)", "(-3, 2)", "(3, 5)"], answer: 0, why: "Apply the same translation: add 4 to x and subtract 2 from y, giving (1 + 4, 4 - 2) = (5, 2)." }
    ]
  },
  {
    id: "charity-stall", subject: "maths", topicId: "ratio", type: "Ratio & proportion",
    title: "Sharing a charity-stall fund",
    prompt: "Three clubs divide a £64 donation in the ratio 3:4:1. The first club is saving for books; the second for sports equipment; the third for art supplies.",
    questions: [
      { q: "How much does the second club receive?", options: ["£8", "£24", "£32", "£36"], answer: 2, why: "There are 3 + 4 + 1 = 8 parts. £64 ÷ 8 = £8 per part, so the second club receives 4 × £8 = £32." },
      { q: "How much more does the second club receive than the third?", options: ["£8", "£16", "£24", "£32"], answer: 2, why: "The difference is 4 - 1 = 3 parts. Three parts are 3 × £8 = £24." }
    ]
  },
  {
    id: "water-tank", subject: "maths", topicId: "units", type: "Measures & units",
    title: "Filling a water container",
    prompt: "A container can hold up to 2.5 litres and currently holds 2 litres of water. A gardener uses 350 ml, then adds a further 0.6 litres from a jug.",
    questions: [
      { q: "How much water remains after the gardener uses 350 ml?", options: ["1,350 ml", "1,650 ml", "1,750 ml", "2,350 ml"], answer: 1, why: "2 litres is 2,000 ml. Subtract 350 ml: 2,000 - 350 = 1,650 ml." },
      { q: "How much water is in the container after adding 0.6 litres?", options: ["1,710 ml", "2,050 ml", "2,250 ml", "2,600 ml"], answer: 2, why: "0.6 litres is 600 ml. Add 1,650 + 600 = 2,250 ml; this is within the 2.5-litre container." }
    ]
  }
].concat([
  {
    id: "garden-gate", subject: "english", topicId: "inference", type: "Comprehension & inference",
    title: "The garden gate",
    prompt: "Nina stopped at the garden gate. A bright ribbon was tied to its latch, though the rest of the path looked grey with rain. She reached towards it, then pulled her hand back. From behind the shed came a soft scratching sound. Nina looked towards the house, where the kitchen light was still on. She took one step towards the shed and called her brother's name. The scratching stopped. For a moment she stood perfectly still. Then a small, muddy spaniel trotted out, carrying a red glove in its mouth. Nina laughed and opened the gate wider.",
    questions: [
      { q: "What does Nina's reaching towards the ribbon and then stopping suggest?", options: ["She is unsure whether to touch it", "She has already untied it", "She cannot see the gate", "She wants to leave the garden"], answer: 0, why: "She reaches towards the ribbon but pulls her hand back, showing hesitation. The passage does not explain her exact reason, so a more specific claim would be unsupported." },
      { q: "What was making the scratching sound?", options: ["Nina's brother", "A muddy spaniel", "The kitchen light", "The ribbon"], answer: 1, why: "The final part reveals a muddy spaniel trotting out from behind the shed, resolving the earlier sound." }
    ]
  },
  {
    id: "library-notice", subject: "english", topicId: "evidence", type: "Comprehension & purpose",
    title: "A note on the library door",
    prompt: "The library door carried a new notice: 'The reading room will close at 4 pm this Friday while shelves are repaired. Books can still be returned through the slot. The children's story circle will meet in the community hall at the usual time. Thank you for your patience.'",
    questions: [
      { q: "What is the main purpose of the notice?", options: ["To explain a temporary change and give practical information", "To advertise a new library", "To persuade readers to buy books", "To describe how shelves are built"], answer: 0, why: "It tells readers the room will close early, how to return books and where the story circle will meet." },
      { q: "Where will the story circle meet?", options: ["In the reading room", "At the book-return slot", "In the community hall", "At 4 pm on another day"], answer: 2, why: "The notice states that the story circle will meet in the community hall at its usual time." }
    ]
  },
  {
    id: "market-word-choice", subject: "english", topicId: "context", type: "Vocabulary in context",
    title: "Choosing a precise word",
    prompt: "At the market, a narrow stream of customers moved between the stalls. When the doors opened, the stream became a crowd, and the pavement grew busy with voices and footsteps.",
    questions: [
      { q: "In the first sentence, what does 'stream' suggest?", options: ["A line of people moving steadily", "A river flowing through the market", "A group sitting silently", "A stall selling water"], answer: 0, why: "The people are described as moving between stalls. 'Stream' is a figurative comparison for their steady flow, not a literal river." },
      { q: "Which word best describes the pavement after the doors open?", options: ["Deserted", "Crowded", "Silent", "Narrowed"], answer: 1, why: "The passage says the pavement grew busy with voices and footsteps, so 'crowded' best fits." }
    ]
  },
  {
    id: "homophone-edit", subject: "english", topicId: "spelling", type: "Spelling & editing",
    title: "Editing a club announcement",
    prompt: "A pupil drafts this announcement: 'Their meeting is on Tuesday. Please bring you're notebook and leave it on the table over their.' Read for sound-alike words and meaning.",
    questions: [
      { q: "Which word should replace 'you're' in 'bring you're notebook'?", options: ["your", "yore", "you are", "there"], answer: 0, why: "'Your' shows that the notebook belongs to the reader. 'You're' means 'you are', which does not fit before the noun notebook." },
      { q: "Which word should replace 'their' in 'over their'?", options: ["there", "they're", "theirs", "the"], answer: 0, why: "'There' can refer to a place in 'over there'. 'Their' shows belonging, 'they're' means 'they are', and 'theirs' is a possessive pronoun." }
    ]
  },
  {
    id: "team-sentence", subject: "english", topicId: "sentences", type: "Grammar & agreement",
    title: "A sentence about the team",
    prompt: "A report describes a team of helpers. The writer wants the subject to be 'The basket of clean cloths' and the sentence to use the present tense.",
    questions: [
      { q: "Which verb completes this sentence correctly: 'The basket of clean cloths ___ beside the door.'?", options: ["are", "were", "is", "have"], answer: 2, why: "The subject is the singular noun 'basket'. The plural word 'cloths' is inside a prepositional phrase and does not control the verb, so use 'is'." },
      { q: "Which sentence keeps the same subject and present tense?", options: ["The basket of clean cloths is beside the door.", "The cloths were in a basket.", "Helpers put the basket beside the door yesterday.", "The basket of clean cloths are beside the door."], answer: 0, why: "Only the first sentence keeps 'the basket' as the subject and uses the present-tense singular verb 'is'." }
    ]
  },
  {
    id: "garden-description", subject: "english", topicId: "synonyms", type: "Vocabulary & effect",
    title: "Describing a garden path",
    prompt: "A writer describes a visitor crossing a garden. The visitor is in no hurry, and the scene is peaceful rather than formal or threatening.",
    questions: [
      { q: "Which verb best fits this description?", options: ["Strolled", "Charged", "Marched", "Fled"], answer: 0, why: "'Strolled' suggests an unhurried walk, matching the calm scene. The other verbs imply haste, force or escape." },
      { q: "Which detail would best continue the peaceful mood?", options: ["The gravel crunched softly beneath each step.", "The visitor slammed the gate against the wall.", "A whistle split the air without warning.", "The visitor sprinted past the flower beds."], answer: 0, why: "Soft crunching is a quiet, measured sound that supports a peaceful mood." }
    ]
  },
  {
    id: "diary-tenses", subject: "english", topicId: "tenses", type: "Grammar & editing",
    title: "Editing a diary entry",
    prompt: "A diary entry describes a completed trip yesterday. The writer has begun: 'We set off early and walked through the woods.' The account should stay in the past tense.",
    questions: [
      { q: "Which sentence continues the past-tense account?", options: ["The path becomes muddy near the stream.", "The path became muddy near the stream.", "The path will become muddy near the stream.", "The path is becoming muddy near the stream."], answer: 1, why: "'Became' is past tense and continues the account of yesterday. The other choices shift to present or future time." },
      { q: "Which sentence correctly edits 'We seen a heron by the bridge'?", options: ["We saw a heron by the bridge.", "We seed a heron by the bridge.", "We have saw a heron by the bridge.", "We seeing a heron by the bridge."], answer: 0, why: "The simple past form of 'see' is 'saw'. The sentence describes a completed event, so 'We saw' is correct." }
    ]
  },
  {
    id: "stage-directions", subject: "english", topicId: "punctuation", type: "Punctuation & editing",
    title: "Preparing a short scene",
    prompt: "A short scene includes a character speaking. The writer wants the reader to know exactly who asks the question and where the character is going.",
    questions: [
      { q: "Which version punctuates the speech correctly?", options: ["'Are you ready?' asked Mina.", "'Are you ready'? asked Mina.", "'Are you ready,' asked Mina?", "'Are you ready?' Asked Mina."], answer: 0, why: "The question mark belongs inside the speech marks because it is part of the spoken question. 'asked' continues the same sentence and is lower case." },
      { q: "Which sentence uses an apostrophe to show one character's bag?", options: ["Mina's bag was beside the door.", "Minas bag was beside the door.", "Mina bag's was beside the door.", "Minas' bag was beside the door."], answer: 0, why: "For one person named Mina, add apostrophe-s to show possession: Mina's bag." }
    ]
  },
  {
    id: "poem-image", subject: "english", topicId: "devices", type: "Literary language",
    title: "A line from a poem",
    prompt: "A poem about a windy evening includes this line: 'The streetlamps stitched gold across the rain.' The poet wants to make the wet street seem bright and connected.",
    questions: [
      { q: "Which device is used in 'streetlamps stitched gold'?", options: ["Personification", "A factual instruction", "A list of events", "An onomatopoeia"], answer: 0, why: "Streetlamps cannot literally sew. Giving them the human action of stitching is personification." },
      { q: "What picture does the line create?", options: ["Thin bands of light appearing across the wet street", "A row of lamps being switched off", "A golden thread hidden under the road", "A dry path with no lights"], answer: 0, why: "The image of stitching suggests narrow connected lines of light reflected across the rain-wet street." }
    ]
  },
  {
    id: "newsletter-edit", subject: "english", topicId: "word-classes", type: "Grammar & editing",
    title: "Editing a newsletter sentence",
    prompt: "A school newsletter includes this draft: 'The careful volunteers worked quiet while they painted the hall.' The writer wants 'careful' to describe the volunteers and an adverb to describe how they worked.",
    questions: [
      { q: "Which word should replace 'quiet'?", options: ["quietly", "quieter", "quietness", "quite"], answer: 0, why: "'Quietly' is an adverb describing how the volunteers worked. 'Careful' remains an adjective describing the volunteers." },
      { q: "In the corrected sentence, what is 'volunteers'?", options: ["A noun", "A verb", "An adverb", "A conjunction"], answer: 0, why: "'Volunteers' names the people doing the work, so it is a noun." }
    ]
  },
  {
    id: "story-order", subject: "english", topicId: "comprehension", type: "Comprehension & inference",
    title: "The missing sketch",
    prompt: "When Elian opened his sketchbook, the page he had drawn the night before was missing. A faint blue mark crossed the next page. He checked his desk, then noticed the window was open and a paper corner caught on the ivy outside. Rather than pull at it, he fetched a stool and asked his neighbour to hold the window wider. Together they eased the page free. The corner had torn, but the drawing was still clear. Elian placed it between two clean sheets and closed the book.",
    questions: [
      { q: "Which clue helps Elian work out where the missing page is?", options: ["The blue mark on the next page", "The open window and paper caught on the ivy", "The clean sheets on the desk", "The neighbour's closed door"], answer: 1, why: "The open window and paper corner outside provide direct clues that the page has blown out and caught on the ivy." },
      { q: "Why does Elian ask his neighbour to hold the window wider?", options: ["To help retrieve the page safely", "To hide the sketch from the neighbour", "To let more rain into the room", "To close the sketchbook"], answer: 0, why: "He avoids pulling at the page and asks for help so they can ease it free without causing more damage." }
    ]
  },
  {
    id: "club-invitation", subject: "english", topicId: "writing", type: "Writing choices",
    title: "Inviting new members to a club",
    prompt: "A pupil is writing a short notice for families about a new after-school nature club. The notice should be friendly, clear and useful to someone deciding whether to attend.",
    questions: [
      { q: "Which detail is most useful to include?", options: ["The meeting day, time, place and how to join", "A long description of every plant in the garden", "A secret that only current members know", "An unrelated story about last year's sports day"], answer: 0, why: "Readers need practical information to decide whether they can attend and how to join." },
      { q: "Which opening best suits the audience and purpose?", options: ["Come and explore the school garden with us on Thursdays after lessons.", "This document shall hereby establish a botanical assembly.", "Nobody likes gardening, but you should attend.", "Once upon a time, a club appeared in a forest."], answer: 0, why: "The opening is welcoming, gives a clear activity and includes a useful time. The other options are unsuitable or unclear for a family notice." }
    ]
  },
  {
    id: "spelling-check", subject: "english", topicId: "spelling", type: "Spelling & editing",
    title: "Proofreading an invitation",
    prompt: "A pupil proofreads an invitation before sending it. The draft includes: 'We are grateful for your help. The guests will arrive early, so please be ready.'",
    questions: [
      { q: "Which is the correct spelling of the word shown in the draft?", options: ["gratefull", "grateful", "greatful", "gratefullly"], answer: 1, why: "'Grateful' begins with 'grate' (not 'great') and ends with a single l." },
      { q: "Which sentence correctly uses 'arrive' in the future?", options: ["The guests will arrive early.", "The guests will arrived early.", "The guests will arriving early.", "The guests will arrives early."], answer: 0, why: "After the modal verb 'will', use the base form 'arrive'." }
    ]
  },
  {
    id: "school-report", subject: "english", topicId: "evidence", type: "Comprehension & viewpoint",
    title: "A report about the playground",
    prompt: "A pupil's report says: 'In our survey, 28 pupils asked for more benches and 12 asked for a larger ball area. Several pupils said they would use the benches to read or talk. The survey asked one class, so it may not represent every pupil in the school.'",
    questions: [
      { q: "What limitation does the writer identify?", options: ["The survey asked only one class", "No pupils answered the survey", "The school has too many benches", "The ball area is already too large"], answer: 0, why: "The final sentence says the survey asked one class, so its results may not represent everyone in the school." },
      { q: "Which request received more votes?", options: ["More benches", "A larger ball area", "They received the same number", "The report does not say"], answer: 0, why: "Twenty-eight pupils requested benches, compared with twelve for a larger ball area." }
    ]
  },
  {
    id: "persuasive-choice", subject: "english", topicId: "writing", type: "Writing choices",
    title: "Persuading the council to add a crossing",
    prompt: "A pupil is planning a polite letter to the council asking for a safer crossing near the park. The reader needs a clear request and reasons supported by relevant information.",
    questions: [
      { q: "Which evidence would best support the request?", options: ["A count of how many children cross there at busy times", "A description of the pupil's favourite colour", "A list of unrelated books", "A claim that everyone agrees, without checking"], answer: 0, why: "A relevant count gives the council specific information about how many people may use the crossing." },
      { q: "Which plan gives the letter the clearest structure?", options: ["State the request, give evidence and reasons, suggest a practical next step, close politely", "Begin with an insult, change the subject, and stop", "Repeat the same sentence in every paragraph", "Hide the request until the final line"], answer: 0, why: "This order makes the purpose clear, supports it with relevant reasons and keeps a respectful tone for the audience." }
    ]
  },
  {
    id: "lost-dog-poster", subject: "english", topicId: "punctuation", type: "Editing & clarity",
    title: "Proofreading a lost-dog poster",
    prompt: "A neighbourhood group prepares a poster: 'LOST dog called Pippin. He has a white patch on his chest and wears a blue collar. If you see him please phone 01400 123456.' The poster should be clear and easy to scan.",
    questions: [
      { q: "Which edit best improves the final instruction?", options: ["If you see him, please phone 01400 123456.", "If, you see him please phone 01400 123456", "If you see him please, phone 01400 123456", "If you see him. please phone 01400 123456."], answer: 0, why: "A comma after the introductory clause separates it from the main instruction, and the final full stop closes the sentence." },
      { q: "Which detail would help someone identify Pippin most directly?", options: ["His white chest patch and blue collar", "The group's meeting time", "The colour of the poster paper", "How long the group has existed"], answer: 0, why: "The white patch and blue collar are distinctive visible features that can help a reader recognise the dog." }
    ]
  }
]).map(scenario => ({
  ...scenario,
  questions: scenario.questions.map((question, index) => ({ ...question, id: scenario.id + "-q" + (index + 1) }))
}));
