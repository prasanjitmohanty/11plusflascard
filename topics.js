/* Original lesson and question bank, bundled for direct file:// use. */
window.BRIGHTLANE_TOPICS = [
  {
    id: "place-value", subject: "maths", title: "Number & place value", summary: "Read, order, round and estimate whole numbers, including negative numbers.",
    learn: ["Each place is worth ten times the place to its right: in 47,306 the 7 represents 7,000.", "Compare numbers from the highest place. On a number line, numbers further right are greater; -2 is greater than -7.", "To round, find the target place and inspect the next digit. 5 or more rounds up; less than 5 rounds down. Estimate first to check whether an answer is sensible."],
    example: ["Round 38,672 to the nearest thousand.", "The thousands digit is 8 and the hundreds digit is 6. Round the thousands up: 39,000. To the nearest hundred, the answer is 38,700."],
    pitfall: "A zero holds a place. 40,506 is not the same as 4,506. With negative numbers, a larger magnitude does not mean a greater value.",
    questions: [
      {q:"What is the value of the digit 6 in 263,419?", options:["600","6,000","60,000","600,000"], answer:2, why:"The 6 is in the ten-thousands column, so its value is 60,000."},
      {q:"Round 7,849 to the nearest hundred.", options:["7,800","7,850","7,900","8,000"], answer:0, why:"The tens digit is 4, so keep the hundreds digit and replace tens and units with zeros: 7,800."},
      {q:"Which number is greatest?", options:["-8","-3","-12","-5"], answer:1, why:"-3 is furthest right on the number line, closest to zero."}
    ]
  },
  {
    id:"operations", subject:"maths", title:"The four operations", summary:"Add, subtract, multiply and divide with reliable written and mental methods.",
    learn:["Line up place-value columns in addition and subtraction, including decimal points. Exchange ten units for one ten when needed.", "For multiplication, partition: 23 x 14 = (23 x 10) + (23 x 4). For division, share or group equally and interpret any remainder.", "Use brackets first, then powers if present, then multiplication and division from left to right, then addition and subtraction from left to right. Check with an inverse operation."],
    example:["Calculate 306 x 7.", "300 x 7 = 2,100 and 6 x 7 = 42. Add to get 2,142. Dividing 2,142 by 7 gives 306, confirming the product."],
    pitfall:"Addition does not come before multiplication just because it is written first. Multiplication and division have equal priority.",
    questions:[
      {q:"What is 48 + 6 x 3?",options:["162","66","54","72"],answer:1,why:"Multiply first: 6 x 3 = 18. Then 48 + 18 = 66."},
      {q:"Calculate 936 divided by 8.",options:["107","116","117","127"],answer:2,why:"8 x 100 = 800, leaving 136; 8 x 17 = 136. Total: 117."},
      {q:"What is 4.7 - 2.85?",options:["2.15","1.85","2.85","1.95"],answer:1,why:"Write 4.70 - 2.85 and align decimal places. The difference is 1.85."}
    ]
  },
  {
    id:"factors",subject:"maths",title:"Factors, multiples & primes",summary:"Recognise divisibility, prime numbers, common factors and common multiples.",
    learn:["A factor divides a number exactly; a multiple is the result of multiplying a number by a whole number. Factor pairs of 12 are 1 and 12, 2 and 6, 3 and 4.", "A prime has exactly two positive factors: 1 and itself. 1 is not prime; 2 is the only even prime. A composite has more than two factors.", "The highest common factor (HCF) is the greatest shared factor. The lowest common multiple (LCM) is the smallest positive shared multiple. Digit sums test divisibility by 3 or 9."],
    example:["Find the HCF and LCM of 12 and 18.", "Common factors are 1, 2, 3 and 6, so HCF = 6. Multiples of 12 include 12, 24, 36; multiples of 18 include 18, 36. LCM = 36."],
    pitfall:"Do not confuse factors, which are at most the number, with multiples, which continue without end.",
    questions:[
      {q:"Which number is prime?",options:["21","29","35","39"],answer:1,why:"29 has only factors 1 and 29. The others are divisible by 3 or 5."},
      {q:"What is the highest common factor of 24 and 36?",options:["6","12","24","72"],answer:1,why:"12 divides both numbers. No greater factor is shared."},
      {q:"Two bells ring every 6 and 8 minutes. They ring together now. When do they next ring together?",options:["12 minutes","14 minutes","24 minutes","48 minutes"],answer:2,why:"The LCM of 6 and 8 is 24: 6 x 4 = 8 x 3 = 24."}
    ]
  },
  {
    id:"fractions",subject:"maths",title:"Fractions",summary:"Equivalent fractions, comparison, mixed numbers and fraction calculations.",
    learn:["The denominator counts equal parts in a whole; the numerator counts selected parts. Multiply or divide both by the same non-zero number to make an equivalent fraction.", "To add or subtract fractions, use a common denominator. For multiplication, multiply numerators and denominators. To divide by a fraction, multiply by its reciprocal.", "To find a fraction of an amount, divide by the denominator then multiply by the numerator. Convert mixed numbers to improper fractions before multiplying."],
    example:["Calculate 2/3 + 1/4.", "Use twelfths: 2/3 = 8/12 and 1/4 = 3/12. Add: 11/12. In contrast, 2/3 x 1/4 = 2/12 = 1/6."],
    pitfall:"Do not add denominators when adding fractions. Equal denominators mean equal-sized pieces.",
    questions:[
      {q:"What is 3/4 of 48?",options:["12","24","36","40"],answer:2,why:"One quarter is 48 divided by 4 = 12. Three quarters are 12 x 3 = 36."},
      {q:"Calculate 5/6 - 1/3.",options:["4/3","1/2","4/6","2/9"],answer:1,why:"1/3 = 2/6. Then 5/6 - 2/6 = 3/6 = 1/2."},
      {q:"What is 1 1/2 divided by 3/4?",options:["1/2","1","2","3"],answer:2,why:"1 1/2 = 3/2. Multiply by 4/3: (3 x 4)/(2 x 3) = 2."}
    ]
  },
  {
    id:"decimals",subject:"maths",title:"Decimals",summary:"Decimal place value, ordering, rounding and conversions to fractions.",
    learn:["Digits after the point represent tenths, hundredths and thousandths. 0.35 is 35/100, which simplifies to 7/20.", "Append zeros to compare: 0.6 = 0.60, so it is greater than 0.56. For decimal addition and subtraction, align the decimal points.", "Multiplying by 10 shifts each digit one place left in place value; dividing by 100 shifts two places right. In decimal multiplication, count decimal places in both factors."],
    example:["Calculate 0.7 x 0.4.", "7 x 4 = 28. There are two decimal places altogether, so the product is 0.28. It is less than 0.7 because we are finding four tenths of it."],
    pitfall:"More digits after the point do not make a larger number. 0.125 is smaller than 0.2.",
    questions:[
      {q:"Which is smallest?",options:["0.4","0.39","0.405","0.409"],answer:1,why:"Write 0.400, 0.390, 0.405, 0.409. 0.390 is smallest."},
      {q:"What is 6.28 divided by 100?",options:["0.628","0.0628","62.8","628"],answer:1,why:"Each digit moves two place-value columns right: 0.0628."},
      {q:"Round 3.476 to two decimal places.",options:["3.47","3.48","3.5","3.476"],answer:1,why:"The thousandths digit is 6, so round the hundredths digit 7 up to 8."}
    ]
  },
  {
    id:"percentages",subject:"maths",title:"Percentages",summary:"Connect fractions, decimals and percentages; calculate changes and discounts.",
    learn:["Per cent means out of 100. 25% = 25/100 = 1/4 = 0.25. Multiply a decimal by 100 to express it as a percentage.", "Find 10% by dividing by 10 and 1% by dividing by 100, then build the required amount. Alternatively multiply by the percentage as a decimal.", "A 20% increase gives 120% of the original; a 20% discount leaves 80%. When finding an original price, divide by the fraction of the original that remains."],
    example:["A coat costs £60 and is reduced by 15%. Find the sale price.", "10% of £60 is £6 and 5% is £3. The discount is £9, so the sale price is £51. Check: 60 x 0.85 = 51."],
    pitfall:"A 20% decrease followed by a 20% increase does not cancel out: the second percentage uses a different starting amount.",
    questions:[
      {q:"What is 35% of 80?",options:["24","28","35","45"],answer:1,why:"30% is 24 and 5% is 4. Add to get 28."},
      {q:"A £40 bag increases in price by 10%. What is the new price?",options:["£4","£36","£44","£50"],answer:2,why:"10% of £40 is £4. Add the increase: £44."},
      {q:"A toy costs £24 after a 20% discount. What was its original price?",options:["£28.80","£30","£32","£120"],answer:1,why:"£24 is 80% of the original. 24 divided by 0.8 = 30."}
    ]
  },
  {
    id:"ratio",subject:"maths",title:"Ratio & proportion",summary:"Share amounts, simplify ratios and scale recipes or other quantities.",
    learn:["A ratio compares quantities in order. Red:blue = 2:3 means two red parts for every three blue parts; red is 2/5 of the total.", "Simplify ratios by dividing all parts by a common factor. To share a total, add the parts, find one part, then multiply.", "In direct proportion, doubling one quantity doubles the other. Find the value for one unit or use a scale factor. Keep units consistent."],
    example:["Share £45 in the ratio 2:3.", "There are 5 equal parts. One part is £45 divided by 5 = £9. The shares are 2 x £9 = £18 and 3 x £9 = £27."],
    pitfall:"A ratio of 2:3 does not mean the first share is 2/3 of the total. The total has 5 parts.",
    questions:[
      {q:"Simplify 18:24.",options:["2:3","3:4","6:8","4:3"],answer:1,why:"Divide both parts by their HCF, 6, to get 3:4. 6:8 is equivalent but not fully simplified."},
      {q:"A recipe for 4 people uses 300 g of rice. How much for 6 people?",options:["200 g","400 g","450 g","600 g"],answer:2,why:"Each person needs 75 g. Six people need 6 x 75 = 450 g."},
      {q:"There are 35 counters, with red:blue = 3:4. How many are red?",options:["15","20","21","28"],answer:0,why:"7 parts total; 35 divided by 7 = 5. Three red parts give 15."}
    ]
  },
  {
    id:"algebra",subject:"maths",title:"Basic algebra",summary:"Use letters for unknowns, substitute values and solve simple equations.",
    learn:["A letter stands for a number. 3n means 3 x n; n + n + n also simplifies to 3n. Only combine like terms: 2a + 3b cannot become 5ab.", "Substitute a value carefully, respecting operation order. If n = 4, then 2n + 3 = 11.", "An equation is a balance. Do the same operation to both sides. Undo addition or subtraction, then multiplication or division to isolate the unknown."],
    example:["Solve 3x + 5 = 26.", "Subtract 5 from both sides: 3x = 21. Divide both sides by 3: x = 7. Check: 3 x 7 + 5 = 26."],
    pitfall:"3x is multiplication, not a two-digit number. Keep an equals sign only between quantities of equal value.",
    questions:[
      {q:"If a = 6, what is 4a - 7?",options:["3","17","24","31"],answer:1,why:"Substitute 6 for a and multiply first: 4 x 6 = 24, then 24 - 7 = 17."},
      {q:"Solve 5x = 45.",options:["5","8","9","40"],answer:2,why:"Divide both sides by 5 to undo multiplication: x = 9. Check: 5 x 9 = 45."},
      {q:"Simplify 3y + 2y + 4.",options:["9y","5y + 4","5y + 4y","6y + 4"],answer:1,why:"3y and 2y are like terms, giving 5y. The constant 4 stays separate."}
    ]
  },
  {
    id:"sequences",subject:"maths",title:"Sequences & patterns",summary:"Recognise step rules, square numbers and simple position-to-term rules.",
    learn:["Inspect differences between terms, but also check multiplication, alternating rules and growing differences. Explain a rule rather than guessing from one pair.", "An arithmetic sequence has a constant difference. For 5, 8, 11, 14, the nth term is 3n + 2, where the first position is n = 1.", "Square numbers are 1, 4, 9, 16, 25 ...; triangular numbers are 1, 3, 6, 10, 15 ... . A finite list may fit more than one rule; use the intended simple pattern and any clues."],
    example:["Find the tenth term of 4, 9, 14, 19 ... .", "The difference is 5. The nth term is 5n - 1, since 5 x 1 - 1 = 4. The tenth term is 5 x 10 - 1 = 49."],
    pitfall:"Do not multiply the first term by the position. Count steps: from the first to the tenth term there are nine steps.",
    questions:[
      {q:"What comes next in 3, 6, 12, 24 ... using the doubling rule?",options:["27","30","36","48"],answer:3,why:"Each term is twice the preceding term: 24 x 2 = 48."},
      {q:"What is the sixth term of 2, 5, 8, 11 ...?",options:["14","17","18","20"],answer:1,why:"Continue adding 3: the fifth term is 14 and the sixth is 17."},
      {q:"A sequence has nth term 4n + 1. What is its third term?",options:["8","12","13","16"],answer:2,why:"The third position means n = 3. Substitute into the rule: 4 x 3 + 1 = 13."}
    ]
  },
  {
    id:"units",subject:"maths",title:"Measurement & units",summary:"Convert metric length, mass and capacity and interpret scales.",
    learn:["1 km = 1,000 m; 1 m = 100 cm; 1 cm = 10 mm. 1 kg = 1,000 g; 1 litre = 1,000 ml. Choose a sensible unit for the object.", "Convert to a smaller unit by multiplying, and to a larger unit by dividing. Put measurements in the same unit before combining or comparing.", "Read a scale by dividing the difference between labelled marks by the number of equal intervals, not the number of tick marks. Conversion factors for area and volume are squared and cubed."],
    example:["A jug has 1.2 litres of juice. Pour out 350 ml. How much remains?", "Convert first so the units match: 1.2 litres = 1,200 ml. Subtract 350 ml to get 850 ml, which is 0.85 litres. This is less than the starting amount, as expected."],
    pitfall:"1 square metre is 10,000 square centimetres, not 100: both length and width change by a factor of 100.",
    questions:[
      {q:"Convert 2.35 kg to grams.",options:["23.5 g","235 g","2,350 g","23,500 g"],answer:2,why:"Multiply by 1,000: 2.35 kg = 2,350 g."},
      {q:"Which length equals 0.75 m?",options:["7.5 cm","75 cm","750 cm","7,500 cm"],answer:1,why:"There are 100 cm per metre; 0.75 x 100 = 75 cm."},
      {q:"A scale runs from 0 to 200 g in five equal intervals. What does each interval represent?",options:["20 g","40 g","50 g","100 g"],answer:1,why:"200 divided by 5 = 40 g per interval."}
    ]
  },
  {
    id:"time-money",subject:"maths",title:"Time & money",summary:"Read timetables, calculate durations and work with pounds and pence.",
    learn:["An hour has 60 minutes, a minute has 60 seconds. For 24-hour time, 3:20 pm is 15:20; noon is 12:00 and midnight is 00:00.", "Find elapsed time by bridging to the next hour, then adding the remaining minutes. Timetable questions may include waiting or transfer time.", "£1 = 100p. Keep currency units consistent, calculate total cost before change and compare offers using cost per item."],
    example:["A train leaves at 14:48 and arrives at 16:15. Find the duration.", "14:48 to 15:00 is 12 minutes; to 16:00 is 60 more; to 16:15 is 15 more. Total 87 minutes = 1 hour 27 minutes."],
    pitfall:"Time is not base ten. 1 hour 30 minutes is 1.5 hours, not 1.30 hours.",
    questions:[
      {q:"What is 7:45 pm in 24-hour time?",options:["07:45","17:45","19:45","20:45"],answer:2,why:"Add 12 to the hour for pm times other than noon: 7 + 12 = 19."},
      {q:"Three notebooks cost £1.85 each. What change is due from £10?",options:["£4.45","£4.55","£5.55","£8.15"],answer:0,why:"3 x £1.85 = £5.55. £10 - £5.55 = £4.45."},
      {q:"A film begins at 10:35 and lasts 95 minutes. When does it finish?",options:["11:30","11:50","12:10","12:30"],answer:2,why:"95 minutes is 1 hour 35 minutes. 10:35 + 1 hour = 11:35, plus 35 minutes = 12:10."}
    ]
  },
  {
    id:"angles",subject:"maths",title:"Angles",summary:"Identify angle types and use straight-line, full-turn and triangle facts.",
    learn:["Acute angles are greater than 0 and less than 90 degrees; right angles are 90; obtuse angles are between 90 and 180; reflex angles are between 180 and 360.", "Angles on a straight line total 180 degrees; angles around a point total 360. Vertically opposite angles are equal.", "A triangle's interior angles total 180 degrees and a quadrilateral's total 360. In an isosceles triangle the two base angles are equal. Parallel lines create equal corresponding and alternate angles."],
    example:["An isosceles triangle has a vertex angle of 40 degrees. Find each base angle.", "180 - 40 = 140 degrees remain for two equal angles. Each is 140 divided by 2 = 70 degrees."],
    pitfall:"A diagram may not be drawn to scale. Use given facts, not how wide an angle looks.",
    questions:[
      {q:"One angle on a straight line is 127 degrees. What is the adjacent angle?",options:["43 degrees","53 degrees","63 degrees","233 degrees"],answer:1,why:"The pair totals 180 degrees: 180 - 127 = 53."},
      {q:"Two angles of a triangle are 48 and 67 degrees. What is the third?",options:["65 degrees","75 degrees","115 degrees","245 degrees"],answer:0,why:"Triangle angles total 180 degrees. Subtract the known angles: 180 - (48 + 67) = 65."},
      {q:"Which angle is reflex?",options:["45 degrees","90 degrees","135 degrees","225 degrees"],answer:3,why:"225 degrees is greater than 180 and less than 360."}
    ]
  },
  {
    id:"shapes",subject:"maths",title:"2D & 3D shapes",summary:"Classify polygons, describe solids and recognise symmetry and nets.",
    learn:["A polygon has straight sides. A regular polygon has equal sides and equal angles. Triangles may be equilateral, isosceles or scalene; a right-angled triangle has one right angle.", "A rectangle has four right angles; a square also has four equal sides. A parallelogram has two pairs of parallel sides; a rhombus also has four equal sides. In usual UK usage, a trapezium has one pair of parallel sides.", "Describe solids using faces, edges and vertices. A cube has 6 square faces, 12 edges and 8 vertices. A net folds into a solid. A symmetry line reflects a shape onto itself."],
    example:["Compare a square and a non-square rectangle.", "Both have four right angles and two pairs of parallel sides. A square has four equal sides and four lines of symmetry; a non-square rectangle has two lines of symmetry."],
    pitfall:"A square is a special rectangle and a special rhombus. Rotating a shape does not change its properties.",
    questions:[
      {q:"How many edges does a cube have?",options:["6","8","12","16"],answer:2,why:"There are 4 edges on top, 4 on the bottom and 4 joining them: 12."},
      {q:"A triangle has three equal sides. What is it called?",options:["Scalene","Equilateral","Right-angled","Obtuse"],answer:1,why:"An equilateral triangle has three equal sides and three 60-degree angles."},
      {q:"How many lines of symmetry does a non-square rectangle have?",options:["0","1","2","4"],answer:2,why:"The horizontal and vertical lines through its centre are symmetry lines. Its diagonals are not."}
    ]
  },
  {
    id:"area-volume",subject:"maths",title:"Perimeter, area & volume",summary:"Measure boundaries, calculate surface space and work with cuboids.",
    learn:["Perimeter is the total distance around a shape. A rectangle has perimeter 2 x (length + width). Add all outer edges for a compound shape.", "Rectangle area = length x width; triangle area = base x perpendicular height divided by 2; parallelogram area = base x perpendicular height. Split compound shapes into simpler ones.", "Cuboid volume = length x width x height. Area uses square units; volume uses cubic units. Surface area is the sum of face areas. Some schools introduce circles: circumference = 2 x pi x radius and area = pi x radius squared; pi is approximately 3.14."],
    example:["A rectangular box measures 5 cm by 3 cm by 2 cm.", "Volume = 5 x 3 x 2 = 30 cubic centimetres. Surface area = 2 x (5 x 3 + 5 x 2 + 3 x 2) = 62 square centimetres. Its 5-by-3 base has perimeter 16 cm."],
    pitfall:"A triangle's height must be perpendicular to its base. A sloping side is not necessarily the height.",
    questions:[
      {q:"A rectangle is 8 cm long and 5 cm wide. What is its perimeter?",options:["13 cm","26 cm","40 cm","80 cm"],answer:1,why:"Add all four sides: 8 + 5 + 8 + 5 = 26 cm."},
      {q:"A triangle has base 10 cm and perpendicular height 6 cm. What is its area?",options:["16 square cm","30 square cm","60 square cm","120 square cm"],answer:1,why:"10 x 6 divided by 2 = 30 square centimetres."},
      {q:"A cuboid measures 4 cm by 3 cm by 5 cm. What is its volume?",options:["12 cubic cm","20 cubic cm","47 cubic cm","60 cubic cm"],answer:3,why:"Multiply length, width and height: 4 x 3 x 5 = 60 cubic centimetres."}
    ]
  },
  {
    id:"coordinates",subject:"maths",title:"Coordinates & transformations",summary:"Plot points, translate, reflect and rotate on a coordinate grid.",
    learn:["Coordinates are (x, y): move horizontally from the origin, then vertically. Negative x is left; negative y is down. The origin is (0, 0).", "Translation slides every point by the same amount. Reflection mirrors a shape across a line. In the y-axis, (x, y) becomes (-x, y); in the x-axis it becomes (x, -y).", "Rotation needs an angle, a direction and a centre. A quarter turn is 90 degrees. Enlargement changes size by a scale factor; corresponding lengths scale equally."],
    example:["Translate point (-2, 3) four units right and five down.", "Add 4 to x and subtract 5 from y: (-2 + 4, 3 - 5) = (2, -2). Reflection of the original point in the y-axis would instead be (2, 3)."],
    pitfall:"The coordinate order is x then y. A reflection changes orientation; a translation does not.",
    questions:[
      {q:"Reflect (4, -2) in the y-axis.",options:["(4, 2)","(-4, -2)","(-4, 2)","(-2, 4)"],answer:1,why:"Reflection in the y-axis changes the sign of x only."},
      {q:"Move (1, 5) three units left and two down.",options:["(4, 3)","(-2, 7)","(-2, 3)","(3, 2)"],answer:2,why:"Moving left decreases x and moving down decreases y: (1 - 3, 5 - 2) = (-2, 3)."},
      {q:"How many degrees are in a three-quarter turn?",options:["90","180","270","360"],answer:2,why:"Three quarters of 360 degrees is 270 degrees."}
    ]
  },
  {
    id:"data",subject:"maths",title:"Data, graphs & averages",summary:"Read tables and charts; find mean, median, mode and range.",
    learn:["Read a graph's title, axes, units and key before using it. Bar charts compare categories; line graphs show change. A pictogram symbol may stand for several items.", "Mean = total divided by count. Median is the middle of ordered data; for an even count, average the middle two. Mode is the most frequent value and may be absent or shared.", "Range = largest minus smallest. Frequency tables show how often values occur; multiply each value by its frequency when finding the total. Pie-chart sectors represent proportions of 360 degrees."],
    example:["For 2, 3, 3, 8, find the averages and range.", "Mean = 16 divided by 4 = 4. Median = (3 + 3)/2 = 3. Mode = 3. Range = 8 - 2 = 6. The large value 8 pulls the mean above the median."],
    pitfall:"Sort the data before finding the median. The range is a difference, not the two end values.",
    questions:[
      {q:"Find the mean of 5, 7, 8 and 12.",options:["7","8","9","32"],answer:1,why:"Total = 32. Divide by four values: 8."},
      {q:"Find the median of 9, 2, 6, 4 and 7.",options:["4","5","6","7"],answer:2,why:"In order: 2, 4, 6, 7, 9. The middle is 6."},
      {q:"A pictogram uses one full star for 8 books. What do two and a half stars represent?",options:["10 books","16 books","20 books","24 books"],answer:2,why:"2 x 8 + half of 8 = 16 + 4 = 20 books."}
    ]
  },
  {
    id:"probability",subject:"maths",title:"Probability",summary:"Describe chance and calculate probabilities for equally likely outcomes.",
    learn:["Probability runs from 0 (impossible) to 1 (certain). An even chance is 1/2. Likely does not mean guaranteed.", "For equally likely outcomes, probability = number of favourable outcomes divided by number of possible outcomes. Simplify the fraction where possible.", "Probabilities of all possible outcomes total 1. The probability of not happening is 1 minus the probability of happening. A fair die has six equally likely faces."],
    example:["A bag contains 3 blue and 5 yellow counters. Pick one without looking.", "There are 8 counters. P(blue) = 3/8 and P(not blue) = 5/8. Without replacement, the contents change after a pick, so the next probability depends on what was removed."],
    pitfall:"Count outcomes rather than colour names. Two colours need not be equally likely.",
    questions:[
      {q:"What is the chance of rolling an even number on a fair six-sided die?",options:["1/6","1/3","1/2","2/3"],answer:2,why:"The even outcomes are 2, 4 and 6: 3 out of 6 = 1/2."},
      {q:"A bag has 4 red and 6 green counters. What is P(red)?",options:["2/5","3/5","2/3","1/4"],answer:0,why:"4 out of 10 counters are red; 4/10 simplifies to 2/5."},
      {q:"P(rain) is 0.3. What is P(no rain)?",options:["0.3","0.5","0.7","1.3"],answer:2,why:"Rain and no rain cover all outcomes. 1 - 0.3 = 0.7."}
    ]
  },
  {
    id:"word-problems",subject:"maths",title:"Multi-step word problems",summary:"Model a problem, choose operations and check answers in context.",
    learn:["Read twice: identify what is being asked, relevant quantities and units. Draw a bar model, table or simple sketch rather than relying only on clue words.", "Plan the order of steps. Work backwards for an unknown starting amount; use systematic lists for possibilities. Keep intermediate answers precise until the end.", "Interpret remainders in context: buses require rounding up, full packs may require rounding down. Check by estimating and putting the answer back into the story."],
    example:["A club takes 94 pupils on minibuses with 15 passenger seats each. How many minibuses are needed?", "94 divided by 15 is 6 remainder 4. Six buses carry only 90 pupils, so a seventh is needed. The answer is 7, not 6.27 buses."],
    pitfall:"Keywords are not foolproof. 'More' can appear in a subtraction problem when comparing two amounts.",
    questions:[
      {q:"A school buys 8 packs of 12 pencils and shares them equally among 6 classes. How many per class?",options:["12","14","16","18"],answer:2,why:"8 x 12 = 96 pencils. 96 divided by 6 = 16."},
      {q:"A number is doubled, then 7 is added, giving 31. What was the number?",options:["12","15.5","19","24"],answer:0,why:"Work backwards: 31 - 7 = 24, then divide by 2 to get 12."},
      {q:"Tickets cost £7 each. With £50, how many can you buy?",options:["6","7","8","9"],answer:1,why:"7 tickets cost £49; 8 cost £56. You can buy 7 whole tickets."}
    ]
  },
  {
    id:"comprehension",subject:"english",title:"Reading comprehension",summary:"Retrieve information, follow events and distinguish fact from opinion.",
    learn:["Read the whole passage for its situation, characters and main idea. Then read the question carefully and return to the relevant section.", "Retrieval asks for information stated explicitly. Paraphrase accurately and obey limits such as 'give two reasons'. A summary keeps key ideas without minor details.", "A fact can be checked against evidence; an opinion expresses a judgement. Notice pronouns, time words and connectives to follow who does what and when."],
    passage:"At nine o'clock, the village library opened its new reading room. Maya arrived carrying a box of donated books. She placed it beside the window, then helped Mr Ellis arrange the chairs. By ten, every chair was occupied. 'This is the finest room in the village,' Maya said.",
    example:["What did Maya do immediately after putting down the box?", "She helped Mr Ellis arrange the chairs. The word 'then' establishes the order. Her comment that the room is the finest is an opinion, not a measurable fact."],
    pitfall:"Use the passage, not what would usually happen in real life. A plausible answer may still be unsupported.",
    questions:[
      {q:"At what time did the reading room open?",options:["Eight o'clock","Nine o'clock","Ten o'clock","Noon"],answer:1,why:"The opening sentence explicitly states nine o'clock."},
      {q:"Where did Maya place the box?",options:["Under a chair","Beside the door","Beside the window","On a shelf"],answer:2,why:"The passage says she placed it beside the window."},
      {q:"Which statement is an opinion?",options:["Maya carried books.","The room opened at nine.","Every chair was occupied by ten.","It is the finest room in the village."],answer:3,why:"'Finest' is Maya's personal judgement. The other statements describe checkable events."}
    ]
  },
  {
    id:"inference",subject:"english",title:"Inference & character",summary:"Read between the lines using actions, speech and specific clues.",
    learn:["An inference is a reasoned conclusion, not a random guess. Combine a detail from the text with what that detail reasonably suggests.", "Writers may reveal feelings through behaviour rather than naming them. Trembling hands might suggest fear, but context could point to cold instead.", "Distinguish a supported inference from certainty. Use phrasing such as 'suggests' when the passage does not prove a conclusion. Track how a character's feelings change."],
    passage:"Noah stood outside the audition room, smoothing the same crease in his sleeve again and again. When his name was called, he took a slow breath. A few minutes later he emerged smiling, his shoulders no longer drawn up towards his ears.",
    example:["How does Noah's mood change?", "He seems nervous at first: repeatedly smoothing his sleeve and taking a slow breath suggest tension. Afterwards, his smile and relaxed shoulders suggest relief. The passage does not tell us whether he won a part."],
    pitfall:"Do not turn a likely feeling into an unsupported event. A smile does not prove that Noah passed the audition.",
    questions:[
      {q:"What does smoothing the same crease repeatedly most strongly suggest here?",options:["Boredom","Nervousness","Anger","Hunger"],answer:1,why:"The repetitive action before an audition, combined with the slow breath, suggests nerves."},
      {q:"Which detail best suggests Noah feels more relaxed afterwards?",options:["He stands outside.","His name is called.","His shoulders are no longer drawn up.","There is an audition room."],answer:2,why:"Relaxed shoulders contrast directly with his earlier tense posture."},
      {q:"Which conclusion is not supported?",options:["Noah attends an audition.","He smiles afterwards.","His mood appears to change.","He definitely wins the main part."],answer:3,why:"No result is stated. Feeling relieved or smiling does not establish that he won."}
    ]
  },
  {
    id:"evidence",subject:"english",title:"Evidence, purpose & viewpoint",summary:"Choose precise quotations and explain how language supports an idea.",
    learn:["Build an answer from a point, a short quotation or precise reference, and an explanation. Evidence must support the particular point being made.", "Consider purpose: to inform, persuade, entertain, instruct or a combination. Audience affects tone and word choice. A narrator's viewpoint is not automatically the author's opinion.", "For language questions, explain the effect of a specific word or phrase. For structure questions, consider contrasts, changes of pace, openings and endings."],
    passage:"The old footbridge shuddered as Lina stepped onto it. Beneath her, the river clawed at the bank. She tested each plank before moving her weight. On the far side, a sunlit meadow waited, calm and still.",
    example:["How does the writer make the crossing seem dangerous?", "The bridge 'shuddered', suggesting instability. The river 'clawed' at the bank makes it seem aggressive. The calm meadow contrasts with the crossing, emphasising safety on the other side."],
    pitfall:"A quotation alone is not an explanation. Avoid naming a technique without describing what it makes the reader imagine.",
    questions:[
      {q:"Which quotation best supports the idea that the bridge is unstable?",options:["'old footbridge'","'shuddered'","'sunlit meadow'","'far side'"],answer:1,why:"'Shuddered' directly describes the bridge shaking under Lina's step."},
      {q:"What is the main effect of the calm meadow at the end?",options:["It contrasts safety with danger.","It proves Lina cannot swim.","It tells us the time exactly.","It explains how bridges are built."],answer:0,why:"'Calm and still' contrasts with the shaking bridge and aggressive river."},
      {q:"Which answer best explains 'clawed'?",options:["It is a long word.","It says the river has real fingers.","It makes the river seem aggressive, like an animal.","It means the water is warm."],answer:2,why:"The verb gives the river a threatening animal-like action; this is personification."}
    ]
  },
  {
    id:"context",subject:"english",title:"Vocabulary in context",summary:"Infer unfamiliar meanings from clues, word parts and the surrounding sentence.",
    learn:["Read before and after the unfamiliar word. Examples, contrasts, explanations and a character's reaction can narrow its meaning.", "Use prefixes and suffixes as clues: re- often means again, un- can mean not and -less means without. Clues help, but a word's actual use must still make sense.", "Words can have multiple meanings. Substitute a possible meaning into the sentence and check the tone and grammar as well as the idea."],
    passage:"The path was usually crowded, but this morning it was deserted. A solitary cyclist passed the gate. Amira hesitated at the steep slope, then cautiously began her descent, placing each foot firmly before taking another step.",
    example:["What does 'cautiously' mean here?", "It means carefully, trying to avoid danger. The steep slope and Amira's deliberate footsteps support this. It does not simply mean slowly: the reason for her care matters."],
    pitfall:"Do not choose a familiar meaning that does not fit the sentence. 'Deserted' here does not describe a sandy landscape.",
    questions:[
      {q:"What does 'deserted' mean in this passage?",options:["Full of sand","Empty of people","Very noisy","Newly built"],answer:1,why:"The contrast with 'usually crowded' shows that the path is empty or almost empty."},
      {q:"What does 'solitary' describe about the cyclist?",options:["Alone","Fast","Lost","Angry"],answer:0,why:"A solitary cyclist is one travelling alone; nothing states the cyclist's speed or mood."},
      {q:"What is a 'descent' here?",options:["An argument","A journey upwards","A movement downwards","A long rest"],answer:2,why:"Amira is moving down a steep slope. The surrounding actions establish the meaning."}
    ]
  },
  {
    id:"synonyms",subject:"english",title:"Synonyms & antonyms",summary:"Develop precise vocabulary while noticing shades of meaning and register.",
    learn:["Synonyms have similar meanings; antonyms have opposite meanings. The closest synonym depends on the sentence: 'bright' might mean shining or clever.", "Match word class and grammatical form. An adjective usually needs an adjective replacement. Words with similar meanings can differ in strength: annoyed is weaker than furious.", "Register is the level of formality. 'Purchase' and 'buy' share a meaning, but purchase is more formal. Learn words in sentences rather than isolated lists."],
    example:["Replace 'reluctant' in 'Eli was reluctant to enter the dark shed.'", "'Unwilling' is a close synonym. 'Terrified' may explain a possible reason, but it is stronger and not equivalent. 'Eager' is an antonym in this context."],
    pitfall:"A word linked to the same topic is not necessarily a synonym. 'Rain' and 'cloud' are related, not interchangeable.",
    questions:[
      {q:"Choose the closest synonym for 'scarce' in 'Food was scarce.'",options:["Plentiful","Limited","Delicious","Expensive"],answer:1,why:"Scarce means in short supply. Limited is closest; expensive may be a consequence but is not the meaning."},
      {q:"Which is the antonym of 'generous' in describing someone's willingness to give?",options:["Kind","Cheerful","Stingy","Wealthy"],answer:2,why:"Stingy means unwilling to give or spend, the opposite of generous."},
      {q:"In 'a bright pupil', which replacement fits best?",options:["Shining","Colourful","Intelligent","Loud"],answer:2,why:"Here bright describes ability or quick understanding, not light."}
    ]
  },
  {
    id:"spelling",subject:"english",title:"Spelling patterns & homophones",summary:"Apply common spelling rules and distinguish words that sound alike.",
    learn:["Before a vowel suffix, a final silent e is often dropped: hope -> hoping. A short stressed vowel followed by one consonant often needs that consonant doubled: stop -> stopping.", "A consonant followed by y often changes to i before -es or -ed: baby -> babies, carry -> carried. Keep y before -ing: carrying. Learn exceptions alongside patterns.", "Homophones sound alike but differ in spelling and meaning: their (belonging to them), there (a place), they're (they are); your/you're and its/it's. British forms include colour, centre and travelling."],
    example:["Choose a spelling: 'They are ___ their bags over ___.'", "'carrying' keeps y before -ing, and 'there' identifies a place: 'They are carrying their bags over there.' Use 'their' for possession."],
    pitfall:"'I before e' is not a universal rule: receive, science and many other words need separate attention.",
    questions:[
      {q:"Which is the correct spelling?",options:["stoping","stopping","stoppping","stopeing"],answer:1,why:"Stop has a short vowel followed by one final consonant. Double p before -ing."},
      {q:"Choose the correct word: '___ going to bring their coats.'",options:["There","Their","They're","Theirs"],answer:2,why:"They're means 'they are', which fits before 'going'."},
      {q:"What is the plural of 'baby'?",options:["babys","babyes","babies","baby's"],answer:2,why:"Consonant + y changes to ies for this plural: babies. An apostrophe is not used for a normal plural."}
    ]
  },
  {
    id:"word-classes",subject:"english",title:"Grammar: parts of speech",summary:"Identify nouns, verbs, adjectives, adverbs, pronouns and other word classes.",
    learn:["Nouns name people, places, things or ideas. Proper nouns take capitals. Pronouns replace noun phrases. Verbs express actions or states, including 'be', 'seem' and 'have'.", "Adjectives describe nouns; adverbs modify verbs, adjectives or other adverbs. Not every adverb ends in -ly: 'often', 'soon' and 'very' are examples.", "Determiners introduce nouns: a, the, this, some. Prepositions show relationships such as under, beside or during. Conjunctions join words or clauses, such as and, but and because. Classify a word by its job in the sentence."],
    example:["Analyse: 'The curious fox moved silently beneath the fence.'", "'Fox' and 'fence' are nouns; 'curious' is an adjective; 'moved' is a verb; 'silently' is an adverb; 'beneath' is a preposition; 'the' is a determiner."],
    pitfall:"A word can have different classes in different sentences: 'watch' is a noun in 'my watch' but a verb in 'watch the bird'.",
    questions:[
      {q:"Which word is the adverb in 'The small dog barked loudly'?",options:["small","dog","barked","loudly"],answer:3,why:"Loudly describes how the dog barked, modifying the verb."},
      {q:"Which word is a pronoun in 'Aisha said she would return'?",options:["Aisha","said","she","return"],answer:2,why:"She stands in place of Aisha, so it is a pronoun."},
      {q:"What is 'under' in 'The keys are under the mat'?",options:["A noun","A preposition","An adjective","A determiner"],answer:1,why:"Under shows the spatial relationship between the keys and the mat."}
    ]
  },
  {
    id:"sentences",subject:"english",title:"Sentences, clauses & agreement",summary:"Build complete sentences and use clauses, conjunctions and subjects accurately.",
    learn:["A main clause can stand as a complete sentence. A subordinate clause depends on a main clause: 'because it was raining' leaves an idea unfinished.", "A simple sentence has one main clause. A compound sentence joins main clauses, often with and, but or or. A complex sentence includes at least one subordinate clause.", "Match the verb to the subject, not a nearby noun: 'The box of pencils is heavy.' Singular subjects usually take singular verbs. Relative clauses add detail: 'The girl who won smiled.'"],
    example:["Combine 'We stayed inside' and 'The storm grew worse'.", "'We stayed inside because the storm grew worse.' The main clause is 'We stayed inside'; the because-clause explains why. 'Although the storm grew worse, we went outside' changes the relationship."],
    pitfall:"A long sentence is not automatically complex. Avoid comma splices: two main clauses need suitable punctuation or a conjunction.",
    questions:[
      {q:"Which is a complete sentence?",options:["Although the door was open.","Running through the park.","The children waited outside.","Because we were late."],answer:2,why:"'The children waited outside' is a main clause with a subject and finite verb."},
      {q:"Choose the correct verb: 'The basket of apples ___ on the table.'",options:["are","is","were","have"],answer:1,why:"The subject is the singular basket, not the plural apples. Use is."},
      {q:"Which conjunction best expresses contrast: 'It was cold, ___ we enjoyed the walk'?",options:["because","so","but","if"],answer:2,why:"But contrasts the cold weather with the enjoyment."}
    ]
  },
  {
    id:"tenses",subject:"english",title:"Tenses & verb forms",summary:"Keep time consistent; recognise progressive, perfect, active and passive forms.",
    learn:["Simple past describes completed actions: 'I walked'. Present can describe habits: 'I walk daily'. Future can use will: 'I will walk'. Irregular past forms include went, saw and wrote.", "Progressive forms use be + -ing: 'was reading'. Perfect forms use have + past participle: 'has written'. Past perfect can mark an action before another past action: 'had left'.", "Active voice puts the doer as subject: 'Sam opened the gate.' Passive puts the receiver as subject: 'The gate was opened by Sam.' Maintain intended tense unless time changes."],
    example:["Explain 'When Jo arrived, the train had left.'", "'Arrived' is simple past. 'Had left' is past perfect and shows the departure happened before Jo's arrival. 'Was leaving' would instead suggest the departure was in progress."],
    pitfall:"The past participle may differ from simple past: wrote/written, saw/seen. 'Has wrote' is incorrect.",
    questions:[
      {q:"Choose the correct form: 'She has ___ the letter.'",options:["wrote","write","written","writing"],answer:2,why:"Has requires the past participle written to form the present perfect."},
      {q:"Which sentence is passive?",options:["The wind broke the branch.","The branch was broken by the wind.","The branch fell.","The wind was blowing."],answer:1,why:"The branch receives the action; 'was broken' forms the passive."},
      {q:"Which verb form shows an action in progress in the past?",options:["I read every day.","I will read.","I was reading.","I have read."],answer:2,why:"Was + reading is past progressive, describing an ongoing past action."}
    ]
  },
  {
    id:"punctuation",subject:"english",title:"Punctuation",summary:"Use capitals, commas, apostrophes, speech punctuation and stronger separators.",
    learn:["Capitals begin sentences and proper nouns. Full stops end statements; question marks end direct questions. Commas separate list items and can mark introductory or extra information.", "Apostrophes mark missing letters in contractions and possession: 'can't', 'the girl's hat', 'the girls' hats'. 'Its' is possessive; 'it's' means it is or it has.", "Quotation marks enclose direct speech. A colon can introduce an explanation or list after a complete clause; a semicolon can join closely related main clauses. Brackets or dashes can enclose extra information."],
    example:["Punctuate direct speech: Tom said I found it.", "Tom said, \"I found it.\" The comma introduces the speech; the capital begins it; the full stop belongs inside the quotation marks. Single quotation marks are also acceptable in British writing if used consistently."],
    pitfall:"Do not add apostrophes to ordinary plurals. 'The dogs are playful' has no apostrophe; 'the dog's lead' shows one dog's possession.",
    questions:[
      {q:"Which correctly shows a coat belonging to one girl?",options:["the girls coat","the girl's coat","the girls' coat","the girl coat's"],answer:1,why:"Singular possession adds apostrophe + s: girl's. Girls' would indicate more than one girl."},
      {q:"Choose the correct sentence.",options:["Its raining today.","It's raining today.","Its' raining today.","It raining today."],answer:1,why:"It's expands to 'it is'. Its without an apostrophe shows possession."},
      {q:"Which uses a semicolon correctly?",options:["I packed; my bag.","The sun set; the street grew quiet.","Because; we were late.","We bought apples; and."],answer:1,why:"Both sides are complete, closely related main clauses. The other examples split incomplete units."}
    ]
  },
  {
    id:"devices",subject:"english",title:"Literary devices & poetry",summary:"Recognise imagery, sound patterns and the effects of deliberate language choices.",
    learn:["A simile compares using like or as; a metaphor describes one thing as another. Personification gives human or animate qualities to a non-human thing.", "Alliteration repeats initial consonant sounds; onomatopoeia echoes a sound, such as hiss. Repetition can emphasise an idea or create rhythm. Rhyme concerns sounds, not just spelling.", "In poetry, consider the speaker, imagery, lines, stanzas and rhythm. Explain what a device contributes to the mood or meaning; not every poem rhymes and not every comparison is a simile."],
    passage:"The wind whispered through the lane.\nWindows blinked in silver rain.\nMy scarf, a flag, flew wild and free;\nThe night rolled in like a restless sea.",
    example:["Explain 'The wind whispered'.", "Whispered personifies the wind and suggests a soft, secretive sound. The repeated w sound also creates alliteration. 'Like a restless sea' is a simile, making the night seem moving and unsettled."],
    pitfall:"Naming a device is only the first step. Explain its effect in this particular passage rather than saying it 'makes it interesting'.",
    questions:[
      {q:"Which phrase is a metaphor?",options:["'silver rain'","'My scarf, a flag'","'like a restless sea'","'through the lane'"],answer:1,why:"The scarf is described as a flag without like or as, suggesting its fluttering movement."},
      {q:"What device appears in 'Windows blinked'?",options:["Personification","A factual instruction","A simile","A question"],answer:0,why:"Windows are given the animate action of blinking."},
      {q:"Which pair of line-ending words rhymes in this poem?",options:["lane / free","rain / sea","free / sea","wild / rain"],answer:2,why:"Free and sea have matching end sounds. Lane and rain also rhyme, but they are not offered together."}
    ]
  },
  {
    id:"writing",subject:"english",title:"Writing, planning & editing",summary:"Plan purposeful stories and non-fiction, organise paragraphs and improve a draft.",
    learn:["Identify audience, purpose and form before writing. A story needs a setting, a character with a goal, a problem and a satisfying outcome. A letter, report or argument needs a suitable tone and structure.", "Make a brief plan, group related ideas into paragraphs and use specific detail rather than piling up adjectives. Vary sentence length deliberately; show important feelings through actions.", "Edit in layers: meaning and organisation first, then sentence clarity, vocabulary, tense, agreement, punctuation and spelling. Keep time for proofreading. Writing tasks vary: some schools do not assess extended writing."],
    example:["Improve: 'The place was scary. I was scared. I went in.'", "'The door scraped across the floor. I gripped the torch and stepped inside.' Specific sound and action show nervousness without repeating 'scared'. This is one possible revision, not the only good one."],
    pitfall:"Long words and long sentences do not automatically earn quality. Clear meaning, controlled accuracy and relevance matter more.",
    questions:[
      {q:"What is the best first step before writing a persuasive letter?",options:["Add as many adjectives as possible.","Identify the audience and the change you want.","Choose the longest words you know.","Write the conclusion only."],answer:1,why:"Audience and purpose guide the arguments, tone and structure."},
      {q:"When is a new paragraph most useful in a story?",options:["After every word.","Only after exactly five sentences.","When time, place, speaker or focus changes.","Never in a short story."],answer:2,why:"Paragraphs help readers follow meaningful shifts; they are not fixed-length units."},
      {q:"Which revision shows nervousness most effectively?",options:["I was very, very nervous.","I was a nervous person.","My hands trembled as I unfolded the note.","The note was made of paper."],answer:2,why:"The specific physical action gives the reader evidence of the feeling."}
    ]
  }
];
