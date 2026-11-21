const $=id=>document.getElementById(id);
const defaults={enabled:true,speed:1.5,size:22};
function render(v){$('enabled').checked=v.enabled;$('speed').value=v.speed;$('size').value=v.size;$('speedOut').textContent=Number(v.speed).toFixed(1).replace('.',',')+'×';$('sizeOut').textContent=v.size+' px'}
chrome.storage.sync.get(defaults,render);
function save(){const v={enabled:$('enabled').checked,speed:Number($('speed').value),size:Number($('size').value)};render(v);chrome.storage.sync.set(v)}
['enabled','speed','size'].forEach(id=>$(id).addEventListener(id==='enabled'?'change':'input',save));