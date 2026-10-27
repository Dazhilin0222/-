"""Generate browser dictionary from Rime Terra Pinyin (CC BY-SA 3.0).
Usage: python build_dictionary.py /path/to/terra_pinyin.dict.yaml
Requires pypinyin==0.55.0 (build-time only).
"""
import json, sys
from pathlib import Path
from pypinyin.style.bopomofo import converter
symbols = 'ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦˊˇˋ˙'
keys = '1qaz2wsxedcrfv5tgbyhnujm8ik,9ol.0p;/-6347'
lookup = dict(zip(symbols, keys))
entries = []
for line in Path(sys.argv[1]).read_text().splitlines():
    parts = line.split('\t')
    if len(parts)<2 or line.startswith('#'): continue
    word, syllables = parts[:2]
    if len(word)>12: continue
    code = ''
    for syllable in syllables.split():
        phonetic = converter.to_bopomofo(syllable)
        if any(c not in lookup for c in phonetic): break
        code += ''.join(lookup[c] for c in phonetic)
        if not phonetic.endswith(('ˊ','ˇ','ˋ','˙')): code += ' '
    else:
        entries.append([code,word])
(Path(__file__).resolve().parents[1] / 'public/dictionary.json').write_text(json.dumps(entries,ensure_ascii=False,separators=(',',':')))
print(f'Generated {len(entries)} entries')
