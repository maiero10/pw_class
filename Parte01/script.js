const modal = document.querySelector('.modal-container');
const tbody = document.querySelector('tbody');
const sNome = document.getElementById('m-funcao')
const sFuncao = document.getElementById('m-funcao');
const sSalario = document.getElementById('m-salario');
const btnSalvar = document.getElementById('btnSalvar');

let itens;
let id;

function openModal(edit = false, index = 0) {
    modal.classList.add('active');

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active');
        }
    }

    if (edit) {
        sNome.value = itens[index].nome;
        sFuncao.value = itens[index].funcao;
        sSalario.value = itens[index].salario;
        id = index;
    } else {
        sNome.value = '';
        sFuncao.value = '';
        sSalario.value = '';
    }
}

function editItem(index) {
    id = itens[index].id;
    openModal(true, index);
}

async function deleteItem(index) {
    if (!itens[index]?.id) return;
    try {
        await fetch(`${API_BASE}/${itens[index].id}`, {method: 'DELETE'});
        loadItens();
    } catch (error) {
        console.error('Erro ao deletar:', error);
    }
}

function insertItem(item, index) {
    let tr = document.createElement('tr');

    tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.funcao}</td>
        <td>R$ ${item.salario}</td>
        <td class="acao">
            <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
        </td>
    `
    tbody.appendChild(tr);
}

btnSalvar.onclick = async e => {
    if (sNome.value == '' || sFuncao.value == '' || sSalario.value == '') {
        return;
    }

    e.preventDefault();

    try {
        if (id !== undefined && itens[id]?.id) {
            await fetch(`${API_BASE}/${itens[id].id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'appliation/json'},
                body: JSON.stringify ({
                    nome: sNome.value,
                    funcao: sFuncao.value,
                    Salario: sSalario.value
                })
            });
        } else {
            await fetch(API_BASE, {
                method: 'POST',
                headers: {'Content-Type': 'appliation/json'},
                body: JSON.stringify ({
                    nome: sNome.value,
                    funcao: sFuncao.value,
                    Salario: sSalario.value
                })
            });
        }
        modal.classList.remove('actie');
        loadItens();
        id = undefined;
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar. verifique se o servidor está rodando.');
    }
}

async function loadItens() {
    itens = await getItensBD();
    tbody.innerHTML = '';
    itens.forEach((item, index) => {
        insertItem(item, index);
    });
}

loadItens();

const getItensDB = async () => {
    try {
        const response = await fetch(API_BASE);
        if (!response.ok) throw new Error('Erro ao carregar');
        return await response.json();
    } catch (error) {
        console.error('Erro API:', error);
        return [];
    }
};

const setItensBD = () => {};

loadItens();