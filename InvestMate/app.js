const tbody = document.querySelector('#tbl tbody');

const today = new Date().toISOString().split('T')[0];
document.getElementById('start').value = today;
document.getElementById('end').value = today;

function daysInclusive(startStr, endStr){
  const s = new Date(startStr);
  const e = new Date(endStr);
  const ms = 24*60*60*1000;
  return Math.floor((e - s)/ms) + 1;
}

function formatNum(n){
  return Number.isFinite(n) ? (Math.round(n*100)/100) : '';
}

function createRow(start, end, principal, valuation){
  const tr = document.createElement('tr');
  const period = daysInclusive(start, end);
  const profit = valuation - principal;
  const shortR = (profit / principal) * 100;
  const annR = (profit / principal) * (365 / period) * 100;

  tr.innerHTML = `
    <td class="cell"><input type="date" class="r-start" value="${start}"></td>
    <td class="cell"><input type="date" class="r-end" value="${end}"></td>
    <td class="cell"><input type="number" class="r-principal" value="${principal}"></td>
    <td class="cell"><input type="number" class="r-valuation" value="${valuation}"></td>
    <td class="cell r-days">${period}</td>
    <td class="cell r-profit">${formatNum(profit)}</td>
    <td class="cell cell-number r-short">${formatNum(shortR)}</td>
    <td class="cell cell-number r-ann">${formatNum(annR)}</td>
    <td class="cell"><code class="r-formula">=${'((' + valuation + '-' + principal + ')/' + principal + ')*(365/' + period + ')*100'}</code></td>
    <td class="cell"><button class="del">삭제</button></td>
  `;

  tr.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', () => recalcRow(tr));
  });
  tr.querySelector('.del').addEventListener('click', () => tr.remove());
  tbody.appendChild(tr);
  return tr;
}

function recalcRow(tr){
  const s = tr.querySelector('.r-start').value;
  const e = tr.querySelector('.r-end').value;
  const p = parseFloat(tr.querySelector('.r-principal').value) || 0;
  const v = parseFloat(tr.querySelector('.r-valuation').value) || 0;
  const profit = v - p;
  const d = daysInclusive(s, e);
  const shortR = p === 0 ? NaN : (profit / p) * 100;
  const annR = p === 0 ? NaN : (profit / p) * (365 / d) * 100;

  tr.querySelector('.r-days').textContent = d;
  tr.querySelector('.r-profit').textContent = formatNum(profit);
  tr.querySelector('.r-short').textContent = formatNum(shortR);
  tr.querySelector('.r-ann').textContent = formatNum(annR);
  tr.querySelector('.r-formula').textContent = '=((' + v + '-' + p + ')/' + p + ')*(365/' + d + ')*100';
}

document.getElementById('addRow').addEventListener('click', ()=>{
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;
  const principal = parseFloat(document.getElementById('principal').value) || 0;
  const valuation = parseFloat(document.getElementById('valuation').value) || 0;
  createRow(start, end, principal, valuation);
});

document.getElementById('clear').addEventListener('click', ()=>{ tbody.innerHTML = ''; });

document.getElementById('copySheet').addEventListener('click', async ()=>{
  const rows = Array.from(tbody.querySelectorAll('tr'));
  if(rows.length === 0){
    alert('먼저 행을 추가하세요.');
    return;
  }
  const formulas = rows.map(tr=>{
    const p = tr.querySelector('.r-principal').value;
    const v = tr.querySelector('.r-valuation').value;
    const d = tr.querySelector('.r-days').textContent;
    return `=( (${v}-${p}) / ${p} ) * (365 / ${d}) * 100`;
  }).join('\n');
  try{
    await navigator.clipboard.writeText(formulas);
    alert('구글시트 수식이 복사되었습니다.');
  }catch(e){
    prompt('복사에 실패했습니다. 아래 수식을 수동으로 복사하세요:', formulas);
  }
});