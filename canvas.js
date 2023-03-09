const canvas = document.getElementById("chart");
const ctx = canvas.getContext("2d");
const colorsList = document.getElementById("colors-list");

const data = [20, 45, 35];
const colors = ["pink", "green", "blue"];

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = Math.min(centerX, centerY);
// начальный угол для первого элемента (в радианах)
let startAngle = 0;

colors.forEach((color) => {
  const li = document.createElement("li");
  li.innerText = color;
  li.style.color = color;
  colorsList.appendChild(li);
});

canvas.addEventListener('mousemove', function (event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  // проверяем, находится ли курсор над сектором диаграммы
  let isInside = false;
  data.forEach((value, index) => {
    const endAngle = startAngle + (value / 100) * (Math.PI * 2);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    if (ctx.isPointInPath(x, y)) {
      // отображаем подсказку с названием цвета
      const tooltip = document.getElementById("tooltip");
      tooltip.innerText = colors[index];
      tooltip.style.display = "block";
      tooltip.style.left = `${event.pageX}px`;
      tooltip.style.top = `${event.pageY}px`;
      isInside = true;

      ctx.globalAlpha = 0.5;

      // меняем цвет элемента списка цветов, соответствующего текущему цвету диаграммы
      const colorListItem = colorsList.children[index];
      colorListItem.style.backgroundColor = "rgb(187, 135, 57)";
      colorListItem.style.width = "60px";
    } else {
      // меняем цвет элемента списка цветов, соответствующего текущему цвету диаграммы, обратно на изначальный цвет
      const colorListItem = colorsList.children[index];
      colorListItem.style.backgroundColor = "";
      colorListItem.style.width = "50px"

      ctx.globalAlpha = 1
    }
    startAngle = endAngle;
  });

  // скрываем подсказку, если курсор больше не находится над диаграммой
  if (!isInside) {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";

    // меняем цвет всех элементов списка цветов обратно на изначальный цвет
    Array.from(colorsList.children).forEach((colorListItem) => {
      colorListItem.style.backgroundColor = "";
    });
  }

  // обновляем начальный угол для следующего элемента
  startAngle = 0;
});

data.forEach((value, index) => {
  // рассчитываем конечный угол для текущего элемента
  const endAngle = startAngle + (value / 100) * (Math.PI * 2);

  // рисуем сектор диаграммы
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fillStyle = colors[index];
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();

  // обновляем начальный угол для следующего элемента
  startAngle = endAngle;
});
// добавляем элемент для отображения подсказки
const tooltip = document.createElement("div");
tooltip.id = "tooltip";
tooltip.style.display = "none";
tooltip.style.position = "absolute";
tooltip.style.padding = "4px";
tooltip.style.background = "#fff";
tooltip.style.border = "1px solid #ccc";
tooltip.style.borderRadius = "4px";
tooltip.style.boxShadow = "2px 2px 2px rgba(0, 0, 0, 0.2)";
tooltip.style.fontSize = "12px";
document.body.appendChild(tooltip);