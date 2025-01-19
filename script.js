document.getElementById("input-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const heightsInput = document.getElementById("heights").value;
    const heights = heightsInput.split(",").map(Number);
    const outputDiv = document.getElementById("output");

    if (heights.some(isNaN)) {
        outputDiv.innerHTML = "<p>Please enter valid numbers!</p>";
        return;
    }

    const totalWater = calculateWaterStored(heights);

    outputDiv.innerHTML = `
      <h3>Total Water Stored: ${totalWater} units</h3>
      <div style="padding: 12px 0px; border: 1px solid black; ">
      ${renderBlocks(heights)}
      </div>
    `;
});

function calculateWaterStored(heights) {
    const n = heights.length;
    if (n === 0) return 0;

    const leftMax = Array(n).fill(0);
    const rightMax = Array(n).fill(0);
    let totalWater = 0;

    leftMax[0] = heights[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], heights[i]);
    }

    rightMax[n - 1] = heights[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], heights[i]);
    }

    for (let i = 0; i < n; i++) {
        totalWater += Math.max(0, Math.min(leftMax[i], rightMax[i]) - heights[i]);
    }

    return totalWater;
}

function renderBlocks(heights) {
    const maxHeight = Math.max(...heights);
    let html = '<div style="display: flex; justify-content: center; align-items: flex-end; gap: 0;">';

    heights.forEach((height, index) => {
        const waterHeight = Math.max(0, Math.min(leftMax(heights, index), rightMax(heights, index)) - height);

        html += `
        <div class="block" style="border: 1px solid black; height: ${maxHeight * 20}px; display: flex; flex-direction: column-reverse;">
        ${waterHeight < height ?
                `<div style="display:flex; flex-direction: column-reverse; height: ${maxHeight * 20}px; gap: 0px;">
                    ${Array.from({ length: height }).map(() => `
                    <div class="water" style="height: 19px; background-color:rgb(99, 24, 11); border-top: 1px solid black; width: 20px;"></div>
                    `).join('')
                }
                </div>`
                :
                `<div style="display:flex; flex-direction: column-reverse; height: ${maxHeight * 20}px; gap: 0px;">
                ${Array.from({ length: waterHeight }).map(() => `
                    <div class="water" style="height: 19px; background-color: #3498db; border-top: 1px solid black; width: 20px;"></div>
                    `).join('')
                }
                </div>`
            }  
        </div >
        `;
    });

    html += "</div>";
    return html;
}

function leftMax(heights, index) {
    let max = 0;
    for (let i = 0; i <= index; i++) {
        max = Math.max(max, heights[i]);
    }
    return max;
}

function rightMax(heights, index) {
    let max = 0;
    for (let i = index; i < heights.length; i++) {
        max = Math.max(max, heights[i]);
    }
    return max;
}
