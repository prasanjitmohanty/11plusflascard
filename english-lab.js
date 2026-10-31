/* Original British English practice. Marks and criteria are self-check guidance, not school mark schemes. */
(function () {
  "use strict";

  const passages = [
    {
      id: "english-lab-fiction",
      title: "A Gap in the Sky",
      genre: "fiction",
      segments: [
        ["s01", 1, "At half past four, only Nia and Eli remained in the art room, finishing the sky for Friday's play."],
        ["s02", 1, "Across the long sheet of hardboard, Nia had painted a blue so even that she kept stepping back to admire it."],
        ["s03", 1, "A small notice above the sink read, \"Backdrops must be ready by five.\""],
        ["s04", 1, "Eli had offered to add clouds, but Nia preferred to keep the picture exactly as she had planned it."],
        ["s05", 2, "When she reached for a fresh brush, her sleeve caught a jar of dark green paint."],
        ["s06", 2, "A crooked river spread across the blue, swallowing the neat horizon before she could lift the board."],
        ["s07", 2, "For a moment she held the dripping jar in the air as if putting it down would make the accident real."],
        ["s08", 2, "Eli fetched a cloth without being asked."],
        ["s09", 3, "\"We'll have to start again,\" Nia said, although there was scarcely any blue left in the tin."],
        ["s10", 3, "She looked from the tin to the clock, then pressed the cloth against the board far too hard."],
        ["s11", 3, "Instead of disappearing, the stain widened into a soft-edged shape."],
        ["s12", 3, "\"What if it wasn't sky all the way across?\" Eli asked."],
        ["s13", 4, "He laid his clean brush beside hers and waited."],
        ["s14", 4, "Nia almost told him not to touch anything; the words reached her teeth and stayed there."],
        ["s15", 4, "From the window, the late sun was throwing the shadow of a chestnut branch onto the playground."],
        ["s16", 4, "In the shadow, patches of light showed between leaves."],
        ["s17", 5, "She turned the board upright and studied the green shape again."],
        ["s18", 5, "\"A tree,\" she said, and pushed the spare brush towards Eli."],
        ["s19", 5, "They worked from opposite ends, adding a trunk, small branches and gaps through which the original blue could still be seen."],
        ["s20", 5, "When Eli painted a leaf too round, Nia made the next one match it instead of correcting him."],
        ["s21", 6, "At five, the drama teacher paused in the doorway and asked whether the new tree could frame the scene where the characters met."],
        ["s22", 6, "Nia nodded, surprised to find that she no longer wanted to explain what the picture had been meant to look like."],
        ["s23", 6, "Beside the sink, Eli washed both brushes while she carried the board to the drying rack."],
        ["s24", 7, "The smooth sky she had imagined that morning was gone, but the stage now had somewhere for a story to begin."],
        ["s25", 7, "Before leaving, Nia wrote both their names on the back of the board."],
        ["s26", 7, "She placed Eli's name first, in letters large enough to be read from the doorway."]
      ],
      questions: [
        {
          id: "english-lab-fiction-q01", type: "retrieval", topicId: "comprehension", difficulty: "foundation", format: "select-one",
          q: "According to the notice, by what time must the backdrops be ready?",
          options: ["Four o'clock", "Half past four", "Five o'clock", "Half past five"], answer: 2,
          why: "The notice states that the backdrops must be ready by five. Half past four is the time at the opening, not the deadline.",
          evidenceIds: ["english-lab-fiction-s01", "english-lab-fiction-s03"]
        },
        {
          id: "english-lab-fiction-q02", type: "inference", topicId: "inference", difficulty: "stretch", format: "select-one",
          q: "Why does Eli put his clean brush beside Nia's and wait instead of beginning to paint at once?",
          options: ["He is allowing the paint to dry before either of them touches the board.", "He seems to be leaving Nia room to accept his suggestion.", "He expects Nia to repair the picture while he watches.", "He is waiting for the teacher to approve a different design."], answer: 1,
          why: "Nia has wanted to control the design, so waiting gives her a choice. She later offers him the spare brush, supporting the idea that he allows her to decide rather than taking over.",
          evidenceIds: ["english-lab-fiction-s04", "english-lab-fiction-s12", "english-lab-fiction-s13", "english-lab-fiction-s18"]
        },
        {
          id: "english-lab-fiction-q03", type: "vocabulary", topicId: "context", difficulty: "foundation", format: "select-one",
          q: "In 'there was scarcely any blue left in the tin', which phrase is closest in meaning to 'scarcely any'?",
          options: ["More than enough", "Carefully stored", "Exactly half", "Hardly any"], answer: 3,
          why: "Scarcely any means hardly any: the supply is almost used up. It does not give an exact fraction or describe how the paint is stored.",
          evidenceIds: ["english-lab-fiction-s09", "english-lab-fiction-s10"]
        },
        {
          id: "english-lab-fiction-q04", type: "language", topicId: "devices", difficulty: "challenge", format: "select-one",
          q: "What is the effect of calling the spill a 'crooked river' that is 'swallowing the neat horizon'?",
          options: ["It makes the spreading paint seem powerful and beyond Nia's control.", "It draws attention to how carefully Nia is directing the new pattern.", "It makes the blue sky seem stronger than the spreading green paint.", "It creates a peaceful impression of a pattern settling neatly into place."], answer: 0,
          why: "The moving-river comparison and the active verb 'swallowing' make the accidental spill seem to take over her careful work. The image suggests the green paint is overwhelming the blue, not being calmly directed by Nia.",
          evidenceIds: ["english-lab-fiction-s05", "english-lab-fiction-s06"]
        },
        {
          id: "english-lab-fiction-q05", type: "purpose", topicId: "evidence", difficulty: "stretch", format: "written",
          q: "Why does the writer end with Nia placing Eli's name first, rather than only describing the finished backdrop?",
          modelAnswer: "The ending shows that Nia now values Eli's contribution and wants him to receive credit. This contrasts with her earlier wish to keep the picture exactly as she planned it, so the final action reveals a change in her attitude.",
          marks: 2,
          scheme: ["1 mark: explain that writing Eli's name first gives him credit or recognises his contribution; accept equivalent wording.", "1 mark: connect that action to Nia's earlier control of the design, showing that the ending reveals a personal change rather than only a changed painting."],
          why: "The order and size of the names make the recognition deliberate. The opening establishes Nia's wish to preserve her own plan, which gives the ending its contrast.",
          evidenceIds: ["english-lab-fiction-s04", "english-lab-fiction-s25", "english-lab-fiction-s26"]
        },
        {
          id: "english-lab-fiction-q06", type: "summary", topicId: "comprehension", difficulty: "stretch", format: "written",
          q: "In no more than 50 words, summarise how the accident changes both the backdrop and the way Nia works.",
          modelAnswer: "Nia spills green paint on her carefully planned sky and lacks enough blue to start again. Eli's suggestion helps her turn the mark into a tree. Instead of protecting her plan alone, she shares the work and credits them both.",
          marks: 3,
          scheme: ["1 mark: include the accidental green spill and the shortage of blue paint; accept a concise paraphrase of both linked details.", "1 mark: explain that they turn the damaged area into a tree rather than repainting the original sky.", "1 mark: identify Nia's move towards cooperation or shared credit; accept this in any clear summary of 50 words or fewer."],
          why: "A summary needs the problem, the practical response and the change in cooperation. A list of every brush movement would obscure these main developments.",
          evidenceIds: ["english-lab-fiction-s05", "english-lab-fiction-s09", "english-lab-fiction-s18", "english-lab-fiction-s19", "english-lab-fiction-s25"]
        },
        {
          id: "english-lab-fiction-q07", type: "inference", topicId: "inference", difficulty: "challenge", format: "written",
          q: "What does Nia's response to Eli's round leaf reveal about her changing attitude? Use one earlier detail and one later detail.",
          modelAnswer: "Earlier, Nia wanted the picture to follow her own plan exactly and almost told Eli not to touch it. Later, she makes her leaf match his instead of correcting him. This suggests that she is becoming more flexible and willing to work with his ideas.",
          marks: 2,
          scheme: ["1 mark: use an earlier detail to establish Nia's wish for control, such as keeping her plan unchanged or almost stopping Eli from touching the board.", "1 mark: link matching Eli's leaf instead of correcting it to greater flexibility or acceptance of his contribution; accept a supported equivalent inference."],
          why: "The contrast between protecting her original plan and adapting her own brushwork supports a change towards cooperation. It does not prove that she now dislikes careful painting.",
          evidenceIds: ["english-lab-fiction-s04", "english-lab-fiction-s14", "english-lab-fiction-s20"]
        },
        {
          id: "english-lab-fiction-q08", type: "true-false-not-given", topicId: "evidence", difficulty: "stretch", format: "written",
          q: "Classify each statement as true, false or not given, and briefly explain why. A: The notice sets a five o'clock deadline. B: Nia has plenty of blue paint available after the spill. C: Eli attends an art club every Saturday.",
          modelAnswer: "A is true: the notice says the backdrops must be ready by five. B is false: there is scarcely any blue left. C is not given: the story describes Eli's help but says nothing about an art club or his Saturday activities.",
          marks: 3,
          scheme: ["1 mark: A = true, supported by the deadline on the notice; accept a quotation or accurate paraphrase.", "1 mark: B = false, supported by the statement that scarcely any blue remains; accept 'hardly any' or an equivalent.", "1 mark: C = not given, explaining that no Saturday club information appears; helping with a painting does not establish club attendance."],
          why: "True requires support, false requires contradiction, and not given means the necessary information is absent. Eli's ability or willingness to help cannot establish an unstated weekly activity.",
          evidenceIds: ["english-lab-fiction-s03", "english-lab-fiction-s09", "english-lab-fiction-s13", "english-lab-fiction-s19"]
        }
      ]
    },
    {
      id: "english-lab-nonfiction",
      title: "Where Does the Rain Go?",
      genre: "non-fiction",
      segments: [
        ["s01", 1, "On a wet street, raindrops striking sloping roof tiles usually travel towards a gutter and then into a drain."],
        ["s02", 1, "Roofs keep the rooms below dry, but many hard surfaces can send water into the drainage system very quickly."],
        ["s03", 1, "A planted roof, sometimes called a green roof, has a layer of growing material above a waterproof surface."],
        ["s04", 1, "Its layers must be designed for the building; plants are not simply scattered over an ordinary roof."],
        ["s05", 2, "Water on a planted roof follows more than one route."],
        ["s06", 2, "Some is caught on leaves, some is retained in the growing layer, and some passes through a drainage outlet."],
        ["s07", 2, "Roots take up some of the stored water, and plants also release water into the air as vapour."],
        ["s08", 2, "The amount held and the time it remains depend on the weather, the plants and the condition of the growing layer."],
        ["s09", 2, "This can slow water entering drains, but it does not make all the rain vanish."],
        ["s10", 3, "Consider an imaginary classroom trial with two small model trays, used here to illustrate how a comparison might be made."],
        ["s11", 3, "The trays have the same surface area, are tilted at the same angle and each have a drainage hole."],
        ["s12", 3, "One has a bare waterproof surface; the other has a three-centimetre layer of growing mixture and low plants."],
        ["s13", 3, "Starting with both trays dry, the class pours 500 millilitres of water onto each at the same rate."],
        ["s14", 3, "After five minutes, the measuring jugs contain 420 millilitres from the bare tray and 220 millilitres from the planted tray."],
        ["s15", 3, "The remaining water has not yet flowed into the jugs; these measurements alone do not show what will happen later."],
        ["s16", 4, "At first glance, the result suggests that the planted model holds back more water during those five minutes."],
        ["s17", 4, "However, one trial cannot show that the same difference will occur in every situation."],
        ["s18", 4, "Nor can a five-minute observation tell the class how much water will leave either tray over a full day."],
        ["s19", 4, "If the growing mixture is already wet, it may have less room to hold water from fresh rainfall."],
        ["s20", 4, "Repeating the comparison under different starting conditions and measuring for longer would make the investigation more informative."],
        ["s21", 5, "A planted roof may also provide shelter for small creatures, while flowering plants can offer food for visiting insects."],
        ["s22", 5, "Roof conditions may be windy and dry, so plants must be suitable for that particular place and depth of material."],
        ["s23", 5, "Not every roof is strong enough for the extra weight, especially when the growing material is full of water."],
        ["s24", 5, "Qualified people must check the structure, waterproofing, drainage and safe access before any such roof is planned."],
        ["s25", 6, "The lesson is not that planted roofs are a magic answer to every problem caused by heavy rain."],
        ["s26", 6, "They are one possible way to slow the movement of water, alongside other carefully chosen measures."],
        ["s27", 6, "A school cannot judge all the needs of a real building from a single small tray."],
        ["s28", 6, "By measuring what is observed and naming what remains uncertain, a class can ask better questions before making a large claim."]
      ],
      questions: [
        {
          id: "english-lab-nonfiction-q01", type: "retrieval", topicId: "comprehension", difficulty: "foundation", format: "select-one",
          q: "In the imaginary trial, how much water is collected from the bare tray after five minutes?",
          options: ["220 millilitres", "420 millilitres", "500 millilitres", "700 millilitres"], answer: 1,
          why: "The passage gives 420 millilitres for the bare tray and 220 for the planted tray. The 500 millilitres is the amount poured onto each, not the amount collected at five minutes.",
          evidenceIds: ["english-lab-nonfiction-s13", "english-lab-nonfiction-s14"]
        },
        {
          id: "english-lab-nonfiction-q02", type: "inference", topicId: "inference", difficulty: "stretch", format: "select-one",
          q: "Why are the trays given the same area, angle and rate of watering?",
          options: ["To ensure that both trays must produce identical results.", "To make this single trial represent every possible starting condition.", "To make the amount collected equal to the amount poured in.", "To reduce other differences that could affect the comparison."], answer: 3,
          why: "Keeping these conditions alike makes the comparison fairer. It helps the class investigate the different surfaces without changing several other factors; it neither forces a result nor represents every possible condition.",
          evidenceIds: ["english-lab-nonfiction-s11", "english-lab-nonfiction-s12", "english-lab-nonfiction-s13"]
        },
        {
          id: "english-lab-nonfiction-q03", type: "vocabulary", topicId: "context", difficulty: "foundation", format: "select-one",
          q: "What does 'retained' mean in the statement that some water is retained in the growing layer?",
          options: ["Held there for a time", "Changed permanently into soil", "Measured before it arrives", "Forced to disappear at once"], answer: 0,
          why: "Retained means kept or held. The passage later explains that water can remain for different lengths of time, so it does not mean permanent storage or disappearance.",
          evidenceIds: ["english-lab-nonfiction-s06", "english-lab-nonfiction-s08", "english-lab-nonfiction-s09"]
        },
        {
          id: "english-lab-nonfiction-q04", type: "language", topicId: "devices", difficulty: "challenge", format: "select-one",
          q: "By saying planted roofs are not a 'magic answer', which idea does the writer challenge?",
          options: ["That useful results should come from carefully planned investigations.", "That slowing rainwater can help even when it does not stop all runoff.", "That one measure can solve every heavy-rain problem without limits.", "That different conditions can change the effect of a planted roof."], answer: 2,
          why: "A magic answer would seem to solve everything effortlessly. The writer rejects that exaggerated idea while still explaining how planted roofs may help.",
          evidenceIds: ["english-lab-nonfiction-s23", "english-lab-nonfiction-s25", "english-lab-nonfiction-s26", "english-lab-nonfiction-s27"]
        },
        {
          id: "english-lab-nonfiction-q05", type: "purpose", topicId: "evidence", difficulty: "stretch", format: "written",
          q: "Why does the writer include the trial's limitations instead of reporting only the two measured amounts?",
          modelAnswer: "The limitations prevent readers from treating one short comparison as proof of what all roofs always do. They also show how further testing could improve the investigation, encouraging careful use of evidence rather than a sweeping claim.",
          marks: 2,
          scheme: ["1 mark: explain that the limitations prevent overgeneralising from one short model trial; accept 'the result does not prove what always happens'.", "1 mark: explain that the passage encourages better investigation, such as longer measurements or different starting conditions; accept another evidence-based explanation of that purpose."],
          why: "The writer moves from the observed result to what it cannot establish and how it could be checked further. This makes the explanation balanced, not a rejection of measurement.",
          evidenceIds: ["english-lab-nonfiction-s15", "english-lab-nonfiction-s17", "english-lab-nonfiction-s18", "english-lab-nonfiction-s20", "english-lab-nonfiction-s28"]
        },
        {
          id: "english-lab-nonfiction-q06", type: "summary", topicId: "comprehension", difficulty: "stretch", format: "written",
          q: "In no more than 50 words, summarise how planted roofs may affect rainwater and why they need careful planning.",
          modelAnswer: "Plants and growing material can hold some rainwater temporarily, slowing its movement towards drains. The effect varies with conditions. Because wet material adds weight and roofs differ, qualified people must check the structure and drainage rather than assuming every building is suitable.",
          marks: 3,
          scheme: ["1 mark: explain that plants or growing material hold some water and can slow its movement to drains; accept a concise equivalent.", "1 mark: recognise that the effect varies with conditions and does not remove all rainfall.", "1 mark: connect added weight or building differences to the need for qualified checks; accept a clear summary of 50 words or fewer."],
          why: "The main account combines a possible benefit with limits and practical suitability. The model-tray numbers are supporting details, not a guarantee about real buildings.",
          evidenceIds: ["english-lab-nonfiction-s06", "english-lab-nonfiction-s08", "english-lab-nonfiction-s09", "english-lab-nonfiction-s23", "english-lab-nonfiction-s24"]
        },
        {
          id: "english-lab-nonfiction-q07", type: "inference", topicId: "inference", difficulty: "challenge", format: "written",
          q: "Can the class conclude that the planted tray will always release 200 millilitres less water than the bare tray? Explain using two limitations in the passage.",
          modelAnswer: "No. Only one trial is described, so the same difference has not been shown in other conditions. The measurement covers just five minutes, and more water may drain later, changing the difference between the two amounts.",
          marks: 2,
          scheme: ["1 mark: reject the 'always' claim and explain one limitation: a single trial, a short observation period or different possible starting wetness.", "1 mark: explain a second distinct limitation from those supported by the passage; accept equivalent wording, but do not credit repeating the same limitation twice."],
          why: "The difference between 420 and 220 is 200 at the measured time only. Neither future drainage nor results in other conditions can be established from that one observation.",
          evidenceIds: ["english-lab-nonfiction-s14", "english-lab-nonfiction-s15", "english-lab-nonfiction-s17", "english-lab-nonfiction-s18", "english-lab-nonfiction-s19"]
        },
        {
          id: "english-lab-nonfiction-q08", type: "true-false-not-given", topicId: "evidence", difficulty: "stretch", format: "written",
          q: "Classify each statement as true, false or not given, explaining your decision. A: At five minutes, 500 millilitres has drained from each tray. B: The plants in the model have white flowers. C: The two trays have the same surface area.",
          modelAnswer: "A is false: the collected amounts are 420 and 220 millilitres, not 500 each. B is not given: no flower colour is supplied for the model plants. C is true: the text explicitly says that the surface areas are the same.",
          marks: 3,
          scheme: ["1 mark: A = false, using the collected amounts or distinguishing poured water from collected water.", "1 mark: B = not given, explaining that the model plants' flower colour is not stated; the general mention of flowering plants does not supply a colour.", "1 mark: C = true, supported by the stated equality of the trays' surface areas."],
          why: "The numerical result contradicts A and the setup directly supports C. B needs a specific colour that neither the model description nor the general roof information provides.",
          evidenceIds: ["english-lab-nonfiction-s11", "english-lab-nonfiction-s12", "english-lab-nonfiction-s13", "english-lab-nonfiction-s14", "english-lab-nonfiction-s21"]
        }
      ]
    },
    {
      id: "english-lab-poetry",
      title: "Night Shift at the Library",
      genre: "poetry",
      segments: [
        ["s01", 1, "At closing time the library loosens its collar,"],
        ["s02", 1, "and lets the last footsteps slip out through the door."],
        ["s03", 1, "Chairs stand with their knees tucked under the tables;"],
        ["s04", 1, "a bookmark keeps watch where a reader has paused."],
        ["s05", 1, "Beyond the glass, a bus drags a ribbon of light."],
        ["s06", 2, "The clock counts crumbs of a vanished afternoon;"],
        ["s07", 2, "rain stitches silver threads down the window."],
        ["s08", 2, "On the returns trolley, a book lies open,"],
        ["s09", 2, "its story's boat stranded halfway through a storm,"],
        ["s10", 2, "while a folded receipt waits quietly to be found."],
        ["s11", 3, "Nobody hears the shelves exchange their stories;"],
        ["s12", 3, "no atlas lifts its mountains from the page."],
        ["s13", 3, "Yet under each cover a journey is waiting,"],
        ["s14", 3, "packed small enough for two hands to carry,"],
        ["s15", 3, "and patient enough to begin whenever we are ready."],
        ["s16", 4, "Tomorrow a child will reach for the open book,"],
        ["s17", 4, "smooth its bent corner and settle beside the window."],
        ["s18", 4, "The clock will keep counting; the rain may have stopped."],
        ["s19", 4, "One page will turn, and without leaving the chair,"],
        ["s20", 4, "the child will set that stranded boat afloat."]
      ],
      questions: [
        {
          id: "english-lab-poetry-q01", type: "retrieval", topicId: "comprehension", difficulty: "foundation", format: "select-one",
          q: "Where does the poem place the open book?",
          options: ["Inside the passing bus", "Under a table", "On top of an atlas", "On the returns trolley"], answer: 3,
          why: "The second stanza explicitly places the open book on the returns trolley. The bus, tables and atlas are other images, not the book's stated position.",
          evidenceIds: ["english-lab-poetry-s08"]
        },
        {
          id: "english-lab-poetry-q02", type: "inference", topicId: "inference", difficulty: "stretch", format: "select-one",
          q: "Why is the story's boat described as 'stranded' until the child turns a page?",
          options: ["The story seems paused until someone reads on.", "The characters are waiting for the rain outside the library to stop.", "The library has finished with the book and will no longer lend it.", "The boat's journey has ended, and the child will read an unrelated story."], answer: 0,
          why: "The boat belongs to the story in the open book. Turning the page allows the reader's imagined journey to continue, so 'stranded' links a paused story with a boat unable to move.",
          evidenceIds: ["english-lab-poetry-s08", "english-lab-poetry-s09", "english-lab-poetry-s19", "english-lab-poetry-s20"]
        },
        {
          id: "english-lab-poetry-q03", type: "vocabulary", topicId: "context", difficulty: "foundation", format: "select-one",
          q: "Which meaning of 'vanished' best fits 'a vanished afternoon'?",
          options: ["Not yet begun", "Made much longer", "Gone or no longer present", "Lit by bright sunshine"], answer: 2,
          why: "At closing time, the afternoon has passed. Vanished conveys that it is gone, rather than describing its weather or suggesting that it is still to come.",
          evidenceIds: ["english-lab-poetry-s01", "english-lab-poetry-s06"]
        },
        {
          id: "english-lab-poetry-q04", type: "language", topicId: "devices", difficulty: "challenge", format: "select-one",
          q: "What effect does the opening image of the library 'loosening its collar' create?",
          options: ["It presents the library as tense and unable to settle after closing.", "It personifies the library as if it were relaxing after a busy day.", "It makes the library seem neglected once its readers have left.", "It contrasts the library's impatience with the slow movement of its clock."], answer: 1,
          why: "Loosening a collar is a human action associated with relaxing. Giving it to the library makes the quiet building seem to settle after its working day.",
          evidenceIds: ["english-lab-poetry-s01", "english-lab-poetry-s02"]
        },
        {
          id: "english-lab-poetry-q05", type: "purpose", topicId: "evidence", difficulty: "stretch", format: "written",
          q: "Why does the final stanza introduce a child reading, rather than end with the empty library at night?",
          modelAnswer: "The child shows that the quiet books are waiting to be used, not finished with. Turning the page brings the imagined journey back into motion, so the ending connects the still library with the possibilities of reading.",
          marks: 2,
          scheme: ["1 mark: explain that the child's arrival suggests the books will be read again or that the library's quietness is temporary.", "1 mark: link the turned page or floating story-boat to imagination or a story continuing; accept a supported equivalent, not a claim that a real boat is launched."],
          why: "The third stanza describes waiting journeys, and the final one gives an example of a reader beginning or continuing one. The ending therefore develops the poem's idea rather than merely changing the time.",
          evidenceIds: ["english-lab-poetry-s13", "english-lab-poetry-s15", "english-lab-poetry-s16", "english-lab-poetry-s19", "english-lab-poetry-s20"]
        },
        {
          id: "english-lab-poetry-q06", type: "summary", topicId: "comprehension", difficulty: "stretch", format: "written",
          q: "In no more than 40 words, summarise the contrast between the quiet building and the stories within it.",
          modelAnswer: "After closing, the library is quiet, but its books contain journeys ready for readers. The imagined return of a child suggests that opening and reading a book allows a paused story to continue.",
          marks: 2,
          scheme: ["1 mark: capture the library's physical quietness or stillness after closing; accept a concise paraphrase.", "1 mark: contrast this with waiting imaginative journeys that readers can activate, in a clear summary of 40 words or fewer."],
          why: "The contrast is between a still place and the experiences its books can offer. The poem does not suggest that the furniture literally travels or speaks.",
          evidenceIds: ["english-lab-poetry-s02", "english-lab-poetry-s11", "english-lab-poetry-s12", "english-lab-poetry-s13", "english-lab-poetry-s19", "english-lab-poetry-s20"]
        },
        {
          id: "english-lab-poetry-q07", type: "inference", topicId: "inference", difficulty: "challenge", format: "written",
          q: "Does the speaker promise that tomorrow will be dry? Use a word or phrase from the final stanza to explain your answer.",
          modelAnswer: "No. The phrase 'the rain may have stopped' presents dry weather as a possibility, not a certainty. The word 'may' leaves open the possibility that it is still raining.",
          marks: 2,
          scheme: ["1 mark: identify 'may' or quote 'the rain may have stopped' as the relevant wording.", "1 mark: explain that it expresses possibility rather than a promise or certainty; accept equivalent wording and do not require a separate prediction."],
          why: "A careful inference respects the degree of certainty in the words. 'May' is not the same as 'will', so the poem supplies no guaranteed forecast.",
          evidenceIds: ["english-lab-poetry-s18"]
        },
        {
          id: "english-lab-poetry-q08", type: "true-false-not-given", topicId: "evidence", difficulty: "stretch", format: "written",
          q: "Label each statement true, false or not given and give a brief reason. A: The poem imagines the child leaving the chair to launch the boat. B: The folded receipt belongs to the child. C: A book lies open on the returns trolley.",
          modelAnswer: "A is false: the child remains in the chair, and the boat belongs to the story. B is not given: the receipt's owner is never identified. C is true: the second stanza directly states where the open book lies.",
          marks: 3,
          scheme: ["1 mark: A = false, using 'without leaving the chair' or explaining that the journey is imaginative rather than a physical launch.", "1 mark: B = not given, because no owner is stated; do not treat the later mention of a child as proof of ownership.", "1 mark: C = true, supported by the line about the open book on the returns trolley."],
          why: "The poem explicitly locates the book and keeps the child in the chair. It mentions a receipt but gives no owner, so that part must remain unknown.",
          evidenceIds: ["english-lab-poetry-s08", "english-lab-poetry-s09", "english-lab-poetry-s10", "english-lab-poetry-s16", "english-lab-poetry-s19"]
        }
      ]
    },
    {
      id: "english-lab-playscript",
      title: "The Smallest Exhibit",
      genre: "playscript",
      segments: [
        ["s01", 1, "[A school hall, late afternoon: Amina and Leo are arranging objects for an exhibition called Journeys.]"],
        ["s02", 1, "[A large model ship occupies the centre of their table; a handwritten sign reads, \"One space left\".]"],
        ["s03", 2, "LEO: The model looks splendid there, but our final object needs to be something people can spot from the door."],
        ["s04", 3, "AMINA: Something can matter even if you have to come closer to see it, can't it?"],
        ["s05", 4, "[Mr Dale enters carrying a small dented tin, which he sets beside the model without opening it.]"],
        ["s06", 5, "MR DALE: I wondered whether you might have room for this, although I can see you already have plenty to arrange."],
        ["s07", 6, "LEO: Is there something inside it that makes a noise or lights up when you press a button?"],
        ["s08", 7, "MR DALE: Nothing like that; there is only a railway ticket, and it has grown rather thin at the fold."],
        ["s09", 8, "[Leo glances towards the empty space and straightens the model's flag.]"],
        ["s10", 9, "AMINA: Would you tell us where the ticket took you, and why you kept it for so long?"],
        ["s11", 10, "MR DALE: It was for my first journey to this town, when every street name sounded strange and I knew nobody here."],
        ["s12", 11, "LEO: Then it must have taken you a long time to find the station exit and carry all your bags."],
        ["s13", 12, "MR DALE: I found the exit easily enough, but outside I stood with a map upside down until a woman stopped to help."],
        ["s14", 12, "MR DALE: She walked with me to the street I needed, then pointed out the bakery so I would know where to buy breakfast."],
        ["s15", 13, "AMINA: And the ticket reminds you of her, rather than only of the train you travelled on?"],
        ["s16", 14, "MR DALE: Exactly; I cannot remember the price of that ticket, but I have never forgotten being made welcome."],
        ["s17", 15, "[Amina pulls a chair towards Mr Dale; Leo takes his hand away from the flag.]"],
        ["s18", 16, "LEO: I thought a journey exhibit had to be about how far someone travelled, or how fast the vehicle went."],
        ["s19", 17, "AMINA: What if we made the label ask visitors who helped them at the end of a journey?"],
        ["s20", 18, "LEO: We could place the tin on this small stand, with the ticket beside it where people can see the fold."],
        ["s21", 19, "MR DALE: I would rather keep it inside the tin, if that is possible, because it tears when it is lifted."],
        ["s22", 20, "LEO: Of course; we can angle the open tin towards visitors and tell them not to touch the paper."],
        ["s23", 21, "[He moves the model ship a little to one side, then checks that the stand cannot wobble.]"],
        ["s24", 22, "AMINA: We should write down your words accurately, instead of guessing the parts of the journey you haven't told us."],
        ["s25", 23, "MR DALE: You may use the bit about the upside-down map, even though it still makes me laugh at myself."],
        ["s26", 24, "LEO: I think our last space has found its story; shall we start the label with \"The price I forgot\"?"],
        ["s27", 25, "[Mr Dale opens the tin, and the two pupils bend closer rather than reaching inside.]"]
      ],
      questions: [
        {
          id: "english-lab-playscript-q01", type: "retrieval", topicId: "comprehension", difficulty: "foundation", format: "select-one",
          q: "Why does Mr Dale prefer the ticket to stay inside the tin?",
          options: ["It tears when it is lifted.", "It is too large to fit on the stand.", "Its price must remain a secret.", "He wants the visitors to hear it play music."], answer: 0,
          why: "Mr Dale directly explains that the ticket tears when lifted. Keeping it in the tin protects fragile paper; the text does not describe a hidden price or a musical object.",
          evidenceIds: ["english-lab-playscript-s08", "english-lab-playscript-s21"]
        },
        {
          id: "english-lab-playscript-q02", type: "inference", topicId: "inference", difficulty: "stretch", format: "select-one",
          q: "What is most reasonably suggested when Leo looks at the empty space and straightens the model's flag after hearing about the ticket?",
          options: ["He hopes that tidying the model will persuade Mr Dale to describe its history.", "He is already convinced that the ticket is the most suitable final exhibit.", "He is still drawn to the impressive model and seems unsure about the modest ticket.", "He is following Mr Dale's instructions about arranging the display."], answer: 2,
          why: "Leo first wants an eye-catching object and asks about lights or noise. His return to the model after hearing about the plain ticket suggests doubt, though the stage direction alone does not state his thoughts.",
          evidenceIds: ["english-lab-playscript-s03", "english-lab-playscript-s07", "english-lab-playscript-s08", "english-lab-playscript-s09"]
        },
        {
          id: "english-lab-playscript-q03", type: "vocabulary", topicId: "context", difficulty: "foundation", format: "select-one",
          q: "When Leo says the model looks 'splendid', which word is closest to his meaning?",
          options: ["Ordinary", "Impressive", "Portable", "Fragile"], answer: 1,
          why: "Leo admires the model's appearance and wants another striking object. Splendid means impressive or excellent here; it does not describe how easy the model is to carry.",
          evidenceIds: ["english-lab-playscript-s02", "english-lab-playscript-s03"]
        },
        {
          id: "english-lab-playscript-q04", type: "language", topicId: "devices", difficulty: "challenge", format: "select-one",
          q: "How does the final stage direction, with the pupils bending closer rather than reaching inside, develop the ending?",
          options: ["It shows that they care more about the tin's mechanism than its story.", "It suggests that they still think the ticket is too unimportant to handle.", "It implies that Mr Dale has withdrawn permission to show the ticket.", "It shows interest in the ticket together with care for its fragility."], answer: 3,
          why: "Bending closer shows attention, while not reaching inside respects Mr Dale's warning about tearing. The physical action combines curiosity with care without needing another explanatory speech.",
          evidenceIds: ["english-lab-playscript-s21", "english-lab-playscript-s22", "english-lab-playscript-s27"]
        },
        {
          id: "english-lab-playscript-q05", type: "purpose", topicId: "evidence", difficulty: "stretch", format: "written",
          q: "Why is 'The Smallest Exhibit' an effective title for a script that begins with a large model ship?",
          modelAnswer: "The title draws attention to a small, easily overlooked object rather than the eye-catching model. The ticket turns out to hold an important story about being welcomed, suggesting that an exhibit's value need not depend on its size or spectacle.",
          marks: 2,
          scheme: ["1 mark: identify the contrast between the small ticket or tin and the large, impressive model; accept equivalent wording.", "1 mark: connect that contrast to the personal story or the idea that importance is not determined by size, noise or appearance."],
          why: "The opening gives prominence to the model, while the later conversation reveals the ticket's meaning. The title encourages readers to notice this reversal of expectations.",
          evidenceIds: ["english-lab-playscript-s02", "english-lab-playscript-s03", "english-lab-playscript-s08", "english-lab-playscript-s16", "english-lab-playscript-s26"]
        },
        {
          id: "english-lab-playscript-q06", type: "summary", topicId: "comprehension", difficulty: "stretch", format: "written",
          q: "In no more than 50 words, summarise why the ticket belongs in the exhibition and how the pupils plan to display it.",
          modelAnswer: "The ticket recalls Mr Dale's first journey to the town and the welcome he received there. The pupils will show it inside its open tin, angled towards visitors and protected from handling. They plan a label based on his own words rather than invented details.",
          marks: 3,
          scheme: ["1 mark: connect the ticket to Mr Dale's journey and his memory of being welcomed; accept a concise paraphrase.", "1 mark: state that it will remain in the open tin and be protected from handling; accept the angled display as supporting detail.", "1 mark: include the plan for an accurate label based on Mr Dale's account, in a clear summary of 50 words or fewer."],
          why: "The decision depends on both the ticket's personal meaning and its physical fragility. Accurate labelling is part of the agreed plan; no ticket price or journey distance is supplied.",
          evidenceIds: ["english-lab-playscript-s11", "english-lab-playscript-s16", "english-lab-playscript-s21", "english-lab-playscript-s22", "english-lab-playscript-s24"]
        },
        {
          id: "english-lab-playscript-q07", type: "inference", topicId: "inference", difficulty: "challenge", format: "written",
          q: "Explain Leo's change of attitude using one earlier detail and one later action. Which part of Mr Dale's account may have helped change his mind?",
          modelAnswer: "At first Leo wants an object that people can see from the door and asks whether the tin lights up or makes a noise. Later he moves the model aside and steadies the ticket's stand. Hearing that the ticket recalls a stranger's kindness seems to help him value a human story instead of spectacle.",
          marks: 3,
          scheme: ["1 mark: support Leo's initial preference for spectacle with his wish for an eye-catching object, his question about lights or noise, or his idea about distance and speed.", "1 mark: use his later action of moving the model or checking the stand to support a more interested or considerate attitude towards the ticket.", "1 mark: link the possible change to Mr Dale's memory of help or welcome; accept a supported inference, not an invented price, fame or extraordinary journey."],
          why: "The script contrasts Leo's early priorities with his later practical care. Mr Dale explicitly values being welcomed, giving a supported reason for the change without claiming access to Leo's private thoughts.",
          evidenceIds: ["english-lab-playscript-s03", "english-lab-playscript-s07", "english-lab-playscript-s14", "english-lab-playscript-s16", "english-lab-playscript-s18", "english-lab-playscript-s23"]
        },
        {
          id: "english-lab-playscript-q08", type: "true-false-not-given", topicId: "evidence", difficulty: "stretch", format: "written",
          q: "Decide whether each statement is true, false or not given, and support your decision. A: Mr Dale remembers the ticket's price. B: A woman helped him find the street he needed. C: He has visited this exhibition every year.",
          modelAnswer: "A is false: Mr Dale says he cannot remember the price. B is true: he says that the woman walked with him to the street. C is not given: the script describes this visit but gives no history of earlier exhibitions or visits.",
          marks: 3,
          scheme: ["1 mark: A = false, using Mr Dale's direct statement that he cannot remember the price.", "1 mark: B = true, supported by the woman's walk with him to the required street.", "1 mark: C = not given, explaining that previous yearly attendance is not discussed; this visit alone cannot establish or disprove a pattern."],
          why: "The dialogue directly settles the price-memory and help statements. It gives no annual attendance history, so a reader must not turn missing information into a false claim.",
          evidenceIds: ["english-lab-playscript-s05", "english-lab-playscript-s13", "english-lab-playscript-s14", "english-lab-playscript-s16"]
        }
      ]
    }
  ].map(passage => ({
    ...passage,
    segments: passage.segments.map(([key, paragraph, text]) => ({
      id: passage.id + "-" + key, text, paragraph
    }))
  }));

  const writingPrompts = [
    {
      id: "english-writing-01", title: "The Extra Footprint", type: "Narrative",
      prompt: "Write a story in which a character notices one unexpected footprint after fresh snow. Decide what makes it puzzling and give the discovery a believable explanation, whether your story is realistic or fantastical.",
      audience: "Readers of an upper-primary adventure collection", purpose: "Build curiosity and resolve a small mystery",
      plan: ["Establish who notices the print and where they are.", "Choose one feature that makes this print different.", "Plant a clue before the character follows it.", "Let a decision or mistake complicate the search.", "Resolve the mystery using something already introduced."],
      criteria: ["The unusual print matters to the story, not just its opening.", "The reader can follow the order and location of events.", "Clues prepare the explanation without revealing it too early.", "Actions and selected details show the character's feelings.", "The ending resolves the central puzzle without an unexplained rescue."]
    },
    {
      id: "english-writing-02", title: "The Market at Its Busiest", type: "Descriptive",
      prompt: "Describe a crowded market during its busiest hour. Keep one observer's viewpoint and move the reader through two or three connected areas, selecting details that create a lively atmosphere rather than listing everything for sale.",
      audience: "Readers of a descriptive anthology", purpose: "Create a coherent sense of movement and place",
      plan: ["Choose where the observer stands at the start.", "Select a few sounds, movements and smells that fit the market.", "Decide how the viewpoint moves between stalls.", "Contrast a crowded area with one smaller, quieter detail.", "End on an image that captures the market's energy."],
      criteria: ["The setting is busy during the scene, not waiting to open.", "Details belong to a consistent viewpoint.", "Precise nouns and verbs do more work than repeated adjectives.", "Sensory impressions combine naturally rather than forming a checklist.", "Paragraph changes guide the reader through the space."]
    },
    {
      id: "english-writing-03", title: "Repair Before Replacing", type: "Persuasive article",
      prompt: "Write an article arguing that people should consider repairing suitable possessions before replacing them. Explain benefits, acknowledge that some items cannot safely or sensibly be repaired, and propose a practical first step. Use everyday examples rather than invented statistics.",
      audience: "Families reading a community newsletter", purpose: "Persuade readers to consider a careful, practical habit",
      plan: ["State the habit you want readers to consider.", "Develop two different reasons, such as reducing waste and keeping useful possessions.", "Use a specific everyday example to explain each reason.", "Acknowledge safety, cost or lack of repair skills as a limitation.", "Suggest asking a qualified repairer about a suitable item."],
      criteria: ["The viewpoint is clear without claiming every item can be repaired.", "Reasons are explained rather than repeated in different words.", "Examples are presented honestly, not as invented research.", "The response to a counterargument remains respectful.", "The conclusion gives a feasible next step rather than an absolute promise."]
    },
    {
      id: "english-writing-04", title: "A Place on the Radio", type: "Formal letter",
      prompt: "Write to a fictional community radio producer requesting a short slot for a class recording about local history. Practice facts: six pupils and their teacher would attend; the prepared recording lasts four minutes; the class can visit on a Tuesday or Thursday afternoon. Ask about permission and suitable times without assuming the request will be accepted.",
      audience: "A community radio producer", purpose: "Make a clear and courteous request",
      plan: ["Use a suitable greeting and introduce the class's purpose.", "Explain what the recording would offer listeners.", "Include the supplied length and attendance details.", "Offer the two possible afternoons and ask about arrangements.", "Close politely, using fictional names and no real contact details."],
      criteria: ["The request is easy to identify in the opening.", "The supplied facts are accurate and no booking is invented.", "The tone is polite rather than demanding.", "Paragraphs separate purpose, practical information and the request for a reply.", "The greeting, punctuation and closing suit a formal letter."]
    },
    {
      id: "english-writing-05", title: "A Night Beside the Light", type: "Diary entry",
      prompt: "Imagine staying overnight in a lighthouse visitor room with a supervised school group. Write a diary entry after the evening has grown quiet. Reflect on an unfamiliar sound, a small interaction and something you are looking forward to tomorrow; you do not need a dangerous adventure.",
      audience: "The fictional writer's future self", purpose: "Capture a personal response to an unfamiliar experience",
      plan: ["Choose a voice and a time for the entry.", "Select one evening moment rather than recounting every activity.", "Connect a sound or sight to a specific feeling.", "Include an interaction that reveals something about the writer.", "End with a question, hope or small intention for tomorrow."],
      criteria: ["The voice sounds personal rather than like a formal report.", "Reflection explains why a moment mattered.", "The diary uses consistent first person and controlled tense changes.", "Sensory details support the writer's thoughts.", "The ending looks ahead without abruptly introducing a new adventure."]
    },
    {
      id: "english-writing-06", title: "The Repair Cafe Trial", type: "Report",
      prompt: "Write a report for the library manager using only these fictional practice facts. A repair cafe ran on Saturday from 10 am to noon with six volunteers. Twenty-four visitors brought 30 items: 18 were repaired, eight were referred to specialist repairers and four were judged unsafe to repair at the event. Of 20 visitors who gave feedback, 16 wanted another event and four were unsure; four visitors gave no feedback. Costs were not recorded. Summarise the results, explain a limitation and recommend one next step.",
      audience: "The library manager", purpose: "Report supplied findings and make a qualified recommendation",
      plan: ["Give the event's purpose, time and scale in a short introduction.", "Group the item outcomes separately from visitor feedback.", "Use accurate totals and make a useful comparison.", "Explain what the missing cost or feedback information limits.", "Recommend a next step linked to a reported finding."],
      criteria: ["All factual claims come from the supplied practice facts.", "Item totals and visitor totals are not confused.", "Eighteen, eight and four account for all 30 items.", "The report does not call the event profitable when no costs were recorded.", "A recommendation is clearly a proposal, not an outcome that already happened."]
    },
    {
      id: "english-writing-07", title: "Welcome Means More Than Hello", type: "Speech",
      prompt: "Write a short speech inviting pupils to help visiting children feel included during a school activity day. Offer two specific actions, explain why they help, and avoid assuming that every newcomer feels or behaves in the same way.",
      audience: "Pupils preparing for an activity day", purpose: "Encourage thoughtful, inclusive action",
      plan: ["Open with a familiar situation the audience can imagine.", "Explain the difference between greeting someone and including them.", "Develop two actions, such as explaining a game or offering a choice.", "Acknowledge that a visitor may prefer time to settle.", "End with a short invitation that the audience can remember."],
      criteria: ["The speech addresses listeners directly without talking down to them.", "Suggestions are practical and respect individual preferences.", "An example explains the effect of an action.", "Sentence rhythm works when the speech is read aloud.", "The ending reinforces inclusion rather than demanding identical behaviour."]
    },
    {
      id: "english-writing-08", title: "When the Familiar Sound Stopped", type: "Narrative",
      prompt: "Write a story in which a familiar sound suddenly stops. Show why the silence matters to one character and let the character investigate or respond. The ending should explain the silence or deliberately leave one well-prepared question unanswered.",
      audience: "Readers who enjoy a short mystery", purpose: "Use a change in sound to build and resolve tension",
      plan: ["Establish the sound as part of the character's ordinary surroundings.", "Choose the precise moment when its absence is noticed.", "Show a physical reaction before explaining every thought.", "Build the response through two connected actions.", "Resolve the cause or choose one purposeful final uncertainty."],
      criteria: ["The reader understands why this particular silence is unusual.", "Suspense develops through evidence rather than repeated claims that things are scary.", "Events follow a clear cause-and-effect sequence.", "Short and longer sentences control pace.", "The ending connects to the established sound and situation."]
    },
    {
      id: "english-writing-09", title: "Rain Across the Allotments", type: "Descriptive",
      prompt: "Describe an allotment as a summer shower moves across it. Keep the observer in a sheltered place and show a change in light, sound and movement before and after the heaviest rain. Concentrate on atmosphere rather than a rescue story.",
      audience: "Readers of nature writing for young people", purpose: "Describe a setting through a clear change in weather",
      plan: ["Choose a sheltered viewpoint with a few visible landmarks.", "Notice the first signs of the approaching shower.", "Select sounds and movements for the rain's strongest moment.", "Use one clear comparison whose details genuinely fit.", "End with the changed appearance of one earlier detail."],
      criteria: ["The viewpoint remains consistent throughout the description.", "The weather changes in a clear order.", "Comparisons clarify the scene instead of mixing unrelated images.", "Verbs convey the movement of rain and plants.", "The ending develops an opening detail rather than adding an unrelated event."]
    },
    {
      id: "english-writing-10", title: "Look Out of the Window", type: "Persuasive article",
      prompt: "Write an article proposing that a class tries a short screen-free part of its next coach journey. Explain what pupils could do instead, acknowledge reasonable needs or preferences, and present it as a limited trial rather than a rule for every journey.",
      audience: "Pupils and staff planning a class visit", purpose: "Argue for a manageable trial while considering alternatives",
      plan: ["Define how long the proposed trial would last.", "Explain two possible benefits using realistic examples.", "Suggest activities that do not distract the driver.", "Consider a fair objection or an access need.", "Propose asking pupils for feedback afterwards."],
      criteria: ["The proposal remains a limited trial, not an unsupported universal rule.", "Examples show what participants could actually do.", "Counterarguments are answered without mocking other preferences.", "No invented statistic is presented as evidence.", "The conclusion explains how the trial could be reviewed."]
    },
    {
      id: "english-writing-11", title: "The Incomplete Book Parcel", type: "Formal letter",
      prompt: "Write to a fictional bookseller about a damaged delivery. Practice facts: order BK204 contained four books; it arrived on Tuesday; one book, River Paths, has a torn cover and its final ten pages are missing; the other three books are undamaged. Request a replacement for the affected book and ask how to return it. Do not invent a promise the shop has made.",
      audience: "A bookseller's customer-service team", purpose: "Explain a problem accurately and request a reasonable remedy",
      plan: ["Choose a formal greeting for a team whose names you do not know.", "Identify the order and the affected title.", "Describe both defects briefly and precisely.", "State the requested remedy and ask about the return process.", "Close courteously without including real personal details."],
      criteria: ["The letter makes clear that only one of four books is damaged.", "The title, order reference and defects match the supplied facts.", "The tone is firm but polite.", "The request does not assume an unconfirmed refund or replacement.", "Paragraphs, sentence punctuation and the closing are controlled."]
    },
    {
      id: "english-writing-12", title: "The Job Nobody Noticed", type: "Diary entry",
      prompt: "Invent a pupil who quietly completes a useful task that nobody seems to notice. Write that pupil's diary entry later the same day. Explore mixed feelings about the effort and the lack of recognition without needing to turn the event into a disagreement.",
      audience: "The fictional diarist's future self", purpose: "Reflect honestly on effort and recognition",
      plan: ["Choose a small, specific task and why the writer undertook it.", "Recall one moment that captures the effort involved.", "Explore more than one feeling about the response.", "Distinguish what the writer knows from what they assume others thought.", "End with a believable intention or unresolved feeling."],
      criteria: ["The task is clear enough for the reflection to make sense.", "Thoughts go beyond saying the writer was simply happy or sad.", "The diary does not claim to know other people's unspoken motives.", "First-person voice and tense remain consistent.", "The ending grows from the experience rather than supplying a sudden reward."]
    },
    {
      id: "english-writing-13", title: "Comparing Paper Towels", type: "Report",
      prompt: "Report these fictional investigation results to a science club. Three dry paper-towel squares, each 10 cm by 10 cm, were tested with the same dropper. Water was added until the first drip fell through. Sample A held 14 ml, sample B held 18 ml and sample C held 10 ml. Only one square of each kind was tested, and prices were not recorded. Explain the observed comparison, a limitation and a useful next test; do not claim that a brand is always best or cheapest.",
      audience: "Members of a school science club", purpose: "Present a controlled comparison without overstating the evidence",
      plan: ["Introduce the question and describe the equal-sized dry samples.", "Explain what was kept the same and what was measured.", "Report the three results accurately, using a clear comparison.", "Identify the problem with testing only one square of each kind.", "Recommend repeating the test before making a wider claim."],
      criteria: ["The report preserves the 14 ml, 18 ml and 10 ml observations.", "The measured property is water held before dripping, not every aspect of towel quality.", "The single-trial limitation is explained.", "No claim about value for money is made without price information.", "The suggested next test follows from the limitation."]
    },
    {
      id: "english-writing-14", title: "Give One Difficult Skill a Chance", type: "Speech",
      prompt: "Prepare a speech encouraging pupils to practise one skill they currently find difficult. Use a realistic example, suggest a small first step and acknowledge that improvement may take time. Do not promise that effort guarantees a prize, a score or selection.",
      audience: "A year-group assembly", purpose: "Encourage manageable practice without unrealistic promises",
      plan: ["Begin with a moment of difficulty that listeners can recognise.", "Explain what a small, repeatable practice step could look like.", "Show how asking for help or feedback can be useful.", "Acknowledge setbacks and different rates of progress.", "Finish with a specific invitation for the coming week."],
      criteria: ["The example is believable and relevant to the listeners.", "The proposed action is small enough to try.", "Encouragement does not become a guarantee of success.", "Language and rhythm sound natural aloud.", "The conclusion leaves listeners with a clear next step."]
    },
    {
      id: "english-writing-15", title: "A Small Promise", type: "Narrative",
      prompt: "Write a story in which keeping a small promise becomes unexpectedly difficult. Make the promise clear early on, give the character a meaningful choice and show a consequence of that choice.",
      audience: "Readers of realistic stories for young people", purpose: "Develop character through a choice and its consequences",
      plan: ["Decide who makes the promise and why it matters.", "Introduce an obstacle that grows naturally from the setting.", "Give the character two believable ways to respond.", "Show the chosen action rather than explaining the moral in advance.", "End with a consequence connected to the promise."],
      criteria: ["The promise is specific rather than a vague plan to be good.", "The obstacle is prepared and believable.", "The character's choice affects the outcome.", "Dialogue, action and thought are balanced.", "The ending earns its effect through events rather than an added moral lecture."]
    },
    {
      id: "english-writing-16", title: "Through the Train Window", type: "Descriptive",
      prompt: "Describe a changing landscape seen from a moving train. Keep the observer inside the carriage, choose a mood and move from a nearby detail to a more distant view. You may include reflections in the glass, but keep the description easy to follow.",
      audience: "Readers of a travel-writing anthology", purpose: "Control viewpoint and movement in description",
      plan: ["Choose the time of day and the observer's mood.", "Select one detail close to the window and one beyond it.", "Decide how the landscape changes as the train moves.", "Use sentence length to vary the sense of pace.", "Return to a detail that links the outer scene and the carriage."],
      criteria: ["Details are visible or audible from the chosen viewpoint.", "The movement of the train shapes the order of the description.", "Imagery fits the objects actually described.", "Sentence openings vary without losing grammatical control.", "The piece remains descriptive rather than turning into a full journey plot."]
    },
    {
      id: "english-writing-17", title: "Make Room for Quiet Hobbies", type: "Persuasive article",
      prompt: "Write an article arguing that a school hobbies fair should celebrate quiet activities as well as loud or competitive ones. Choose examples, explain how a fair could include different preferences and address the concern that quiet displays might be overlooked.",
      audience: "A school magazine's pupils and staff", purpose: "Present an inclusive, reasoned proposal",
      plan: ["Explain the fair you are proposing rather than criticising existing pupils.", "Choose two quiet hobbies and show what visitors could try.", "Explain why offering a range of activities matters.", "Answer the concern about attracting attention respectfully.", "Conclude with one practical design suggestion for the fair."],
      criteria: ["The viewpoint includes different interests without declaring one kind superior.", "Each reason develops a distinct point.", "Examples show how a quiet activity could engage a visitor.", "Suggestions are practical and not presented as researched facts.", "Paragraphs lead towards a clear, proportionate conclusion."]
    },
    {
      id: "english-writing-18", title: "Permission to Ask About the Past", type: "Formal letter",
      prompt: "Write to a fictional museum volunteer asking for a local-history interview. Practice facts: a group of six pupils would attend with a teacher; they hope for a 30-minute conversation; their questions concern how the high street has changed; any recording would be used only in the classroom and only with permission. Ask about availability and consent rather than claiming either has been agreed.",
      audience: "A museum volunteer", purpose: "Request an interview with clear, respectful arrangements",
      plan: ["Introduce the group and the enquiry.", "Explain the topic and why the volunteer's experience may help.", "State the proposed group size and length.", "Ask separately about a suitable time and permission to record.", "Thank the recipient and use an appropriate formal closing."],
      criteria: ["The letter states a request, not a confirmed appointment.", "All practical details agree with the supplied facts.", "The recipient is free to decline recording or suggest another arrangement.", "The language is courteous and concise.", "The organisation makes the two requests easy to answer."]
    },
    {
      id: "english-writing-19", title: "After Finishing Last", type: "Diary entry",
      prompt: "Imagine that your fictional team has finished last in a friendly challenge. Write a diary entry that evening about one difficult moment, one worthwhile moment and what you hope to remember. Avoid blaming a named real person or turning the result into an instant victory.",
      audience: "The fictional writer's future self", purpose: "Explore a mixed response to disappointment",
      plan: ["Choose the kind of challenge and one important moment.", "Describe the immediate reaction using a concrete detail.", "Recall something worthwhile without pretending the disappointment vanished.", "Reflect on the writer's own actions as well as the result.", "End with a modest hope or question for next time."],
      criteria: ["The account keeps the stated last-place result.", "Feelings are explored rather than reduced to a simple lesson.", "A worthwhile moment is supported by a specific event.", "The voice is reflective and personal.", "The ending is believable and does not invent an effortless future success."]
    },
    {
      id: "english-writing-20", title: "Choosing a New Lunchtime Club", type: "Report",
      prompt: "Write a report for a school council using these fictional survey facts. Forty of the 60 Year 5 pupils responded, choosing one preferred new club each: chess 14, craft 11, coding nine and choir six. Twenty pupils did not respond. No questions were asked about staffing, costs or preferences in other year groups. Summarise the results and recommend what the council should check before deciding.",
      audience: "The school council", purpose: "Summarise preferences and explain the limits of a survey",
      plan: ["Identify who was asked and how many replied.", "Present the four counts without changing the categories.", "Explain which option has most votes without calling it a majority.", "Discuss non-response or the missing practical information.", "Recommend a further check before a final club choice."],
      criteria: ["The four preference counts total 40, not 60.", "The report distinguishes all Year 5 pupils from those who responded.", "Fourteen votes is the largest group but not more than half of 40.", "No preferences are invented for non-respondents or other year groups.", "The recommendation is linked to a limitation rather than presented as a proven best choice."]
    },
    {
      id: "english-writing-21", title: "Swap a Skill", type: "Speech",
      prompt: "Write a speech inviting pupils to a proposed 'Swap a Skill' afternoon, where volunteers teach a simple skill they know and try one taught by someone else. Give examples that are safe and manageable, explain that volunteering is optional and suggest how beginners could be welcomed.",
      audience: "Pupils considering an optional activity afternoon", purpose: "Invite participation and explain a fair, practical idea",
      plan: ["Introduce the idea in a sentence listeners can remember.", "Offer two possible skills rather than a long list.", "Explain how short beginner-friendly demonstrations could work.", "Acknowledge that not everyone wants to teach in front of a group.", "End with a clear, optional way to express interest."],
      criteria: ["The invitation does not pressure every pupil to volunteer.", "Examples are appropriate for a supervised school activity.", "The speech explains both teaching and trying a skill.", "Direct address and repetition support meaning rather than filling space.", "Listeners can understand what the proposed next step would be."]
    },
    {
      id: "english-writing-22", title: "An Unexpected Guide", type: "Narrative",
      prompt: "Write a story in which an unlikely guide helps a character find something important. The guide might be a person, an animal or an overlooked sign. Establish why the guidance makes sense within your story rather than allowing a sudden unexplained solution.",
      audience: "Readers of an imaginative story collection", purpose: "Build a satisfying discovery through planted clues",
      plan: ["Decide what the character seeks and why it matters.", "Introduce the unlikely guide before the final discovery.", "Give the character a reason to overlook the guidance at first.", "Use a clue or event to make the character reconsider the route.", "Resolve the search in a way that uses the earlier details."],
      criteria: ["The object of the search remains clear.", "The guide's role is prepared rather than added at the last moment.", "The character takes actions that help lead to the discovery.", "Descriptions and dialogue advance the story.", "The ending connects the discovery with its importance to the character."]
    }
  ];
  const modelParagraphs = [
    {
      id: "english-model-01", type: "Narrative",
      weaker: "It was raining. I went to the shed. It was dark inside. I heard a scratching noise. I was scared. I opened the door and looked in.",
      improved: "Rain tapped against the shed roof as I reached for the latch. From inside came a faint scratching, followed by silence. My hand stopped. I could see nothing through the dusty window, but the sound came again, close to the floor. Slowly, I lifted the latch and eased the door open.",
      annotations: ["Content: the same rain, shed and unexplained sound remain, but selected details make the moment easier to imagine.", "Organisation: the opening establishes the setting before the sound interrupts the action.", "Vocabulary: 'tapped', 'scratching' and 'eased' are precise everyday words, not unnecessarily difficult substitutes.", "Sentences: 'My hand stopped' creates a pause between longer observations and shows fear through action.", "Punctuation: commas separate the introductory adverb and linked details, while full stops control the suspense."]
    },
    {
      id: "english-model-02", type: "Narrative",
      weaker: "Milo dropped the key. It went under the bench. He wanted to get it. He got a ruler. He pulled it out. His sister was waiting.",
      improved: "The key slid beneath the bench and stopped just beyond Milo's fingertips. His sister waited by the door, her coat already fastened. Rather than reach blindly, he laid a ruler flat on the floor and drew the key towards him a little at a time. \"Nearly there,\" he said. When the metal finally touched his hand, his sister let out the breath she had been holding.",
      annotations: ["Content: the key, bench, ruler and waiting sister are retained; the revision develops the existing problem rather than replacing the plot.", "Organisation: each action follows from the previous obstacle, making the solution easy to follow.", "Vocabulary: 'slid', 'beyond' and 'drew' show movement and position more exactly than repeated 'got'.", "Sentences: the opening varies the subject, and the final dependent clause connects success with the sister's reaction.", "Punctuation: the comma in the spoken statement sits inside the quotation marks before the lower-case reporting clause."]
    },
    {
      id: "english-model-03", type: "Descriptive",
      weaker: "The station was busy. There were people and bags. There was a coffee stall. There was a clock. It was noisy and everyone was moving.",
      improved: "Beside the coffee stall, a queue curled around a pile of bulging bags. Steam clouded the glass counter, then cleared as the server reached for another cup. Beyond the queue, travellers crossed the hall in hurried streams. Above them, the station clock remained perfectly still except for the small, patient movement of its hands.",
      annotations: ["Content: the revision keeps the station, people, bags, stall and clock, selecting details instead of adding unrelated objects.", "Organisation: the viewpoint moves from the nearby stall to the hall and then upwards to the clock.", "Vocabulary: 'curled', 'clouded' and 'streams' create clear movement without relying on repeated 'busy' or 'noisy'.", "Sentences: prepositional openings such as 'Beside' and 'Beyond' guide the reader through the scene.", "Punctuation: commas mark the introductory place phrases; complete sentences prevent the description from becoming a list."]
    },
    {
      id: "english-model-04", type: "Descriptive",
      weaker: "The garden was cold. The grass was white. The pond had ice on it. A leaf fell. It was very quiet. The sun came out.",
      improved: "A white crust covered the lawn, and the pond held a thin sheet of ice. When a leaf slipped from the apple tree, it landed with a small, dry tick. Nothing else moved. Then sunlight reached the fence and caught the frosted tips of the grass, turning the nearest patch from dull white to a brief glitter.",
      annotations: ["Content: cold, frost, ice, a falling leaf and sunlight remain the focus; the revision does not invent an unrelated event.", "Organisation: the still scene is established before the leaf falls and the light changes.", "Vocabulary: the 'dry tick' gives the quiet scene one small sound, while 'frosted' is more exact than simply 'white'.", "Sentences: the short middle sentence emphasises stillness between two longer descriptions.", "Punctuation: a comma joins the opening main clauses with 'and'; the subordinate clause beginning 'When' is separated clearly."]
    },
    {
      id: "english-model-05", type: "Persuasive article",
      weaker: "We need a book-swap table. It would be really good. Everyone wants more books and everyone would use it. It is the best idea. We should do it now.",
      improved: "A small book-swap table could help pupils try a different kind of story without buying another book. For example, a reader who usually chooses mysteries might discover a funny adventure. Some pupils may have no books they are allowed to give away, so taking part should not depend on bringing one. We could begin with donated copies and review the idea after a fortnight.",
      annotations: ["Content: the revision explains a possible benefit and recognises an access problem instead of claiming that everyone agrees.", "Organisation: a reason leads to an example, a fair limitation and a practical trial.", "Vocabulary: 'could' and 'may' keep suggestions proportionate; the paragraph does not invent survey evidence.", "Sentences: a longer conditional idea explains how to include pupils who cannot donate a book.", "Punctuation: the comma after 'For example' introduces support, and full stops separate the argument's stages."]
    },
    {
      id: "english-model-06", type: "Formal letter",
      weaker: "Hi, my order BK204 had four books and came on Tuesday. River Paths has a torn cover and the last ten pages are missing. The others are fine. Send a good one! Tell me how to send this back.",
      improved: "Dear Customer Service Team,\n\nI am writing about order BK204, which arrived on Tuesday. Of the four books delivered, River Paths has a torn cover and its final ten pages are missing; the other three books are undamaged. Please could you arrange a replacement for the affected book and explain how I should return it?\n\nYours faithfully,\nA. Patel",
      annotations: ["Content: the order reference, date description, quantity and defects are preserved accurately rather than exaggerated.", "Organisation: the letter identifies the order, describes the problem and then states the requested remedy.", "Vocabulary: 'affected book' makes clear that the request concerns only one title; polite language replaces the command.", "Sentences: the relative clause links the order to its arrival, while the final question combines two related requests.", "Punctuation: the semicolon links contrasting complete clauses, and the question mark belongs to the courteous request."]
    }
  ];

  const languageBanks = [
    {
      id: "english-language-01", label: "Calm water and an unhurried mood",
      words: ["still", "tranquil", "drifting", "unhurried"],
      openers: ["Beyond the reeds, the still water reflected a single cloud.", "As the wind dropped, the bay became tranquil again.", "Drifting towards the shore, the empty rowing boat barely disturbed the surface.", "The walker followed the lakeside path at an unhurried pace."]
    },
    {
      id: "english-language-02", label: "Quiet unease and concealed spaces",
      words: ["hushed", "uneasy", "wavering", "concealed"],
      openers: ["Inside the corridor, a hushed conversation stopped as we approached.", "Although the room looked ordinary, I felt uneasy about the open drawer.", "Wavering in the draught, the candle flame briefly revealed the keyhole.", "Behind a loose panel lay a concealed compartment."]
    },
    {
      id: "english-language-03", label: "Celebration and renewed confidence",
      words: ["jubilant", "radiant", "buoyant", "resounding"],
      openers: ["Across the finish line came the jubilant final runner.", "When the result was announced, her face wore a radiant smile.", "With his confidence restored, he returned to the group in a buoyant mood.", "A resounding cheer rose from the spectators beside the track."]
    },
    {
      id: "english-language-04", label: "A stormy setting",
      words: ["gusting", "turbulent", "sodden", "relentless"],
      openers: ["Beyond the harbour wall, gusting winds drove spray across the empty path.", "As the current met the rocks, the water became turbulent.", "Sodden leaves clung to the steps beneath the sheltered doorway.", "All afternoon, relentless rain drummed against the roof."]
    },
    {
      id: "english-language-05", label: "A cold, quiet landscape",
      words: ["crisp", "frosted", "brittle", "pale"],
      openers: ["At dawn, the crisp air stung my cheeks.", "Before the sun reached the gate, its frosted bars glittered white.", "Brittle leaves cracked beneath the gardener's boots.", "Through the bare branches came a pale band of winter light."]
    },
    {
      id: "english-language-06", label: "A busy public place",
      words: ["bustling", "clamorous", "jostling", "hurried"],
      openers: ["Around the bustling square, stallholders greeted their first customers.", "While the band tuned its instruments, the crowd grew clamorous with shouted requests.", "Jostling at the narrow entrance, the visitors waited for the doors to open fully.", "A hurried clerk crossed the hall with a bundle of papers under one arm."]
    }
  ];

  const dialogueGuide = [
    {
      rule: "Enclose spoken words in quotation marks, including the end punctuation of a complete spoken sentence.",
      example: "\"The bus is here.\"",
      why: "The full stop ends the words being spoken, so it comes before the closing quotation mark."
    },
    {
      rule: "Use a comma inside the quotation marks before a following reporting clause for a spoken statement.",
      example: "\"I found the key,\" whispered Mina.",
      why: "The reporting clause tells us who speaks and continues the same sentence. Its verb begins with a lower-case letter, and the sentence ends after the speaker's name."
    },
    {
      rule: "A reporting clause can come first, followed by a comma and the spoken sentence.",
      example: "Noor said, \"Pack a coat.\"",
      why: "The comma separates the introduction from the direct speech. The spoken sentence starts with a capital letter and has its full stop inside the quotation marks."
    },
    {
      rule: "Begin a new paragraph when a different person starts speaking.",
      example: "\"Shall I carry the map?\" asked Arun.\n\n\"Please do,\" replied Beth.",
      why: "Separate paragraphs help readers follow a change of speaker even when the exchange is short."
    },
    {
      rule: "Keep a spoken question mark or exclamation mark inside the quotation marks; do not add another comma before the reporting clause.",
      example: "\"Where is the path?\" asked Jo.\n\n\"There it is!\" replied Sam.",
      why: "The question mark or exclamation mark belongs to the speech and does the separating work. The following reporting verb still begins with a lower-case letter."
    },
    {
      rule: "An inserted reporting clause can interrupt one spoken sentence without starting a new one.",
      example: "\"If the rain stops,\" said Noor, \"we can finish the survey.\"",
      why: "The underlying spoken sentence is 'If the rain stops, we can finish the survey.' The continued word 'we' stays lower-case, and commas mark the interruption."
    },
    {
      rule: "Treat an action that is not a reporting clause as a separate sentence.",
      example: "\"The bridge is safe.\" Mina folded the map.",
      why: "'Mina folded the map' describes an action rather than how she speaks. A full stop ends the speech, and a capital letter begins the new action sentence."
    }
  ];

  const typeQuestions = [
    {
      id: "english-type-01", topicId: "comprehension", difficulty: "foundation",
      q: "A task asks, 'Which two tools are named in the first paragraph?' It wants facts explicitly stated there. Which question type is this?",
      options: ["Summary", "Purpose", "Retrieval", "Inference"], answer: 2,
      why: "Retrieval means finding information the text states directly. The task asks for named tools, not an explanation of an unstated motive or the whole passage."
    },
    {
      id: "english-type-02", topicId: "inference", difficulty: "stretch",
      q: "A character says 'I'm fine' but grips a letter tightly and avoids looking at anyone. A question asks what these clues suggest about her feelings. Which type is it?",
      options: ["Inference", "Retrieval", "Summary", "Purpose"], answer: 0,
      why: "Inference combines clues to suggest something not directly stated. Here the response should interpret behaviour rather than simply repeat the character's spoken claim."
    },
    {
      id: "english-type-03", topicId: "context", difficulty: "foundation",
      q: "You read, 'The room was stifling, so we opened every window.' A task asks which phrase could replace 'stifling' in that sentence. Which skill does it assess?",
      options: ["Purpose", "Retrieval", "Summary", "Vocabulary in context"], answer: 3,
      why: "Vocabulary in context uses nearby information to choose the meaning that fits a word. Opening the windows supplies a clue; the task is not asking for the passage's main message."
    },
    {
      id: "english-type-04", topicId: "devices", difficulty: "stretch",
      q: "A question asks how comparing a queue to 'a coiled spring' affects the reader's picture of the waiting crowd. Which type of response is needed?",
      options: ["Retrieval", "Language effect", "Summary", "True/false/not given"], answer: 1,
      why: "Language-effect questions ask how a writer's wording or technique shapes an impression. Naming the comparison alone would not explain what it makes the crowd seem like."
    },
    {
      id: "english-type-05", topicId: "evidence", difficulty: "stretch",
      q: "A task asks why the writer has included a warning box beside a set of instructions, rather than asking about any one word in the box. Which type is this?",
      options: ["Purpose", "Vocabulary in context", "Retrieval", "Summary"], answer: 0,
      why: "Purpose concerns why a writer includes a section or what it is intended to achieve. A response would explain the role of the warning, not merely define its vocabulary."
    },
    {
      id: "english-type-06", topicId: "comprehension", difficulty: "foundation",
      q: "The instruction is to give the main changes in a journey in 35 words, leaving out minor details. What question type does this describe?",
      options: ["Inference", "Language effect", "Summary", "Retrieval"], answer: 2,
      why: "A summary selects and condenses the main points. It does not retell every detail or introduce a new opinion about the journey."
    },
    {
      id: "english-type-07", topicId: "evidence", difficulty: "stretch",
      q: "For each statement, a learner must decide whether the text supports it, contradicts it or supplies too little information to settle it. Which type of task is this?",
      options: ["Language effect", "True/false/not given", "Summary", "Vocabulary in context"], answer: 1,
      why: "True/false/not-given tasks separate support, contradiction and missing information. A plausible guess is not enough to turn an unstated claim into a true one."
    },
    {
      id: "english-type-08", topicId: "comprehension", difficulty: "foundation",
      q: "A reading question asks for the name of the town explicitly given in the final sentence. What type of question is it?",
      options: ["Inference", "Purpose", "Language effect", "Retrieval"], answer: 3,
      why: "The answer is a stated detail that can be located and copied or accurately paraphrased. No deduction about a hidden meaning is required."
    },
    {
      id: "english-type-09", topicId: "inference", difficulty: "stretch",
      q: "A character quickly hides a cracked bowl when footsteps approach. A task asks why the character might do this and requests a clue to support the suggestion. Which type fits?",
      options: ["Retrieval", "Inference", "Vocabulary in context", "Summary"], answer: 1,
      why: "The motive is not directly stated, so the learner must infer a reasonable possibility from the action. The supporting clue keeps the suggestion tied to the text."
    },
    {
      id: "english-type-10", topicId: "context", difficulty: "foundation",
      q: "In 'The otter climbed onto the bank beside the river', a task asks which meaning of 'bank' is intended. Which question type is being used?",
      options: ["Summary", "Purpose", "Vocabulary in context", "Language effect"], answer: 2,
      why: "The same word can have different meanings. Vocabulary in context selects the sense that fits the surrounding sentence, here using the river setting."
    },
    {
      id: "english-type-11", topicId: "devices", difficulty: "challenge",
      q: "After several long sentences, a writer uses 'Then the lights died.' A question asks how that short sentence changes the pace and tension. Which type is it?",
      options: ["Language effect", "Retrieval", "True/false/not given", "Summary"], answer: 0,
      why: "The task examines the effect of a sentence choice on the reader. A useful answer explains pace or tension rather than only stating what happened to the lights."
    },
    {
      id: "english-type-12", topicId: "evidence", difficulty: "stretch",
      q: "A question asks what an advice leaflet is trying to achieve for its readers as a whole, not what happened first or what a particular word means. Which type fits?",
      options: ["Retrieval", "Summary", "Vocabulary in context", "Purpose"], answer: 3,
      why: "Purpose identifies the writer's intended aim, such as informing, advising or persuading. A summary would instead condense the leaflet's main content."
    },
    {
      id: "english-type-13", topicId: "comprehension", difficulty: "stretch",
      q: "You are asked to state the main argument and its central supporting reason in one sentence, without adding your own view. Which task is this?",
      options: ["Summary", "Inference", "Language effect", "True/false/not given"], answer: 0,
      why: "The task requires a compressed account of the main ideas. Summary writing selects what matters most while keeping the original meaning and leaving out personal additions."
    },
    {
      id: "english-type-14", topicId: "evidence", difficulty: "challenge",
      q: "A reading exercise warns that a statement is not automatically false just because the passage never mentions it. Which question type needs this distinction most directly?",
      options: ["Purpose", "True/false/not given", "Vocabulary in context", "Retrieval"], answer: 1,
      why: "True/false/not-given questions require evidence of contradiction before a statement is called false. If the necessary fact is absent, the correct classification is not given."
    }
  ];

  window.BRIGHTLANE_ENGLISH_LAB = { passages, writingPrompts, modelParagraphs, languageBanks, dialogueGuide, typeQuestions };
}());
