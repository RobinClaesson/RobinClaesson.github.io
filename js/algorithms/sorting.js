////////////////////
//    ELEMENTS    //
////////////////////
const canvas = document.getElementById("sorting-canvas");

const button_selection = document.getElementById("button-selection");
const button_insertion = document.getElementById("button-insertion");
const button_quick = document.getElementById("button-quick");
const button_test = document.getElementById("button-test");


function disableButtons(disable) {
    button_selection.disabled = disable;
    button_insertion.disabled = disable;
    button_quick.disabled = disable;
    button_test.disabled = disable;
}

////////////////
//   COLORS   //
////////////////
var color_default = "#FFE4C4";
var color_green = "#00FF00";
var color_blue = "#0000FF";
var color_red = "#FF0000";
var color_yellow = "#FFD700";

///////////////////
//    TIMEOUT    //
///////////////////
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


function drawList_promise() {
    return new Promise(resolve => {
        setTimeout(() => {
            drawList();
            resolve('resolved');
        }, delay);
    });
}

//TODO: Rewrite this to be async 
function drawList() {

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

//TODO: Rewrite selection to make use of async await draw

async function selectionSort_async() {
    disableButtons(true);
    newList(50);
    delay = 10;

    for (let i = 0; i < list.length - 1; i++) {

        var min = i;
        list[i][1] = color_yellow;

        //Find min
        for (let j = i + 1; j < list.length; j++) {

            if (list[j][0] < list[min][0]) {

                if (min != i)
                    list[min][1] = color_default;

                min = j;
                list[j][1] = color_blue;

                await drawList_promise();
            }

            else {
                list[j][1] = color_red;
                await drawList_promise();
                list[j][1] = color_default;
            }
        }

        //Swap min and i
        list[i][1] = color_default;
        list[min][1] = color_green;

        var temp = list[min];
        list[min] = list[i];
        list[i] = temp;
    }

    //Last one is ok when all other is
    list[list.length - 1][1] = color_green;

    //Draw final results
    await drawList_promise();
    disableButtons(false);

}

//////////////////////////
//    INSERTION SORT    //
//////////////////////////
//TODO: Rewrite insertion to make use of async await draw


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
//TODO: Rewrite quick to make use of async await draw

function startQuickSort() {
    updates = 0;
    delay = 40;
    clearTimeout(timeout);

    newList(50);

    quicksort(0, list.length - 1)
}

function quicksort(start, end) {
    if (start > end)
        return;


    list[start][1] = color_yellow;
    quicksort_partition(start, end, start, end + 1, false, false)

}

function quicksort_partition(start, end, left, right, foundLeft, foundRight) {
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



