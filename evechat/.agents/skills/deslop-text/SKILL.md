---
name: deslop-text
description: "Hunt the tells of AI writing and rewrite them into human prose. Use when the user wants to humanize or de-AI text, says a draft 'sounds like ChatGPT' or 'sounds like AI', or wants writing to read natural without changing what it says."
---

# Humanize AI text

AI prose gives itself away with **tells**: buzzwords, even rhythm, hedging, formulaic framing. This skill runs one process every time: find the tells, kill them, keep the meaning. Rewrite the sound of the text, never its claims.

## Workflow

1. Pin the target. Name the text's purpose, audience, and register in a phrase each. Done when you can state all three.
2. Capture the voice. Pull concrete markers from the author's existing writing (sentence length, diction, punctuation habits). Done when you have named markers, or confirmed no prior voice exists and are matching register instead.
3. Mark the tells. Read the text against every group in the catalog below and flag each hit. Done when all four groups have been checked against the whole text, not just the opening.
4. Rewrite. Replace each flagged tell: cut the filler, vary the rhythm, swap buzzwords for concrete words, unwind the formulas. Done when no flagged tell survives.
5. Check meaning. Compare rewrite to source claim by claim. Done when every fact, number, name, and stance is intact and the two make the same argument.

## Tell catalog

Diction:
- Buzzwords: "seamless", "robust", "cutting-edge", "game-changing", "elevate", "unlock", "leverage", "delve", "tapestry", "realm", "testament".
- Empty intensifiers: "truly", "incredibly", "very", "really", "extremely", "arguably".
- Corporate throat-clearing: "In today's fast-paced world", "It's worth noting that", "At the end of the day", "When it comes to".
- Stacked hedging: "may potentially", "could possibly help", "generally tends to".

Rhythm:
- Every sentence the same length and shape. Break the pattern with a short one.
- Reflexive tricolons: "fast, reliable, and scalable".
- Em-dash and parenthetical asides where a period or comma is cleaner.
- Bulleted lists standing in for prose that would flow better as sentences.

Framing:
- "It's not just X, it's Y" and "It's not about X, it's about Y".
- Hypophora: posing a rhetorical question only to answer it.
- Over-signposting: "Firstly", "Moreover", "Furthermore", "In conclusion".
- Fake balance ("on one hand... on the other") when the author holds a clear view.

Padding:
- Preamble and summary that restate the prompt or the paragraph.
- Moralizing wrap-ups and generic calls to action.
- Emoji and exclamation inflation above the register.

## Guardrails

- Preserve every fact, number, name, and the author's stance; the rewrite makes the same claims as the source, and adds no information the source lacked.
- Match the source register: casual stays casual, formal stays formal.
- Carry the author's voice markers into the rewrite when a voice exists.
- Cut to length; a humanized version runs shorter than the AI original.
- Keep domain terms and technical accuracy, trimming only words that carry no weight.
- Leave quotes, citations, and code samples verbatim unless the user asks to change them.

## Output

- The rewritten text, ready to use.
- On request, a one-line note of which tells drove the biggest changes.
- Flag any line you could not rewrite without a fact you do not have.
