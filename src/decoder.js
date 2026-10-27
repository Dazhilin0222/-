export const keys = '1qaz2wsxedcrfv5tgbyhnujm8ik,9ol.0p;/-6347';
export const symbols = 'ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙㄧㄨㄩㄚㄛㄜㄝㄞㄟㄠㄡㄢㄣㄤㄥㄦˊˇˋ˙';
const mapping = Object.fromEntries([...keys].map((k,i)=>[k,symbols[i]]));
export function toZhuyin(input) { return [...input.toLowerCase()].map(c=>mapping[c]??c).join(''); }
const preferred = ['你好','你好嗎','謝謝','不好意思','我','你','他','她','的','是','了','在','有','不','就','今天','我們','可以','這個','什麼','沒關係','我愛你','世界','再見','早安','晚安','謝謝你','對不起','沒問題','知道','喜歡','開心'];
export function createDecoder(entries, frequencies = new Map()) {
  const root = new Map();
  for (const [code,word] of entries) {
    let node=root;
    for (const c of code) { if(!node.has(c)) node.set(c,new Map()); node=node.get(c); }
    if(!node.words) node.words=[];
    node.words.push(word);
  }
  const score = word => [...word].length * 8 + Math.log10(1 + (frequencies.get(word) ?? 0)) * 2 - 12 + (preferred.includes(word) ? 2 : 0);
  return function decode(raw, limit=6) {
    const input=raw.toLowerCase().replace(/\r\n/g,'\n');
    if(!input.trim()) return [];
    const beams=Array.from({length:input.length+1},()=>[]);
    beams[0]=[{text:'',score:0,unknown:0}];
    const add=(end,item)=>{ const b=beams[end]; const same=b.findIndex(x=>x.text===item.text); if(same>=0) {if(b[same].score>=item.score)return;b.splice(same,1);} b.push(item);b.sort((a,b)=>b.score-a.score); if(b.length>12)b.length=12; };
    for(let i=0;i<input.length;i++) {
      if(!beams[i].length)continue;
      let node=root;
      for(let j=i;j<Math.min(input.length,i+70);j++) {
        node=node.get(input[j]); if(!node)break;
        let words=node.words;
        // The final first-tone syllable may omit its confirming space.
        if(j===input.length-1 && node.get(' ')?.words) words=[...(words??[]),...node.get(' ').words];
        if(words) for(const word of words) for(const prev of beams[i]) add(j+1,{text:prev.text+word,score:prev.score+score(word),unknown:prev.unknown});
      }
      const c=input[i];
      const unknown = c in mapping;
      for(const prev of beams[i])add(i+1,{text:prev.text+raw[i],score:prev.score-(unknown?18:0.5),unknown:prev.unknown+(unknown?1:0)});
    }
    return beams[input.length].filter(x=>x.text!==raw).slice(0,limit);
  };
}
