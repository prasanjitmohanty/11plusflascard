/* Original offline practice, not past-paper copies, predictions or official marking. */
(function () {
  "use strict";

  const teachingNote = "Teaching marks are for self-review, not an official school mark scheme. Tiffin Girls' does not award method marks.";
  const original = q => "Original practice: " + q;
  const visualId = number => "visual-maths-" + String(number).padStart(3, "0");
  const escape = value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const round = value => Number(value.toFixed(3));
  const text = (x, y, value, anchor = "middle", extra = "") => `<text x="${round(x)}" y="${round(y)}" text-anchor="${anchor}" ${extra}>${escape(value)}</text>`;
  const line = (x1, y1, x2, y2, extra = "") => `<line x1="${round(x1)}" y1="${round(y1)}" x2="${round(x2)}" y2="${round(y2)}" stroke="#111" ${extra}/>`;
  const pointsText = points => points.map(([x, y]) => `${round(x)},${round(y)}`).join(" ");
  const polar = (cx, cy, radius, degrees) => [cx + radius * Math.cos(degrees * Math.PI / 180), cy - radius * Math.sin(degrees * Math.PI / 180)];

  function visual(number, title, alt, body, height = 270) {
    const id = visualId(number);
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="${height}" viewBox="0 0 320 ${height}" role="img" aria-labelledby="${id}-title ${id}-desc" style="display:block;max-width:100%;height:auto" font-family="sans-serif" font-size="14" fill="#111" stroke-width="1.5"><title id="${id}-title">${escape(original(title))}</title><desc id="${id}-desc">${escape(alt)}</desc>${text(160, 21, title, "middle", 'font-size="16"')}${body}</svg>`,
      alt
    };
  }

  function barDiagram(number, title, categories, values, maximum, step, unit, xTitle) {
    const left = 52, right = 304, top = 60, bottom = 220;
    const y = value => bottom - value * (bottom - top) / maximum;
    let body = text(left, 44, unit, "start");
    for (let value = 0; value <= maximum; value += step) {
      const position = y(value);
      body += `<g data-tick="y">${line(left, position, right, position, 'stroke-dasharray="2 3"')}${text(left - 9, position + 4, value, "end")}</g>`;
    }
    body += line(left, top, left, bottom) + line(left, bottom, right, bottom);
    categories.forEach((category, index) => {
      const x = left + (index + 0.5) * (right - left) / categories.length;
      const width = Math.min(34, (right - left) / categories.length - 18);
      body += `<g data-bar="${escape(category)}"><rect x="${round(x - width / 2)}" y="${round(y(values[index]))}" width="${round(width)}" height="${round(bottom - y(values[index]))}" fill="#d5d5d5" stroke="#111" stroke-width="1.5"/>${text(x, 242, category)}</g>`;
    });
    body += text(178, 264, xTitle);
    const alt = `${title}. Vertical scale: 0 to ${maximum} ${unit}, with ticks every ${step}. Horizontal categories: ${xTitle}. ` +
      categories.map((category, index) => `${category}: ${values[index]} ${unit}`).join("; ") + ".";
    return visual(number, title, alt, body, 280);
  }

  function lineDiagram(number, title, labels, series, maximum, step, unit, xTitle) {
    const left = 52, right = 298, top = 70, bottom = 210;
    const x = index => left + index * (right - left) / (labels.length - 1);
    const y = value => bottom - value * (bottom - top) / maximum;
    let body = text(left, 58, unit, "start");
    series.forEach((item, index) => {
      const start = index ? 172 : 32;
      body += line(start, 40, start + 24, 40, index ? 'stroke-dasharray="5 3"' : "");
      body += index
        ? `<rect x="${start + 9}" y="37" width="6" height="6" fill="#fff" stroke="#111"/>`
        : `<circle cx="${start + 12}" cy="40" r="3" fill="#111"/>`;
      body += text(start + 32, 44, item.name, "start");
    });
    for (let value = 0; value <= maximum; value += step) {
      body += `<g data-tick="y">${line(left, y(value), right, y(value), 'stroke-dasharray="2 3"')}${text(left - 9, y(value) + 4, value, "end")}</g>`;
    }
    labels.forEach((label, index) => {
      body += `<g data-tick="x">${line(x(index), bottom, x(index), bottom + 5)}${text(x(index), 233, label)}</g>`;
    });
    body += line(left, top, left, bottom) + line(left, bottom, right, bottom);
    series.forEach((item, index) => {
      const points = item.values.map((value, position) => [x(position), y(value)]);
      body += `<g data-series="${escape(item.name)}"><polyline points="${pointsText(points)}" fill="none" stroke="#111" stroke-width="2" ${index ? 'stroke-dasharray="5 3"' : ""}/>`;
      points.forEach(([px, py]) => {
        body += index
          ? `<rect x="${round(px - 3.5)}" y="${round(py - 3.5)}" width="7" height="7" fill="#fff" stroke="#111" stroke-width="1.5"/>`
          : `<circle cx="${round(px)}" cy="${round(py)}" r="3.5" fill="#111"/>`;
      });
      body += "</g>";
    });
    body += text(178, 258, xTitle);
    const alt = `${title}. Horizontal axis: ${xTitle}; marked values ${labels.join(", ")}. Vertical scale: 0 to ${maximum} ${unit}, ticks every ${step}. ` +
      series.map((item, index) => `${item.name} (${index ? "dashed line, square markers" : "solid line, circle markers"}): ` +
        item.values.map((value, position) => `${labels[position]}: ${value} ${unit}`).join("; ")).join(". ") + ". Straight segments join consecutive readings.";
    return visual(number, title, alt, body);
  }

  function pieDiagram(number, title, sectors) {
    const cx = 100, cy = 137, radius = 79;
    const fills = ["#fff", "#d5d5d5", "#999", "#eee"];
    let start = 90, body = "";
    sectors.forEach(([name, angle], index) => {
      const end = start - angle;
      const first = polar(cx, cy, radius, start), last = polar(cx, cy, radius, end);
      const middle = polar(cx, cy, radius * 0.62, start - angle / 2);
      const letter = String.fromCharCode(65 + index);
      body += `<g data-slice="${escape(name)}"><path d="M ${cx} ${cy} L ${round(first[0])} ${round(first[1])} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 1 ${round(last[0])} ${round(last[1])} Z" fill="${fills[index]}" stroke="#111" stroke-width="1.5"/>${text(middle[0], middle[1] + 5, letter, "middle", 'font-size="16"')}</g>`;
      body += `<g data-legend="${escape(name)}">${text(194, 66 + index * 42, `${letter} ${name}`, "start")}${text(194, 83 + index * 42, `${angle} deg`, "start")}</g>`;
      start = end;
    });
    body += text(160, 251, "Sector angles are labelled in degrees.");
    return visual(number, title, `${title}. A whole circle is 360 degrees. ` + sectors.map(([name, angle], index) => `${String.fromCharCode(65 + index)}: ${name}, ${angle} degrees`).join("; ") + ".", body);
  }

  function tableDiagram(number, title, sections, note) {
    const left = 12, width = 296, rowHeight = 28;
    let top = 47, body = "";
    sections.forEach(section => {
      body += text(160, top, section.caption);
      top += 10;
      body += `<g data-table="${escape(section.caption)}">`;
      [section.headers, ...section.rows].forEach((row, rowIndex) => {
        body += `<g data-row="${rowIndex}">`;
        row.forEach((value, column) => {
          const cellWidth = width / row.length;
          const x = left + column * cellWidth, y = top + rowIndex * rowHeight;
          body += `<rect x="${round(x)}" y="${y}" width="${round(cellWidth)}" height="${rowHeight}" fill="${rowIndex ? "#fff" : "#e5e5e5"}" stroke="#111"/>`;
          body += text(x + cellWidth / 2, y + 19, value, "middle", `data-column="${column}"`);
        });
        body += "</g>";
      });
      body += "</g>";
      top += (section.rows.length + 1) * rowHeight + 27;
    });
    const height = Math.max(220, top + 18);
    body += text(160, height - 12, note);
    const alt = title + ". " + sections.map(section => section.caption + "; columns: " + section.headers.join(", ") + ". " +
      section.rows.map(row => row.map((value, index) => `${section.headers[index]}: ${value}`).join(", ")).join("; ")).join(". ") + ". " + note + ".";
    return visual(number, title, alt, body, height);
  }

  function netDiagram(number, cells) {
    const size = 48;
    const columns = Math.max(...cells.map(cell => cell[0])) + 1;
    const rows = Math.max(...cells.map(cell => cell[1])) + 1;
    const left = (320 - columns * size) / 2, top = 45;
    let body = "";
    cells.forEach(([column, row, label]) => {
      const x = left + column * size, y = top + row * size;
      body += `<g data-face="${escape(label)}"><rect x="${x}" y="${y}" width="${size}" height="${size}" fill="#fff" stroke="#111" stroke-width="1.5"/>${text(x + size / 2, y + size / 2 + 6, label, "middle", 'font-size="18"')}</g>`;
    });
    const height = top + rows * size + 38;
    body += text(160, height - 12, "Fold along the shared edges.");
    const alt = "A cube net of six equal squares. Grid columns increase from left to right and rows from top to bottom, both starting at 1. " +
      cells.map(([column, row, label]) => `Face ${label} is in column ${column + 1}, row ${row + 1}`).join("; ") +
      ". Squares one grid step apart horizontally or vertically share a folding edge.";
    return visual(number, "Cube net", alt, body, height);
  }

  function angleMark(cx, cy, radius, start, end, label, labelRadius) {
    const first = polar(cx, cy, radius, start), last = polar(cx, cy, radius, end);
    const middle = polar(cx, cy, labelRadius, (start + end) / 2);
    return `<g data-angle="${escape(label)}"><path d="M ${round(first[0])} ${round(first[1])} A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 0 ${round(last[0])} ${round(last[1])}" fill="none" stroke="#111"/>${text(middle[0], middle[1] + 5, label)}</g>`;
  }

  function equalTick(first, last) {
    const dx = last[0] - first[0], dy = last[1] - first[1], length = Math.hypot(dx, dy);
    const mx = (first[0] + last[0]) / 2, my = (first[1] + last[1]) / 2;
    return line(mx - 5 * dy / length, my + 5 * dx / length, mx + 5 * dy / length, my - 5 * dx / length, 'data-equal="side" stroke-width="2"');
  }

  function gridDiagram(number, title, drawing, alt) {
    const x = value => 160 + value * 24, y = value => 146 - value * 24;
    const gridText = (...args) => `<g stroke="#fff" stroke-width="3" paint-order="stroke">${text(...args)}</g>`;
    let body = "", axisLabels = "";
    for (let value = -4; value <= 4; value += 1) {
      body += line(x(value), y(-4), x(value), y(4), 'stroke-dasharray="1 3" stroke-width="0.7"');
      body += line(x(-4), y(value), x(4), y(value), 'stroke-dasharray="1 3" stroke-width="0.7"');
    }
    body += line(x(-4) - 7, y(0), x(4) + 11, y(0), 'data-axis="x"');
    body += line(x(0), y(-4) + 7, x(0), y(4) - 11, 'data-axis="y"');
    for (const value of [-4, -2, 2, 4]) {
      axisLabels += `<g data-tick="x">${line(x(value), y(0) - 3, x(value), y(0) + 3)}${gridText(x(value), y(0) + 16, value)}</g>`;
      axisLabels += `<g data-tick="y">${line(x(0) - 3, y(value), x(0) + 3, y(value))}${gridText(x(0) - 9, y(value) + 4, value, "end")}</g>`;
    }
    axisLabels += gridText(x(0) - 9, y(0) + 16, "0", "end") + gridText(278, y(0) + 5, "x") + gridText(x(0) + 5, 39, "y");
    (drawing.polygons || []).forEach((shape, index) => {
      body += `<polygon data-shape="${escape(shape.name)}" points="${pointsText(shape.points.map(([px, py]) => [x(px), y(py)]))}" fill="none" stroke="#111" stroke-width="2.5" ${index ? 'stroke-dasharray="6 3"' : ""}/>`;
      if (shape.label) body += gridText(x(shape.label[0]), y(shape.label[1]), shape.name);
    });
    (drawing.routes || []).forEach(route => {
      body += `<polyline data-route="${escape(route.name)}" points="${pointsText(route.points.map(([px, py]) => [x(px), y(py)]))}" fill="none" stroke="#111" stroke-width="2.5"/>`;
    });
    if (drawing.mirror) {
      const { axis, value } = drawing.mirror;
      body += axis === "x"
        ? line(x(value), y(-4), x(value), y(4), 'data-mirror="x" stroke-dasharray="7 4" stroke-width="2.5"')
        : line(x(-4), y(value), x(4), y(value), 'data-mirror="y" stroke-dasharray="7 4" stroke-width="2.5"');
      body += text(160, 262, `Dashed mirror line: ${axis} = ${value}`);
    }
    if (drawing.arrow) {
      const first = [x(drawing.arrow[0][0]), y(drawing.arrow[0][1])];
      const last = [x(drawing.arrow[1][0]), y(drawing.arrow[1][1])];
      const dx = last[0] - first[0], dy = last[1] - first[1], length = Math.hypot(dx, dy);
      const back = [last[0] - dx * 10 / length, last[1] - dy * 10 / length];
      body += line(...first, ...last, 'data-arrow="translation" stroke-dasharray="5 3" stroke-width="2"');
      body += `<polyline points="${pointsText([[back[0] - dy * 4 / length, back[1] + dx * 4 / length], last, [back[0] + dy * 4 / length, back[1] - dx * 4 / length]])}" fill="none" stroke="#111" stroke-width="2"/>`;
    }
    // Draw haloed labels after the shapes so crossing lines cannot obscure digits.
    body += `<g data-label-layer="axes">${axisLabels}</g>`;
    (drawing.points || []).forEach(point => {
      const [name, px, py, dx = 8, dy = -8] = point;
      body += `<g data-point="${escape(name)}"><circle cx="${x(px)}" cy="${y(py)}" r="3.5" fill="#fff" stroke="#111" stroke-width="2"/>${gridText(x(px) + dx, y(py) + dy, name, dx < 0 ? "end" : "start")}</g>`;
    });
    body += text(160, 283, "Grid spacing: 1 unit.");
    return visual(number, title, alt + " Both axes run from -4 to 4; each grid step is 1 unit.", body, 296);
  }

  const strategies = [
    {
      id: "bar-model", title: "Bar model",
      explanation: "Use equal-length boxes for equal amounts. Put comparison amounts outside the boxes, then use a known total or difference to find one box. The worked example is original practice.",
      steps: ["Name what one box stands for.", "Draw every quantity with the same-sized boxes; label any extra amount.", "Match the boxes to a total or difference, removing extras first.", "Find one box, rebuild every requested amount, and check all the conditions."],
      workedExample: {
        q: original("Three identical short ribbons and one long ribbon use 90 cm. The long ribbon is twice as long as a short ribbon. Find both lengths."),
        finalAnswer: "Short ribbon: 18 cm; long ribbon: 36 cm.",
        scheme: ["Draw each short ribbon as [u] and the long ribbon as [u][u].", "The three short ribbons and the long one make five equal boxes, totalling 90 cm.", "One box is 90 / 5 = 18 cm, so a short ribbon is 18 cm and the long ribbon is 36 cm.", "Check the complete collection: 3 x 18 + 36 = 90 cm."]
      }
    },
    {
      id: "work-backwards", title: "Work backwards",
      explanation: "Start at the final state and undo the last change first. Undo adding by subtracting and multiplying by dividing. If a fraction was removed, identify the fraction that remained. The worked example is original practice.",
      steps: ["Write the changes in their original order.", "Begin with the known final amount and reverse the order.", "Undo each change, remembering which whole a fraction or percentage describes.", "Run the result forwards through every original change."],
      workedExample: {
        q: original("One third of a jar's beads is removed, then 8 more beads are removed. There are 20 left. How many were in the jar at first?"),
        finalAnswer: "42 beads.",
        scheme: ["Undo the final removal: 20 + 8 = 28 beads remained after the fraction was removed.", "Removing one third leaves two thirds, so 28 represents two equal parts.", "One third is 14 beads; all three thirds make 42 beads.", "Check forwards: 42 - 14 - 8 = 20 beads."]
      }
    },
    {
      id: "systematic-listing", title: "Systematic listing",
      explanation: "Organise possible cases by one feature, such as the first digit or the number of large coins. Keep the order fixed so you neither miss a case nor count it twice. The worked example is original practice.",
      steps: ["Write the constraints before listing anything.", "Choose one feature to fix and list its possible values in order.", "For each value, list the remaining possibilities and cross out failures.", "Explain why every possible case belongs to one of your groups."],
      workedExample: {
        q: original("Use the digits 1, 2 and 4 once each. List every three-digit even number greater than 200."),
        finalAnswer: "214 and 412.",
        scheme: ["An even number must end in 2 or 4, so make two groups.", "Ending in 2 gives 142 and 412; only 412 is greater than 200.", "Ending in 4 gives 124 and 214; only 214 is greater than 200.", "Thus 214 and 412 are the complete list: both possible even endings and both orders of the other digits were checked."]
      }
    },
    {
      id: "trial-improvement", title: "Trial and improvement",
      explanation: "Try a value that satisfies one condition, calculate its effect on the other condition, and adjust in a useful direction. Record trials so that an improvement is explained, not guessed. The worked example is original practice.",
      steps: ["Choose an unknown with a small sensible range.", "Make each trial obey the easy condition, such as a fixed total number of items.", "Compare the trial's result with the target and decide whether to increase or decrease.", "Check all conditions and explain why no other allowed value can work."],
      workedExample: {
        q: original("Nine tickets cost GBP 30 altogether. Adult tickets cost GBP 5 and child tickets GBP 2. How many of each were bought?"),
        finalAnswer: "4 adult tickets and 5 child tickets.",
        scheme: ["Try 3 adult and 6 child tickets: 3 x 5 + 6 x 2 = GBP 27, which is too low.", "Replacing one child ticket with an adult ticket keeps nine tickets but adds GBP 3.", "Try 4 adult and 5 child tickets: 4 x 5 + 5 x 2 = GBP 30.", "Each further replacement adds GBP 3, so only this trial reaches GBP 30; the counts also total nine."]
      }
    },
    {
      id: "pattern-spotting", title: "Pattern spotting",
      explanation: "Make a small table, look for a repeated change, and explain it using how the objects are built. A short list alone does not prove a rule; the construction must support it. The worked example is original practice.",
      steps: ["Build or record several small cases with their position numbers.", "Look for repeated differences, groups or layers.", "Explain why that change continues under the stated construction.", "Use the rule, then test the answer against a smaller known case and any limit."],
      workedExample: {
        q: original("Matchstick squares form one straight row. Neighbours share exactly one side. How many sticks make 7 squares, and how many squares can be made with 31 sticks used exactly?"),
        finalAnswer: "7 squares need 22 sticks; 31 sticks make 10 squares.",
        scheme: ["Make a table: 1, 2, 3 squares need 4, 7, 10 sticks.", "Each new square shares one existing side, so it adds only three sticks. Start with four and add three for each further square.", "Seven squares need 4 + 6 x 3 = 22 sticks.", "After the first four sticks, 31 - 4 = 27 sticks make nine more squares; 1 + 9 = 10. Check: 4 + 9 x 3 = 31."]
      }
    },
    {
      id: "draw-diagram", title: "Draw a diagram",
      explanation: "Sketch the relationships, not a decorative picture. Label lengths, times, positions or overlaps, and mark what must not be counted twice. The worked example is original practice.",
      steps: ["Choose a useful sketch: a line, grid, rectangle, route or part-whole picture.", "Add every given quantity and label the unknowns.", "Split the picture into simpler parts, or mark shared and overlapping parts.", "Calculate from the labelled picture and check the whole, including units."],
      workedExample: {
        q: original("Rectangles measuring 8 cm by 3 cm and 5 cm by 3 cm are joined along one complete 3 cm side to form a larger rectangle. Find its perimeter."),
        finalAnswer: "32 cm.",
        scheme: ["Draw the two rectangles side by side, with their 3 cm sides touching.", "Label the new long side 8 + 5 = 13 cm and the height 3 cm.", "Cross out the shared internal edge: it is not part of the outside perimeter.", "Trace the outside: 13 + 3 + 13 + 3 = 32 cm. Check by subtracting the two shared 3 cm edges from the separate perimeters."]
      }
    }
  ];

  function written(number, topicId, difficulty, strategyId, q, finalAnswer, scheme, why) {
    return { id: "strategy-maths-" + String(number).padStart(3, "0"), topicId, difficulty, format: "written", strategyId,
      q: original(q), finalAnswer, scheme, maxMarks: scheme.length, why: why + " " + teachingNote };
  }

  const strategyQuestions = [
    written(1, "ratio", "foundation", "bar-model",
      "Asha and Ben have 72 counters between them. Asha has twice as many as Ben. Asha gives Ben enough counters to make their amounts equal. How many did each start with, and how many did Asha give?",
      "Asha: 48 counters; Ben: 24 counters; transfer: 12 counters.",
      ["Draw Ben as one box and Asha as two equal boxes: three boxes total 72 counters.", "One box is 72 / 3 = 24, so Ben starts with 24 and Asha with 48.", "A transfer shrinks their 24-counter difference from both ends; half the difference is 12.", "Check: 48 - 12 = 36 and 24 + 12 = 36, still totalling 72 counters."],
      "A transfer changes both shares, not just the larger one. Matching the two final bars prevents giving away the whole difference."),
    written(2, "fractions", "foundation", "bar-model",
      "Nia spends one quarter of her money on a notebook and GBP 6 on pens. She has half her original money left. Find her starting amount and the notebook's cost.",
      "Starting amount: GBP 24; notebook: GBP 6.",
      ["Draw the original money as four equal boxes; the notebook takes one and the money left takes two.", "The fourth box must be the GBP 6 spent on pens.", "Four boxes total GBP 24; the notebook's one box costs GBP 6.", "Check: GBP 24 - GBP 6 - GBP 6 = GBP 12, exactly half the original amount."],
      "Use fractions of the original amount throughout. The unlabelled gap in the bar identifies the value of one quarter."),
    written(3, "ratio", "stretch", "bar-model",
      "Red and blue tiles are in the ratio 2:3. There are 8 more green tiles than blue tiles. There are 72 tiles altogether. Find the number of each colour.",
      "Red: 16 tiles; blue: 24 tiles; green: 32 tiles.",
      ["Draw red as two boxes, blue as three, and green as three boxes plus an extra 8.", "Remove the extra 8 from 72: eight equal boxes total 64.", "One box is 8 tiles, giving red 16, blue 24 and green 24 + 8 = 32.", "Check: 16 + 24 + 32 = 72; 16:24 simplifies to 2:3 and 32 is 8 more than 24."],
      "The green bar is linked to the blue bar, not to the total. Removing the fixed extra first leaves equal units."),
    written(4, "word-problems", "stretch", "bar-model",
      "Three shelves contain the same number of books at first. Six books move from the top shelf to the middle, then 9 new books go on the bottom shelf. The middle and bottom shelves now hold 61 books together. How many were on each shelf at first, and how many are on each now?",
      "At first: 23 books per shelf; now top: 17, middle: 29, bottom: 32 books.",
      ["Draw a starting box for each shelf; the final middle bar is one box plus 6 and the bottom is one box plus 9.", "Together those two bars are two boxes plus 15, so two boxes total 61 - 15 = 46.", "One starting box is 23 books. The final amounts are 23 - 6 = 17, 23 + 6 = 29 and 23 + 9 = 32.", "Check: 29 + 32 = 61. The whole collection grows from 69 to 78, exactly the nine new books."],
      "Moving books does not add books to the collection. Separate the transfer from the new books in the bars."),
    written(5, "ratio", "challenge", "bar-model",
      "Two tanks hold equal amounts of water. After 18 litres are moved from the first tank to the second, the second holds four times as much as the first. How much did each hold before the move, and how much does each hold afterwards?",
      "Before: 30 litres in each tank; afterwards first: 12 litres, second: 48 litres.",
      ["Draw the final first tank as one box and the second as four equal boxes.", "The transfer creates a difference of 18 + 18 = 36 litres, represented by three boxes.", "One box is 12 litres, so the final tanks hold 12 and 48 litres.", "Undo the transfer: 12 + 18 = 30 and 48 - 18 = 30. Check the conserved total of 60 litres."],
      "The final difference is twice the transferred amount because one tank loses exactly what the other gains."),
    written(6, "fractions", "stretch", "work-backwards",
      "A baker gives away one third of the buns, sells half of the remaining buns, then sets aside 5 buns. There are 19 left. How many buns were baked, and how many were sold?",
      "Baked: 72 buns; sold: 24 buns.",
      ["Undo setting aside five: 19 + 5 = 24 buns remained immediately after selling.", "That was half the amount available for sale, so there were 48 buns after the giveaway.", "The 48 buns are two thirds of the original; one third is 24 and the original is 72.", "The baker sold 48 / 2 = 24. Check forwards: 72 - 24 - 24 - 5 = 19."],
      "The sale fraction uses the amount remaining after the giveaway. Reversing the events keeps these two different wholes separate."),
    written(7, "percentages", "stretch", "work-backwards",
      "A jacket's marked price is reduced by 20%, then GBP 5 delivery is added. The customer pays GBP 41. What was the marked price, and how much was the discount?",
      "Marked price: GBP 45; discount: GBP 9.",
      ["Undo the delivery charge first: the discounted jacket costs GBP 41 - GBP 5 = GBP 36.", "A 20% reduction leaves 80% of the marked price, so 10% is GBP 36 / 8 = GBP 4.50.", "The full marked price is GBP 45 and the 20% discount is GBP 9.", "Check: GBP 45 - GBP 9 + GBP 5 = GBP 41; delivery itself was not discounted."],
      "Undo the last operation first. Dividing the full payment by 80% would incorrectly treat delivery as part of the jacket's price."),
    written(8, "time-money", "stretch", "work-backwards",
      "A train arrives at an observatory at 14:05 after a 35-minute journey. Before boarding, Eli waited at the station for 12 minutes. Before that he walked 8 minutes from a bus stop, after a 27-minute bus journey. There were no other gaps. When did the bus leave, and when did the train leave?",
      "Bus left at 12:43; train left at 13:30.",
      ["Work back 35 minutes from 14:05: the train left at 13:30.", "Undo the 12-minute wait and then the 8-minute walk: Eli reached the station at 13:18 and left the bus at 13:10.", "Undo the 27-minute bus journey: the bus left at 12:43.", "Check forwards: 12:43 + 27 + 8 + 12 + 35 minutes = 14:05, a total of 82 minutes."],
      "A backwards timeline makes waiting time visible. Treat hours as 60 minutes rather than decimal hundreds."),
    written(9, "algebra", "foundation", "work-backwards",
      "A machine triples a number and then subtracts 4. Sam sends a starting number through this same machine twice and gets 65. Find the starting number and the output after the first pass.",
      "Starting number: 9; first output: 23.",
      ["Undo the second pass in reverse order: add 4 to 65, then divide 69 by 3 to get 23.", "Undo the first pass: add 4 to 23, then divide 27 by 3 to get 9.", "The first output is 23, not the starting number.", "Check both passes forwards: 3 x 9 - 4 = 23 and 3 x 23 - 4 = 65."],
      "Reverse the order within each pass as well as reversing the passes. Checking both intermediate and final outputs avoids stopping too soon."),
    written(10, "fractions", "challenge", "work-backwards",
      "Half of the blue beads and one quarter of the gold beads are used in a mosaic. Afterwards there are 18 blue beads and 18 gold beads left. How many of each colour were there originally, and what fraction of all the original beads was used?",
      "Originally blue: 36 beads; gold: 24 beads; fraction used: 2/5.",
      ["The 18 blue beads left are one half, so there were originally 36 blue beads.", "The 18 gold beads left are three quarters; one quarter is 6, so there were originally 24 gold beads.", "There were 60 beads in all and 36 left, so 24 were used; 24/60 simplifies to 2/5.", "Check by colour: 18 blue plus 6 gold were used, agreeing with the total of 24."],
      "Equal remainders do not imply equal starting amounts. Rebuild each colour's original whole before finding the overall fraction."),
    written(11, "factors", "challenge", "systematic-listing",
      "Using the digits 1, 2, 4 and 5 exactly once each, list all four-digit numbers greater than 4000 that are divisible by 4. Explain why the list is complete.",
      "4152, 4512, 5124 and 5412.",
      ["Divisibility by 4 depends on the final two digits. The possible divisible endings are 12, 24 and 52.", "Ending 12 leaves 4 and 5 at the front: 4512 and 5412 both qualify.", "Ending 24 gives 1524 or 5124; only 5124 qualifies. Ending 52 gives 1452 or 4152; only 4152 qualifies.", "Order the four results: 4152, 4512, 5124, 5412. Every eligible ending and every order of its remaining digits has been checked."],
      "Group by the last two digits to apply the divisibility rule before listing. Each number uses four different given digits and exceeds 4000."),
    written(12, "coordinates", "foundation", "systematic-listing",
      "Walk from the south-west corner to the north-east corner of a 2-by-2 square grid using exactly two east steps (E) and two north steps (N). The centre point, reached after one E and one N in either order, is blocked. List every allowed route and state how many there are.",
      "EENN and NNEE; 2 routes.",
      ["List routes in E-first order: EENN, ENEN, ENNE, NEEN, NENE, NNEE.", "Any route whose first two letters are EN or NE reaches the blocked centre.", "Cross out ENEN, ENNE, NEEN and NENE, leaving EENN and NNEE.", "There are two allowed routes. The six listed orders exhaust the ways to place two E steps among four positions."],
      "The obstruction is a visited point, not just a final direction. Checking the first two steps against that point makes the list reliable."),
    written(13, "time-money", "stretch", "systematic-listing",
      "Make GBP 2.20 using only 20p and 50p coins, with at least one coin of each kind. List every possible pair of coin counts and identify the fewest coins needed.",
      "(6 twenty-pence, 2 fifty-pence) or (1 twenty-pence, 4 fifty-pence); fewest: 5 coins.",
      ["Work in pence and list one, two, three or four 50p coins; five would already exceed 220p.", "The remainders are 170p, 120p, 70p and 20p. Only 120p and 20p are divisible by 20p.", "The possible counts are six 20p plus two 50p coins, or one 20p plus four 50p coins.", "These use eight or five coins, so the fewest is five. Check both totals are 220p and both kinds occur."],
      "Fixing the number of larger coins makes a short complete list; the remaining amount must be a positive multiple of 20p."),
    written(14, "area-volume", "stretch", "systematic-listing",
      "A rectangular allotment has whole-number side lengths and an area of 36 square metres. Its perimeter must be at most 30 m. List all possible dimension pairs, ignoring rotations, and identify the least perimeter.",
      "3 m by 12 m, 4 m by 9 m, or 6 m by 6 m; least perimeter: 24 m (6 m by 6 m).",
      ["List factor pairs of 36 without reversing them: 1 and 36, 2 and 18, 3 and 12, 4 and 9, 6 and 6.", "Their perimeters are 74, 40, 30, 26 and 24 metres respectively.", "Keep the last three pairs because a perimeter of exactly 30 m is allowed.", "The 6 m by 6 m square has the least perimeter, 24 m; all three retained areas are 36 square metres."],
      "An area condition gives factor pairs, while the separate perimeter condition filters them. Ignoring rotations avoids duplicate answers."),
    written(15, "word-problems", "stretch", "systematic-listing",
      "Four talks A, B, C and D occupy four consecutive slots. A must come before B, and C must come immediately before D. List every possible order and state how many orders put B last.",
      "ABCD, ACDB and CDAB; 2 orders put B last.",
      ["Keep C and D together in that order as one block, CD.", "Arrange A, B and the CD block, keeping A before B: A-B-CD, A-CD-B, CD-A-B.", "Expand the blocks to ABCD, ACDB and CDAB.", "B is last in ACDB and CDAB, so two orders qualify. The CD block has been placed before, between and after A and B."],
      "Treating an immediate pair as a block prevents accidentally separating it. The block's three positions prove that no valid order is missed."),
    written(16, "time-money", "foundation", "trial-improvement",
      "Eleven hire items are bikes costing GBP 8 each or helmets costing GBP 3 each. The total is GBP 63. How many of each were hired? Give the neighbouring trials with one fewer bike and one more bike, keeping eleven items.",
      "6 bikes and 5 helmets; cheaper trial: 5 bikes and 6 helmets (GBP 58); dearer trial: 7 bikes and 4 helmets (GBP 68).",
      ["Try five bikes and six helmets: GBP 40 + GBP 18 = GBP 58, which is too low.", "Replacing one helmet with one bike adds GBP 5 without changing the item count.", "Try six bikes and five helmets: GBP 48 + GBP 15 = GBP 63.", "The next trial, seven bikes and four helmets, costs GBP 68. Each step adds GBP 5, so only six bikes work."],
      "Every trial must keep eleven items. The fixed GBP 5 change both improves the guess and explains uniqueness."),
    written(17, "area-volume", "stretch", "trial-improvement",
      "A rectangular pond has whole-number side lengths, perimeter 34 m and area 66 square metres. Its length is at least its width. Find its dimensions, showing trials immediately below and above the successful width.",
      "Length: 11 m; width: 6 m. Neighbouring trials: 12 m by 5 m gives 60 square metres; 10 m by 7 m gives 70 square metres.",
      ["Half the perimeter is 17 m, so every trial must have length + width = 17.", "Try width 5 m and length 12 m: area 60 square metres, too small.", "Try width 6 m and length 11 m: area 66 square metres. Width 7 m and length 10 m gives 70 square metres.", "For widths 1 to 8, the areas increase as the sides become more equal; only width 6 works. Check 2 x (11 + 6) = 34 m."],
      "Use the perimeter to choose the other side in each trial. The width cannot exceed 8 whole metres when length is at least width."),
    written(18, "word-problems", "challenge", "trial-improvement",
      "A club needs at least 52 badges and must buy exactly seven packs. Small packs contain 6 badges and cost GBP 4; large packs contain 10 and cost GBP 7. Which combination meets the need for the least cost, how many badges does it give, and what does it cost?",
      "4 small packs and 3 large packs; 54 badges; GBP 37.",
      ["Try two large and five small packs: 20 + 30 = 50 badges, costing GBP 34, so there are too few.", "Exchange one small pack for one large pack: this adds four badges and GBP 3 while keeping seven packs.", "Three large and four small packs give 30 + 24 = 54 badges for GBP 21 + GBP 16 = GBP 37.", "Fewer large packs cannot reach 52 badges; more large packs cost more. The next trial gives 58 badges for GBP 40."],
      "The least-cost trial is the first one to meet the threshold, because every small-to-large exchange increases both quantity and cost."),
    written(19, "algebra", "challenge", "trial-improvement",
      "Mina and Luca have whole-number ages. Luca is five years older than Mina. In three years, the product of their ages will be 84. Find their ages now, using trials that keep the five-year age gap.",
      "Mina: 4 years; Luca: 9 years.",
      ["Try Mina aged 3 now: Luca is 8, so in three years their ages would be 6 and 11, with product 66.", "Try Mina aged 4: Luca is 9; the future ages 7 and 12 have product 84.", "Try Mina aged 5: future ages 8 and 13 have product 104, too large.", "For non-negative whole-number ages the product increases as Mina's trial age increases. Only ages 4 and 9 work, and their gap is five."],
      "Advance both ages by three years, not just one. Keep the age gap fixed in every trial and compare products with the target."),
    written(20, "place-value", "stretch", "trial-improvement",
      "A three-digit number lies between 200 and 400. Its digits total 12 and its tens digit is three times its hundreds digit. Reversing its digits makes a number 198 larger. Find the number and show why the other possible hundreds digit fails.",
      "264; 390 fails because its reversal is 93, which is not 198 more.",
      ["Try hundreds digit 2: the tens digit must be 6, leaving 12 - 2 - 6 = 4 for the units digit.", "The trial 264 reverses to 462; 462 - 264 = 198, so it works.", "Try hundreds digit 3: the tens digit is 9 and the units digit 0, giving 390.", "Reversing 390 gives 093, meaning 93, which is smaller, not 198 larger. Hundreds digits 2 and 3 exhaust the stated range."],
      "Use two conditions to build each trial before checking the reversal. A leading zero in the reversal is not a new hundreds digit."),
    written(21, "sequences", "stretch", "pattern-spotting",
      "An n-by-n square patio is surrounded by a one-tile-wide border. For patio side lengths 1, 2 and 3 tiles, the border uses 8, 12 and 16 tiles. Explain why increasing the side length by one always adds four border tiles, and find the patio side length that uses exactly 52 border tiles.",
      "Patio side: 12 tiles; each increase adds 4 border tiles.",
      ["Count the top and bottom border rows as n + 2 tiles each, then the two side strips between them as n tiles each.", "That is four groups of n plus four corner tiles, so increasing n by one adds four tiles.", "Remove the four corners from 52: the four groups total 48, giving n = 12.", "Check: two rows of 14 and two strips of 12 use 28 + 24 = 52 border tiles."],
      "The border construction proves the pattern; the first three counts alone would not prove what happens next. Corners must be counted only once."),
    written(22, "sequences", "challenge", "pattern-spotting",
      "At a club each member shakes hands with every other member exactly once. Give the handshake counts for 2, 3 and 4 members, then for 8 members. How many members would give exactly 45 handshakes?",
      "For 2, 3 and 4 members: 1, 3 and 6 handshakes; for 8: 28 handshakes; 45 handshakes: 10 members.",
      ["Start with two members: one handshake. A third member adds two, and a fourth adds three, giving 1, 3, 6.", "Each new member shakes hands once with each existing member, so the additions continue 4, 5, 6, 7.", "For eight members the total is 1 + 2 + 3 + 4 + 5 + 6 + 7 = 28.", "Nine members give 36 and ten give 45. Check: ten people each meet nine others, but 10 x 9 counts each handshake twice, so divide by two."],
      "The repeated addition comes from the new member's partners. It avoids counting a handshake once from each person's viewpoint."),
    written(23, "sequences", "foundation", "pattern-spotting",
      "Beads repeat in the order red, blue, blue, green, starting with red. A bracelet uses the first 67 beads of this pattern. How many of each colour are used, and what colour would the 68th bead be?",
      "Red: 17 beads; blue: 34 beads; green: 16 beads; 68th bead: green.",
      ["Group the beads into blocks of four: each block contains one red, two blue and one green.", "Sixteen complete blocks use 64 beads, giving 16 red, 32 blue and 16 green.", "The three extra beads are red, blue, blue, giving totals 17 red, 34 blue and 16 green.", "Check: 17 + 34 + 16 = 67. The next bead completes that block and is green."],
      "Count complete blocks first, then handle the leftover positions in order. Blue occurs twice in every block."),
    written(24, "sequences", "foundation", "pattern-spotting",
      "A counter display has rows containing 1, 2, 3 and so on. Stage 1 has one row with one counter, and each new stage adds the next longer bottom row. How many counters are at stage 9? With 60 counters, what is the largest complete stage and how many counters are spare?",
      "Stage 9: 45 counters; largest complete stage: 10; spare: 5 counters.",
      ["Make totals by adding the new row: stages 1 to 5 use 1, 3, 6, 10 and 15 counters.", "Continue adding 6, 7, 8 and 9 to reach 21, 28, 36 and 45, so stage 9 uses 45.", "Stage 10 uses 45 + 10 = 55; stage 11 would use 55 + 11 = 66, which exceeds 60.", "The largest complete stage is 10, with 60 - 55 = 5 counters spare. Those five cannot fill the next row of eleven."],
      "The stage number gives the length of the new row, not the total number of counters. Test the next stage to prove the largest possible one."),
    written(25, "area-volume", "challenge", "pattern-spotting",
      "A solid cube is built from small cubes and only its outside is painted. Give the numbers of unpainted small cubes for side lengths 3, 4 and 5 small cubes. Find the smallest whole-number side length with at least 100 unpainted cubes, and the number of painted cubes in that solid.",
      "Unpainted for sides 3, 4 and 5: 1, 8 and 27; smallest side: 7 cubes; painted: 218 cubes.",
      ["Remove one outside layer at each end of every dimension. The unpainted core has side length two less than the whole cube.", "Sides 3, 4 and 5 leave cores of side 1, 2 and 3, containing 1, 8 and 27 cubes.", "Side 6 leaves 4 x 4 x 4 = 64 unpainted cubes; side 7 leaves 5 x 5 x 5 = 125, the first count reaching 100.", "The side-7 solid contains 7 x 7 x 7 = 343 cubes. Painted cubes total 343 - 125 = 218; core plus outside returns 343."],
      "The construction explains the cube-number pattern. Count every cube with any paint once by subtracting the unpainted core from the whole."),
    written(26, "area-volume", "stretch", "draw-diagram",
      "A rectangle 12 m wide and 9 m high has a 4 m by 3 m rectangle cut from its top-right corner. Find the area and perimeter of the remaining L-shape, and explain why the cut does not change the perimeter.",
      "Area: 96 square metres; perimeter: 42 m; the removed 4 m and 3 m outer edges are replaced by 4 m and 3 m inner edges.",
      ["Sketch the original rectangle and remove a 4 m horizontal by 3 m vertical corner.", "The remaining area is 12 x 9 - 4 x 3 = 108 - 12 = 96 square metres.", "Trace the L-shape: bottom 12, right 6, inward 4, upward 3, top 8 and left 9 metres; these total 42 m.", "The original perimeter was also 42 m: the lost 4 m and 3 m edges are replaced by equal-length edges inside the notch."],
      "A corner cut reduces area but does not automatically reduce perimeter. Label the short sides as differences before tracing the boundary."),
    written(27, "units", "stretch", "draw-diagram",
      "Iris's model robot starts at the west end of a straight 150 cm track and travels east at 5 cm per minute. Omar's robot starts at the east end two minutes later and travels west at 9 cm per minute. When do they meet, measured from Iris's start, and how far has Iris's robot travelled?",
      "They meet 12 minutes after Iris's start; Iris's robot travels 60 cm.",
      ["Draw the track as a 150 cm line with arrows towards each other. In the first two minutes Iris's robot moves 10 cm.", "Mark the remaining gap as 140 cm. Once both move, the gap shrinks by 5 + 9 = 14 cm each minute.", "Closing 140 cm takes 10 more minutes, so they meet 2 + 10 = 12 minutes after Iris's start.", "Iris's robot travels 5 x 12 = 60 cm; Omar's travels 9 x 10 = 90 cm. Check: 60 + 90 = 150 cm."],
      "Separate the head start from the time both robots move. The line diagram shows why their approach speeds add rather than subtract."),
    written(28, "coordinates", "foundation", "draw-diagram",
      "A(-2, 1), B(4, 1) and C(4, 5) are consecutive vertices of rectangle ABCD. Sketch it and find D, the area, and the coordinates where the diagonals meet.",
      "D = (-2, 5); area = 24 square units; diagonals meet at (1, 3).",
      ["Plot A and B on the horizontal line y = 1, then C directly above B.", "Complete the rectangle with D directly above A and level with C: D = (-2, 5).", "The width is 4 - (-2) = 6 and the height is 5 - 1 = 4, giving area 24 square units.", "The diagonals meet halfway across and halfway up: (-2 + 3, 1 + 2) = (1, 3). Check this is also the midpoint of AC."],
      "The sketch links matching x- and y-coordinates. Include both coordinates for each point and square units for area."),
    written(29, "area-volume", "stretch", "draw-diagram",
      "A 10 m by 8 m lawn is crossed by two straight paths, each 1 m wide. One runs from top to bottom and the other from left to right; they cross at right angles entirely inside the lawn. Find the total path area and the grass area remaining.",
      "Paths: 17 square metres; grass: 63 square metres.",
      ["Draw the lawn with an 8 m by 1 m vertical strip and a 10 m by 1 m horizontal strip.", "Their separate areas are 8 and 10 square metres, but the 1 m by 1 m crossing appears in both.", "Count that crossing only once: the path area is 8 + 10 - 1 = 17 square metres.", "The lawn's area is 80 square metres, leaving 80 - 17 = 63 square metres of grass. Check the two areas sum to 80."],
      "Mark the overlap on the drawing before adding. Adding two strip areas without correcting the crossing would count one square metre twice."),
    written(30, "area-volume", "challenge", "draw-diagram",
      "Four identical rectangular animal pens form a 2-by-2 grid. All outside edges and both complete internal dividers are fenced, with no gates. There is 90 m of fencing. Each small pen is twice as long as it is wide. Find each pen's dimensions, the whole enclosure's dimensions and its total area.",
      "Each pen: 10 m by 5 m; enclosure: 20 m by 10 m; total area: 200 square metres.",
      ["Draw two rows of two pens. There are three complete horizontal fence runs and three complete vertical runs.", "If a small pen has width w and length twice w, the whole enclosure is 4w by 2w.", "The fencing is three lots of 4w plus three lots of 2w: 18 equal width-units total 90 m, so w = 5 m.", "Each pen is 10 m by 5 m; the enclosure is 20 m by 10 m with area 200 square metres. Check fencing: 3 x 20 + 3 x 10 = 90 m."],
      "The internal fences matter, but shared edges must not be counted once for each neighbouring pen. Counting complete runs in a sketch avoids both errors.")
  ];

  function choice(number, topicId, difficulty, q, options, answer, why, picture) {
    return { id: visualId(number), topicId, difficulty, format: "select-one", q: original(q), options, answer, why, visual: picture };
  }

  const visualQuestions = [
    choice(1, "data", "foundation", "How many more seedlings were sold in May and June together than in April and July together?",
      ["10 seedlings", "5 seedlings", "15 seedlings", "20 seedlings", "40 seedlings"], 0,
      "May and June total 15 + 25 = 40 seedlings; April and July total 10 + 20 = 30. The difference is 10 seedlings.",
      barDiagram(1, "Seedlings sold", ["Apr", "May", "Jun", "Jul"], [10, 15, 25, 20], 30, 5, "plants", "Month")),
    choice(2, "data", "foundation", "The library wants at least 90 loans across the four days shown. How many extra loans would bring the total to exactly 90?",
      ["12 loans", "18 loans", "20 loans", "24 loans", "28 loans"], 1,
      "The bars show 16, 24, 20 and 12 loans, totalling 72. Another 90 - 72 = 18 loans reach the target.",
      barDiagram(2, "Library loans", ["Mon", "Tue", "Wed", "Thu"], [16, 24, 20, 12], 28, 4, "loans", "Day")),
    choice(3, "fractions", "stretch", "What fraction of all the club votes was for Code or Music? Give the simplest fraction.",
      ["7/25", "9/25", "16/25", "3/5", "4/5"], 2,
      "Code and Music have 14 + 18 = 32 votes. There are 8 + 14 + 10 + 18 = 50 votes altogether, and 32/50 simplifies to 16/25.",
      barDiagram(3, "Club votes", ["Art", "Code", "Drama", "Music"], [8, 14, 10, 18], 20, 2, "votes", "Club")),
    choice(4, "units", "foundation", "All the material shown is packed into bags holding exactly 5 kg each. How many full bags can be made without leftovers?",
      ["6 bags", "10 bags", "11 bags", "12 bags", "15 bags"], 3,
      "The masses total 18 + 12 + 24 + 6 = 60 kg. Dividing by 5 kg per bag gives 12 bags with nothing left.",
      barDiagram(4, "Class recycling", ["Elm", "Ash", "Oak", "Pine"], [18, 12, 24, 6], 30, 6, "kg", "Class")),
    choice(5, "data", "stretch", "What is the mean rainfall for the five days shown?",
      ["8 mm", "9 mm", "12 mm", "50 mm", "10 mm"], 4,
      "Add the five readings: 4 + 12 + 8 + 16 + 10 = 50 mm. Divide by five days to obtain a mean of 10 mm.",
      barDiagram(5, "Daily rainfall", ["Mon", "Tue", "Wed", "Thu", "Fri"], [4, 12, 8, 16, 10], 18, 2, "mm", "Day")),
    choice(6, "data", "stretch", "Between which pair of consecutive marked times did the water volume increase the most?",
      ["4-6 minutes", "0-2 minutes", "2-4 minutes", "6-8 minutes", "8-10 minutes"], 0,
      "The five increases are 10, 0, 15, 5 and 5 litres. The largest, 15 litres, occurs from 4 to 6 minutes; each interval is two minutes.",
      lineDiagram(6, "Water in a tank", ["0", "2", "4", "6", "8", "10"], [{ name: "Water", values: [5, 15, 15, 30, 35, 40] }], 40, 5, "litres", "Time (minutes)")),
    choice(7, "data", "foundation", "What is the difference between the highest and lowest temperature readings?",
      ["6 degrees C", "10 degrees C", "12 degrees C", "14 degrees C", "18 degrees C"], 1,
      "The highest plotted temperature is 14 degrees C at 12:00 and the lowest is 4 degrees C at 08:00. Their difference is 10 degrees C.",
      lineDiagram(7, "Outdoor temperature", ["08", "10", "12", "14", "16"], [{ name: "Air", values: [4, 8, 14, 10, 6] }], 16, 2, "degrees C", "Time (hour, same day)")),
    choice(8, "data", "stretch", "For how many minutes was the walker stationary? Each straight segment describes the whole interval between its marked times.",
      ["0 minutes", "5 minutes", "10 minutes", "20 minutes", "30 minutes"], 2,
      "The distance stays at 1 km from 10 to 20 minutes, so no distance is covered during that ten-minute interval. All other segments rise.",
      lineDiagram(8, "Distance walked", ["0", "10", "20", "30", "40"], [{ name: "Route", values: [0, 1, 1, 3, 4] }], 5, 1, "km", "Time (minutes)")),
    choice(9, "sequences", "stretch", "If the same increase continues for the next four days after the last reading, how tall will the plant be on day 12?",
      ["20 cm", "24 cm", "26 cm", "28 cm", "32 cm"], 3,
      "Height increases by 4 cm every two days. The last reading is 20 cm on day 8; two more two-day increases give 20 + 8 = 28 cm on day 12.",
      lineDiagram(9, "Plant height", ["0", "2", "4", "6", "8"], [{ name: "Plant", values: [4, 8, 12, 16, 20] }], 24, 4, "cm", "Day")),
    choice(10, "data", "challenge", "On which plotted day has Ada read more than 20 pages and exactly five more pages than Bex?",
      ["Mon", "Tue", "Thu", "Fri", "Wed"], 4,
      "Ada is five pages ahead on Monday (10 versus 5) and Wednesday (35 versus 30). Only Wednesday also satisfies Ada's total being more than 20 pages.",
      lineDiagram(10, "Pages read in total", ["Mon", "Tue", "Wed", "Thu", "Fri"], [{ name: "Ada", values: [10, 20, 35, 45, 60] }, { name: "Bex", values: [5, 25, 30, 50, 60] }], 60, 10, "pages", "Day")),
    choice(11, "data", "stretch", "The chart represents 120 children. How many more walk to school than travel by bus?",
      ["40 children", "20 children", "30 children", "50 children", "60 children"], 0,
      "Walking represents 180/360 of 120, or 60 children. Bus represents 60/360 of 120, or 20. The difference is 40 children.",
      pieDiagram(11, "Travel to school", [["Walk", 180], ["Bike", 90], ["Bus", 60], ["Car", 30]])),
    choice(12, "percentages", "stretch", "A club has a budget of GBP 240. What is the combined budget for Games and Music?",
      ["GBP 48", "GBP 84", "GBP 96", "GBP 120", "GBP 156"], 1,
      "Games and Music span 72 + 54 = 126 degrees out of 360. Their share is 126/360 x GBP 240 = GBP 84.",
      pieDiagram(12, "Club budget", [["Garden", 144], ["Art", 90], ["Games", 72], ["Music", 54]])),
    choice(13, "percentages", "stretch", "What percentage of the mascot votes was for Badger?",
      ["25%", "30%", "35%", "40%", "45%"], 2,
      "Badger's sector is 126 of the 360 degrees. The fraction 126/360 is 0.35, which is 35%. The whole chart represents 100%.",
      pieDiagram(13, "Mascot votes", [["Fox", 108], ["Owl", 72], ["Badger", 126], ["Hare", 54]])),
    choice(14, "time-money", "challenge", "The chart divides one 24-hour day. How many hours longer are Sleep and Free time together than School?",
      ["3 hours", "5 hours", "6 hours", "7 hours", "13 hours"], 3,
      "Sleep and Free total 120 + 75 = 195 degrees. Subtract School's 90 to get 105 degrees; 105/360 of 24 hours is 7 hours.",
      pieDiagram(14, "One day's activities", [["Sleep", 120], ["School", 90], ["Free", 75], ["Other", 75]])),
    choice(15, "ratio", "challenge", "The Abroad sector represents 18 parcels. How many parcels are represented by Local and Regional together?",
      ["24 parcels", "30 parcels", "36 parcels", "48 parcels", "54 parcels"], 4,
      "The 90-degree Abroad sector is one quarter of the total, so there are 72 parcels. Local and Regional make the remaining three quarters: 54 parcels.",
      pieDiagram(15, "Parcel destinations", [["Local", 150], ["Regional", 120], ["Abroad", 90]])),
    choice(16, "time-money", "challenge", "Travel from Grove to the Museum using a train followed by a bus. Allow at least six minutes at Hub between arrival and departure. To reach the Museum by 09:10, what is the latest listed train departure you can use from Grove?",
      ["08:12", "08:26", "08:41", "08:32", "08:48"], 0,
      "The bus at 08:48 arrives at 09:06, but the 08:26 train leaves only four minutes to transfer. The 08:12 train arrives at 08:29, allowing 19 minutes before the 08:48 bus. Later buses arrive too late.",
      tableDiagram(16, "Journey connections", [
        { caption: "Trains", headers: ["Train", "Grove", "Hub"], rows: [["A", "08:12", "08:29"], ["B", "08:26", "08:44"], ["C", "08:41", "08:58"]] },
        { caption: "Buses", headers: ["Bus", "Hub", "Museum"], rows: [["X", "08:32", "08:50"], ["Y", "08:48", "09:06"], ["Z", "09:06", "09:24"]] }
      ], "All times are on the same morning")),
    choice(17, "time-money", "challenge", "You need exactly 28 pencils, using whole boxes from the table. What is the lowest possible cost?",
      ["GBP 7.60", "GBP 8.20", "GBP 8.40", "GBP 9.00", "GBP 9.20"], 1,
      "Try zero, one or two large boxes. Only one large box leaves a multiple of six: 28 - 10 = 18 pencils, requiring three small boxes. The cost is GBP 2.80 + 3 x GBP 1.80 = GBP 8.20.",
      tableDiagram(17, "Pencil boxes", [{ caption: "Whole-box prices", headers: ["Box", "Pencils", "Cost"], rows: [["Small", "6", "GBP 1.80"], ["Large", "10", "GBP 2.80"]] }], "Boxes cannot be split")),
    choice(18, "fractions", "stretch", "A score of 3 or more wins a token. What fraction of the players won a token?",
      ["1/4", "3/10", "1/3", "2/5", "1/2"], 2,
      "Three players scored 3 and one scored 4, so four won a token. There are 1 + 3 + 4 + 3 + 1 = 12 players, giving 4/12 = 1/3.",
      tableDiagram(18, "Target-game scores", [{ caption: "One score per player", headers: ["Score", "Players"], rows: [["0", "1"], ["1", "3"], ["2", "4"], ["3", "3"], ["4", "1"]] }], "Each player appears once")),
    choice(19, "units", "stretch", "The fruit from all three crates is shared equally into six bags. What is the mass of fruit in each bag?",
      ["4 kg", "4.5 kg", "6 kg", "5 kg", "6.5 kg"], 3,
      "Subtract each empty crate: the fruit masses are 9, 12 and 9 kg, totalling 30 kg. Six equal bags each contain 30 / 6 = 5 kg of fruit.",
      tableDiagram(19, "Fruit delivery", [{ caption: "Crate masses", headers: ["Crate", "Empty (kg)", "Full (kg)"], rows: [["A", "2.5", "11.5"], ["B", "3", "15"], ["C", "1.5", "10.5"]] }], "Full mass includes the crate")),
    choice(20, "time-money", "stretch", "From the start of Warm-up to the end of Race, how many minutes pass when no listed session is taking place?",
      ["25 minutes", "30 minutes", "35 minutes", "73 minutes", "40 minutes"], 4,
      "The first gap is 09:50 to 10:05, or 15 minutes. The second is 10:45 to 11:10, or 25 minutes. They total 40 minutes; do not include the active sessions.",
      tableDiagram(20, "Swimming timetable", [{ caption: "Same-day sessions", headers: ["Session", "Starts", "Ends"], rows: [["Warm-up", "09:35", "09:50"], ["Practice", "10:05", "10:45"], ["Race", "11:10", "11:28"]] }], "There are no other sessions")),
    choice(21, "shapes", "foundation", "Fold the net into a cube. If face C is on the bottom, which labelled face is on top?",
      ["E", "A", "B", "D", "F"], 0,
      "The four-square strip wraps around the cube. C and E are two steps apart along that strip and become opposite faces. A and F close the other two sides.",
      netDiagram(21, [[1, 0, "A"], [0, 1, "B"], [1, 1, "C"], [2, 1, "D"], [3, 1, "E"], [1, 2, "F"]])),
    choice(22, "shapes", "stretch", "When this net is folded into a cube, which face is opposite A?",
      ["B", "F", "C", "D", "E"], 1,
      "B, C, D and E form the four-face belt. The flap A closes one end of the belt and F closes the other, so A and F are opposite even though they attach at different places.",
      netDiagram(22, [[0, 0, "A"], [0, 1, "B"], [1, 1, "C"], [2, 1, "D"], [3, 1, "E"], [2, 2, "F"]])),
    choice(23, "shapes", "stretch", "After the net is folded into a cube, which numbered face cannot share an edge with face 4?",
      ["2", "3", "1", "5", "6"], 2,
      "Faces 2, 3, 5 and 6 fold around face 4 and each shares one of its edges. Face 1 closes the cube opposite face 4, so it does not share an edge with 4.",
      netDiagram(23, [[1, 0, "1"], [1, 1, "2"], [0, 2, "3"], [1, 2, "4"], [2, 2, "5"], [1, 3, "6"]])),
    choice(24, "shapes", "challenge", "Fold the cube. Add the numbers on the faces opposite the faces numbered 2 and 4.",
      ["10", "12", "14", "18", "22"], 3,
      "The face opposite 2 is 10; the face opposite 4 is 8. Their numbers add to 18. The central 6 is opposite the far end face 12.",
      netDiagram(24, [[1, 0, "2"], [0, 1, "4"], [1, 1, "6"], [2, 1, "8"], [1, 2, "10"], [1, 3, "12"]])),
    choice(25, "shapes", "challenge", "Fold this net with C as the base. Which pair becomes opposite side walls, rather than a base-and-top pair?",
      ["A and B", "B and D", "D and E", "A and F", "A and D"], 4,
      "Following the folds gives opposite pairs A-D, B-E and C-F. With C as the base, F is the top; A and D are opposite side walls. Every other offered pair shares an edge.",
      netDiagram(25, [[0, 0, "A"], [1, 0, "B"], [1, 1, "C"], [2, 1, "D"], [2, 2, "E"], [3, 2, "F"]]))
  ];

  const straightRay = polar(160, 172, 115, 52);
  visualQuestions.push(choice(26, "angles", "foundation", "Find angle x in the straight-line diagram.",
    ["52 degrees", "62 degrees", "128 degrees", "142 degrees", "232 degrees"], 0,
    "The labelled 128-degree angle and x together make a straight angle of 180 degrees. Subtracting gives x = 52 degrees.",
    visual(26, "Angles on a straight line", "A straight horizontal line passes through O. A ray slopes up and right from O. The angle between the left half-line and the ray is 128 degrees; the angle between the ray and the right half-line is x.",
      line(28, 172, 292, 172, 'data-base="straight"') + line(160, 172, ...straightRay, 'data-ray="sloping"') +
      angleMark(160, 172, 30, 52, 180, "128 deg", 68) + angleMark(160, 172, 42, 0, 52, "x", 70) + text(160, 193, "O"))));

  let aroundBody = "";
  [0, 90, 200, 285].forEach(angle => {
    const end = polar(160, 145, 100, angle);
    aroundBody += line(160, 145, ...end, 'data-ray="around"');
  });
  aroundBody += angleMark(160, 145, 28, 0, 90, "90 deg", 65) + angleMark(160, 145, 35, 90, 200, "110 deg", 65) +
    angleMark(160, 145, 28, 200, 285, "85 deg", 65) + angleMark(160, 145, 35, 285, 360, "x", 65) + text(151, 141, "O");
  visualQuestions.push(choice(27, "angles", "stretch", "The four rays meet at O. What is angle x?",
    ["65 degrees", "75 degrees", "85 degrees", "95 degrees", "105 degrees"], 1,
    "Angles around a point total 360 degrees. The three labelled angles total 90 + 110 + 85 = 285 degrees, leaving 75 degrees.",
    visual(27, "Angles around a point", "Four rays divide a full turn at O into four adjacent angles, labelled 90 degrees, 110 degrees, 85 degrees and x in order.", aroundBody)));

  const apex = [160, 48], halfBase = 170 * Math.tan(23 * Math.PI / 180);
  const triangleLeft = [160 - halfBase, 218], triangleRight = [160 + halfBase, 218];
  visualQuestions.push(choice(28, "angles", "stretch", "The matching ticks mark equal sides. Find angle x.",
    ["23 degrees", "46 degrees", "67 degrees", "92 degrees", "134 degrees"], 2,
    "The equal sloping sides make the two base angles equal. After the 46-degree vertex angle, 134 degrees remain, so each base angle is 67 degrees.",
    visual(28, "An isosceles triangle", "A triangle has a horizontal base and two sloping sides marked with matching single ticks. The angle where the equal sides meet is 46 degrees. The left base angle is labelled x.",
      `<polygon data-triangle="isosceles" points="${pointsText([triangleLeft, triangleRight, apex])}" fill="none" stroke="#111" stroke-width="2"/>` +
      equalTick(apex, triangleLeft) + equalTick(apex, triangleRight) +
      angleMark(...apex, 30, -113, -67, "46 deg", 53) + angleMark(...triangleLeft, 26, 0, 67, "x", 44))));

  const slopeLeft = Math.tan(52 * Math.PI / 180), slopeRight = Math.tan(68 * Math.PI / 180);
  const apexX = (slopeRight * 240 + slopeLeft * 50) / (slopeLeft + slopeRight);
  const exteriorApex = [apexX, 215 - slopeLeft * (apexX - 50)];
  visualQuestions.push(choice(29, "angles", "stretch", "Calculate x, the exterior angle at B.",
    ["60 degrees", "68 degrees", "92 degrees", "112 degrees", "128 degrees"], 3,
    "The third interior angle is 180 - 52 - 60 = 68 degrees. It forms a straight line with x, so x = 180 - 68 = 112 degrees. This also equals 52 + 60.",
    visual(29, "Triangle with an extension", "Triangle ABC has A at the left of a horizontal base, B at the right and C above. AB extends straight past B to the right. Interior angles A and C are 52 and 60 degrees. The exterior angle between BC and the extension at B is x.",
      `<polygon data-triangle="exterior" points="${pointsText([[50, 215], [240, 215], exteriorApex])}" fill="none" stroke="#111" stroke-width="2"/>` +
      line(240, 215, 303, 215, 'data-extension="base"') + text(42, 235, "A") + text(237, 237, "B") + text(exteriorApex[0], exteriorApex[1] - 12, "C") +
      angleMark(50, 215, 25, 0, 52, "52 deg", 48) + angleMark(...exteriorApex, 24, -128, -68, "60 deg", 45) +
      angleMark(240, 215, 26, 0, 112, "x", 45))));

  const crossingTop = [175, 80], crossingBottom = [175 - 110 / Math.tan(68 * Math.PI / 180), 190];
  let parallelBody = line(27, 80, 292, 80, 'data-parallel="upper"') + line(27, 190, 292, 190, 'data-parallel="lower"') +
    line(175 + 55 / Math.tan(68 * Math.PI / 180), 25, 175 - 160 / Math.tan(68 * Math.PI / 180), 240, 'data-transversal="sloping"');
  [80, 190].forEach(y => { parallelBody += `<polyline points="260,${y - 5} 266,${y} 260,${y + 5}" fill="none" stroke="#111" stroke-width="2"/>`; });
  parallelBody += angleMark(...crossingTop, 27, 0, 68, "68 deg", 58) + angleMark(...crossingBottom, 29, 68, 180, "x", 50);
  visualQuestions.push(choice(30, "angles", "challenge", "The two horizontal lines are marked parallel. Find x.",
    ["22 degrees", "56 degrees", "68 degrees", "102 degrees", "112 degrees"], 4,
    "The angle above the lower line and to the right of the transversal corresponds to the labelled 68 degrees. It is adjacent to x on a straight line, so x = 180 - 68 = 112 degrees.",
    visual(30, "Parallel lines", "Two horizontal lines have matching parallel arrows. A transversal rises to the right. The angle above the upper line and right of the transversal is 68 degrees. The angle above the lower line and left of the transversal is x.", parallelBody)));

  visualQuestions.push(
    choice(31, "coordinates", "foundation", "Reflect P in the dashed vertical mirror line. What are the coordinates of P'?",
      ["(4, 1)", "(2, 1)", "(-2, -1)", "(1, 4)", "(0, 1)"], 0,
      "P is at (-2, 1), three units left of the mirror x = 1. Its image is three units to the right at (4, 1); a vertical reflection leaves the y-coordinate unchanged.",
      gridDiagram(31, "Reflect a point", { points: [["P", -2, 1]], mirror: { axis: "x", value: 1 } }, "Point P is at (-2, 1). The dashed vertical mirror line crosses the x-axis at 1.")),
    choice(32, "coordinates", "stretch", "A moves to A' by a translation. Where will vertex C move under the same translation?",
      ["(1, 1)", "(1, 3)", "(-3, 1)", "(3, 1)", "(0, 2)"], 1,
      "A moves from (-3, -1) to (-1, 0), a move of two units right and one up. Apply that to C(-1, 2) to get (1, 3). A translation moves every vertex by the same amounts.",
      gridDiagram(32, "Translate a triangle", { polygons: [{ name: "ABC", points: [[-3, -1], [-1, -1], [-1, 2]] }], points: [["A", -3, -1, -8, 17], ["B", -1, -1, 8, 17], ["C", -1, 2, -8, -8], ["A'", -1, 0, -8, -12]], arrow: [[-3, -1], [-1, 0]] }, "Triangle vertices are A(-3, -1), B(-1, -1), C(-1, 2). A dashed arrow goes from A to A'(-1, 0).")),
    choice(33, "coordinates", "stretch", "Reflect the triangle in the dashed horizontal line. Which coordinates give the image of vertex B?",
      ["(-1, 3)", "(1, -3)", "(1, -1)", "(-1, -1)", "(3, 1)"], 2,
      "B is at (1, 3), two units above the mirror y = 1. Its image is two units below that line at (1, -1); the x-coordinate stays 1.",
      gridDiagram(33, "Reflect a triangle", { polygons: [{ name: "ABC", points: [[-3, 1], [1, 3], [2, 1]] }], points: [["A", -3, 1, -8, -8], ["B", 1, 3], ["C", 2, 1]], mirror: { axis: "y", value: 1 } }, "Triangle vertices are A(-3, 1), B(1, 3), C(2, 1). The dashed horizontal mirror line crosses the y-axis at 1.")),
    choice(34, "coordinates", "stretch", "Triangle S is translated to triangle T. Which translation is used?",
      ["3 right, 4 up", "4 left, 3 up", "4 right, 3 down", "4 right, 3 up", "3 right, 4 down"], 3,
      "For example, the top vertex moves from (-3, 0) to (1, 3), which is four units right and three up. The same movement matches the other two vertices.",
      gridDiagram(34, "Find the translation", { polygons: [{ name: "S", points: [[-4, -2], [-2, -2], [-3, 0]], label: [-3, -1.5] }, { name: "T", points: [[0, 1], [2, 1], [1, 3]], label: [1, 1.5] }] }, "Solid triangle S has vertices (-4, -2), (-2, -2), (-3, 0). Dashed triangle T has vertices (0, 1), (2, 1), (1, 3).")),
    choice(35, "coordinates", "challenge", "P is reflected in the y-axis, then translated one unit down. Where does it finish?",
      ["(3, -3)", "(-3, -1)", "(-2, -2)", "(2, -3)", "(-3, -3)"], 4,
      "P starts at (3, -2). Reflection in the y-axis changes it to (-3, -2). Moving down one unit then gives (-3, -3); do not change x in the second move.",
      gridDiagram(35, "Two transformations", { points: [["P", 3, -2]] }, "Point P is at (3, -2). The labelled horizontal and vertical axes meet at the origin.")),
    choice(36, "coordinates", "foundation", "What is the perimeter of rectangle ABCD, in grid units?",
      ["16 units", "8 units", "15 units", "10 units", "30 units"], 0,
      "The horizontal side is 2 - (-3) = 5 units and the vertical side is 1 - (-2) = 3. The perimeter is 2 x (5 + 3) = 16 units.",
      gridDiagram(36, "Rectangle on a grid", { polygons: [{ name: "ABCD", points: [[-3, -2], [2, -2], [2, 1], [-3, 1]] }], points: [["A", -3, -2, -8, 17], ["B", 2, -2, 8, 17], ["C", 2, 1], ["D", -3, 1, -8, -8]] }, "Rectangle ABCD has vertices A(-3, -2), B(2, -2), C(2, 1), D(-3, 1), joined in that order.")),
    choice(37, "area-volume", "stretch", "What is the area of triangle PQR?",
      ["6 square units", "12 square units", "18 square units", "24 square units", "30 square units"], 1,
      "The base PQ is 4 - (-2) = 6 units long. Its horizontal line is at y = -1, so R at y = 3 is four units above it. Area = 6 x 4 / 2 = 12 square units.",
      gridDiagram(37, "Triangle on a grid", { polygons: [{ name: "PQR", points: [[-2, -1], [4, -1], [1, 3]] }], points: [["P", -2, -1, -8, 17], ["Q", 4, -1, 8, 17], ["R", 1, 3]] }, "Triangle PQR has vertices P(-2, -1), Q(4, -1), R(1, 3).")),
    choice(38, "coordinates", "challenge", "Walk along the solid route P-Q-R-S, then return from S to P by a shortest route using only horizontal and vertical grid lines. What is the total distance?",
      ["11 units", "14 units", "18 units", "20 units", "22 units"], 2,
      "P-Q is 4 units, Q-R is 5 and R-S is 2, totalling 11. Returning from S to P requires two units left and five down, or 7 more. Total distance is 18 units.",
      gridDiagram(38, "A route on a grid", { routes: [{ name: "P-Q-R-S", points: [[-3, -2], [1, -2], [1, 3], [-1, 3]] }], points: [["P", -3, -2, -8, 17], ["Q", 1, -2, 8, 17], ["R", 1, 3], ["S", -1, 3, -8, -8]] }, "The solid route joins P(-3, -2) to Q(1, -2), then R(1, 3), then S(-1, 3), in that order. No return route is drawn.")),
    choice(39, "coordinates", "stretch", "M is the midpoint of AB and N is the midpoint of CD. What is the length MN?",
      ["2 units", "3 units", "6 units", "4 units", "8 units"], 3,
      "The midpoint of A(-3, 2) and B(3, 2) is M(0, 2). The midpoint of C(1, -2) and D(-1, -2) is N(0, -2). They are on the same vertical line, four units apart.",
      gridDiagram(39, "Midpoints", { routes: [{ name: "AB", points: [[-3, 2], [3, 2]] }, { name: "CD", points: [[1, -2], [-1, -2]] }], points: [["A", -3, 2, -8, -8], ["B", 3, 2], ["C", 1, -2, 8, 17], ["D", -1, -2, -8, 17]] }, "Segment AB joins A(-3, 2) to B(3, 2). Segment CD joins C(1, -2) to D(-1, -2). M and N have not been plotted.")),
    choice(40, "coordinates", "challenge", "A fourth point D completes rectangle ABCD in that order. What are D's coordinates and the rectangle's area?",
      ["(-3, 3); 12 square units", "(3, -3); 24 square units", "(-3, -1); 24 square units", "(-3, 3); 20 square units", "(-3, 3); 24 square units"], 4,
      "A and D share x = -3; C and D share y = 3, so D = (-3, 3). The width is 6 units and height 4, giving area 24 square units. Both the point and the area must match.",
      gridDiagram(40, "Complete the rectangle", { routes: [{ name: "A-B-C", points: [[-3, -1], [3, -1], [3, 3]] }], points: [["A", -3, -1, -8, 17], ["B", 3, -1, 8, 17], ["C", 3, 3]] }, "The drawn sides join A(-3, -1) to B(3, -1) and then to C(3, 3). The fourth vertex and remaining two sides have not been drawn."))
  );

  window.BRIGHTLANE_MATHS_LAB = { strategies, visualQuestions, strategyQuestions };
})();
