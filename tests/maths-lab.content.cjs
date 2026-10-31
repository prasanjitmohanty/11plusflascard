const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { isDeepStrictEqual } = require("node:util");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "maths-lab.js"), "utf8");
const sandbox = { window: {} };
vm.runInNewContext(source, sandbox, { timeout: 1000, filename: "maths-lab.js" });
assert.deepEqual(Object.keys(sandbox), ["window"], "The classic script does not leak helper globals");
assert.deepEqual(Object.keys(sandbox.window), ["BRIGHTLANE_MATHS_LAB"]);
const bank = JSON.parse(JSON.stringify(sandbox.window.BRIGHTLANE_MATHS_LAB));
assert.deepEqual(Object.keys(bank).sort(), ["strategies", "strategyQuestions", "visualQuestions"]);
assert.doesNotMatch(source, /\b(?:fetch|require|eval|setTimeout|setInterval)\s*\(|XMLHttpRequest|WebSocket|localStorage|import\s*\(/, "No runtime services or packages");

const topicContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, "topics.js"), "utf8"), topicContext, { timeout: 1000 });
const mathsTopics = new Set(topicContext.window.BRIGHTLANE_TOPICS.filter(topic => topic.subject === "maths").map(topic => topic.id));
const levels = new Set(["foundation", "stretch", "challenge"]);
const strategyIds = ["bar-model", "work-backwards", "systematic-listing", "trial-improvement", "pattern-spotting", "draw-diagram"];
assert.equal(bank.strategies.length, 6);
assert.equal(bank.strategyQuestions.length, 30);
assert.equal(bank.visualQuestions.length, 40);
assert.deepEqual(bank.strategies.map(item => item.id), strategyIds);
const expectedIds = (prefix, count) => Array.from({ length: count }, (_, index) => prefix + String(index + 1).padStart(3, "0"));
assert.deepEqual(bank.strategyQuestions.map(item => item.id), expectedIds("strategy-maths-", 30));
assert.deepEqual(bank.visualQuestions.map(item => item.id), expectedIds("visual-maths-", 40));
const allRecords = [...bank.strategies, ...bank.strategyQuestions, ...bank.visualQuestions];
assert.equal(new Set(allRecords.map(item => item.id)).size, allRecords.length);
const stems = [...bank.strategyQuestions, ...bank.visualQuestions, ...bank.strategies.map(item => item.workedExample)]
  .map(item => item.q.trim().replace(/\s+/g, " ").toLowerCase());
assert.equal(new Set(stems).size, 76, "All question and worked-example stems are distinct");

function completeScheme(item, label) {
  assert.ok(Array.isArray(item.scheme) && item.scheme.length >= 3, label + ": a multi-step method");
  assert.ok(item.scheme.every(step => typeof step === "string" && step.length >= 30), label + ": complete teaching steps");
  assert.equal(new Set(item.scheme).size, item.scheme.length, label + ": no repeated padding steps");
  assert.ok(typeof item.finalAnswer === "string" && item.finalAnswer.length > 4, label + ": a complete final answer");
  assert.ok(item.q.startsWith("Original practice: "), label + ": labelled as original practice");
}

for (const strategy of bank.strategies) {
  assert.ok(strategy.title.length > 5 && strategy.explanation.length >= 100);
  assert.ok(strategy.steps.length >= 4 && strategy.steps.every(step => step.length >= 25));
  assert.match(strategy.explanation, /original practice/);
  completeScheme(strategy.workedExample, strategy.id);
  assert.equal(bank.strategyQuestions.filter(item => item.strategyId === strategy.id).length, 5);
}
for (const item of [...bank.strategyQuestions, ...bank.visualQuestions]) {
  assert.ok(mathsTopics.has(item.topicId), item.id + ": existing Maths topic");
  assert.ok(levels.has(item.difficulty), item.id + ": supported difficulty");
  assert.ok(item.q.startsWith("Original practice: ") && item.q.length >= 45);
  assert.ok(typeof item.why === "string" && item.why.length >= 70);
}
for (const item of bank.strategyQuestions) {
  assert.equal(item.format, "written");
  assert.ok(strategyIds.includes(item.strategyId));
  completeScheme(item, item.id);
  assert.ok(Number.isInteger(item.maxMarks) && item.maxMarks > 0);
  assert.equal(item.maxMarks, item.scheme.length);
  assert.match(item.why, /Teaching marks.*not an official school mark scheme/);
  assert.match(item.why, /Tiffin Girls' does not award method marks/);
}
for (const collection of [bank.visualQuestions, bank.strategyQuestions]) {
  assert.deepEqual([...new Set(collection.map(item => item.difficulty))].sort(), [...levels].sort());
}
assert.deepEqual(bank.visualQuestions.reduce((counts, item) => {
  assert.equal(item.format, "select-one");
  assert.ok(Number.isInteger(item.answer) && item.answer >= 0 && item.answer < 5);
  assert.equal(item.options.length, 5);
  assert.ok(item.options.every(option => typeof option === "string" && option.length > 0));
  assert.equal(new Set(item.options.map(option => option.trim().toLowerCase())).size, 5);
  counts[item.answer] += 1;
  return counts;
}, [0, 0, 0, 0, 0]), [8, 8, 8, 8, 8], "Correct positions are evenly balanced across A-E");

const close = (actual, expected, message, tolerance = 0.003) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message}: ${actual} != ${expected}`);
const sum = values => values.reduce((total, value) => total + value, 0);
const range = (first, last) => Array.from({ length: last - first + 1 }, (_, index) => first + index);
const gcd = (a, b) => b ? gcd(b, a % b) : a;
const fraction = (numerator, denominator) => {
  assert.ok(Number.isInteger(numerator) && Number.isInteger(denominator) && denominator > 0);
  const divisor = gcd(numerator, denominator);
  return [numerator / divisor, denominator / divisor];
};
const fractionText = (a, b) => fraction(a, b).join("/");
const coordinate = point => "(" + point.join(", ") + ")";
const englishList = values => values.length < 2 ? values.join("") : values.slice(0, -1).join(", ") + " and " + values.at(-1);
const permutations = values => values.length ? values.flatMap((value, index) =>
  permutations(values.filter((_, position) => position !== index)).map(rest => [value, ...rest])) : [[]];
const minutes = value => {
  assert.match(value, /^\d{2}:\d{2}$/);
  const [hours, mins] = value.split(":").map(Number);
  assert.ok(hours < 24 && mins < 60);
  return hours * 60 + mins;
};
const clock = value => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
const pounds = value => {
  assert.match(value, /^GBP \d+(?:\.\d{2})?$/);
  return Math.round(Number(value.slice(4)) * 100);
};
const withUnit = unit => value => {
  const match = value.match(/^(-?\d+(?:\.\d+)?) (.+)$/);
  assert.ok(match, "A numeric option with a unit: " + value);
  assert.equal(match[2], unit, "Consistent units in every distractor");
  return Number(match[1]);
};
const parseFraction = value => {
  assert.match(value, /^\d+\/[1-9]\d*$/);
  return fraction(...value.split("/").map(Number));
};
const parseCoordinate = value => {
  const match = value.match(/^\((-?\d+), (-?\d+)\)$/);
  assert.ok(match, "Complete coordinate option: " + value);
  return match.slice(1).map(Number);
};

// Parse the intentionally small SVG subset without installing an XML package.
// The browser harness additionally exercises Chromium's real XML/SVG parser.
const allowedTags = new Set(["svg", "title", "desc", "g", "line", "rect", "circle", "text", "polyline", "polygon", "path"]);
const allowedAttributes = new Set(["xmlns", "width", "height", "viewBox", "role", "aria-labelledby", "style", "font-family", "font-size",
  "fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-linecap", "paint-order", "text-anchor", "id", "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "points", "d"]);
function decode(value) {
  assert.doesNotMatch(value, /&(?!(?:amp|lt|gt|quot);)/, "Only known XML entities");
  return value.replace(/&(amp|lt|gt|quot);/g, (_, entity) => ({ amp: "&", lt: "<", gt: ">", quot: '"' })[entity]);
}
function parseSvg(svg) {
  const document = { tag: "document", attrs: {}, children: [] }, stack = [document];
  for (const token of svg.match(/<[^>]*>|[^<]+/g) || []) {
    if (!token.startsWith("<")) {
      stack.at(-1).children.push(decode(token));
      continue;
    }
    if (token.startsWith("</")) {
      const end = token.match(/^<\/([a-z]+)>$/i);
      assert.ok(end && stack.length > 1, "Valid SVG close tag");
      assert.equal(stack.pop().tag, end[1], "Properly nested SVG");
      continue;
    }
    const start = token.match(/^<([a-z]+)([\s\S]*?)(\/?)>$/i);
    assert.ok(start && allowedTags.has(start[1]), "Safe supported SVG element: " + token);
    const node = { tag: start[1], attrs: {}, children: [] };
    let remaining = start[2];
    while (remaining.trim()) {
      const attribute = remaining.match(/^\s+([a-zA-Z_:][\w:.-]*)="([^"]*)"/);
      assert.ok(attribute, "Quoted well-formed SVG attributes: " + remaining);
      const [, name, value] = attribute;
      assert.ok(allowedAttributes.has(name) || /^data-[a-z-]+$/.test(name), "Safe SVG attribute: " + name);
      assert.ok(!Object.hasOwn(node.attrs, name), "No duplicate SVG attribute: " + name);
      node.attrs[name] = decode(value);
      remaining = remaining.slice(attribute[0].length);
    }
    stack.at(-1).children.push(node);
    if (!start[3]) stack.push(node);
  }
  assert.equal(stack.length, 1, "Every SVG element is closed");
  assert.equal(document.children.length, 1);
  assert.equal(document.children[0].tag, "svg");
  return document.children[0];
}
function nodes(node, predicate) {
  return (predicate(node) ? [node] : []).concat(node.children.filter(child => typeof child !== "string").flatMap(child => nodes(child, predicate)));
}
const tagged = (node, tag) => nodes(node, child => child.tag === tag);
const marked = (node, attribute, value) => nodes(node, child => child.attrs[attribute] !== undefined && (value === undefined || child.attrs[attribute] === value));
const textContent = node => node.children.map(child => typeof child === "string" ? child : textContent(child)).join("");
function one(values, label) {
  assert.equal(values.length, 1, label + ": exactly one");
  return values[0];
}
const numberAttr = (node, name) => {
  assert.ok(Object.hasOwn(node.attrs, name));
  assert.match(node.attrs[name], /^-?\d+(?:\.\d+)?$/);
  return Number(node.attrs[name]);
};
const readPoints = node => node.attrs.points.trim().split(/\s+/).map(value => {
  assert.match(value, /^-?\d+(?:\.\d+)?,-?\d+(?:\.\d+)?$/);
  return value.split(",").map(Number);
});
const figures = bank.visualQuestions.map(item => parseSvg(item.visual.svg));
const allSvgIds = new Set();
figures.forEach((figure, index) => {
  const item = bank.visualQuestions[index], id = item.id;
  assert.equal(figure.attrs.xmlns, "http://www.w3.org/2000/svg");
  assert.equal(figure.attrs.role, "img");
  assert.equal(figure.attrs.style, "display:block;max-width:100%;height:auto");
  const bounds = figure.attrs.viewBox.split(" ").map(Number);
  assert.deepEqual(bounds.slice(0, 3), [0, 0, 320]);
  assert.ok(bounds[3] >= 200 && bounds[3] <= 400, id + ": mobile-sized viewBox");
  assert.equal(numberAttr(figure, "height"), bounds[3]);
  assert.equal(numberAttr(figure, "width"), bounds[2]);
  assert.equal(figure.attrs["aria-labelledby"], id + "-title " + id + "-desc");
  const title = one(tagged(figure, "title"), id + " accessible title");
  const desc = one(tagged(figure, "desc"), id + " accessible description");
  assert.equal(title.attrs.id, id + "-title");
  assert.equal(desc.attrs.id, id + "-desc");
  assert.ok(textContent(title).startsWith("Original practice: "));
  assert.equal(textContent(desc), item.visual.alt);
  assert.ok(item.visual.alt.length >= 80, id + ": equivalent diagram data");
  assert.ok(tagged(figure, "text").length >= 3, id + ": useful visible labels");
  for (const node of nodes(figure, () => true)) {
    for (const [name, value] of Object.entries(node.attrs)) {
      assert.doesNotMatch(name, /^on/i);
      assert.doesNotMatch(value, /javascript:|data:|url\s*\(|<|>/i);
      if (name !== "xmlns") assert.doesNotMatch(value, /https?:|file:/i);
      if (name === "id") {
        assert.ok(!allSvgIds.has(value), "Globally unique SVG ID " + value);
        allSvgIds.add(value);
      }
    }
    const inside = (x, y) => {
      assert.ok(x >= -0.01 && x <= bounds[2] + 0.01, `${id}: x=${x} inside the viewBox`);
      assert.ok(y >= -0.01 && y <= bounds[3] + 0.01, `${id}: y=${y} inside the viewBox`);
    };
    if (node.tag === "line") {
      inside(numberAttr(node, "x1"), numberAttr(node, "y1"));
      inside(numberAttr(node, "x2"), numberAttr(node, "y2"));
    } else if (node.tag === "rect") {
      assert.ok(numberAttr(node, "width") > 0 && numberAttr(node, "height") >= 0);
      inside(numberAttr(node, "x"), numberAttr(node, "y"));
      inside(numberAttr(node, "x") + numberAttr(node, "width"), numberAttr(node, "y") + numberAttr(node, "height"));
    } else if (node.tag === "circle") {
      const r = numberAttr(node, "r");
      assert.ok(r > 0);
      inside(numberAttr(node, "cx") - r, numberAttr(node, "cy") - r);
      inside(numberAttr(node, "cx") + r, numberAttr(node, "cy") + r);
    } else if (node.tag === "text") {
      inside(numberAttr(node, "x"), numberAttr(node, "y"));
      assert.ok(textContent(node).length > 0);
    } else if (node.tag === "polyline" || node.tag === "polygon") {
      for (const point of readPoints(node)) inside(...point);
    }
  }
});
assert.equal(allSvgIds.size, 80);

function scale(figure, axis) {
  const ticks = marked(figure, "data-tick", axis).map(group => {
    const stroke = one(tagged(group, "line"), "Tick line");
    const value = Number(textContent(one(tagged(group, "text"), "Tick label")));
    assert.ok(Number.isFinite(value));
    return { value, position: numberAttr(stroke, axis === "x" ? "x1" : "y1") };
  }).sort((a, b) => a.value - b.value);
  assert.ok(ticks.length >= 2);
  assert.equal(new Set(ticks.map(tick => tick.value)).size, ticks.length);
  const first = ticks[0], last = ticks.at(-1);
  const unit = (last.position - first.position) / (last.value - first.value);
  assert.ok(axis === "x" ? unit > 0 : unit < 0, "Axis direction agrees with its labels");
  for (const tick of ticks) close(tick.position, first.position + (tick.value - first.value) * unit, "Linear labelled tick scale");
  return {
    ticks,
    at: value => first.position + (value - first.value) * unit,
    read: position => {
      const value = first.value + (position - first.position) / unit;
      const integer = Math.round(value);
      close(value, integer, "Plotted value is precisely on the stated integer scale", 0.001);
      return integer;
    }
  };
}
function bars(number) {
  const figure = figures[number - 1], y = scale(figure, "y"), result = {};
  for (const group of marked(figure, "data-bar")) {
    const rect = one(tagged(group, "rect"), "Bar rectangle");
    const name = textContent(one(tagged(group, "text"), "Bar category"));
    assert.equal(name, group.attrs["data-bar"]);
    close(numberAttr(rect, "y") + numberAttr(rect, "height"), y.at(0), "Bar begins at zero, not a cropped baseline");
    result[name] = y.read(numberAttr(rect, "y"));
    assert.ok(bank.visualQuestions[number - 1].visual.alt.includes(`${name}: ${result[name]} `), "Alt text agrees with actual bar geometry");
  }
  return result;
}
function lines(number) {
  const figure = figures[number - 1], y = scale(figure, "y");
  const xTicks = marked(figure, "data-tick", "x").map(group => ({
    label: textContent(one(tagged(group, "text"), "Line chart x label")),
    position: numberAttr(one(tagged(group, "line"), "Line chart tick"), "x1")
  }));
  const series = {};
  marked(figure, "data-series").forEach((group, index) => {
    const polyline = one(tagged(group, "polyline"), "Line series");
    const points = readPoints(polyline);
    assert.equal(points.length, xTicks.length);
    const markers = tagged(group, index ? "rect" : "circle");
    assert.equal(markers.length, points.length);
    series[group.attrs["data-series"]] = points.map(([x, py], position) => {
      close(x, xTicks[position].position, "Plotted reading matches its time/category");
      const markerX = index ? numberAttr(markers[position], "x") + numberAttr(markers[position], "width") / 2 : numberAttr(markers[position], "cx");
      const markerY = index ? numberAttr(markers[position], "y") + numberAttr(markers[position], "height") / 2 : numberAttr(markers[position], "cy");
      close(markerX, x, "Marker lies on the data line");
      close(markerY, py, "Marker lies on the data line");
      const value = y.read(py);
      assert.ok(bank.visualQuestions[number - 1].visual.alt.includes(`${xTicks[position].label}: ${value} `));
      return value;
    });
    if (index) assert.equal(polyline.attrs["stroke-dasharray"], "5 3", "The second series is distinguishable in black and white");
  });
  return { labels: xTicks.map(tick => tick.label), series };
}
function pies(number) {
  const figure = figures[number - 1], angles = {};
  let firstStart, previousEnd, commonCentre;
  marked(figure, "data-slice").forEach((group, index) => {
    const sector = one(tagged(group, "path"), "Pie sector");
    assert.match(sector.attrs.d, /^M [-\d.]+ [-\d.]+ L [-\d.]+ [-\d.]+ A [-\d.]+ [-\d.]+ 0 [01] 1 [-\d.]+ [-\d.]+ Z$/);
    const [cx, cy, sx, sy, rx, ry, rotation, large, sweep, ex, ey] = sector.attrs.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
    assert.equal(rx, ry); assert.equal(rotation, 0); assert.equal(sweep, 1);
    if (!commonCentre) commonCentre = [cx, cy];
    assert.deepEqual([cx, cy], commonCentre);
    close(Math.hypot(sx - cx, sy - cy), rx, "Sector starts on the circle");
    close(Math.hypot(ex - cx, ey - cy), rx, "Sector ends on the circle");
    if (!firstStart) firstStart = [sx, sy];
    if (previousEnd) { close(sx, previousEnd[0], "No gap between sectors"); close(sy, previousEnd[1], "No gap between sectors"); }
    previousEnd = [ex, ey];
    const measured = ((Math.atan2(ey - cy, ex - cx) - Math.atan2(sy - cy, sx - cx)) * 180 / Math.PI + 360) % 360;
    const legend = one(marked(figure, "data-legend", group.attrs["data-slice"]), "Matching pie legend");
    const labels = tagged(legend, "text").map(textContent);
    assert.equal(labels[0], String.fromCharCode(65 + index) + " " + group.attrs["data-slice"]);
    assert.equal(textContent(one(tagged(group, "text"), "Sector letter")), String.fromCharCode(65 + index));
    assert.match(labels[1], /^\d+ deg$/);
    const stated = Number(labels[1].split(" ")[0]);
    close(measured, stated, "Actual pie arc equals its printed angle", 0.002);
    assert.equal(large, stated > 180 ? 1 : 0);
    angles[group.attrs["data-slice"]] = stated;
    assert.ok(bank.visualQuestions[number - 1].visual.alt.includes(`${group.attrs["data-slice"]}, ${stated} degrees`));
  });
  close(previousEnd[0], firstStart[0], "Pie closes without a missing wedge");
  close(previousEnd[1], firstStart[1], "Pie closes without a missing wedge");
  assert.equal(sum(Object.values(angles)), 360);
  return angles;
}
function tables(number) {
  return marked(figures[number - 1], "data-table").map(table => {
    const rows = marked(table, "data-row").map((row, index) => {
      assert.equal(Number(row.attrs["data-row"]), index);
      const labels = tagged(row, "text");
      assert.deepEqual(labels.map(node => Number(node.attrs["data-column"])), range(0, labels.length - 1));
      return labels.map(textContent);
    });
    rows.slice(1).forEach(row => row.forEach((value, column) => {
      assert.ok(bank.visualQuestions[number - 1].visual.alt.includes(`${rows[0][column]}: ${value}`));
    }));
    return rows;
  });
}

// Rotate a local right/down/normal frame by 90 degrees at each shared edge.
// Distinct normals plus the 8 vertices / 12 twice-shared edges verify a closed cube.
function foldNet(number) {
  const faces = marked(figures[number - 1], "data-face").map(group => {
    const rect = one(tagged(group, "rect"), "Net square");
    const size = numberAttr(rect, "width");
    assert.equal(size, numberAttr(rect, "height"));
    const label = textContent(one(tagged(group, "text"), "Visible face label"));
    assert.equal(label, group.attrs["data-face"]);
    return { label, x: numberAttr(rect, "x"), y: numberAttr(rect, "y"), size };
  });
  assert.equal(faces.length, 6);
  assert.equal(new Set(faces.map(face => face.label)).size, 6);
  assert.equal(new Set(faces.map(face => face.size)).size, 1);
  const left = Math.min(...faces.map(face => face.x)), top = Math.min(...faces.map(face => face.y));
  const cells = faces.map(face => [face.x, face.y]);
  const negate = vector => vector.map(value => -value);
  const frames = new Map([[0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]]]);
  const queue = [0];
  while (queue.length) {
    const index = queue.shift(), [r, d, n] = frames.get(index), face = faces[index];
    for (const [dx, dy, frame] of [[1, 0, [negate(n), d, r]], [-1, 0, [n, d, negate(r)]], [0, 1, [r, negate(n), d]], [0, -1, [r, n, negate(d)]]]) {
      const neighbour = cells.findIndex(([x, y]) => x === face.x + dx * face.size && y === face.y + dy * face.size);
      if (neighbour < 0) continue;
      if (frames.has(neighbour)) {
        frames.get(neighbour).forEach((vector, axis) => vector.forEach((value, component) => close(value, frame[axis][component], "Consistent fold at shared edge")));
      } else {
        frames.set(neighbour, frame);
        queue.push(neighbour);
      }
    }
  }
  assert.equal(frames.size, 6, "The net is connected");
  const normals = faces.map((_, index) => frames.get(index)[2]);
  assert.equal(new Set(normals.map(vector => vector.join(","))).size, 6, "No folded faces overlap");
  const vertices = new Set(), edges = new Map();
  faces.forEach((face, index) => {
    const [r, d, n] = frames.get(index);
    const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => n.map((value, axis) => value + u * r[axis] + v * d[axis]).join(","));
    corners.forEach(corner => vertices.add(corner));
    corners.forEach((corner, position) => {
      const edge = [corner, corners[(position + 1) % 4]].sort().join("|");
      edges.set(edge, (edges.get(edge) || 0) + 1);
    });
    const column = (face.x - left) / face.size + 1, row = (face.y - top) / face.size + 1;
    assert.ok(Number.isInteger(column) && Number.isInteger(row));
    assert.ok(bank.visualQuestions[number - 1].visual.alt.includes(`Face ${face.label} is in column ${column}, row ${row}`));
  });
  assert.equal(vertices.size, 8);
  assert.equal(edges.size, 12);
  assert.ok([...edges.values()].every(count => count === 2), "Each cube edge belongs to two faces");
  return {
    labels: faces.map(face => face.label),
    opposite: label => {
      const index = faces.findIndex(face => face.label === label);
      assert.ok(index >= 0);
      return faces[one(normals.map((vector, position) => ({ vector, position })).filter(({ vector }) =>
        vector.every((value, axis) => value === -normals[index][axis])), "Opposite face").position].label;
    }
  };
}
function arcSpan(figure, label, centre) {
  const group = one(marked(figure, "data-angle", label), "Labelled angle");
  assert.equal(textContent(one(tagged(group, "text"), "Visible angle label")), label);
  const d = one(tagged(group, "path"), "Angle arc").attrs.d;
  assert.match(d, /^M [-\d.]+ [-\d.]+ A [-\d.]+ [-\d.]+ 0 [01] 0 [-\d.]+ [-\d.]+$/);
  const [sx, sy, rx, ry, rotation, large, sweep, ex, ey] = d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert.equal(rx, ry); assert.equal(rotation, 0); assert.equal(sweep, 0);
  close(Math.hypot(sx - centre[0], sy - centre[1]), rx, "Angle arc is centred on the vertex");
  close(Math.hypot(ex - centre[0], ey - centre[1]), rx, "Angle arc is centred on the vertex");
  const start = Math.atan2(centre[1] - sy, sx - centre[0]), end = Math.atan2(centre[1] - ey, ex - centre[0]);
  const degrees = ((end - start) * 180 / Math.PI + 360) % 360;
  assert.equal(large, degrees > 180 ? 1 : 0);
  if (label !== "x") close(degrees, Number(label.split(" ")[0]), "Angle arc agrees with its numerical label", 0.01);
  return degrees;
}
function internalAngle(a, vertex, b) {
  const u = a.map((value, axis) => value - vertex[axis]), v = b.map((value, axis) => value - vertex[axis]);
  return Math.acos(sum(u.map((value, axis) => value * v[axis])) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI;
}
function grid(number) {
  const figure = figures[number - 1], x = scale(figure, "x"), y = scale(figure, "y"), points = {};
  const labelLayer = one(marked(figure, "data-label-layer", "axes"), "Legible axis-label layer");
  const layerIndex = figure.children.indexOf(labelLayer);
  figure.children.forEach((child, index) => {
    if (typeof child !== "string" && ["data-shape", "data-route", "data-arrow"].some(attribute => child.attrs[attribute])) {
      assert.ok(index < layerIndex, "Axis labels are painted above intersecting shape/route lines");
    }
  });
  marked(labelLayer, "data-tick").forEach(tick => {
    const halo = one(marked(tick, "paint-order", "stroke"), "White halo behind axis numerals");
    assert.equal(halo.attrs.stroke, "#fff");
    assert.equal(halo.attrs["stroke-width"], "3");
  });
  const read = point => [x.read(point[0]), y.read(point[1])];
  for (const group of marked(figure, "data-point")) {
    const circle = one(tagged(group, "circle"), "Grid point");
    const name = textContent(one(tagged(group, "text"), "Grid point label"));
    assert.equal(name, group.attrs["data-point"]);
    points[name] = read([numberAttr(circle, "cx"), numberAttr(circle, "cy")]);
    assert.ok(bank.visualQuestions[number - 1].visual.alt.includes(coordinate(points[name])), "Alt text includes the point's actual coordinates");
  }
  const shapes = Object.fromEntries(marked(figure, "data-shape").map(shape => [shape.attrs["data-shape"], readPoints(shape).map(read)]));
  const routes = Object.fromEntries(marked(figure, "data-route").map(route => [route.attrs["data-route"], readPoints(route).map(read)]));
  for (const point of [...Object.values(shapes).flat(), ...Object.values(routes).flat()]) {
    assert.ok(bank.visualQuestions[number - 1].visual.alt.includes(coordinate(point)), "Alt text includes plotted route/shape vertices");
  }
  return { figure, x, y, points, shapes, routes };
}

const checkedVisuals = new Set(), checkedWritten = new Set(), checkedExamples = new Set();
function checkVisual(number, expected, parse = value => value) {
  assert.ok(!checkedVisuals.has(number));
  const item = bank.visualQuestions[number - 1], meanings = item.options.map(parse);
  assert.equal(new Set(meanings.map(value => JSON.stringify(value))).size, 5, item.id + ": distractors have five distinct meanings");
  const correct = meanings.map((value, index) => isDeepStrictEqual(value, expected) ? index : -1).filter(index => index >= 0);
  assert.equal(correct.length, 1, item.id + ": exactly one choice follows from independently read diagram data");
  assert.equal(item.answer, correct[0], item.id + ": the key points to that choice");
  checkedVisuals.add(number);
}
function checkWritten(number, fragments, expected) {
  assert.ok(!checkedWritten.has(number));
  const item = bank.strategyQuestions[number - 1];
  for (const fragment of fragments) assert.ok(item.q.includes(fragment), item.id + ": oracle is tied to the stated constraint " + fragment);
  assert.equal(item.finalAnswer, expected, item.id + ": every requested part and unit matches an independent solution");
  checkedWritten.add(number);
}
function checkExample(id, expected) {
  const item = bank.strategies.find(strategy => strategy.id === id);
  assert.equal(item.workedExample.finalAnswer, expected, id + ": independent worked-example result");
  checkedExamples.add(id);
}

// Read actual bar heights and axis ticks, not answer keys or hidden SVG values.
{
  const b = bars(1);
  assert.deepEqual(b, { Apr: 10, May: 15, Jun: 25, Jul: 20 });
  checkVisual(1, b.May + b.Jun - b.Apr - b.Jul, withUnit("seedlings"));
}
{
  const b = bars(2);
  assert.deepEqual(b, { Mon: 16, Tue: 24, Wed: 20, Thu: 12 });
  checkVisual(2, 90 - sum(Object.values(b)), withUnit("loans"));
}
{
  const b = bars(3);
  assert.deepEqual(b, { Art: 8, Code: 14, Drama: 10, Music: 18 });
  checkVisual(3, fraction(b.Code + b.Music, sum(Object.values(b))), parseFraction);
}
{
  const total = sum(Object.values(bars(4)));
  assert.equal(total % 5, 0, "No partial recycling bag is implied");
  checkVisual(4, total / 5, withUnit("bags"));
}
{
  const values = Object.values(bars(5));
  assert.equal(values.length, 5);
  checkVisual(5, sum(values) / values.length, withUnit("mm"));
}
{
  const { labels, series } = lines(6), times = labels.map(Number), values = series.Water;
  const intervals = times.slice(1).map((end, index) => [times[index], end]);
  const changes = values.slice(1).map((value, index) => value - values[index]);
  const best = Math.max(...changes);
  assert.equal(changes.filter(change => change === best).length, 1);
  checkVisual(6, intervals[changes.indexOf(best)], option => {
    assert.match(option, /^\d+-\d+ minutes$/);
    const pair = option.split(" ")[0].split("-").map(Number);
    assert.ok(intervals.some(interval => isDeepStrictEqual(interval, pair)), "Every interval distractor is a real consecutive pair");
    return pair;
  });
}
{
  const values = lines(7).series.Air;
  checkVisual(7, Math.max(...values) - Math.min(...values), withUnit("degrees C"));
}
{
  const { labels, series } = lines(8), times = labels.map(Number);
  const still = sum(series.Route.slice(1).map((value, index) => value === series.Route[index] ? times[index + 1] - times[index] : 0));
  checkVisual(8, still, withUnit("minutes"));
}
{
  const { labels, series } = lines(9), days = labels.map(Number), heights = series.Plant;
  const rates = heights.slice(1).map((value, index) => (value - heights[index]) / (days[index + 1] - days[index]));
  assert.equal(new Set(rates).size, 1, "The continued growth rule is supported by every interval");
  checkVisual(9, heights.at(-1) + (12 - days.at(-1)) * rates[0], withUnit("cm"));
}
{
  const { labels, series } = lines(10);
  const eligible = labels.filter((_, index) => series.Ada[index] > 20 && series.Ada[index] - series.Bex[index] === 5);
  checkVisual(10, one(eligible, "Day satisfying both constraints"), value => {
    assert.ok(labels.includes(value), "Each day option occurs on the plot");
    return value;
  });
}
{
  const p = pies(11);
  checkVisual(11, (p.Walk - p.Bus) * 120 / 360, withUnit("children"));
}
{
  const p = pies(12);
  checkVisual(12, (p.Games + p.Music) * 24000 / 360, pounds);
}
{
  const p = pies(13);
  checkVisual(13, p.Badger * 100 / 360, value => {
    assert.match(value, /^\d+%$/);
    return Number(value.slice(0, -1));
  });
}
{
  const p = pies(14);
  checkVisual(14, (p.Sleep + p.Free - p.School) * 24 / 360, withUnit("hours"));
}
{
  const p = pies(15);
  checkVisual(15, (p.Local + p.Regional) * 18 / p.Abroad, withUnit("parcels"));
}
{
  const [trainRows, busRows] = tables(16);
  assert.deepEqual(trainRows[0], ["Train", "Grove", "Hub"]);
  assert.deepEqual(busRows[0], ["Bus", "Hub", "Museum"]);
  const trains = trainRows.slice(1).map(row => row.slice(1).map(minutes));
  const buses = busRows.slice(1).map(row => row.slice(1).map(minutes));
  const journeys = trains.flatMap(([leave, arrive]) => buses.filter(([depart, finish]) => depart - arrive >= 6 && finish <= minutes("09:10")).map(bus => ({ leave, arrive, bus })));
  assert.ok(journeys.length > 0);
  checkVisual(16, Math.max(...journeys.map(journey => journey.leave)), minutes);
  assert.ok(journeys.every(journey => journey.leave <= minutes("08:12")), "Later trains fail the transfer/deadline constraints");
}
{
  const rows = tables(17)[0];
  assert.deepEqual(rows[0], ["Box", "Pencils", "Cost"]);
  const [small, large] = rows.slice(1).map(row => ({ count: Number(row[1]), cost: pounds(row[2]) }));
  const choices = range(0, Math.floor(28 / small.count)).flatMap(s => range(0, Math.floor(28 / large.count)).filter(l => small.count * s + large.count * l === 28).map(l => ({ s, l, cost: s * small.cost + l * large.cost })));
  assert.equal(choices.length, 1, "The exact pencil count has a unique box combination");
  checkVisual(17, Math.min(...choices.map(choice => choice.cost)), pounds);
}
{
  const rows = tables(18)[0].slice(1).map(row => row.map(Number));
  const winners = sum(rows.filter(([score]) => score >= 3).map(([, count]) => count));
  checkVisual(18, fraction(winners, sum(rows.map(([, count]) => count))), parseFraction);
}
{
  const rows = tables(19)[0].slice(1);
  const fruit = rows.map(([, empty, full]) => Number(full) - Number(empty));
  assert.ok(fruit.every(mass => mass > 0));
  checkVisual(19, sum(fruit) / 6, withUnit("kg"));
}
{
  const sessions = tables(20)[0].slice(1).map(row => row.slice(1).map(minutes));
  const gaps = sessions.slice(1).map(([start], index) => start - sessions[index][1]);
  assert.ok(gaps.every(gap => gap >= 0));
  const idle = sessions.at(-1)[1] - sessions[0][0] - sum(sessions.map(([start, end]) => end - start));
  assert.equal(idle, sum(gaps));
  checkVisual(20, idle, withUnit("minutes"));
}
for (const [number, face] of [[21, "C"], [22, "A"], [23, "4"]]) {
  const cube = foldNet(number);
  checkVisual(number, cube.opposite(face), value => {
    assert.ok(cube.labels.includes(value) && value !== face, "Every face distractor is another face of the pictured cube");
    return value;
  });
}
{
  const cube = foldNet(24);
  checkVisual(24, Number(cube.opposite("2")) + Number(cube.opposite("4")), value => {
    assert.match(value, /^\d+$/);
    return Number(value);
  });
}
{
  const cube = foldNet(25), top = cube.opposite("C");
  const pairs = bank.visualQuestions[24].options.map(option => {
    assert.match(option, /^[A-F] and [A-F]$/);
    return option.split(" and ").sort();
  });
  const eligible = pairs.filter(([a, b]) => ![a, b].includes("C") && ![a, b].includes(top) && cube.opposite(a) === b);
  checkVisual(25, one(eligible, "Opposite side-wall pair"), value => value.split(" and ").sort());
}
{
  const f = figures[25], ray = one(marked(f, "data-ray", "sloping"), "Straight-line ray");
  const base = one(marked(f, "data-base", "straight"), "Straight baseline");
  assert.equal(numberAttr(base, "y1"), numberAttr(base, "y2"));
  const o = [numberAttr(ray, "x1"), numberAttr(ray, "y1")];
  assert.equal(o[1], numberAttr(base, "y1"));
  const slopeAngle = Math.atan2(o[1] - numberAttr(ray, "y2"), numberAttr(ray, "x2") - o[0]) * 180 / Math.PI;
  const known = Number(one(marked(f, "data-angle").filter(group => group.attrs["data-angle"] !== "x"), "Known straight-line angle").attrs["data-angle"].split(" ")[0]);
  close(180 - slopeAngle, known, "Ray location agrees with the known angle", 0.01);
  close(arcSpan(f, known + " deg", o), known, "Known angle arc", 0.01);
  close(arcSpan(f, "x", o), 180 - known, "Unknown angle geometry", 0.01);
  checkVisual(26, 180 - known, withUnit("degrees"));
}
{
  const f = figures[26], rays = marked(f, "data-ray", "around"), o = [numberAttr(rays[0], "x1"), numberAttr(rays[0], "y1")];
  assert.equal(rays.length, 4);
  rays.forEach(ray => assert.deepEqual([numberAttr(ray, "x1"), numberAttr(ray, "y1")], o));
  const known = marked(f, "data-angle").filter(group => group.attrs["data-angle"] !== "x").map(group => {
    const label = group.attrs["data-angle"];
    arcSpan(f, label, o);
    return Number(label.split(" ")[0]);
  });
  const directions = rays.map(ray => (Math.atan2(o[1] - numberAttr(ray, "y2"), numberAttr(ray, "x2") - o[0]) * 180 / Math.PI + 360) % 360).sort((a, b) => a - b);
  const gaps = directions.map((direction, index) => ((directions[(index + 1) % 4] - direction) + 360) % 360).sort((a, b) => a - b);
  [...known, 360 - sum(known)].sort((a, b) => a - b).forEach((angle, index) => close(gaps[index], angle, "Ray gaps agree with angle sectors", 0.01));
  close(arcSpan(f, "x", o), 360 - sum(known), "Unknown full-turn angle", 0.01);
  checkVisual(27, 360 - sum(known), withUnit("degrees"));
}
{
  const f = figures[27], [left, right, apex] = readPoints(one(marked(f, "data-triangle", "isosceles"), "Isosceles triangle"));
  close(Math.hypot(left[0] - apex[0], left[1] - apex[1]), Math.hypot(right[0] - apex[0], right[1] - apex[1]), "Equal marked sides really are equal");
  const ticks = marked(f, "data-equal", "side");
  assert.equal(ticks.length, 2);
  for (const endpoint of [left, right]) {
    const midpoint = endpoint.map((value, axis) => (value + apex[axis]) / 2);
    assert.equal(ticks.filter(tick => Math.hypot((numberAttr(tick, "x1") + numberAttr(tick, "x2")) / 2 - midpoint[0],
      (numberAttr(tick, "y1") + numberAttr(tick, "y2")) / 2 - midpoint[1]) < 0.01).length, 1);
  }
  const known = Number(one(marked(f, "data-angle").filter(group => group.attrs["data-angle"] !== "x"), "Vertex angle").attrs["data-angle"].split(" ")[0]);
  close(internalAngle(left, apex, right), known, "Drawn vertex angle", 0.01);
  arcSpan(f, known + " deg", apex);
  close(arcSpan(f, "x", left), (180 - known) / 2, "Drawn base-angle arc", 0.01);
  checkVisual(28, (180 - known) / 2, withUnit("degrees"));
}
{
  const f = figures[28], [a, b, c] = readPoints(one(marked(f, "data-triangle", "exterior"), "Exterior-angle triangle"));
  const extension = one(marked(f, "data-extension", "base"), "Base extension");
  assert.deepEqual([numberAttr(extension, "x1"), numberAttr(extension, "y1")], b);
  assert.equal(numberAttr(extension, "y2"), b[1]); assert.ok(numberAttr(extension, "x2") > b[0]);
  const first = Number(marked(f, "data-angle")[0].attrs["data-angle"].split(" ")[0]);
  const second = Number(marked(f, "data-angle")[1].attrs["data-angle"].split(" ")[0]);
  close(internalAngle(b, a, c), first, "Angle A geometry", 0.01);
  close(internalAngle(a, c, b), second, "Angle C geometry", 0.01);
  arcSpan(f, first + " deg", a); arcSpan(f, second + " deg", c);
  close(arcSpan(f, "x", b), 180 - internalAngle(a, b, c), "Exterior arc geometry", 0.01);
  checkVisual(29, first + second, withUnit("degrees"));
}
{
  const f = figures[29], parallels = marked(f, "data-parallel"), transversal = one(marked(f, "data-transversal"), "Transversal");
  assert.equal(parallels.length, 2);
  parallels.forEach(stroke => assert.equal(numberAttr(stroke, "y1"), numberAttr(stroke, "y2")));
  const dx = numberAttr(transversal, "x2") - numberAttr(transversal, "x1"), dy = numberAttr(transversal, "y2") - numberAttr(transversal, "y1");
  const crossings = parallels.map(stroke => {
    const y = numberAttr(stroke, "y1");
    return [numberAttr(transversal, "x1") + (y - numberAttr(transversal, "y1")) * dx / dy, y];
  });
  const label = one(marked(f, "data-angle").filter(group => group.attrs["data-angle"] !== "x"), "Parallel-line known angle").attrs["data-angle"];
  const known = Number(label.split(" ")[0]);
  close(Math.atan2(Math.abs(dy), Math.abs(dx)) * 180 / Math.PI, known, "Transversal inclination agrees with label", 0.01);
  arcSpan(f, label, crossings[0]);
  close(arcSpan(f, "x", crossings[1]), 180 - known, "Adjacent corresponding-angle geometry", 0.01);
  checkVisual(30, 180 - known, withUnit("degrees"));
}
{
  const g = grid(31), mirror = one(marked(g.figure, "data-mirror", "x"), "Vertical mirror");
  assert.equal(numberAttr(mirror, "x1"), numberAttr(mirror, "x2"));
  const axis = g.x.read(numberAttr(mirror, "x1"));
  checkVisual(31, [2 * axis - g.points.P[0], g.points.P[1]], parseCoordinate);
}
{
  const g = grid(32), { A, C } = g.points, image = g.points["A'"];
  assert.deepEqual(g.shapes.ABC, [A, g.points.B, C]);
  const arrow = one(marked(g.figure, "data-arrow", "translation"), "Translation arrow");
  assert.deepEqual([g.x.read(numberAttr(arrow, "x1")), g.y.read(numberAttr(arrow, "y1"))], A);
  assert.deepEqual([g.x.read(numberAttr(arrow, "x2")), g.y.read(numberAttr(arrow, "y2"))], image);
  checkVisual(32, C.map((value, axis) => value + image[axis] - A[axis]), parseCoordinate);
}
{
  const g = grid(33), mirror = one(marked(g.figure, "data-mirror", "y"), "Horizontal mirror");
  assert.equal(numberAttr(mirror, "y1"), numberAttr(mirror, "y2"));
  assert.deepEqual(g.shapes.ABC, [g.points.A, g.points.B, g.points.C]);
  const axis = g.y.read(numberAttr(mirror, "y1"));
  checkVisual(33, [g.points.B[0], 2 * axis - g.points.B[1]], parseCoordinate);
}
{
  const { shapes } = grid(34);
  const shifts = shapes.T.map((point, index) => point.map((value, axis) => value - shapes.S[index][axis]));
  assert.ok(shifts.every(shift => isDeepStrictEqual(shift, shifts[0])), "All three vertices undergo the same translation");
  checkVisual(34, shifts[0], value => {
    const match = value.match(/^(\d+) (right|left), (\d+) (up|down)$/);
    assert.ok(match);
    return [Number(match[1]) * (match[2] === "right" ? 1 : -1), Number(match[3]) * (match[4] === "up" ? 1 : -1)];
  });
}
{
  const { P } = grid(35).points;
  checkVisual(35, [-P[0], P[1] - 1], parseCoordinate);
}
const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const area = points => Math.abs(sum(points.map((point, index) => {
  const next = points[(index + 1) % points.length];
  return point[0] * next[1] - next[0] * point[1];
}))) / 2;
const perimeter = points => sum(points.map((point, index) => distance(point, points[(index + 1) % points.length])));
{
  const g = grid(36), rectangle = g.shapes.ABCD;
  assert.deepEqual(rectangle, [g.points.A, g.points.B, g.points.C, g.points.D]);
  rectangle.forEach((vertex, index) => close(internalAngle(rectangle[(index + 3) % 4], vertex, rectangle[(index + 1) % 4]), 90, "Rectangle right angle"));
  checkVisual(36, perimeter(rectangle), withUnit("units"));
}
{
  const g = grid(37);
  assert.deepEqual(g.shapes.PQR, [g.points.P, g.points.Q, g.points.R]);
  checkVisual(37, area(g.shapes.PQR), withUnit("square units"));
}
{
  const g = grid(38), route = g.routes["P-Q-R-S"];
  assert.deepEqual(route, ["P", "Q", "R", "S"].map(name => g.points[name]));
  const outward = sum(route.slice(1).map((point, index) => distance(point, route[index])));
  const shortestReturn = sum(route[0].map((value, axis) => Math.abs(value - route.at(-1)[axis])));
  checkVisual(38, outward + shortestReturn, withUnit("units"));
}
{
  const g = grid(39), { A, B, C, D } = g.points;
  assert.deepEqual(g.routes.AB, [A, B]); assert.deepEqual(g.routes.CD, [C, D]);
  const midpoint = (a, b) => a.map((value, axis) => (value + b[axis]) / 2);
  checkVisual(39, distance(midpoint(A, B), midpoint(C, D)), withUnit("units"));
}
{
  const g = grid(40), { A, B, C } = g.points, D = A.map((value, axis) => value + C[axis] - B[axis]);
  assert.deepEqual(g.routes["A-B-C"], [A, B, C]);
  checkVisual(40, [D, area([A, B, C, D])], option => {
    const match = option.match(/^(\(-?\d+, -?\d+\)); (\d+) square units$/);
    assert.ok(match, "Both parts of a coordinate-and-area option are present");
    return [parseCoordinate(match[1]), Number(match[2])];
  });
}

// Solve written constraints independently, and compare the entire multi-part answer.
{
  const solutions = range(0, 72).flatMap(a => range(0, a).filter(transfer => a === 2 * (72 - a) && a - transfer === 72 - a + transfer).map(transfer => [a, 72 - a, transfer]));
  const [a, b, transfer] = one(solutions, "Counter solution");
  checkWritten(1, ["72", "twice as many", "equal", "each start", "how many did Asha give"],
    `Asha: ${a} counters; Ben: ${b} counters; transfer: ${transfer} counters.`);
}
{
  const original = 6 / (1 - 1 / 4 - 1 / 2), notebook = original / 4;
  assert.equal(original - notebook - 6, original / 2);
  checkWritten(2, ["one quarter", "GBP 6", "half her original", "starting amount", "notebook's cost"],
    `Starting amount: GBP ${original}; notebook: GBP ${notebook}.`);
}
{
  const solutions = range(1, 72).flatMap(red => range(1, 72 - red).filter(blue => red * 3 === blue * 2 && 72 - red - blue === blue + 8).map(blue => [red, blue, 72 - red - blue]));
  const [red, blue, green] = one(solutions, "Three-colour solution");
  checkWritten(3, ["2:3", "8 more green", "72 tiles", "each colour"],
    `Red: ${red} tiles; blue: ${blue} tiles; green: ${green} tiles.`);
}
{
  const initial = one(range(6, 61).filter(value => value + 6 + value + 9 === 61), "Shelf starting amount");
  const final = [initial - 6, initial + 6, initial + 9];
  assert.equal(sum(final), 3 * initial + 9);
  checkWritten(4, ["same number", "Six books move", "9 new", "61", "at first", "each now"],
    `At first: ${initial} books per shelf; now top: ${final[0]}, middle: ${final[1]}, bottom: ${final[2]} books.`);
}
{
  const initial = (18 + 4 * 18) / (4 - 1), first = initial - 18, second = initial + 18;
  assert.equal(second, first * 4); assert.equal(first + second, 2 * initial);
  checkWritten(5, ["equal amounts", "18 litres", "four times", "before", "afterwards"],
    `Before: ${initial} litres in each tank; afterwards first: ${first} litres, second: ${second} litres.`);
}
{
  const afterSale = 19 + 5, beforeSale = afterSale * 2, baked = beforeSale * 3 / 2, sold = beforeSale / 2;
  assert.equal(baked - baked / 3 - sold - 5, 19);
  checkWritten(6, ["one third", "half of the remaining", "5 buns", "19 left", "baked", "sold"],
    `Baked: ${baked} buns; sold: ${sold} buns.`);
}
{
  const price = (4100 - 500) * 100 / 80, discount = price * 20 / 100;
  assert.equal(price - discount + 500, 4100);
  checkWritten(7, ["20%", "then GBP 5", "GBP 41", "marked price", "discount"],
    `Marked price: GBP ${price / 100}; discount: GBP ${discount / 100}.`);
}
{
  const train = minutes("14:05") - 35, bus = train - 12 - 8 - 27;
  assert.equal(minutes("14:05") - bus, 82);
  checkWritten(8, ["14:05", "35-minute", "12 minutes", "8 minutes", "27-minute", "no other gaps", "bus leave", "train leave"],
    `Bus left at ${clock(bus)}; train left at ${clock(train)}.`);
}
{
  const firstOutput = (65 + 4) / 3, start = (firstOutput + 4) / 3;
  assert.equal(3 * (3 * start - 4) - 4, 65);
  checkWritten(9, ["triples", "subtracts 4", "twice", "65", "starting number", "first pass"],
    `Starting number: ${start}; first output: ${firstOutput}.`);
}
{
  const blue = 18 / (1 - 1 / 2), gold = 18 / (1 - 1 / 4), used = blue / 2 + gold / 4;
  assert.equal(blue + gold - used, 36);
  checkWritten(10, ["Half of the blue", "one quarter of the gold", "18 blue", "18 gold", "originally", "fraction of all"],
    `Originally blue: ${blue} beads; gold: ${gold} beads; fraction used: ${fractionText(used, blue + gold)}.`);
}
{
  const solutions = permutations([1, 2, 4, 5]).map(digits => Number(digits.join(""))).filter(value => value > 4000 && value % 4 === 0).sort((a, b) => a - b);
  assert.equal(solutions.length, 4);
  checkWritten(11, ["1, 2, 4 and 5", "exactly once", "greater than 4000", "divisible by 4", "complete"],
    englishList(solutions) + ".");
}
{
  const routes = [...new Set(permutations(["E", "E", "N", "N"]).map(route => route.join("")))].sort();
  assert.equal(routes.length, 6);
  const allowed = routes.filter(route => {
    let x = 0, y = 0;
    for (const step of route) {
      if (step === "E") x += 1; else y += 1;
      if (x === 1 && y === 1) return false;
    }
    return x === 2 && y === 2;
  });
  checkWritten(12, ["2-by-2", "two east", "two north", "centre point", "blocked", "every allowed route"],
    `${englishList(allowed)}; ${allowed.length} routes.`);
}
{
  const pairs = range(1, 4).flatMap(fifty => range(1, 11).filter(twenty => 50 * fifty + 20 * twenty === 220).map(twenty => [twenty, fifty]));
  assert.equal(pairs.length, 2);
  const fewest = Math.min(...pairs.map(pair => sum(pair)));
  checkWritten(13, ["GBP 2.20", "20p and 50p", "at least one", "every possible pair", "fewest"],
    pairs.map(([twenty, fifty]) => `(${twenty} twenty-pence, ${fifty} fifty-pence)`).join(" or ") + `; fewest: ${fewest} coins.`);
}
{
  const pairs = range(1, 6).filter(side => 36 % side === 0).map(side => [side, 36 / side]).filter(([a, b]) => 2 * (a + b) <= 30);
  assert.equal(pairs.length, 3);
  const best = pairs.reduce((a, b) => sum(a) < sum(b) ? a : b);
  checkWritten(14, ["whole-number", "36 square metres", "at most 30 m", "ignoring rotations", "least perimeter"],
    `${pairs[0][0]} m by ${pairs[0][1]} m, ${pairs[1][0]} m by ${pairs[1][1]} m, or ${pairs[2][0]} m by ${pairs[2][1]} m; least perimeter: ${2 * sum(best)} m (${best[0]} m by ${best[1]} m).`);
}
{
  const orders = permutations(["A", "B", "C", "D"]).filter(order => order.indexOf("A") < order.indexOf("B") && order.indexOf("D") === order.indexOf("C") + 1).map(order => order.join("")).sort();
  checkWritten(15, ["A must come before B", "C must come immediately before D", "every possible order", "B last"],
    `${englishList(orders)}; ${orders.filter(order => order.endsWith("B")).length} orders put B last.`);
}
{
  const bikes = one(range(0, 11).filter(value => 8 * value + 3 * (11 - value) === 63), "Hire-item count");
  const helmets = 11 - bikes, lower = 8 * (bikes - 1) + 3 * (helmets + 1), upper = 8 * (bikes + 1) + 3 * (helmets - 1);
  checkWritten(16, ["Eleven", "GBP 8", "GBP 3", "GBP 63", "one fewer bike", "one more bike"],
    `${bikes} bikes and ${helmets} helmets; cheaper trial: ${bikes - 1} bikes and ${helmets + 1} helmets (GBP ${lower}); dearer trial: ${bikes + 1} bikes and ${helmets - 1} helmets (GBP ${upper}).`);
}
{
  const widths = range(1, Math.floor(34 / 4)), lengthFor = width => 34 / 2 - width;
  const w = one(widths.filter(width => width * lengthFor(width) === 66), "Pond width"), l = lengthFor(w);
  assert.ok(widths.slice(1).every(width => width * lengthFor(width) > (width - 1) * lengthFor(width - 1)));
  checkWritten(17, ["whole-number", "34 m", "66 square metres", "length is at least", "immediately below and above"],
    `Length: ${l} m; width: ${w} m. Neighbouring trials: ${lengthFor(w - 1)} m by ${w - 1} m gives ${lengthFor(w - 1) * (w - 1)} square metres; ${lengthFor(w + 1)} m by ${w + 1} m gives ${lengthFor(w + 1) * (w + 1)} square metres.`);
}
{
  const all = range(0, 7).map(large => ({ large, small: 7 - large, badges: 10 * large + 6 * (7 - large), cost: 7 * large + 4 * (7 - large) }));
  const feasible = all.filter(choice => choice.badges >= 52).sort((a, b) => a.cost - b.cost), best = feasible[0];
  assert.ok(feasible.slice(1).every(choice => choice.cost > best.cost));
  checkWritten(18, ["at least 52", "exactly seven", "6 badges", "GBP 4", "contain 10", "GBP 7", "least cost", "how many badges"],
    `${best.small} small packs and ${best.large} large packs; ${best.badges} badges; GBP ${best.cost}.`);
}
{
  const mina = one(range(0, 84).filter(age => (age + 3) * (age + 5 + 3) === 84), "Age solution"), luca = mina + 5;
  assert.equal((mina + 2) * (luca + 2), 66); assert.equal((mina + 4) * (luca + 4), 104);
  checkWritten(19, ["whole-number", "five years older", "In three years", "product", "84", "ages now"],
    `Mina: ${mina} years; Luca: ${luca} years.`);
}
{
  const candidates = range(201, 399).filter(number => {
    const digits = String(number).split("").map(Number);
    return sum(digits) === 12 && digits[1] === 3 * digits[0];
  });
  const reverse = number => Number(String(number).split("").reverse().join(""));
  const answer = one(candidates.filter(number => reverse(number) - number === 198), "Reversed-number solution");
  const other = one(candidates.filter(number => number !== answer), "Other hundreds-digit trial");
  checkWritten(20, ["between 200 and 400", "total 12", "three times", "198 larger", "other possible hundreds digit"],
    `${answer}; ${other} fails because its reversal is ${reverse(other)}, which is not 198 more.`);
}
{
  const borderCount = side => sum(range(-1, side).map(x => range(-1, side).filter(y => x < 0 || y < 0 || x === side || y === side).length));
  assert.deepEqual([1, 2, 3].map(borderCount), [8, 12, 16]);
  assert.ok(range(1, 20).every(side => borderCount(side + 1) - borderCount(side) === 4));
  const side = one(range(1, 52).filter(value => borderCount(value) === 52), "Patio border solution");
  checkWritten(21, ["n-by-n", "one-tile-wide", "8, 12 and 16", "adds four", "exactly 52"],
    `Patio side: ${side} tiles; each increase adds ${borderCount(side + 1) - borderCount(side)} border tiles.`);
}
{
  const handshakes = members => sum(range(1, members).map(person => range(1, members).filter(other => other > person).length));
  const small = [2, 3, 4].map(handshakes), count = handshakes(8);
  const members = one(range(2, 46).filter(number => handshakes(number) === 45), "Handshake group size");
  checkWritten(22, ["every other member exactly once", "2, 3 and 4", "8 members", "45 handshakes"],
    `For 2, 3 and 4 members: ${englishList(small)} handshakes; for 8: ${count} handshakes; 45 handshakes: ${members} members.`);
}
{
  const block = ["red", "blue", "blue", "green"], beads = range(0, 66).map(index => block[index % block.length]);
  const counts = Object.fromEntries(["red", "blue", "green"].map(colour => [colour, beads.filter(bead => bead === colour).length]));
  assert.equal(sum(Object.values(counts)), 67);
  checkWritten(23, ["red, blue, blue, green", "first 67", "each colour", "68th"],
    `Red: ${counts.red} beads; blue: ${counts.blue} beads; green: ${counts.green} beads; 68th bead: ${block[67 % block.length]}.`);
}
{
  const counters = stage => sum(range(1, stage)), maxStage = Math.max(...range(1, 60).filter(stage => counters(stage) <= 60));
  assert.ok(counters(maxStage + 1) > 60);
  checkWritten(24, ["rows containing 1, 2, 3", "next longer", "stage 9", "60 counters", "largest complete", "spare"],
    `Stage 9: ${counters(9)} counters; largest complete stage: ${maxStage}; spare: ${60 - counters(maxStage)} counters.`);
}
{
  const cubeCounts = side => {
    let painted = 0, unpainted = 0;
    for (let x = 0; x < side; x += 1) for (let y = 0; y < side; y += 1) for (let z = 0; z < side; z += 1) {
      if ([x, y, z].some(value => value === 0 || value === side - 1)) painted += 1; else unpainted += 1;
    }
    return { painted, unpainted };
  };
  const core = [3, 4, 5].map(side => cubeCounts(side).unpainted);
  const side = range(3, 12).find(value => cubeCounts(value).unpainted >= 100);
  assert.ok(range(3, side - 1).every(value => cubeCounts(value).unpainted < 100));
  checkWritten(25, ["solid cube", "only its outside", "3, 4 and 5", "at least 100", "smallest", "painted cubes"],
    `Unpainted for sides 3, 4 and 5: ${englishList(core)}; smallest side: ${side} cubes; painted: ${cubeCounts(side).painted} cubes.`);
}
{
  const outline = [[0, 0], [12, 0], [12, 6], [8, 6], [8, 9], [0, 9]];
  assert.equal(area(outline), 12 * 9 - 4 * 3); assert.equal(perimeter(outline), 2 * (12 + 9));
  checkWritten(26, ["12 m wide", "9 m high", "4 m by 3 m", "top-right", "area and perimeter", "why"],
    `Area: ${area(outline)} square metres; perimeter: ${perimeter(outline)} m; the removed 4 m and 3 m outer edges are replaced by 4 m and 3 m inner edges.`);
}
{
  const meet = one(range(0, 150).filter(time => 5 * time === 150 - 9 * Math.max(0, time - 2)), "Robot meeting time");
  assert.equal(5 * meet + 9 * (meet - 2), 150);
  checkWritten(27, ["150 cm", "5 cm per minute", "two minutes later", "9 cm per minute", "Iris's start", "how far"],
    `They meet ${meet} minutes after Iris's start; Iris's robot travels ${5 * meet} cm.`);
}
{
  const A = [-2, 1], B = [4, 1], C = [4, 5], D = A.map((value, axis) => value + C[axis] - B[axis]);
  const middle = A.map((value, axis) => (value + C[axis]) / 2);
  assert.deepEqual(middle, B.map((value, axis) => (value + D[axis]) / 2));
  checkWritten(28, ["A(-2, 1)", "B(4, 1)", "C(4, 5)", "consecutive vertices", "find D", "area", "diagonals meet"],
    `D = ${coordinate(D)}; area = ${area([A, B, C, D])} square units; diagonals meet at ${coordinate(middle)}.`);
}
{
  const total = 10 * 8;
  const pathArea = sum(range(0, 9).map(x => range(0, 7).filter(y => x === 4 || y === 3).length));
  assert.equal(pathArea, 8 * 1 + 10 * 1 - 1 * 1);
  checkWritten(29, ["10 m by 8 m", "each 1 m wide", "top to bottom", "left to right", "right angles", "path area", "grass area"],
    `Paths: ${pathArea} square metres; grass: ${total - pathArea} square metres.`);
}
{
  const horizontalRuns = [0, 1, 2].map(y => [[0, y], [4, y]]), verticalRuns = [0, 2, 4].map(x => [[x, 0], [x, 2]]);
  const lengthInWidthUnits = sum([...horizontalRuns, ...verticalRuns].map(([a, b]) => distance(a, b)));
  const width = 90 / lengthInWidthUnits, length = 2 * width, enclosure = [2 * length, 2 * width];
  assert.equal(3 * sum(enclosure), 90); assert.equal(4 * length * width, enclosure[0] * enclosure[1]);
  checkWritten(30, ["Four identical", "2-by-2", "both complete internal dividers", "90 m", "twice as long", "each pen", "whole enclosure", "total area"],
    `Each pen: ${length} m by ${width} m; enclosure: ${enclosure[0]} m by ${enclosure[1]} m; total area: ${enclosure[0] * enclosure[1]} square metres.`);
}

{
  const short = 90 / (3 + 2), long = 2 * short;
  assert.equal(3 * short + long, 90);
  checkExample("bar-model", `Short ribbon: ${short} cm; long ribbon: ${long} cm.`);
}
{
  const start = (20 + 8) * 3 / 2;
  assert.equal(start - start / 3 - 8, 20);
  checkExample("work-backwards", `${start} beads.`);
}
{
  const numbers = permutations([1, 2, 4]).map(digits => Number(digits.join(""))).filter(number => number > 200 && number % 2 === 0).sort((a, b) => a - b);
  checkExample("systematic-listing", englishList(numbers) + ".");
}
{
  const adults = one(range(0, 9).filter(number => number * 5 + (9 - number) * 2 === 30), "Worked ticket solution");
  checkExample("trial-improvement", `${adults} adult tickets and ${9 - adults} child tickets.`);
}
{
  const sticks = squares => {
    const edges = new Set();
    for (let x = 0; x < squares; x += 1) {
      const corners = [[x, 0], [x + 1, 0], [x + 1, 1], [x, 1]];
      corners.forEach((corner, index) => edges.add([corner.join(","), corners[(index + 1) % 4].join(",")].sort().join("|")));
    }
    return edges.size;
  };
  const squares = one(range(1, 31).filter(number => sticks(number) === 31), "Worked matchstick inverse");
  assert.deepEqual([1, 2, 3].map(sticks), [4, 7, 10]);
  checkExample("pattern-spotting", `7 squares need ${sticks(7)} sticks; 31 sticks make ${squares} squares.`);
}
{
  const outside = perimeter([[0, 0], [13, 0], [13, 3], [0, 3]]);
  assert.equal(outside, 2 * (8 + 3) + 2 * (5 + 3) - 2 * 3);
  checkExample("draw-diagram", `${outside} cm.`);
}
assert.deepEqual([...checkedVisuals].sort((a, b) => a - b), range(1, 40), "Every visual key has an independent oracle");
assert.deepEqual([...checkedWritten].sort((a, b) => a - b), range(1, 30), "Every complete written answer has an independent oracle");
assert.deepEqual([...checkedExamples].sort(), [...strategyIds].sort(), "Every worked example is independently checked");
const surfaces = [
  [1, 5, "data-bar"], [6, 10, "data-series"], [11, 15, "data-slice"], [16, 20, "data-table"],
  [21, 25, "data-face"], [26, 30, "data-angle"], [31, 35, "data-tick"], [36, 40, "data-tick"]
];
surfaces.forEach(([first, last, attribute]) => range(first, last).forEach(number => {
  assert.ok(marked(figures[number - 1], attribute).length > 0, "All eight visual families contain five real diagrams");
}));
console.log("PASS: 6 strategies and worked examples; 30 complete independently solved written answers; 40 visual keys and all 200 option meanings checked from SVG/timetable data; eight balanced visual families; five closed, non-overlapping cube nets; exact angles, plots, pies and scales; safe accessible SVGs with 80 unique IDs; offline standalone contract.");
