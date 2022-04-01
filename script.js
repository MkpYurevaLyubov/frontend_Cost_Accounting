let allFinances = [];
let sum = 0;
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
    sum = 0;
  }
  const p = document.querySelector(".sum");
  allFinances.forEach((el, idx) => {
    sum += el.money;

    const contentBox = document.createElement("div");
    contentBox.className = "contentBox";

    const nameCompany = document.createElement("p");
    nameCompany.className = "nameCompany";
    nameCompany.textContent = `${idx + 1}) ${el.nameCompany}`;
    contentBox.appendChild(nameCompany);

    const date = document.createElement("p");
    date.textContent = convertDate(el.date);
    contentBox.appendChild(date);

    const money = document.createElement("p");
    money.textContent = `${el.money} p.`;
    contentBox.appendChild(money);

    const iconBox = document.createElement("div");
    iconBox.className = "iconBox";

    const editIcon = document.createElement("img");
    editIcon.src = "image/pen.svg";
    iconBox.appendChild(editIcon);

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "image/trash.svg";
    deleteIcon.addEventListener("click", () => onClickDelete(idx));
    iconBox.appendChild(deleteIcon);

    contentBox.appendChild(iconBox);
    contentPage.appendChild(contentBox);
  });
  if (allFinances.length) p.textContent = `Итого: ${sum} р.`;
};

const convertDate = (date) => {
  return date.slice(0, 10).split("-").reverse().join(".");
};

const onChangeInput = () => {
  inputName = document.getElementById("where");
  inputMoney = document.getElementById("howMany");
  newObj.nameCompany = inputName.value;
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