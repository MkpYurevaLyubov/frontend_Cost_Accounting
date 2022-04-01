let allFinances = [];
let sum = 0;

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
    date.textContent = convertDate(el.date.slice(0, 10));
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
    iconBox.appendChild(deleteIcon);

    contentBox.appendChild(iconBox);
    contentPage.appendChild(contentBox);
  });
  p.textContent = `Итого: ${sum} р.`;
};

const convertDate = (date) => {
  let newDate = "";
  const dateArr = date.split("-").reverse();
  dateArr.forEach((el, idx) => {
    newDate += el;
    if (idx !== dateArr.length - 1) newDate += ".";
  });
  return newDate;
};