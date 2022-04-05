let allFinances = [];
const newObj = {};
let inputName = null;
let inputMoney = null;
let isEdit = false;
let isEditValue = false;

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
  const p = document.querySelector(".sum");
  const sum = allFinances.reduce((sum, finance) => sum + finance.money, 0);
  p.textContent = allFinances.length ? `Итого: ${sum} р.` : "";
  allFinances.forEach((finance, idx) => {
    const { nameCompany, date, money, _id, isEdit } = finance;
    const updateEl = { _id };
    const contentBox = document.createElement("div");
    contentBox.className = "contentBox";

    const nameValue = document.createElement("p");
    nameValue.className = isEdit ? "displayNone" : "nameCompany";
    nameValue.textContent = `${idx + 1}) ${nameCompany}`;
    nameValue.addEventListener("dblclick", () => {
      if (isEditValue) return;
      isEditValue = true;
      nameValue.classList.add("displayNone");
      editInputName.className = "editInputName";
    });
    contentBox.appendChild(nameValue);

    const editInputName = document.createElement("input");
    editInputName.className = isEdit ? "editInputName" : "displayNone";
    editInputName.value = nameCompany;
    updateEl.nameCompany = nameCompany;
    editInputName.addEventListener("change", (e) => {
      updateEl.nameCompany = e.target.value.trim();
    });
    if (!isEdit) editInputName.addEventListener("blur", () => onClickSaveEl(updateEl, idx));
    contentBox.appendChild(editInputName);

    const block = document. createElement("div");
    block.className = "block";

    const dateValue = document.createElement("p");
    dateValue.className = isEdit ? "displayNone" : "";
    dateValue.textContent = convertDate(date);
    dateValue.addEventListener("dblclick", () => {
      if (isEditValue) return;
      isEditValue = true;
      dateValue.classList.add("displayNone");
      editInputDate.className = "editInputDate";
    });
    block.appendChild(dateValue);

    const editInputDate = document.createElement("input");
    editInputDate.className = isEdit ? "editInputDate" : "displayNone";
    editInputDate.type = "date";
    editInputDate.value = date.slice(0, 10);
    updateEl.date = date.slice(0, 10);
    editInputDate.addEventListener("change", (e) => {
      updateEl.date = e.target.value;
    });
    if (!isEdit) editInputDate.addEventListener("blur", () => onClickSaveEl(updateEl, idx));
    block.appendChild(editInputDate);

    const moneyValue = document.createElement("p");
    moneyValue.className = isEdit ? "displayNone" : "";
    moneyValue.textContent = `${money} p.`;
    moneyValue.addEventListener("dblclick", () => {
      if (isEditValue) return;
      isEditValue = true;
      moneyValue.classList.add("displayNone");
      editInputMoney.className = "editInputMoney";
    });
    block.appendChild(moneyValue);

    const editInputMoney = document.createElement("input");
    editInputMoney.className = isEdit ? "editInputMoney" : "displayNone";
    editInputMoney.type = "number";
    editInputMoney.value = money;
    updateEl.money = money;
    editInputMoney.addEventListener("change", (e) => {
      updateEl.money = Number(e.target.value);
    });
    if (!isEdit) editInputMoney.addEventListener("blur", () => onClickSaveEl(updateEl, idx));
    block.appendChild(editInputMoney);

    const iconBox = document.createElement("div");
    iconBox.className = "iconBox";
    const editIcon = document.createElement("img");
    editIcon.src = "image/pen.svg";
    editIcon.className = isEdit ? "displayNone" : "";
    editIcon.addEventListener("click", () => onClickEdit(idx));
    iconBox.appendChild(editIcon);

    const doneIcon = document.createElement("img");
    doneIcon.src = "image/check.svg";
    doneIcon.className = isEdit ? "" : "displayNone";
    doneIcon.addEventListener("click", () => onClickSaveEl(updateEl, idx));
    iconBox.appendChild(doneIcon);

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "image/trash.svg";
    deleteIcon.className = isEdit ? "displayNone" : "";
    deleteIcon.addEventListener("click", () => onClickDelete(idx));
    iconBox.appendChild(deleteIcon);

    const closeIcon = document.createElement("img");
    closeIcon.src = "image/close.svg";
    closeIcon.className = isEdit ? "" : "displayNone";
    closeIcon.addEventListener("click", () => onClickClose(idx));
    iconBox.appendChild(closeIcon);

    block.appendChild(iconBox);
    contentBox.appendChild(block);
    contentPage.appendChild(contentBox);
  });
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
  if (isEdit) return alert("Close open inputs");
  isEdit = true;
  allFinances[index].isEdit = true;
  render();
};

const onClickClose = (index) => {
  isEditValue = false;
  isEdit = false;
  delete allFinances[index].isEdit;
  render();
};

const onClickSaveEl = async (el, idx) => {
  isEditValue = false;
  isEdit = false;
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