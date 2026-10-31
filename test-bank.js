/* Separate original test questions: topic quizzes do not reveal these answers. */
(function () {
  "use strict";
  const groups = [
    ["place-value", [
      ["What is 58,406 rounded to the nearest ten thousand?", ["50,000", "58,000", "60,000", "59,000"], 2, "The thousands digit is 8, so round the ten-thousands digit up. The answer is 60,000."],
      ["The temperature rises from -6 degrees Celsius to 8 degrees Celsius. What is the rise?", ["2 degrees", "8 degrees", "14 degrees", "16 degrees"], 2, "There are 6 degrees from -6 to zero, then 8 more to reach 8. The rise is 14 degrees."]
    ]],
    ["operations", [
      ["Calculate 18 x (14 - 9) + 7.", ["97", "259", "133", "90"], 0, "Brackets first: 14 - 9 = 5. Multiply 18 x 5 = 90, then add 7 to get 97."],
      ["Calculate 3.6 x 0.5.", ["18", "0.18", "1.8", "3.1"], 2, "Multiplying by 0.5 finds a half. Half of 3.6 is 1.8."]
    ]],
    ["factors", [
      ["What is the lowest common multiple of 9 and 12?", ["3", "18", "36", "108"], 2, "Multiples of 9 are 9, 18, 27, 36. Multiples of 12 are 12, 24, 36. The first shared positive multiple is 36."],
      ["Which number is divisible by both 3 and 5?", ["35", "42", "65", "75"], 3, "75 ends in 5, so it is divisible by 5. Its digits total 12, a multiple of 3, so it is divisible by 3 too."]
    ]],
    ["fractions", [
      ["Calculate 3/8 + 1/4.", ["1/2", "4/12", "5/8", "3/32"], 2, "Use a common denominator: convert 1/4 to 2/8. Then add the numerators: 3/8 + 2/8 = 5/8."],
      ["A ribbon is 2 1/4 metres long. Three quarters of a metre are cut off. How much remains?", ["1 metre", "1 1/2 metres", "1 3/4 metres", "2 metres"], 1, "2 1/4 = 9/4. Subtract 3/4 to get 6/4, which is 1 1/2 metres."]
    ]],
    ["decimals", [
      ["Which fraction equals 0.125?", ["1/4", "1/5", "1/8", "1/12"], 2, "0.125 = 125/1,000. Divide numerator and denominator by 125 to get 1/8."],
      ["Calculate 7.08 + 0.965.", ["7.173", "8.045", "8.135", "8.45"], 1, "Write 7.08 as 7.080 and align decimal points so equal place values add together: 7.080 + 0.965 = 8.045."]
    ]],
    ["percentages", [
      ["A £72 jacket has a 25% discount. What is its sale price?", ["£18", "£47", "£54", "£57"], 2, "25% is one quarter. A quarter of £72 is £18. Subtract the discount: £72 - £18 = £54."],
      ["18 out of 60 pupils walk to school. What percentage is this?", ["18%", "25%", "30%", "42%"], 2, "18/60 simplifies to 3/10. Multiply by 100 to get 30%."]
    ]],
    ["ratio", [
      ["Orange and apple juice are mixed in the ratio 5:3. There are 640 ml altogether. How much is apple juice?", ["128 ml", "240 ml", "320 ml", "400 ml"], 1, "There are 8 parts, each 640/8 = 80 ml. Apple juice has 3 parts: 3 x 80 = 240 ml."],
      ["Five identical exercise books cost £6.25. What do eight cost at the same price per book?", ["£8", "£9.25", "£10", "£12.50"], 2, "One book costs £6.25/5 = £1.25. Eight cost 8 x £1.25 = £10."]
    ]],
    ["algebra", [
      ["Solve 4x - 3 = 29.", ["6.5", "7", "8", "32"], 2, "Add 3 to both sides to get 4x = 32. Divide by 4, giving x = 8."],
      ["If p = 3 and q = 5, what is 2p + (q x q)?", ["17", "31", "64", "121"], 1, "q squared means 5 x 5 = 25. Also 2p = 6. Add 6 + 25 to get 31."]
    ]],
    ["sequences", [
      ["Continue the square-number pattern: 4, 9, 16, 25, ...", ["30", "32", "35", "36"], 3, "These are 2 squared, 3 squared, 4 squared and 5 squared. The next is 6 squared = 36."],
      ["The first term is 7 and each new term adds 4. What is the eighth term?", ["28", "31", "35", "39"], 2, "There are seven steps from term 1 to term 8. Calculate 7 + 7 x 4 = 35."]
    ]],
    ["units", [
      ["A rope is 3.4 m long. Cut off 85 cm. How much remains?", ["2.55 m", "2.65 m", "3.315 m", "2.45 m"], 0, "Convert 85 cm to 0.85 m. Then 3.40 - 0.85 = 2.55 m."],
      ["Four bottles each hold 750 ml. What is their total capacity in litres?", ["0.3 litres", "3 litres", "30 litres", "300 litres"], 1, "4 x 750 = 3,000 ml. Divide by 1,000 to convert to 3 litres."]
    ]],
    ["time-money", [
      ["A coach leaves at 08:55 and arrives at 11:20. How long is the journey?", ["2 hours 15 minutes", "2 hours 25 minutes", "2 hours 35 minutes", "3 hours 25 minutes"], 1, "From 08:55 to 09:00 is 5 minutes; to 11:00 is 2 hours; then 20 minutes more. Total: 2 hours 25 minutes."],
      ["You buy two sandwiches at £2.65 each and a drink at £1.40. What change do you get from £10?", ["£3.30", "£4.05", "£4.70", "£6.70"], 0, "Two sandwiches cost £5.30. Add £1.40 to get £6.70, then subtract from £10 to get £3.30."]
    ]],
    ["angles", [
      ["Three angles around a point are 80, 95 and 110 degrees. What is the remaining angle?", ["65 degrees", "75 degrees", "85 degrees", "105 degrees"], 1, "Angles around a point total 360 degrees. The three given angles total 285, leaving 75 degrees."],
      ["An isosceles triangle has two equal angles of 54 degrees. What is its third angle?", ["54 degrees", "72 degrees", "108 degrees", "126 degrees"], 1, "The equal pair totals 108 degrees. Subtract from 180 to get 72 degrees."]
    ]],
    ["shapes", [
      ["A solid has two triangular faces and three rectangular faces. What is it?", ["A cube", "A triangular prism", "A square-based pyramid", "A cone"], 1, "A triangular prism has two matching triangular ends joined by three rectangular faces."],
      ["How many sides does a regular hexagon have?", ["5", "6", "7", "8"], 1, "Hexagon means a six-sided polygon. Regular means its sides and angles are equal."]
    ]],
    ["area-volume", [
      ["A rectangular garden measures 12 m by 7 m. A 3 m by 2 m pond occupies part of it. What area is left?", ["78 square m", "84 square m", "90 square m", "72 square m"], 0, "Garden area is 12 x 7 = 84 square m. Pond area is 3 x 2 = 6 square m. Subtract to get 78."],
      ["A cuboid has volume 120 cubic cm. Its base is 8 cm by 5 cm. What is its height?", ["2 cm", "3 cm", "4 cm", "6 cm"], 1, "Base area is 8 x 5 = 40 square cm. Height = volume/base area = 120/40 = 3 cm."]
    ]],
    ["coordinates", [
      ["Reflect (-3, 4) in the x-axis.", ["(3, 4)", "(-3, -4)", "(3, -4)", "(4, -3)"], 1, "Reflection in the x-axis keeps x the same and reverses the sign of y: (-3, -4)."],
      ["Three corners of a rectangle are (1, 2), (6, 2) and (6, 5). What is the fourth corner?", ["(1, 5)", "(5, 1)", "(2, 6)", "(6, 6)"], 0, "The fourth corner shares x = 1 with the left corner and y = 5 with the top corner: (1, 5)."]
    ]],
    ["data", [
      ["Find the median of 11, 4, 7, 9, 3 and 8.", ["7", "7.5", "8", "8.5"], 1, "Order the values: 3, 4, 7, 8, 9, 11. Average the two middle values: (7 + 8)/2 = 7.5."],
      ["A pie chart represents 40 pupils. A quarter of the chart is for cycling. How many pupils cycle?", ["4", "10", "15", "20"], 1, "One quarter of 40 is 40/4 = 10 pupils; that sector would have an angle of 90 degrees."]
    ]],
    ["probability", [
      ["A bag has 2 blue, 3 red and 5 white counters. What is the probability of not picking white?", ["1/5", "3/10", "1/2", "4/5"], 2, "There are 10 counters and 5 are not white: 2 blue plus 3 red. So 5/10 = 1/2."],
      ["On a fair six-sided die, what is the probability of a number greater than 4?", ["1/6", "1/3", "1/2", "2/3"], 1, "The favourable outcomes are 5 and 6: 2 out of 6, which simplifies to 1/3."]
    ]],
    ["word-problems", [
      ["A club has 137 pupils. Each bus has 24 passenger seats. What is the smallest number of buses needed?", ["5", "6", "7", "8"], 1, "Five buses hold 120 pupils, which is insufficient. Six hold 144, so six are needed."],
      ["A shop has 9 boxes of 16 badges. It sells 58 badges. How many remain?", ["76", "84", "86", "102"], 2, "Start with 9 x 16 = 144 badges. Subtract the 58 sold: 144 - 58 = 86."]
    ]],
    ["comprehension", [
      ["Why did the volunteers move the seedlings indoors?", ["To sell them", "To protect them from frost", "To water the tables", "To make room for bicycles"], 1, "The passage explicitly says the frost warning prompted them to carry the seedlings indoors."],
      ["Which event happened before the labels were written?", ["The gate was locked.", "The seedlings were carried inside.", "The visitors arrived.", "The pots were sold."], 1, "The word 'Afterwards' places the label-writing after carrying the seedlings inside."]
    ], "On Saturday, the volunteers gathered at the community garden. A frost warning had been issued, so they carried the young seedlings into the shed. Afterwards, Priya wrote labels for the pots while Ben swept the path. They locked the gate at four o'clock."],
    ["inference", [
      ["What does Zara's first reaction most strongly suggest?", ["She is delighted.", "She is disappointed.", "She is hungry.", "She is puzzled by the weather."], 1, "Her falling smile and decision to turn the envelope face down suggest disappointment at its contents."],
      ["Which conclusion is not supported by the passage?", ["Zara reads an envelope.", "Someone offers her another opportunity.", "Her manner changes.", "She wins a competition the next day."], 3, "Nothing describes the next day or a win. Hope at another opportunity does not prove a future result."]
    ], "Zara tore open the envelope. Her smile faded as she read, and she laid it face down on the table. Dad pointed to a second notice: another music group was holding auditions next month. Zara sat up straighter and reached for her violin."],
    ["evidence", [
      ["Which quotation best supports the idea that the station is busy?", ["'glass roof'", "'queues curled around the hall'", "'empty platform'", "'beyond the doors'"], 1, "Long curling queues provide direct evidence of many people waiting in the station."],
      ["Why does the writer end with the empty platform?", ["To contrast it with the crowded hall", "To prove all trains are cancelled", "To explain the roof's construction", "To give the ticket price"], 0, "The sudden quiet contrasts with the busy hall. No cancellation or ticket price is stated."]
    ], "Under the glass roof, queues curled around the hall. Suitcases rattled and voices rose over the announcements. Beyond the doors, an empty platform stretched into the morning light, startlingly quiet."],
    ["context", [
      ["What does 'fragile' mean in this passage?", ["Easy to break", "Difficult to find", "Very expensive", "Full of water"], 0, "Handling the bowl gently and warning about damage show that it can break easily."],
      ["What does 'scrutinised' mean here?", ["Threw away", "Examined closely", "Painted quickly", "Forgot about"], 1, "The inspector leans close and checks for tiny cracks, so scrutinised means examined closely."]
    ], "The potter wrapped the fragile bowl in soft cloth, warning us to handle it gently. Before packing it, the inspector scrutinised the surface, leaning close to look for even the tiniest crack."],
    ["synonyms", [
      ["Choose the closest synonym for 'brief' in 'We had a brief meeting.'", ["Short", "Private", "Noisy", "Important"], 0, "Brief describes the short duration of the meeting, not its importance or privacy."],
      ["Choose the antonym of 'expand'.", ["Grow", "Stretch", "Shrink", "Extend"], 2, "Expand means become larger; shrink means become smaller, the opposite."]
    ]],
    ["spelling", [
      ["Choose the correctly spelt British English word.", ["travelling", "traviling", "traveleing", "travellling"], 0, "British English normally doubles the final l in travel before -ing: travelling."],
      ["Choose the correct word: 'Please put the books over ___.'", ["their", "there", "they're", "theirs"], 1, "There refers to a place. Their shows possession; they're means they are."]
    ]],
    ["word-classes", [
      ["Which word is a determiner in 'Those birds sing beautifully'?", ["Those", "birds", "sing", "beautifully"], 0, "Those introduces and identifies the noun birds, so it is a determiner."],
      ["In 'We often walk home', which word is an adverb?", ["We", "often", "walk", "homeward"], 1, "Often tells us how frequently the action happens, modifying walk. An adverb need not end in -ly."]
    ]],
    ["sentences", [
      ["Choose the correct verb: 'The owner of the two shops ___ here.'", ["work", "works", "have worked", "are working"], 1, "The subject is the singular owner, not the plural shops, so use works."],
      ["Which sentence contains a subordinate clause?", ["The bell rang.", "We packed and left.", "Although it was late, we finished the puzzle.", "The path was narrow."], 2, "'Although it was late' cannot stand alone as a complete sentence and depends on the main clause."]
    ]],
    ["tenses", [
      ["Choose the correct form: 'By the time we arrived, the show ___.'", ["had begun", "has began", "begin", "will beginning"], 0, "Had begun is past perfect, showing the start happened before our past arrival."],
      ["Which sentence is in the present progressive?", ["We played chess.", "We play chess weekly.", "We are playing chess.", "We have played chess."], 2, "Are + playing forms the present progressive, describing an action in progress now."]
    ]],
    ["punctuation", [
      ["Which phrase shows bags belonging to several boys?", ["the boy's bags", "the boys' bags", "the boys bags", "the boy bags'"], 1, "For the plural boys ending in s, place the possessive apostrophe after the s: boys' bags."],
      ["Which sentence uses a colon correctly to introduce a list?", ["For lunch:.", "We packed three things: bread, cheese and apples.", "We packed:.", "Bread: and cheese."], 1, "The complete clause 'We packed three things' introduces the list after the colon."]
    ]],
    ["devices", [
      ["Which line contains a simile?", ["'The kettle hissed'", "'Steam twisted like a ribbon'", "'The morning yawned'", "'before the dawn'"], 1, "The steam is compared to a ribbon using like. This suggests its curling shape."],
      ["What does 'The morning yawned' do?", ["Gives the morning a human action", "Reports a literal mouth in the sky", "Creates a question", "Introduces instructions"], 0, "Yawning personifies the morning and suggests a sleepy, slowly waking atmosphere."]
    ], "The kettle hissed before the dawn.\nSteam twisted like a ribbon drawn.\nThe morning yawned beyond the glass;\nI watched the last pale stars drift past."],
    ["writing", [
      ["Which opening best suits a formal letter asking for a safer pedestrian crossing?", ["Hey! Sort this out!", "I am writing to request a pedestrian crossing near our school.", "Once upon a time there was a crossing.", "Crossings are things and things are crossings."], 1, "It states a clear request in an appropriate, respectful formal tone for its audience."],
      ["What should you check first when editing a report?", ["Whether every sentence is long", "Whether the information is relevant and clearly organised", "Whether every word has six letters", "Whether each paragraph starts with 'Then'"], 1, "Meaning, relevance and organisation come before polishing spelling and punctuation."]
    ]]
  ];
  window.BRIGHTLANE_TEST_BANK = groups.flatMap(([topicId, questions, passage]) =>
    questions.map(([q, options, answer, why], i) => ({ id: topicId + "-test-" + (i + 1), topicId, q, options, answer, why, passage }))
  );
})();
