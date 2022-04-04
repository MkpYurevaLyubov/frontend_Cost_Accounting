let allFinances = [];
let newObj = {};
let inputName = null;
let inputMoney = null;

window.onload = async () => {
  const res = await fetch("http://localhost:8000/allFinance", {
    method: "GET",
  });
  const result = await res.json();
  allFinances = result;
  render();
};

const render = () => {
  const contentPage = document.querySelector(".contentPage");
  while (contentPage.firstChild) {
    contentPage.removeChild(contentPage.firstChild);
  }
  let sum = 0;
  const p = document.querySelector(".sum");
  allFinances.forEach((el, idx) => {
    sum += Number(el.money);
    const updateEl = {};
    updateEl._id = el._id;

    const contentBox = document.createElement("div");
    contentBox.className = "contentBox";

    const nameCompany = document.createElement("p");
    nameCompany.className = el.isEdit ? "displayNone" : "nameCompany";
    nameCompany.textContent = `${idx + 1}) ${el.nameCompany}`;
    contentBox.appendChild(nameCompany);

    const editInputName = document.createElement("input");
    editInputName.className = el.isEdit ? "editInputName" : "displayNone";
    editInputName.value = el.nameCompany;
    updateEl.nameCompany = el.nameCompany;
    editInputName.addEventListener("change", (e) => {
      updateEl.nameCompany = e.target.value.trim();
    });
    contentBox.appendChild(editInputName);

    const date = document.createElement("p");
    date.className = el.isEdit ? "displayNone" : "";
    date.textContent = convertDate(el.date);
    contentBox.appendChild(date);

    const editInputDate = document.createElement("input");
    editInputDate.className = el.isEdit ? "editInputDate" : "displayNone";
    editInputDate.type = "date";
    editInputDate.value = el.date.slice(0, 10);
    updateEl.date = el.date.slice(0, 10);
    editInputDate.addEventListener("change", (e) => {
      updateEl.date = e.target.value;
    });
    contentBox.appendChild(editInputDate);

    const money = document.createElement("p");
    money.className = el.isEdit ? "displayNone" : "";
    money.textContent = `${el.money} p.`;
    contentBox.appendChild(money);

    const editInputMoney = document.createElement("input");
    editInputMoney.className = el.isEdit ? "editInputMoney" : "displayNone";
    editInputMoney.type = "number";
    editInputMoney.value = el.money;
    updateEl.money = el.money;
    editInputMoney.addEventListener("change", (e) => {
      updateEl.money = Number(e.target.value);
    });
    contentBox.appendChild(editInputMoney);

    const iconBox = document.createElement("div");
    iconBox.className = "iconBox";
    const editIcon = document.createElement("img");
    editIcon.src = "image/pen.svg";
    editIcon.className = el.isEdit ? "displayNone" : "";
    editIcon.addEventListener("click", () => onClickEdit(idx));
    iconBox.appendChild(editIcon);

    const doneIcon = document.createElement("img");
    doneIcon.src = "image/check.svg";
    doneIcon.className = el.isEdit ? "" : "displayNone";
    doneIcon.addEventListener("click", () => onClickSaveEl(updateEl, idx));
    iconBox.appendChild(doneIcon);

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "image/trash.svg";
    el.isEdit ? deleteIcon.addEventListener("click", () => onClickClose(idx)) :
      deleteIcon.addEventListener("click", () => onClickDelete(idx));
    iconBox.appendChild(deleteIcon);

    contentBox.appendChild(iconBox);
    contentPage.appendChild(contentBox);
  });
  allFinances.length ? p.textContent = `Итого: ${sum} р.` : p.textContent = "";
};

const convertDate = (date) => {
  return date.slice(0, 10).split("-").reverse().join(".");
};

const onChangeInput = () => {
  inputName = document.getElementById("where");
  inputMoney = document.getElementById("howMany");
  newObj.nameCompany = inputName.value.trim();
  newObj.money = Number(inputMoney.value);
};

const onClickAdd = async () => {
  if (!newObj.nameCompany) return alert("Enter value name");
  if (!newObj.money) return alert("Enter value money");
  const resp = await fetch("http://localhost:8000/createFinance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(newObj)
  });
  const result = await resp.json();
  allFinances.push(result);
  inputName.value = "";
  inputMoney.value = "";
  render();
};

const onClickDelete = async (index) => {
  const answer = confirm("Are you sure?");
  if (!answer) return;
  await fetch(`http://localhost:8000/deleteFinance?id=${allFinances[index]._id}`, {
    method: "DELETE",
  });
  allFinances.splice(index, 1);
  render();
};

const onClickEdit = (index) => {
  allFinances[index].isEdit = true;
  render();
};

const onClickClose = (index) => {
  delete allFinances[index].isEdit;
  render();
};

const onClickSaveEl = async (el, idx) => {
  for (let key in el) {
    if (!el[key]) return alert(`Enter ${key}`);
  }
  const resp = await fetch("http://localhost:8000/updateFinance", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(el)
  });
  const result = await resp.json();
  allFinances[idx] = result;
  render();
};