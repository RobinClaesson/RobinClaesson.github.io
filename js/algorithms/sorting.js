var color_default = "#FFE4C4";
var color_green = "#00FF00";
var color_blue = "#0000FF";
var color_red = "#FF0000";
var color_yellow = "#FFD700";


var timer = Nan;
var delay = 50;

function newList(length) {
    list = [];
    for (let i = 0; i < length; i++)
        list[i] = [i + 1, color_default];

    for (let i = 0; i < length; i++) {
        var swap = Math.floor(Math.random() * length);
        var temp = list[i];
        list[i] = list[swap];
        list[swap] = temp;
    }
    return list;
}

function drawList(list) {
    var canvas = document.getElementById("sorting-canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    var item_width = Math.floor(ctx.canvas.width / list.length);
    var item_height = Math.floor(ctx.canvas.height / list.length);

    for (let i = 0; i < list.length; i++) {
        var x = i * item_width;
        var y = ctx.canvas.height - list[i][0] * item_height;
        var h = list[i][0] * item_height;
        ctx.fillStyle = list[i][1];

        ctx.fillRect(x, y, item_width, h);
        ctx.beginPath();
        ctx.rect(x, y, item_width, h);
        ctx.stroke();
    }
}

function resetTimer() {
    if (timer != NaN)
        clearTimeout(timer);
}

// SELECTION SORT
function startSelectionSort() {

    resetTimer();

    var list = newList(50);
    list[0][1] = color_yellow;

    selectionSort(list, 0, 1, 0);
}

function selectionSort(list, i, j, min) {

    //Reset last color
    if (j - 1 != min && j - 1 != i)
        list[j - 1][1] = color_default;

    //Find smallest
    if (j < list.length) {

        if (list[j][0] < list[min][0]) {

            list[j][1] = color_blue;

            if (min != i)
                list[min][1] = color_default;
            min = j;
        }

        else
            list[j][1] = color_red;

        timer = setTimeout(selectionSort, delay, list, i, j + 1, min);
    }

    //Smallest found
    else {

        if (i != min) {
            list[i][1] = color_default;
            list[min][1] = color_default;

            var temp = list[i];
            list[i] = list[min];
            list[min] = temp;

        }

        list[i][1] = color_green;

        //Continiue suorting
        if (i < list.length - 1)
            timer = setTimeout(selectionSort, delay, list, i + 1, i + 2, i + 1);
    }

    drawList(list);
}



