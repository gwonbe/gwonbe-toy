const tbody = document.querySelector('#tbl tbody');

function daysInclusive(startStr, endStr){
    const s = new Date(startStr);
    const e = new Date(endStr);
    const ms = 24*60*60*1000;
    return Math.floor((e - s)/ms) + 1;
}

function formatNum(n){
    return Number.isFinite(n) ? (Math.round(n*100)/100) : '';
}

function createRow(start, end, principal, profit){
    const tr = document.createElement('tr');
    const period = daysInclusive(start,end);
    const shortR = (profit/principal)*100;
    const annR = (profit/principal)*(365/period)*100;

    tr.innerHTML = `
        <td class="cell"><input type="date" class="r-start" value="${start}"></td>
        <td class="cell"><input type="date" class="r-end" value="${end}"></td>
        <td class="cell"><input type="number" class="r-principal" value="${principal}"></td>
        <td class="cell"><input type="number" class="r-profit" value="${profit}"></td>
        <td class="cell r-days">${period}</td>
        <td class="cell cell-number r-short">${formatNum(shortR)}</td>
        <td class="cell cell-number r-ann">${formatNum(annR)}</td>
        <td class="cell"><code class="r-formula">=${'(' + profit + '/' + principal + ')*(365/' + period + ')*100'}</code></td>
        <td class="cell"><button class="del">삭제</button></td>
    `;

    tr.querySelectorAll('input').forEach(inp=>{
        inp.addEventListener('change', ()=>{
            recalcRow(tr);
        });
    });
    tr.querySelector('.del').addEventListener('click', ()=>tr.remove());
    tbody.appendChild(tr);
    return tr;
 }

function recalcRow(tr){
    const s = tr.querySelector('.r-start').value;
    const e = tr.querySelector('.r-end').value;
    const p = parseFloat(tr.querySelector('.r-principal').value) || 0;
    const pf = parseFloat(tr.querySelector('.r-profit').value) || 0;
    const d = daysInclusive(s,e);
    const shortR = p === 0 ? NaN : (pf/p)*100;
    const annR = p === 0 ? NaN : (pf/p)*(365/d)*100;
    tr.querySelector('.r-days').textContent = d;
    tr.querySelector('.r-short').textContent = formatNum(shortR);
    tr.querySelector('.r-ann').textContent = formatNum(annR);
    tr.querySelector('.r-formula').textContent = '=' + '(' + pf + '/' + p + ')*(365/' + d + ')*100';
}

document.getElementById('addRow').addEventListener('click', ()=>{
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    const principal = document.getElementById('principal').value || 0;
    const profit = document.getElementById('profit').value || 0;
    createRow(start,end,principal,profit);
});

document.getElementById('clear').addEventListener('click', ()=>{
    tbody.innerHTML = '';
});

document.getElementById('copySheet').addEventListener('click', async ()=>{
    const rows = Array.from(tbody.querySelectorAll('tr'));
    if(rows.length === 0){
        alert('먼저 행을 추가하세요.');
        return;
    }
    const formulas = rows.map((tr,i)=>{
        const s = tr.querySelector('.r-start').value;
        const e = tr.querySelector('.r-end').value;
        const p = tr.querySelector('.r-principal').value;
        const pf = tr.querySelector('.r-profit').value;
        const d = tr.querySelector('.r-days').textContent;
        // produce a generic google sheet formula using the numbers
        return `=( ${pf} / ${p} ) * (365 / ${d}) * 100`;
    }).join('\n');
    try{
        await navigator.clipboard.writeText(formulas);
        alert('구글시트 수식이 복사되었습니다.');
    }catch(e){
        prompt('복사에 실패했습니다. 아래 수식을 수동으로 복사하세요:', formulas);
    }
});
