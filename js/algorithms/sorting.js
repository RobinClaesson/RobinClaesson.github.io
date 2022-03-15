////////////////////
//    ELEMENTS    //
////////////////////
const canvas = document.getElementById("sorting-canvas");

const button_selection = document.getElementById("button-selection");
const button_insertion = document.getElementById("button-insertion");
const button_quick = document.getElementById("button-quick");


function disableButtons(disable) {
    button_selection.disabled = disable;
    button_insertion.disabled = disable;
    button_quick.disabled = disable;
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

async function selectionSort() {
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

async function insertionSort() {
    disableButtons(true);
    newList(50);
    delay = 10;

    // Step forwards through the list
    for (let i = 1; i < list.length; i++) {
        var j = i;

        list[j][1] = color_yellow;
        await drawList_promise();

        // Step back through the list while the previous element is larger than the current
        while (j > 0 && list[j - 1][0] > list[j][0]) {
            var temp = list[j];
            list[j] = list[j - 1];
            list[j - 1] = temp;

            j--;

            await drawList_promise();
        }

        list[j][1] = color_default;
    }

    for (let i = 0; i < list.length; i++)
        list[i][1] = color_green;


    await drawList_promise();
    disableButtons(false);
}

////////////////////
//   QUICK SORT   //
////////////////////
//TODO: Rewrite quick to make use of async await draw


async function quickSort() {
    disableButtons(true);
    newList(50);
    delay = 20;

    await quickSort_sort(0, list.length - 1);

    await drawList_promise();
    disableButtons(false);
}

async function quickSort_sort(start, end) {

    // Return if there is only one or fewer elements
    if (start == end) {
        list[start][1] = color_green;
        await drawList_promise();
        return;
    }

    if (start > end)
        return;

    // Split the list into two partitions around one partitions element
    // and gets the index of that element
    var pElement = await quickSort_partition(start, end);

    list[pElement][1] = color_green;
    await drawList_promise();

    // Sort the two partitions
    await quickSort_sort(start, pElement - 1);
    await quickSort_sort(pElement + 1, end);

    return new Promise(resolve => {
        resolve('resolved');
    });
}

async function quickSort_partition(start, end) {

    list[start][1] = color_yellow;
    await drawList_promise();

    var temp;

    // This sets the first element in the list as the partition element
    var left = start;
    var right = end + 1;

    while (left < right) {

        // Finds elements on the left larger than the partition element
        do {
            left++;

            list[left][1] = color_red;
            await drawList_promise();
            list[left][1] = color_default;


        } while (list[left][0] < list[start][0] && left != end);

        list[left][1] = color_blue;
        await drawList_promise();

        // Finds elements on the right smaller than the partition element
        do {
            right--;

            list[right][1] = color_red;
            await drawList_promise();
            list[right][1] = color_default;
        } while (list[start][0] < list[right][0] && right != start);

        // Swap the larger and smaller element
        if (left < right) {
            temp = list[left];
            list[left] = list[right];
            list[right] = temp;
        }

        list[left][1] = color_default;
        list[right][1] = color_default;
    }

    // Swap the partition element with the last small element to place it inbetween
    // the two partitions
    temp = list[start];
    list[start] = list[right];
    list[right] = temp;

    //Return the index of the partition element
    return new Promise(resolve => {
        resolve(right);
    });
}







