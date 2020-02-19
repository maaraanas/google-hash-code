const fs = require('fs')
const readline = require('readline');

const requiredFiles = ["a_example", "b_small", "c_medium", "d_quite_big", "e_also_big"]

requiredFiles.forEach((fileName) => {
  let data = [];

  const lineReader = readline.createInterface({
    input: fs.createReadStream(`./files-input/${fileName}.in`)
  });

  lineReader.on('line', (line) => {
    data.push(line.split(" "))
  });

  lineReader.on('close', () => { 
    let maximumSlices, pizzaType, inputs;

    [maximumSlices, pizzaType] = data[0];
    inputs = data[1];

    const {fileDescriptor, result, total} = calculate(maximumSlices, pizzaType, inputs, fileName);

    saveOutput(fileDescriptor, result)
    saveTotal(fileDescriptor, total)
  });
});


function calculate(maximumSlices, pizzaType, inputs, fileName){

  let index;
  let result = [];
  let total = 0;

  // Decrease the traversable size of the initial Pizza array in reverse order, by
  for (let i = pizzaType - 1; i >= 0; i--) {
    let sum = 0;
    index = i;
    let tempSolve = [];
    
    for (let j = index; j >= 0; j--) {
      let value = Number(inputs[j]);
      let tempSum = sum + value;

      if (tempSum == maximumSlices) {
        sum = tempSum;
        tempSolve.unshift(j);
        break;
      }

      if (tempSum > maximumSlices) {
        continue;
      }

      if (tempSum < maximumSlices) {
        sum = tempSum;
        tempSolve.unshift(j);
        continue;
      }
    }

    if (total < sum) {
      total = sum;
      result = tempSolve;
    }
  }
  console.log('=====\nfileName: ', fileName, '\nTotal: ', total)

  return {fileDescriptor: fileName, result, total}
}

function saveOutput(fileName, result){
  fs.appendFile(`./files-output/${fileName}.out`, result.length + '\n', (err) => {
    if (err) return console.error(err);

    fs.appendFile(`./files-output/${fileName}.out`, result.join(" "), (err) => {
      if (err) return console.error(err);

      fs.close(`./files-output/${fileName}.out`, (err) => {
        if (err) throw err;
      });
    });
  });
}

function saveTotal(fileDescriptor, total) {
  fs.appendFile('./files-output/total.out', `File: "${fileDescriptor}", Total: ${total}\n-\n`, (err)=> {
    if(err) return console.error(err)
  })
}