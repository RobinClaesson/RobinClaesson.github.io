////////////////
//   COLORS   //
////////////////
var color_default = "#FFE4C4";
var color_green = "#00FF00";
var color_blue = "#0000FF";
var color_red = "#FF0000";
var color_yellow = "#FFD700";

/////////////////
//    TIMER    //
/////////////////
var timeout;
var delay;


///////////////
//   LISTS   //
///////////////

var updates = 0;

var list;
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
}

function drawList() {
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

    // ctx.fillStyle = "#000000";
    // ctx.font = "30px Arial";
    // ctx.fillText(updates++, 10, 50);

}

///////////////////////
//   SELECTION SORT  //
///////////////////////
function startSelectionSort() {
    delay = 15;
    clearTimeout(timeout);

    newList(50);
    list[0][1] = color_yellow;

    selectionSort(0, 1, 0);

}

function selectionSort(i, j, min) {

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

        timeout = setTimeout(selectionSort, delay, i, j + 1, min);
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
        if (i < list.length - 2) {
            list[i + 1][1] = color_yellow;
            timeout = setTimeout(selectionSort, delay, i + 1, i + 2, i + 1);
        }

        //Done sorting
        else
            list[i + 1][1] = color_green;

    }

    drawList();
}

//////////////////////////
//    INSERTION SORT    //
//////////////////////////

function startInsertionSort() {
    delay = 15;
    clearTimeout(timeout);

    newList(50);
    list[1][1] = color_yellow;

    insertionSort(1, 1);
}
function insertionSort(i, j) {

    // Step back through the array while the previous element is larger than the current
    if (j > 0 && list[j][0] < list[j - 1][0]) {
        var temp = list[j];
        list[j] = list[j - 1];
        list[j - 1] = temp;

        timeout = setTimeout(insertionSort, delay, i, j - 1);
    }

    // Start on next current
    else if (i < list.length - 1) {
        list[j][1] = color_default;
        list[i + 1][1] = color_yellow;

        timeout = setTimeout(insertionSort, delay, i + 1, i + 1);
    }

    else
        for (let i = 0; i < list.length; i++)
            list[i][1] = color_green;


    drawList();
}

////////////////////
//   QUICK SORT   //
////////////////////

function startQuickSort() {
    updates = 0;
    delay = 40;
    clearTimeout(timeout);

    newList(50);

    quicksort(0, list.length - 1)
}

function quicksort(start, end) {
    console.log("start: " + start + " | end: " + end);

    if (start > end)
        return;


    list[start][1] = color_yellow;
    quicksort_partition(start, end, start, end + 1, false, false)

}

function quicksort_partition(start, end, left, right, foundLeft, foundRight) {
    // console.log("start:" + start + " | end:" + end + " | left:" + left + " | right:" + right + " | foundLeft:" + foundLeft + " | foundRight:" + foundRight);

    // Finds elements on the left larger than the partition element
    if (left <= right) {
        if (!foundLeft) {
            if (left > start)
                list[left][1] = color_default;

            left++;


            if (left < end && list[left][0] < list[start][0]) {
                list[left][1] = color_red;
                timeout = setTimeout(quicksort_partition, delay, start, end, left, right, false, false);
            }
            else {
                if (left <= end)
                    list[left][1] = color_blue;

                timeout = setTimeout(quicksort_partition, delay, start, end, left, right, true, false);
            }

        }

        // Finds elements on the right smaller than the partition element
        else if (!foundRight) {

            if (right <= end)
                list[right][1] = color_default;

            right--;

            if (right != start && list[start][0] < list[right][0]) {
                list[right][1] = color_red;
                timeout = setTimeout(quicksort_partition, delay, start, end, left, right, true, false);
            }

            else {
                list[right][1] = color_blue;
                timeout = setTimeout(quicksort_partition, delay, start, end, left, right, true, true);
            }
        }

        // Swap the larger and smaller element
        else {
            if (left < right) {
                var temp = list[left];
                list[left] = list[right];
                list[right] = temp;
            }

            timeout = setTimeout(quicksort_partition, delay, start, end, left, right, false, false);
        }
    }

    // Swap the partition element with the last small element to place it inbetween
    // the two partitions
    else {
        list[start][1] = color_green;

        if (right != start)
            list[right][1] = color_default;

        var temp = list[start];
        list[start] = list[right];
        list[right] = temp;


        //Sort left partition
        timeout = setTimeout(quicksort, delay, start, right - 1);

        //TODO: Make this wait for the left partition
        //Sort right parition
        timeout = setTimeout(quicksort, delay, right + 1, end);

    }


    drawList();
}



